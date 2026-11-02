import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, SyncApiError } from './api';
import type { SyncUser } from './types';

interface MeResponse {
  id: string;
  email: string | null;
  displayName: string | null;
}

interface AuthResponse {
  user: SyncUser | null;
}

interface AuthContextValue {
  user: SyncUser | null;
  loading: boolean;
  unavailable: boolean;
  requestMagicLink: (email: string, pdConsent: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const authQueryKey = ['auth', 'me'] as const;
const verifyHashPrefix = '#/login/verify';

const meQuery = async (): Promise<AuthResponse> => {
  try {
    const me = await apiFetch<MeResponse>('/v1/me');
    return {
      user: {
        id: me.id,
        email: me.email,
        displayName: me.displayName,
        telegramUsername: null,
      },
    };
  } catch (error) {
    if (error instanceof SyncApiError && error.status === 401) return { user: null };
    throw error;
  }
};

const readVerifyToken = (): string | null => {
  const hash = window.location.hash;
  if (!hash.startsWith(verifyHashPrefix)) return null;
  const query = hash.slice(verifyHashPrefix.length);
  return new URLSearchParams(query.replace(/^\?/, '')).get('token');
};

const safeReturnPath = (value: string | undefined): string =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/account';

const finishLogin = (path: string, status: 'ok' | 'consent' | 'error'): void => {
  const separator = path.includes('?') ? '&' : '?';
  window.location.replace(`#${path}${separator}login=${status}`);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const authQuery = useQuery({
    queryKey: authQueryKey,
    queryFn: meQuery,
    enabled: Boolean(import.meta.env.VITE_SYNC_API_URL),
    retry: false,
    staleTime: 60_000,
  });

  const refreshAuth = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authQueryKey });
  }, [queryClient]);

  useEffect(() => {
    const token = readVerifyToken();
    if (!token) return;
    let cancelled = false;

    apiFetch<{ returnPath: string }>('/v1/auth/magic-link/verify', {
      method: 'POST',
      body: { token, pdConsent: true },
    })
      .then(async (result) => {
        if (cancelled) return;
        await queryClient.invalidateQueries({ queryKey: authQueryKey });
        finishLogin(safeReturnPath(result.returnPath), 'ok');
      })
      .catch((error) => {
        if (cancelled) return;
        const status =
          error instanceof SyncApiError && error.status === 422 ? 'consent' : 'error';
        finishLogin('/account', status);
      });

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  const magicLinkMutation = useMutation({
    mutationFn: (body: { email: string; pdConsent: boolean }) =>
      apiFetch('/v1/auth/magic-link', {
        method: 'POST',
        body: { ...body, returnPath: '/account', captchaToken: null },
      }),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiFetch('/v1/auth/logout', { method: 'POST' }),
    onSuccess: async () => {
      queryClient.setQueryData<AuthResponse>(authQueryKey, { user: null });
      await queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: authQuery.data?.user ?? null,
      loading: authQuery.isLoading,
      unavailable: authQuery.isError,
      requestMagicLink: async (email, pdConsent) => {
        await magicLinkMutation.mutateAsync({ email, pdConsent });
        await refreshAuth();
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
    }),
    [
      authQuery.data?.user,
      authQuery.isError,
      authQuery.isLoading,
      logoutMutation,
      magicLinkMutation,
      refreshAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
