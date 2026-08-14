import type { CityId } from './types';
import type { LatLng } from '../lib/geo';

export interface TripStay {
  id: string;
  city: CityId;
  name: string;
  address: string;
  dates: string;
  coords: LatLng;
}

export const tripStays: TripStay[] = [
  {
    id: 'osaka-kozu-home',
    city: 'osaka',
    name: 'Home in Chuo Ward, Osaka',
    address: '3-chōme-8-24 Kōzu, Chuo Ward, Osaka 542-0072',
    dates: '29 августа — 2 сентября',
    coords: { lat: 34.6649772, lng: 135.5091772 },
  },
  {
    id: 'kyoto-miyagawacho-machiya',
    city: 'kyoto',
    name: 'Miyagawacho Samurai Machiya',
    address: '527 Higashikawarachō, Higashiyama-ku, Kyoto 605-0839',
    dates: '2—6 сентября',
    coords: { lat: 34.9968894, lng: 135.7684547 },
  },
];
