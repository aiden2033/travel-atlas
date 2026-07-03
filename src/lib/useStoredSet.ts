import { useSyncExternalStore } from 'react';
import type { Place } from '../data/types';

export const placeKey = (place: Pick<Place, 'city' | 'slug'>): string =>
  `${place.city}:${place.slug}`;

export const SCHEMA_VERSION = 1;
const SCHEMA_KEY = 'jt:schema';
export const STORED_SET_CHANGE_EVENT = 'jt:stored-set-change';

export interface StoredSetChangeDetail {
  storageKey: string;
  key: string;
  enabled: boolean;
  updatedAt: string;
}

const markSchema = (): void => {
  try {
    if (localStorage.getItem(SCHEMA_KEY) === null) {
      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    }
  } catch {
    // localStorage unavailable (private mode / quota) — schema marker is best-effort only.
  }
};

const read = (storageKey: string): Set<string> => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((v): v is string => typeof v === 'string')) : new Set();
  } catch {
    return new Set();
  }
};

export const readStoredKeys = (storageKey: string): Set<string> => read(storageKey);

const persist = (storageKey: string, set: Set<string>): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (private mode / quota) — keep state in memory only.
  }
};

interface Store {
  snapshot: Set<string>;
  listeners: Set<() => void>;
}

const stores = new Map<string, Store>();

const getStore = (storageKey: string): Store => {
  let store = stores.get(storageKey);
  if (!store) {
    markSchema();
    store = { snapshot: read(storageKey), listeners: new Set() };
    stores.set(storageKey, store);
  }
  return store;
};

const emit = (store: Store): void => store.listeners.forEach((l) => l());

const emitStoredSetChange = (detail: StoredSetChangeDetail): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<StoredSetChangeDetail>(STORED_SET_CHANGE_EVENT, { detail }));
};

const toggleKey = (storageKey: string, key: string): void => {
  const store = getStore(storageKey);
  const next = new Set(store.snapshot);
  const enabled = !next.has(key);
  if (enabled) next.add(key);
  else next.delete(key);
  store.snapshot = next;
  persist(storageKey, next);
  emit(store);
  emitStoredSetChange({ storageKey, key, enabled, updatedAt: new Date().toISOString() });
};

export interface StoredSet {
  items: Set<string>;
  count: number;
  has: (place: Pick<Place, 'city' | 'slug'>) => boolean;
  toggle: (place: Pick<Place, 'city' | 'slug'>) => void;
}

export interface StoredKeySet {
  items: Set<string>;
  count: number;
  hasKey: (key: string) => boolean;
  toggleKey: (key: string) => void;
  clear: () => void;
}

const clearKeys = (storageKey: string): void => {
  const store = getStore(storageKey);
  const previous = store.snapshot;
  store.snapshot = new Set();
  persist(storageKey, store.snapshot);
  emit(store);
  previous.forEach((key) =>
    emitStoredSetChange({ storageKey, key, enabled: false, updatedAt: new Date().toISOString() }),
  );
};

export const replaceStoredKeys = (storageKey: string, keys: Iterable<string>): void => {
  const store = getStore(storageKey);
  store.snapshot = new Set(keys);
  persist(storageKey, store.snapshot);
  emit(store);
};

export const useStoredKeySet = (storageKey: string): StoredKeySet => {
  const store = getStore(storageKey);
  const items = useSyncExternalStore(
    (listener) => {
      store.listeners.add(listener);
      return () => store.listeners.delete(listener);
    },
    () => store.snapshot,
    () => store.snapshot,
  );

  return {
    items,
    count: items.size,
    hasKey: (key) => items.has(key),
    toggleKey: (key) => toggleKey(storageKey, key),
    clear: () => clearKeys(storageKey),
  };
};

export const useStoredSet = (storageKey: string): StoredSet => {
  const store = getStore(storageKey);
  const items = useSyncExternalStore(
    (listener) => {
      store.listeners.add(listener);
      return () => store.listeners.delete(listener);
    },
    () => store.snapshot,
    () => store.snapshot,
  );

  return {
    items,
    count: items.size,
    has: (place) => items.has(placeKey(place)),
    toggle: (place) => toggleKey(storageKey, placeKey(place)),
  };
};

export const FAVORITES_KEY = 'jt:favorites';
export const VISITED_KEY = 'jt:visited';
export const BOOKED_KEY = 'jt:booked';
export const PREFLIGHT_KEY = 'jt:preflight';

export const useFavorites = (): StoredSet => useStoredSet(FAVORITES_KEY);
export const useVisited = (): StoredSet => useStoredSet(VISITED_KEY);
export const useBooked = (): StoredSet => useStoredSet(BOOKED_KEY);
export const usePreflight = (): StoredKeySet => useStoredKeySet(PREFLIGHT_KEY);
