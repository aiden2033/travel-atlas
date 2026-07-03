import { useSyncExternalStore } from 'react';
import type { AnimeRoute } from '../../data/animeRoutes';
import type { TripDayEventCategory } from '../../data/calendar';
import type { CityId } from '../../data/types';
import type { PersonalTripEvent, SavedRouteState } from './types';

export const TRIP_EVENTS_KEY = 'jt:trip-events';
export const SAVED_ROUTES_KEY = 'jt:saved-routes';
export const TRIP_EVENT_CHANGE_EVENT = 'jt:trip-event-change';
export const SAVED_ROUTE_CHANGE_EVENT = 'jt:saved-route-change';

export interface TripEventChangeDetail {
  op: 'upsert' | 'delete';
  event: PersonalTripEvent;
}

export interface SavedRouteChangeDetail {
  op: 'save' | 'unsave';
  route: SavedRouteState;
}

export interface PersonalTripEventInput {
  date: string;
  title: string;
  time?: string | null;
  detail?: string | null;
  city?: string | null;
  category: TripDayEventCategory;
  links?: { label: string; url: string }[];
  position?: number;
}

const nowIso = (): string => new Date().toISOString();

const newId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readArray = <T>(storageKey: string): T[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeArray = <T>(storageKey: string, value: T[]): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Keep the in-memory snapshot usable even when localStorage is unavailable.
  }
};

interface ArrayStore<T> {
  snapshot: T[];
  listeners: Set<() => void>;
}

const tripEventsStore: ArrayStore<PersonalTripEvent> = {
  snapshot: readArray<PersonalTripEvent>(TRIP_EVENTS_KEY),
  listeners: new Set(),
};

const savedRoutesStore: ArrayStore<SavedRouteState> = {
  snapshot: readArray<SavedRouteState>(SAVED_ROUTES_KEY),
  listeners: new Set(),
};

const emit = <T>(store: ArrayStore<T>): void => store.listeners.forEach((listener) => listener());

const dispatchTripEventChange = (detail: TripEventChangeDetail): void => {
  window.dispatchEvent(new CustomEvent<TripEventChangeDetail>(TRIP_EVENT_CHANGE_EVENT, { detail }));
};

const dispatchSavedRouteChange = (detail: SavedRouteChangeDetail): void => {
  window.dispatchEvent(new CustomEvent<SavedRouteChangeDetail>(SAVED_ROUTE_CHANGE_EVENT, { detail }));
};

export const readPersonalTripEvents = (): PersonalTripEvent[] =>
  readArray<PersonalTripEvent>(TRIP_EVENTS_KEY).filter(
    (event) => typeof event.id === 'string' && typeof event.date === 'string' && typeof event.title === 'string',
  );

export const replacePersonalTripEvents = (events: PersonalTripEvent[]): void => {
  tripEventsStore.snapshot = [...events];
  writeArray(TRIP_EVENTS_KEY, tripEventsStore.snapshot);
  emit(tripEventsStore);
};

const savePersonalTripEvents = (events: PersonalTripEvent[]): void => {
  tripEventsStore.snapshot = events;
  writeArray(TRIP_EVENTS_KEY, events);
  emit(tripEventsStore);
};

export const readSavedRoutes = (): SavedRouteState[] =>
  readArray<SavedRouteState>(SAVED_ROUTES_KEY).filter(
    (route) => typeof route.routeId === 'string' && typeof route.title === 'string',
  );

export const replaceSavedRoutes = (routes: SavedRouteState[]): void => {
  savedRoutesStore.snapshot = [...routes];
  writeArray(SAVED_ROUTES_KEY, savedRoutesStore.snapshot);
  emit(savedRoutesStore);
};

const saveSavedRoutes = (routes: SavedRouteState[]): void => {
  savedRoutesStore.snapshot = routes;
  writeArray(SAVED_ROUTES_KEY, routes);
  emit(savedRoutesStore);
};

export const usePersonalTripEvents = () => {
  const events = useSyncExternalStore(
    (listener) => {
      tripEventsStore.listeners.add(listener);
      return () => tripEventsStore.listeners.delete(listener);
    },
    () => tripEventsStore.snapshot,
    () => tripEventsStore.snapshot,
  );

  const upsert = (input: PersonalTripEventInput & { id?: string }): PersonalTripEvent => {
    const existing = input.id
      ? events.find((event) => event.id === input.id)
      : undefined;
    const event: PersonalTripEvent = {
      id: input.id ?? newId(),
      date: input.date,
      title: input.title,
      time: input.time ?? null,
      detail: input.detail ?? null,
      city: input.city ?? null,
      category: input.category,
      links: input.links ?? existing?.links ?? [],
      position: input.position ?? existing?.position ?? 0,
      deletedAt: null,
      updatedAt: nowIso(),
    };
    const next = existing
      ? events.map((item) => (item.id === event.id ? event : item))
      : [...events, event];
    savePersonalTripEvents(next);
    dispatchTripEventChange({ op: 'upsert', event });
    return event;
  };

  const remove = (id: string): PersonalTripEvent | undefined => {
    const existing = events.find((event) => event.id === id);
    if (!existing) return undefined;
    const event: PersonalTripEvent = {
      ...existing,
      deletedAt: nowIso(),
      updatedAt: nowIso(),
    };
    savePersonalTripEvents(events.map((item) => (item.id === id ? event : item)));
    dispatchTripEventChange({ op: 'delete', event });
    return event;
  };

  return {
    events,
    activeEvents: events.filter((event) => !event.deletedAt),
    upsert,
    remove,
  };
};

export const useSavedRoutes = () => {
  const routes = useSyncExternalStore(
    (listener) => {
      savedRoutesStore.listeners.add(listener);
      return () => savedRoutesStore.listeners.delete(listener);
    },
    () => savedRoutesStore.snapshot,
    () => savedRoutesStore.snapshot,
  );

  const isSaved = (routeId: string): boolean =>
    routes.some((route) => route.routeId === routeId && route.enabled);

  const toggleRoute = (
    routeId: string,
    city: CityId,
    title: string,
    route: AnimeRoute,
  ): SavedRouteState => {
    const existing = routes.find((item) => item.routeId === routeId);
    const enabled = !existing?.enabled;
    const nextRoute: SavedRouteState = {
      routeId,
      city,
      title,
      route,
      enabled,
      updatedAt: nowIso(),
    };
    const next = existing
      ? routes.map((item) => (item.routeId === routeId ? nextRoute : item))
      : [...routes, nextRoute];
    saveSavedRoutes(next);
    dispatchSavedRouteChange({ op: enabled ? 'save' : 'unsave', route: nextRoute });
    return nextRoute;
  };

  return {
    routes,
    activeRoutes: routes.filter((route) => route.enabled),
    isSaved,
    toggleRoute,
  };
};
