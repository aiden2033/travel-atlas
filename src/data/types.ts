export type Tag =
  | 'morning' | 'food' | 'temple-shrine' | 'nature' | 'view'
  | 'shopping' | 'nightlife' | 'museum' | 'walk' | 'day-trip'
  | 'castle' | 'tickets-ahead' | 'low-mobility' | 'cafe' | 'anime'
  | 'nastya-rec';

export type CityId = 'osaka' | 'kyoto' | 'tokyo' | 'other';

export interface Place {
  slug: string;
  nameEn: string;
  nameRu: string;
  city: CityId;
  tags: Tag[];
  timeEstimateHours: [number, number];
  bestTime?: string;
  summary?: string;
  description: string;
  mapsQuery: string;
  coords?: { lat: number; lng: number };
  links?: { label: string; url: string }[];
  photo?: string;
  remotePhoto?: string;
  photoCredit?: string;
  photoSourceUrl?: string;
  isDayTrip?: boolean;
  dayTripGroup?: string;
  incompatibleWith?: string[];
  combinesWith?: string[];
  nameJa?: string;
  hours?: string;
  transport?: string;
  note?: string;
  anime?: string[];
  foodSpot?: boolean;
}

export type BookingKind = 'ticket' | 'reservation' | 'queue';

export interface BookingLink {
  label: string;
  url: string;
  kind?: 'official' | 'partner' | 'concierge' | 'phone' | 'info';
}

export interface BookingItem {
  placeSlug: string;
  city: CityId;
  kind: BookingKind;
  priority: 'critical' | 'recommended';
  leadTime: string;
  note: string;
  links: BookingLink[];
  checkedAt: string;
}

export type TrustSourceKind = 'official' | 'government' | 'operator' | 'guide';

export interface TrustSource {
  label: string;
  url: string;
  kind: TrustSourceKind;
}

export interface TrustTopic {
  title: string;
  category: string;
  checkedAt: string;
  risk: string;
  whatCanChange: string;
  summary: string;
  links: TrustSource[];
}

export interface StayArea { area: string; why: string; }

export interface CityMeta {
  id: CityId;
  nameEn: string;
  nameRu: string;
  nights: number;
  intro: string;
  stay: StayArea[];
  tips: string[];
}

export interface DayTripGroup { id: string; label: string; note?: string; }

export interface TipCategory {
  category: string;
  icon: string;
  items: string[];
}

export interface TripMeta {
  route: string;
  dates: string;
  summary: string;
  globalTips: TipCategory[];
  departure: string[];
}
