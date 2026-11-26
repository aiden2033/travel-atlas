import { cities as tripCities } from '../data/cities';
import { tripStays } from '../data/stays';
import { guideUrl, type Catalog, type GuidePlace } from './model';

export type MapPlace = {
  countryId: string;
  countryName: string;
  cityName: string;
  name: string;
  path: string;
  coords: GuidePlace['coords'];
  kind: 'guide' | 'stay';
};

export type MapPoint = MapPlace & { coords: NonNullable<MapPlace['coords']> };

export function getMapPlaces(catalog: Catalog): MapPlace[] {
  const places = catalog.countries.flatMap((country) =>
    country.cities.flatMap((city) =>
      city.places.map<MapPlace>((place) => ({
        countryId: country.id,
        countryName: country.nameRu,
        cityName: city.nameRu,
        name: place.nameRu,
        path: `${guideUrl(country, city)}/${place.slug}`,
        coords: place.coords,
        kind: 'guide',
      })),
    ),
  );

  const japan = catalog.countries.find((country) => country.id === 'japan');
  const guidePaths = new Set(places.map(({ path }) => path));
  const stays = tripStays
    .filter((stay) => !guidePaths.has(`/guide/japan/${stay.city}/${stay.id}`))
    .map<MapPlace>((stay) => ({
      countryId: 'japan',
      countryName: japan?.nameRu ?? 'Япония',
      cityName:
        japan?.cities.find((city) => city.id === stay.city)?.nameRu ??
        tripCities.find((city) => city.id === stay.city)!.nameRu,
      name: stay.name,
      path: `/${stay.city}?view=map&stay=${stay.id}`,
      coords: stay.coords,
      kind: 'stay',
    }));

  return [...places, ...stays];
}
