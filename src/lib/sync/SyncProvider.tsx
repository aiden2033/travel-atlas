import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BOOKED_KEY,
  FAVORITES_KEY,
  PREFLIGHT_KEY,
  readStoredKeys,
  replaceStoredKeys,
  STORED_SET_CHANGE_EVENT,
  VISITED_KEY,
  type StoredSetChangeDetail,
} from '../useStoredSet';
import { apiFetch } from './api';
import { useAuth } from './AuthProvider';
import {
  readPersonalTripEvents,
  readSavedRoutes,
  replacePersonalTripEvents,
  replaceSavedRoutes,
  SAVED_ROUTE_CHANGE_EVENT,
  TRIP_EVENT_CHANGE_EVENT,
  type SavedRouteChangeDetail,
  type TripEventChangeDetail,
} from './localState';
import type { ImportState, SyncSnapshot, SyncUser } from './types';

const DEVICE_ID_KEY = 'jt:sync:device-id';
const LAST_USER_ID_KEY = 'jt:sync:last-user-id';
const QUEUE_KEY = 'jt:sync:ops';
const QUEUE_CHANGE_EVENT = 'jt:sync-queue-change';

type SyncMethod = 'POST' | 'PUT' | 'DELETE';

interface SyncOp {
  id: string;
  userId: string;
  endpoint: string;
  method: SyncMethod;
  body: object;
  createdAt: string;
}

interface SyncStatus {
  user: SyncUser | null;
  pendingCount: number;
  syncing: boolean;
  lastSyncedAt: string | null;
  backendUnavailable: boolean;
}

const SyncContext = createContext<SyncStatus | null>(null);

const nowIso = (): string => new Date().toISOString();

const newId = (): string => {
  if ('randomUUID' in crypto) return crypto.randomUUID();
  return `op-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readJsonArray = <T,>(storageKey: string): T[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeJsonArray = <T,>(storageKey: string, value: T[]): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Queue durability is best-effort when localStorage is unavailable.
  }
};

export const getSyncDeviceId = (): string => {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const created = newId();
    localStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return newId();
  }
};

const getLastUserId = (): string | null => {
  try {
    return localStorage.getItem(LAST_USER_ID_KEY);
  } catch {
    return null;
  }
};

const setLastUserId = (userId: string | null): void => {
  try {
    if (userId) localStorage.setItem(LAST_USER_ID_KEY, userId);
    else localStorage.removeItem(LAST_USER_ID_KEY);
  } catch {
    // Non-persistent auth hints are acceptable in private browsing.
  }
};

const readQueue = (): SyncOp[] =>
  readJsonArray<SyncOp>(QUEUE_KEY).filter(
    (op) =>
      typeof op.id === 'string' &&
      typeof op.userId === 'string' &&
      typeof op.endpoint === 'string',
  );

const writeQueue = (ops: SyncOp[]): void => {
  writeJsonArray(QUEUE_KEY, ops);
  window.dispatchEvent(new Event(QUEUE_CHANGE_EVENT));
};

const queueCount = (userId: string | null): number =>
  readQueue().filter((op) => !userId || op.userId === userId).length;

const enqueueSyncOp = (
  userId: string,
  endpoint: string,
  method: SyncMethod,
  body: object,
): void => {
  const id = newId();
  const opBody = {
    ...body,
    deviceId: getSyncDeviceId(),
    clientOpId: id,
  };
  writeQueue([
    ...readQueue(),
    {
      id,
      userId,
      endpoint,
      method,
      body: opBody,
      createdAt: nowIso(),
    },
  ]);
};

const removeQueuedOp = (id: string): void => {
  writeQueue(readQueue().filter((op) => op.id !== id));
};

const importState = (): ImportState => ({
  favorites: [...readStoredKeys(FAVORITES_KEY)],
  visited: [...readStoredKeys(VISITED_KEY)],
  booked: [...readStoredKeys(BOOKED_KEY)],
  preflight: [...readStoredKeys(PREFLIGHT_KEY)],
  tripEvents: readPersonalTripEvents(),
  savedRoutes: readSavedRoutes(),
});

const applySnapshot = (snapshot: SyncSnapshot): void => {
  const byKind = {
    favorite: snapshot.placeStates
      .filter((state) => state.kind === 'favorite' && state.enabled)
      .map((state) => state.placeKey),
    visited: snapshot.placeStates
      .filter((state) => state.kind === 'visited' && state.enabled)
      .map((state) => state.placeKey),
    booked: snapshot.placeStates
      .filter((state) => state.kind === 'booked' && state.enabled)
      .map((state) => state.placeKey),
  };

  replaceStoredKeys(FAVORITES_KEY, byKind.favorite);
  replaceStoredKeys(VISITED_KEY, byKind.visited);
  replaceStoredKeys(BOOKED_KEY, byKind.booked);
  replaceStoredKeys(
    PREFLIGHT_KEY,
    snapshot.preflightStates
      .filter((state) => state.enabled)
      .map((state) => state.itemKey),
  );
  replacePersonalTripEvents(snapshot.tripEvents);
  replaceSavedRoutes(snapshot.savedRoutes);
};

const importedMarkerKey = (userId: string): string => `jt:sync:imported:${userId}`;

const hasImported = (userId: string): boolean => {
  try {
    return localStorage.getItem(importedMarkerKey(userId)) === '1';
  } catch {
    return false;
  }
};

const markImported = (userId: string): void => {
  try {
    localStorage.setItem(importedMarkerKey(userId), '1');
  } catch {
    // Import is idempotent server-side; losing the marker only repeats a safe import.
  }
};

export function SyncProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const userRef = useRef<SyncUser | null>(auth.user);
  const importInFlightRef = useRef<string | null>(null);
  const flushInFlightRef = useRef(false);
  const [pendingCount, setPendingCount] = useState(() => queueCount(auth.user?.id ?? getLastUserId()));
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    userRef.current = auth.user;
    if (auth.user) {
      setLastUserId(auth.user.id);
    } else if (!auth.loading && !auth.unavailable) {
      setLastUserId(null);
    }
  }, [auth.loading, auth.unavailable, auth.user]);

  const syncQuery = useQuery({
    queryKey: ['sync', 'state', auth.user?.id],
    queryFn: () => apiFetch<SyncSnapshot>('/api/sync/state'),
    enabled: Boolean(auth.user),
    retry: 1,
    refetchInterval: 10_000,
  });

  const refreshPendingCount = useCallback(() => {
    setPendingCount(queueCount(auth.user?.id ?? getLastUserId()));
  }, [auth.user?.id]);

  const flushQueue = useCallback(async () => {
    const userId = userRef.current?.id;
    if (!userId || flushInFlightRef.current) return;

    const ops = readQueue().filter((op) => op.userId === userId);
    if (ops.length === 0) {
      refreshPendingCount();
      return;
    }

    flushInFlightRef.current = true;
    setSyncing(true);
    try {
      for (const op of ops) {
        await apiFetch(op.endpoint, {
          method: op.method,
          body: op.body,
        });
        removeQueuedOp(op.id);
      }
      setLastSyncedAt(nowIso());
      await queryClient.invalidateQueries({ queryKey: ['sync', 'state', userId] });
    } finally {
      flushInFlightRef.current = false;
      setSyncing(false);
      refreshPendingCount();
    }
  }, [queryClient, refreshPendingCount]);

  useEffect(() => {
    const onStoredSetChange = (event: Event) => {
      const detail = (event as CustomEvent<StoredSetChangeDetail>).detail;
      const userId = userRef.current?.id ?? getLastUserId();
      if (!userId) return;

      if (detail.storageKey === PREFLIGHT_KEY) {
        enqueueSyncOp(userId, '/api/sync/preflight-state', 'POST', {
          itemKey: detail.key,
          enabled: detail.enabled,
          updatedAt: detail.updatedAt,
        });
        return;
      }

      const kind =
        detail.storageKey === FAVORITES_KEY
          ? 'favorite'
          : detail.storageKey === VISITED_KEY
            ? 'visited'
            : detail.storageKey === BOOKED_KEY
              ? 'booked'
              : null;
      if (!kind) return;

      enqueueSyncOp(userId, '/api/sync/place-state', 'POST', {
        placeKey: detail.key,
        kind,
        enabled: detail.enabled,
        updatedAt: detail.updatedAt,
      });
    };

    const onTripEventChange = (event: Event) => {
      const detail = (event as CustomEvent<TripEventChangeDetail>).detail;
      const userId = userRef.current?.id ?? getLastUserId();
      if (!userId) return;
      enqueueSyncOp(userId, `/api/trip-events/${detail.event.id}`, 'PUT', detail.event);
    };

    const onSavedRouteChange = (event: Event) => {
      const detail = (event as CustomEvent<SavedRouteChangeDetail>).detail;
      const userId = userRef.current?.id ?? getLastUserId();
      if (!userId) return;
      enqueueSyncOp(
        userId,
        `/api/saved-routes/${encodeURIComponent(detail.route.routeId)}`,
        'PUT',
        detail.route,
      );
    };

    window.addEventListener(STORED_SET_CHANGE_EVENT, onStoredSetChange);
    window.addEventListener(TRIP_EVENT_CHANGE_EVENT, onTripEventChange);
    window.addEventListener(SAVED_ROUTE_CHANGE_EVENT, onSavedRouteChange);
    return () => {
      window.removeEventListener(STORED_SET_CHANGE_EVENT, onStoredSetChange);
      window.removeEventListener(TRIP_EVENT_CHANGE_EVENT, onTripEventChange);
      window.removeEventListener(SAVED_ROUTE_CHANGE_EVENT, onSavedRouteChange);
    };
  }, []);

  useEffect(() => {
    const onQueueChange = () => {
      refreshPendingCount();
      void flushQueue();
    };
    const onOnline = () => void flushQueue();

    window.addEventListener(QUEUE_CHANGE_EVENT, onQueueChange);
    window.addEventListener('online', onOnline);
    void flushQueue();
    return () => {
      window.removeEventListener(QUEUE_CHANGE_EVENT, onQueueChange);
      window.removeEventListener('online', onOnline);
    };
  }, [flushQueue, refreshPendingCount]);

  useEffect(() => {
    const userId = auth.user?.id;
    if (!userId || hasImported(userId) || importInFlightRef.current === userId) return;

    importInFlightRef.current = userId;
    apiFetch('/api/sync/import', {
      method: 'POST',
      body: {
        deviceId: getSyncDeviceId(),
        clientOpId: `import-${getSyncDeviceId()}`,
        state: importState(),
      },
    })
      .then(async () => {
        markImported(userId);
        setLastSyncedAt(nowIso());
        await queryClient.invalidateQueries({ queryKey: ['sync', 'state', userId] });
      })
      .catch(() => {
        // The next authenticated session will retry the idempotent import.
      })
      .finally(() => {
        importInFlightRef.current = null;
      });
  }, [auth.user?.id, queryClient]);

  useEffect(() => {
    if (!syncQuery.data || pendingCount > 0 || syncing) return;
    applySnapshot(syncQuery.data);
    setLastSyncedAt(nowIso());
  }, [pendingCount, syncQuery.data, syncing]);

  const value = useMemo<SyncStatus>(
    () => ({
      user: auth.user,
      pendingCount,
      syncing,
      lastSyncedAt,
      backendUnavailable: auth.unavailable || syncQuery.isError,
    }),
    [auth.unavailable, auth.user, lastSyncedAt, pendingCount, syncQuery.isError, syncing],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export const useSyncStatus = (): SyncStatus => {
  const value = useContext(SyncContext);
  if (!value) throw new Error('useSyncStatus must be used inside SyncProvider');
  return value;
};
