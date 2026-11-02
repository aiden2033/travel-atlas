import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, SyncApiError } from './api';
import type { SyncUser } from './types';

interface AuthResponse {
  user: SyncUser | null;
}

interface MeResponse {
  id: string;
  email: string | null;
  displayName: string | null;
}

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

interface AuthContextValue {
  user: SyncUser | null;
  loading: boolean;
  unavailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  telegramLogin: (payload: unknown) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const authQueryKey = ['auth', 'me'] as const;

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

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', body }),
    onSuccess: refreshAuth,
  });

  const signupMutation = useMutation({
    mutationFn: (body: { email: string; password: string; displayName?: string }) =>
      apiFetch<AuthResponse>('/api/auth/signup', { method: 'POST', body }),
    onSuccess: refreshAuth,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiFetch<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
    onSuccess: async () => {
      queryClient.setQueryData<AuthResponse>(authQueryKey, { user: null });
      await queryClient.invalidateQueries({ queryKey: ['sync'] });
    },
  });

  const telegramMutation = useMutation({
    mutationFn: (payload: unknown) =>
      apiFetch<AuthResponse>('/api/auth/telegram', { method: 'POST', body: payload }),
    onSuccess: refreshAuth,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: authQuery.data?.user ?? null,
      loading: authQuery.isLoading,
      unavailable: authQuery.isError,
      login: async (email, password) => {
        await loginMutation.mutateAsync({ email, password });
      },
      signup: async (email, password, displayName) => {
        await signupMutation.mutateAsync({ email, password, displayName });
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      telegramLogin: async (payload) => {
        await telegramMutation.mutateAsync(payload);
      },
    }),
    [
      authQuery.data?.user,
      authQuery.isError,
      authQuery.isLoading,
      loginMutation,
      logoutMutation,
      signupMutation,
      telegramMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
