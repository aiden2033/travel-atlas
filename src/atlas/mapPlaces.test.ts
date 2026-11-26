import { describe, expect, it } from 'vitest';
import { tripStays } from '../data/stays';
import { getMapPlaces } from './mapPlaces';
import { type Catalog, type GuidePlace } from './model';
import { defaultSeed } from './seed';

const route = '/guide/vietnam/hanoi/map-test';
const createPlace = (
  city: string,
  coords?: GuidePlace['coords'],
): GuidePlace => ({
  city,
  slug: 'map-test',
  nameRu: 'Тестовое место',
  nameEn: 'Map test place',
  description: '',
  tags: [],
  timeEstimateHours: [1, 2],
  mapsQuery: 'Map test place',
  coords,
});

const vietnamWith = (
  hanoiPlaces: GuidePlace[],
  huePlaces: GuidePlace[] = [],
): Catalog => {
  const vietnam = defaultSeed.countries.find(({ id }) => id === 'vietnam')!;
  return {
    ...defaultSeed,
    countries: [
      {
        ...vietnam,
        cities: vietnam.cities.map((city) => ({
          ...city,
          places:
            city.id === 'hanoi'
              ? hanoiPlaces
              : city.id === 'hue'
                ? huePlaces
                : [],
        })),
      },
    ],
  };
};

describe('atlas map places', () => {
  it('derives additions, coordinate edits, and deletions from the Vietnam catalog', () => {
    const pointAt = (catalog: Catalog) =>
      getMapPlaces(catalog).find(({ path }) => path === route);
    const original = createPlace('hanoi', { lat: 21.031, lng: 105.851 });
    const moved = { ...original, coords: { lat: 21.034, lng: 105.847 } };

    expect(pointAt(vietnamWith([original]))?.coords).toEqual(original.coords);
    expect(pointAt(vietnamWith([moved]))?.coords).toEqual(moved.coords);
    expect(pointAt(vietnamWith([]))).toBeUndefined();
  });

  it('keeps the same slug in two cities and links places without coordinates', () => {
    const coords = { lat: 21.031, lng: 105.851 };
    const points = getMapPlaces(
      vietnamWith([createPlace('hanoi', coords)], [createPlace('hue')]),
    );

    expect(points.filter(({ countryId }) => countryId === 'vietnam')).toEqual([
      expect.objectContaining({ path: route, coords }),
      expect.objectContaining({
        path: '/guide/vietnam/hue/map-test',
        coords: undefined,
      }),
    ]);
  });

  it('includes the public Japan stays once and uses their source map links', () => {
    const points = getMapPlaces(defaultSeed);
    const japan = defaultSeed.countries.find(({ id }) => id === 'japan')!;
    const guidePlaces = japan.cities.reduce(
      (total, city) => total + city.places.length,
      0,
    );
    expect(
      points.filter(({ countryId }) => countryId === 'japan'),
    ).toHaveLength(guidePlaces + tripStays.length);
    expect(new Set(points.map(({ path }) => path)).size).toBe(points.length);

    for (const stay of tripStays) {
      expect(points).toContainEqual(
        expect.objectContaining({
          path: `/${stay.city}?view=map&stay=${stay.id}`,
          coords: stay.coords,
          kind: 'stay',
        }),
      );
    }
  });

  it('prefers the catalog card when it already represents a trip stay', () => {
    const catalog = structuredClone(defaultSeed);
    const stay = tripStays[0];
    const japan = catalog.countries.find(({ id }) => id === 'japan')!;
    japan.cities
      .find(({ id }) => id === stay.city)!
      .places.push({
        ...createPlace(stay.city, stay.coords),
        slug: stay.id,
        nameRu: stay.name,
      });

    expect(
      getMapPlaces(catalog).filter(({ name }) => name === stay.name),
    ).toEqual([
      expect.objectContaining({
        path: `/guide/japan/${stay.city}/${stay.id}`,
        kind: 'guide',
      }),
    ]);
  });
});
