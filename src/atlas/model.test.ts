import { describe, expect, it } from 'vitest';
import { defaultSeed as seed } from './seed';
import {
  catalogSchema,
  guideUrl,
  parseBackup,
  stateKey,
  type Backup,
} from './model';
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

  it('includes all nine countries and the winter city catalog', () => {
    expect(seed.countries.map((c) => c.id)).toEqual([
      'malaysia',
      'singapore',
      'indonesia',
      'japan',
      'australia',
      'thailand',
      'vietnam',
      'laos',
      'cambodia',
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

  it('adds the Australia tab to old catalogs and preserves an existing custom guide', () => {
    const catalog = structuredClone(seed);
    catalog.countries = catalog.countries.filter(
      (country) => country.id !== 'australia',
    );
    const migrated = migrateCatalog(catalog);
    const australia = migrated.countries.find(
      (country) => country.id === 'australia',
    )!;
    expect(australia.cities.length).toBeGreaterThan(1);
    expect(
      australia.cities
        .flatMap((city) => city.places)
        .some((place) => place.foodSpot),
    ).toBe(true);
    const custom = structuredClone(migrated);
    const edited = custom.countries.find(
      (country) => country.id === 'australia',
    )!;
    edited.nameRu = 'Моя Австралия';
    edited.sections.push({
      id: 'personal-plan',
      title: 'Мой план',
      body: 'Встреча с друзьями',
    });
    const original = edited.cities[0].places[0];
    original.note = 'Личная заметка';
    edited.cities[0].places = [original];
    edited.cities = edited.cities.slice(0, 1);
    const expanded = migrateCatalog(custom);
    const actual = expanded.countries.find(
      (country) => country.id === 'australia',
    )!;
    expect(actual.nameRu).toBe('Моя Австралия');
    expect(actual.sections).toEqual(edited.sections);
    expect(actual.cities[0].places[0]).toEqual(original);
    expect(actual.cities.map((city) => city.id)).toEqual(
      australia.cities.map((city) => city.id),
    );
    expect(actual.cities[0].places.length).toBeGreaterThan(1);
    expect(migrateCatalog(expanded)).toEqual(expanded);
    expect(
      catalog.countries.some((country) => country.id === 'australia'),
    ).toBe(false);
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
    expect(updatedPenang.places.map((place) => place.slug)).toEqual(
      expect.arrayContaining(['penang-habitat', 'penang-fort-cornwallis']),
    );
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

describe('Vietnam catalog', () => {
  it('includes nine bases with seven northern, six central and seven southern places', () => {
    const vietnam = seed.countries.find(({ id }) => id === 'vietnam')!;
    expect(vietnam.cities.map((city) => city.id)).toEqual([
      'hanoi',
      'ninh-binh',
      'sapa',
      'phong-nha',
      'hue',
      'hoi-an',
      'ho-chi-minh',
      'can-tho',
      'phu-quoc',
    ]);
    expect(
      [0, 3, 6].map(
        (start) =>
          vietnam.cities.slice(start, start + 3).flatMap((city) => city.places)
            .length,
      ),
    ).toEqual([7, 6, 7]);
    expect(guideUrl(vietnam)).toBe('/guide/vietnam/hanoi');
    expect(stateKey(vietnam.id, 'hanoi', 'ha-long-bay')).toBe(
      'vietnam:hanoi:ha-long-bay',
    );
    expect(migrateCatalog(seed)).toEqual(seed);
  });

  it('restores Vietnam to a saved catalog without changing existing countries', () => {
    const catalog = structuredClone(seed);
    catalog.countries = catalog.countries.filter(
      ({ id }) => id !== 'vietnam',
    );
    catalog.countries[0].intro = 'Мой маршрут по Малайзии';

    const migrated = migrateCatalog(catalog);
    expect(migrated.countries.filter(({ id }) => id !== 'vietnam')).toEqual(
      catalog.countries,
    );
    expect(
      migrated.countries.find(({ id }) => id === 'vietnam')?.cities,
    ).toHaveLength(9);
    expect(migrateCatalog(migrated)).toEqual(migrated);
  });

  it('adds definitions for new tags and retains the saved tag labels', () => {
    const catalog = structuredClone(seed);
    catalog.countries = [
      catalog.countries.find((country) => country.id === 'singapore')!,
    ];
    catalog.countries[0].cities = [];
    catalog.tags = [
      { id: 'sight', label: 'Мои достопримечательности', tone: 'sand' },
      { id: 'personal', label: 'Личное', tone: 'green' },
    ];

    const migrated = migrateCatalog(catalog);
    expect(migrated.tags.slice(0, 2)).toEqual(catalog.tags);
    expect(migrated.tags.some((tag) => tag.id === 'nature')).toBe(true);
    expect(catalogSchema.safeParse(migrated).success).toBe(true);
    expect(migrateCatalog(migrated)).toEqual(migrated);
  });

  it('fills a partial Vietnam guide while keeping user edits, links and marks', () => {
    const value = backup();
    const vietnam = value.catalog.countries.find(({ id }) => id === 'vietnam')!;
    vietnam.nameRu = 'Мой Вьетнам';
    vietnam.sections = [
      { id: 'personal-plan', title: 'Мой план', body: 'Встреча' },
    ];
    const hanoi = vietnam.cities[0];
    hanoi.nameRu = 'Мой Ханой';
    const halong = hanoi.places.find((place) => place.slug === 'ha-long-bay')!;
    halong.note = 'Личная заметка';
    halong.links = [
      { label: 'Мой маршрут', url: 'https://example.org/halong' },
    ];
    const customPlace = { ...halong, slug: 'my-place' };
    hanoi.places = [customPlace, halong];
    const customCity = { ...hanoi, id: 'my-base', places: [] };
    vietnam.cities = [customCity, hanoi];
    value.favorites = ['vietnam:hanoi:ha-long-bay'];
    value.visited = ['osaka:dotonbori'];
    value.booked = ['vietnam:hanoi:my-place'];

    const migrated = migrateCatalog(value.catalog);
    const expanded = migrated.countries.find(({ id }) => id === 'vietnam')!;
    expect(expanded.nameRu).toBe(vietnam.nameRu);
    expect(expanded.sections).toEqual(vietnam.sections);
    expect(expanded.cities[0]).toEqual(customCity);
    expect(expanded.cities[1].nameRu).toBe(hanoi.nameRu);
    expect(expanded.cities[1].places.slice(0, 2)).toEqual([
      customPlace,
      halong,
    ]);
    expect(expanded.cities).toHaveLength(10);
    expect(expanded.cities.flatMap((city) => city.places)).toHaveLength(21);
    expect(vietnam.cities).toHaveLength(2);
    expect(migrateCatalog(migrated)).toEqual(migrated);

    const restored = parseBackup(
      JSON.stringify({ ...value, catalog: migrated }),
    );
    expect(restored.favorites).toEqual(value.favorites);
    expect(restored.visited).toEqual(value.visited);
    expect(restored.booked).toEqual(value.booked);
    expect(restored.favorites[0]).toBe(
      stateKey(expanded.id, hanoi.id, halong.slug),
    );
  });
});

describe('Laos catalog', () => {
  const country = seed.countries.find(({ id }) => id === 'laos')!;

  it('preserves the twenty place slugs in the ten travel regions', () => {
    expect(country.nameRu).toBe('Лаос');
    expect(country.nameEn).toBe('Laos');
    expect(guideUrl(country)).toBe('/guide/laos/nong-khiaw');
    expect(
      country.cities.map(({ id, places }) => [
        id,
        places.map(({ slug }) => slug),
      ]),
    ).toEqual([
      ['nong-khiaw', ['phadeng-peak']],
      [
        'luang-prabang',
        [
          'pak-ou-tham-ting',
          'wat-xieng-thong',
          'mount-phousi',
          'kuang-si-waterfall',
        ],
      ],
      ['phonsavan', ['plain-of-jars-site-1']],
      ['vang-vieng', ['nam-xay-viewpoint', 'blue-lagoon-1', 'tham-chang-cave']],
      [
        'vientiane',
        ['pha-that-luang', 'wat-sisaket', 'cope-visitor-centre', 'buddha-park'],
      ],
      ['khammouane', ['kong-lor-cave', 'tham-pa-fa']],
      ['bolaven-plateau', ['tad-fane']],
      ['champasak', ['vat-phou']],
      ['pakse', ['wat-phou-salao']],
      ['si-phan-don', ['don-det-don-khon-bridge', 'khone-phapheng-falls']],
    ]);
  });

  it('keeps mapped places, sources and visit details across the guide', () => {
    const places = country.cities.flatMap((city) => city.places);
    for (const place of places) {
      expect(place.nameRu).toBeTruthy();
      expect(place.nameEn).toBeTruthy();
      expect(place.coords).toBeDefined();
      expect(place.links?.length).toBeGreaterThan(0);
      expect(place.transport).toBeTruthy();
      expect(place.visitDuration).toBeTruthy();
      expect(place.timeEstimateHours[0]).toBeGreaterThan(0);
      expect(place.bestTime).toBeTruthy();
    }
    const landmarks = [
      ['pak-ou-tham-ting', 20.04931, 102.21077],
      ['kong-lor-cave', 17.95609, 104.76161],
      ['vat-phou', 14.84866, 105.81446],
    ] as const;
    for (const [slug, lat, lng] of landmarks) {
      expect(places.find((place) => place.slug === slug)?.coords).toEqual({
        lat,
        lng,
      });
    }
  });
});

describe('Cambodia catalog', () => {
  const cambodia = seed.countries.find(({ id }) => id === 'cambodia')!;

  it('includes twenty places with valid details in the seven travel bases', () => {
    expect(catalogSchema.parse(seed)).toEqual(seed);
    expect(guideUrl(cambodia)).toBe('/guide/cambodia/siem-reap');
    expect(
      cambodia.cities.map(({ id, places }) => [id, places.length]),
    ).toEqual([
      ['siem-reap', 8],
      ['battambang', 2],
      ['kampong-thom', 1],
      ['phnom-penh', 2],
      ['kratie', 2],
      ['kampot-kep', 4],
      ['koh-rong-sanloem', 1],
    ]);
    for (const place of cambodia.cities.flatMap((city) => city.places)) {
      expect(place.nameEn).toBeTruthy();
      expect(place.coords).toBeDefined();
      expect(place.mapsQuery).toBeTruthy();
      expect(place.sections).toContainEqual({
        id: 'map-pin',
        title: 'Ориентир',
        body: expect.stringContaining(place.mapsQuery),
      });
      expect(place.visitDuration).toBeTruthy();
      expect(place.timeEstimateHours[0]).toBeGreaterThan(0);
      expect(place.transport).toBeTruthy();
      expect(place.note).toBeTruthy();
      expect(place.links?.length).toBeGreaterThanOrEqual(2);
    }
    const saracen = cambodia.cities.at(-1)?.places[0];
    expect(saracen?.visitDuration).toBe('2–3 ночи');
    expect(saracen?.timeEstimateHours).toEqual([48, 72]);
  });

  it('keeps arrival coordinates and named landmarks at the five access points', () => {
    const places = cambodia.cities.flatMap((city) => city.places);
    const checkpoints = [
      ['kampong-phluk', 'Ticket Office', 13.28779, 103.996591],
      ['kampi-dolphins', 'Mekong Dolphin Pleasance', 12.606057, 106.022677],
      ['koh-trong', 'Ferry to Koh Trong', 12.49396, 106.01528],
      ['kep-national-park', 'Entrance · Veranda', 10.486971, 104.295438],
      ['saracen-bay', 'Orchid Pier', 10.58056, 103.30769],
    ] as const;
    for (const [slug, landmark, lat, lng] of checkpoints) {
      const place = places.find((place) => place.slug === slug);
      expect(place?.coords).toEqual({ lat, lng });
      expect(place?.mapsQuery).toContain(landmark);
    }
  });

  it('keeps the three itineraries and dated logistics in the country notes', () => {
    const notes = Object.fromEntries(
      cambodia.sections.map(({ id, body }) => [id, body]),
    );
    expect(notes.route).toContain('Ангкор-Ват, Байон и Та-Пром');
    expect(notes['one-week']).toContain('5,5–7 ч');
    expect(notes['ten-to-fourteen-days']).toContain(
      '2–3 ночи в бухте Сарасен',
    );
    expect(notes['angkor-pass']).toContain('Angkor Pass');
    expect(notes['season-and-airport']).toContain('SAI');
    expect(notes.transfers).toContain('26.11.2026');
  });
});

describe('Thailand catalog', () => {
  const country = seed.countries.find(({ id }) => id === 'thailand')!;
  const places = country.cities.flatMap((city) => city.places);

  it('includes twenty distinct places across the seven source regions', () => {
    expect(catalogSchema.parse(seed)).toEqual(seed);
    expect(guideUrl(country)).toBe('/guide/thailand/andaman');
    expect(
      country.cities.map(({ id, places }) => [id, places.length]),
    ).toEqual([
      ['andaman', 7],
      ['central', 4],
      ['north', 4],
      ['gulf', 2],
      ['south', 1],
      ['isan', 1],
      ['east', 1],
    ]);
    expect(new Set(places.map(({ slug }) => slug)).size).toBe(20);
    expect(places.find(({ slug }) => slug === 'maya-bay')?.nameEn).toBe(
      'Maya Bay',
    );
    expect(places.find(({ slug }) => slug === 'wat-arun')?.nameEn).toContain(
      'Wat Arun',
    );
  });

  it('has searchable names, travel details, a map pin and sources for every place', () => {
    for (const place of places) {
      expect(place.nameEn).toBeTruthy();
      expect(place.coords).toBeDefined();
      expect(place.mapsQuery).toBeTruthy();
      expect(place.visitDuration).toBeTruthy();
      expect(place.timeEstimateHours[0]).toBeGreaterThan(0);
      expect(place.transport).toBeTruthy();
      expect(place.bestTime).toBeTruthy();
      expect(place.links?.length).toBeGreaterThan(0);
      expect(place.sections?.map(({ id }) => id)).toEqual([
        'base',
        'difficulty',
        'map-pin',
      ]);
    }
  });

  it('keeps the map pins on the requested trails, beaches and viewpoints', () => {
    const pins = [
      ['phra-nang-beach', 8.00489, 98.83979],
      ['tiger-cave-temple', 8.12625, 98.92277],
      ['maya-bay', 7.67663, 98.76612],
      ['donald-duck-bay', 8.66565, 97.64775],
      ['khao-phing-kan', 8.27468, 98.50041],
      ['erawan-waterfall', 14.37449, 99.14533],
      ['tanote-bay', 10.08475, 99.848],
      ['wat-rong-khun', 19.82373, 99.7634],
      ['white-sand-beach', 12.10303, 102.27389],
    ] as const;
    for (const [slug, lat, lng] of pins) {
      expect(places.find((place) => place.slug === slug)?.coords).toEqual({
        lat,
        lng,
      });
    }
  });

  it('dates the route and links the climate and access notes to official sources', () => {
    const notes = Object.fromEntries(
      country.sections.map(({ id, body }) => [id, body]),
    );
    expect(notes.route).toContain('20 декабря 2026 — 6–10 января 2027');
    expect(notes.climate).toContain('https://www.tmd.go.th/en');
    expect(notes.access).toContain('https://news.dnp.go.th/news/48996');
    expect(notes.access).toContain('https://news.dnp.go.th/news/50049');
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
