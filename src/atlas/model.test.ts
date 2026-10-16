import { describe, expect, it } from 'vitest';
import { defaultSeed as seed } from './seed';
import { catalogSchema, parseBackup, stateKey, type Backup } from './model';
import { places } from '../data/places';
import { friendsMapPlaces } from '../data/friendsMapPlaces';

const backup = (): Backup => ({
  format: 'travel-atlas',
  version: 1,
  exportedAt: '2026-10-16T09:00:00Z',
  catalog: structuredClone(seed),
  favorites: [],
  visited: [],
  booked: [],
});

describe('source consolidation', () => {
  it('preserves every Japanese catalog and friends-list entry', () => {
    const japan = seed.countries.find((c) => c.id === 'japan')!;
    const imported = japan.cities.flatMap((c) => c.places);
    expect(imported).toHaveLength(places.length + friendsMapPlaces.length);
    for (const place of places)
      expect(
        imported.find((p) => p.slug === place.slug && p.city === place.city)
          ?.description,
      ).toBe(place.description);
  });

  it('includes all four requested countries and the winter city catalog', () => {
    expect(seed.countries.map((c) => c.id)).toEqual([
      'malaysia',
      'singapore',
      'indonesia',
      'japan',
    ]);
    const malaysia = seed.countries[0];
    expect(malaysia.cities.map((c) => c.id)).toEqual([
      'langkawi',
      'kuala-lumpur',
      'penang',
    ]);
    expect(malaysia.cities.flatMap((c) => c.places)).toHaveLength(49);
    expect(seed.countries[1].cities.flatMap((c) => c.places)).toHaveLength(11);
    expect(seed.countries[2].cities).toHaveLength(5);
  });

  it('keeps countries isolated while preserving old Japanese state keys', () => {
    expect(stateKey('japan', 'osaka', 'dotonbori')).toBe('osaka:dotonbori');
    expect(stateKey('malaysia', 'osaka', 'dotonbori')).not.toBe(
      stateKey('japan', 'osaka', 'dotonbori'),
    );
  });
});

describe('portable backups', () => {
  it('round-trips custom country sections, custom tags and personal marks', () => {
    const value = backup();
    value.catalog.tags.push({ id: 'my-tag', label: 'Личное', tone: 'sand' });
    value.catalog.countries[0].sections.push({
      id: 'my-budget',
      title: 'Бюджет',
      body: 'Свои заметки\nВторая строка',
    });
    value.catalog.countries[0].cities[0].places[0].tags.push('my-tag');
    value.favorites = ['malaysia:langkawi:pantai-cenang'];
    value.visited = ['osaka:dotonbori'];
    expect(parseBackup(JSON.stringify(value))).toEqual(value);
  });

  it('rejects duplicate countries and foreign-city places before applying data', () => {
    const value = backup();
    value.catalog.countries.push(value.catalog.countries[0]);
    expect(() => parseBackup(JSON.stringify(value))).toThrow(/Повторяются/);
    value.catalog = structuredClone(seed);
    value.catalog.countries[0].cities[0].places[0].city = 'elsewhere';
    expect(() => parseBackup(JSON.stringify(value))).toThrow(/Город места/);
  });

  it('rejects unsafe links, invalid coordinates and unknown tags', () => {
    const value = backup();
    const place = value.catalog.countries[0].cities[0].places[0];
    place.links = [{ label: 'Invalid', url: 'javascript:alert(1)' }];
    expect(catalogSchema.safeParse(value.catalog).success).toBe(false);
    delete place.links;
    place.coords = { lat: 999, lng: 0 };
    expect(catalogSchema.safeParse(value.catalog).success).toBe(false);
    delete place.coords;
    place.tags.push('unknown');
    expect(() => parseBackup(JSON.stringify(value))).toThrow(/Неизвестный тег/);
  });

  it('rejects corrupt files, unsupported versions and reversed time estimates', () => {
    expect(() => parseBackup('{broken')).toThrow();
    const value = backup();
    expect(() =>
      parseBackup(JSON.stringify({ ...value, version: 2 })),
    ).toThrow();
    value.catalog.countries[0].cities[0].places[0].timeEstimateHours = [4, 1];
    expect(() => parseBackup(JSON.stringify(value))).toThrow(
      /Минимальное время/,
    );
  });

  it('rejects malformed legacy calendar data rather than crashing the restored view', () => {
    const value = {
      ...backup(),
      legacy: { 'jt:trip-events': [{ title: 42, links: 'invalid' }] },
    };
    expect(() => parseBackup(JSON.stringify(value))).toThrow();
  });
});
