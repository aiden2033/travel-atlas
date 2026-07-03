import type { TripDayEventCategory } from '../../data/calendar';
import type { CityId } from '../../data/types';

export interface SyncUser {
  id: string;
  email: string | null;
  displayName: string | null;
  telegramUsername: string | null;
}

export interface PlaceSyncState {
  placeKey: string;
  kind: 'favorite' | 'visited' | 'booked';
  enabled: boolean;
  updatedAt: string;
}

export interface PreflightSyncState {
  itemKey: string;
  enabled: boolean;
  updatedAt: string;
}

export interface PersonalTripEvent {
  id: string;
  date: string;
  title: string;
  time?: string | null;
  detail?: string | null;
  city?: string | null;
  category: TripDayEventCategory;
  links: { label: string; url: string }[];
  position: number;
  deletedAt?: string | null;
  updatedAt: string;
}

export interface SavedRouteState {
  routeId: string;
  city: CityId | string;
  title: string;
  route: unknown;
  enabled: boolean;
  updatedAt: string;
}

export interface SyncSnapshot {
  user: SyncUser;
  serverTime: string;
  placeStates: PlaceSyncState[];
  preflightStates: PreflightSyncState[];
  tripEvents: PersonalTripEvent[];
  savedRoutes: SavedRouteState[];
}

export interface ImportState {
  favorites: string[];
  visited: string[];
  booked: string[];
  preflight: string[];
  tripEvents: PersonalTripEvent[];
  savedRoutes: SavedRouteState[];
}
