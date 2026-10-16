import { describe, expect, it } from 'vitest';
import { defaultSeed as seed } from './seed';
import { catalogSchema, parseBackup, stateKey, type Backup } from './model';
import { places } from '../data/places';
import { friendsMapPlaces } from '../data/friendsMapPlaces';
import { migrateCatalog } from './migrations';
import winter from './winter.json';

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
    for (const city of malaysia.cities) {
      const original = winter.cities[city.id as keyof typeof winter.cities];
      expect(city.places.length).toBeGreaterThanOrEqual(original.length);
    }
    expect(seed.countries[1].cities.flatMap((c) => c.places)).toHaveLength(46);
    expect(seed.countries[2].cities.map((c) => c.id)).toEqual(
      expect.arrayContaining([
        'java',
        'lombok',
        'gili',
        'flores',
        'kalimantan',
        'bali',
      ]),
    );
  });

  it('keeps countries isolated while preserving old Japanese state keys', () => {
    expect(stateKey('japan', 'osaka', 'dotonbori')).toBe('osaka:dotonbori');
    expect(stateKey('malaysia', 'osaka', 'dotonbori')).not.toBe(
      stateKey('japan', 'osaka', 'dotonbori'),
    );
  });

  it('adds researched places to older catalogs while preserving personal edits', () => {
    const catalog = structuredClone(seed);
    const malaysia = catalog.countries.find(
      (country) => country.id === 'malaysia',
    )!;
    const penang = malaysia.cities.find((city) => city.id === 'penang')!;
    const original = penang.places[0];
    original.note = 'Моя остановка';
    original.nameRu = 'Личное название';
    penang.places = [original];
    const indonesia = catalog.countries.find(
      (country) => country.id === 'indonesia',
    )!;
    indonesia.cities = indonesia.cities.filter((city) => city.id !== 'bali');
    const migrated = migrateCatalog(catalog);
    const updatedPenang = migrated.countries
      .find((country) => country.id === 'malaysia')!
      .cities.find((city) => city.id === 'penang')!;
    expect(updatedPenang.places[0]).toEqual(original);
    expect(
      updatedPenang.places.some(
        (place) => place.foodSpot && place.links?.length,
      ),
    ).toBe(true);
    expect(
      migrated.countries
        .find((country) => country.id === 'indonesia')!
        .cities.some((city) => city.id === 'bali'),
    ).toBe(true);
    expect(
      catalog.countries
        .find((country) => country.id === 'indonesia')!
        .cities.some((city) => city.id === 'bali'),
    ).toBe(false);
    expect(migrateCatalog(migrated)).toEqual(migrated);
  });

  it('upgrades old island labels without changing IDs or custom names', () => {
    const catalog = structuredClone(seed);
    const indonesia = catalog.countries.find((c) => c.id === 'indonesia')!;
    indonesia.cities[0].nameRu = 'Ява';
    indonesia.cities[1].nameRu = 'Мой маршрут по Ломбоку';
    indonesia.cities[2].nameRu = 'Острова Гили';
    indonesia.cities[2].places[0].nameRu = 'Гили Траванган';
    const migrated = migrateCatalog(catalog);
    const islands = migrated.countries.find(
      (c) => c.id === 'indonesia',
    )!.cities;
    expect(islands[0].nameRu).toBe('о. Ява');
    expect(islands[1].nameRu).toBe('Мой маршрут по Ломбоку');
    expect(islands[2].nameRu).toBe('о. Гили');
    expect(islands[2].places[0].nameRu).toBe('о. Гили Траванган');
    expect(islands.map((c) => c.id)).toEqual(indonesia.cities.map((c) => c.id));
    expect(migrateCatalog(migrated)).toEqual(migrated);
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
