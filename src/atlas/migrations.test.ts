import { describe, expect, it } from 'vitest';
import { cambodia } from './cambodia';
import { laos } from './laos';
import { migrateCatalog } from './migrations';
import { catalogSchema, guideUrl, parseBackup, stateKey } from './model';
import { withLicensedPhotos } from './photos';
import { defaultSeed } from './seed';
import { thailand } from './thailand';
import { canThoSourceUrls, vietnam, vietnamRouteSummary } from './vietnam';

describe('Vietnam migration', () => {
  it.each([
    [
      'can-tho',
      'cai-rang-floating-market',
      'https://canthotourism.vn/en/tourdetail/?tourid=2186',
      canThoSourceUrls.caiRangFloatingMarket,
    ],
    [
      'can-tho',
      'binh-thuy-ancient-house',
      'https://canthotourism.vn/en/detailtravelplace/?id=535',
      canThoSourceUrls.binhThuyAncientHouse,
    ],
    [
      'hue',
      'thien-mu-pagoda',
      'https://whc.unesco.org/en/list/678/multipleelements/',
      'https://whc.unesco.org/en/list/678/maps/',
    ],
  ])(
    'updates the old source for %s/%s and preserves saved edits',
    (cityId, slug, previousUrl, currentUrl) => {
      const saved = structuredClone(defaultSeed);
      const country = saved.countries.find(({ id }) => id === vietnam.id)!;
      const city = country.cities.find(({ id }) => id === cityId)!;
      const place = city.places.find((entry) => entry.slug === slug)!;
      const source = { label: 'Справка о месте', url: previousUrl };
      const personal = { label: 'Источник', url: 'https://example.org/my-route' };
      expect(place.links).toContainEqual({ label: 'Источник', url: currentUrl });
      place.links = [source, personal];
      place.note = 'Моя заметка о месте';
      const customPlace = { ...place, slug: 'my-stop' };
      city.places = [place, customPlace];
      country.cities = [city];

      const migrated = migrateCatalog(saved);
      const migratedCountry = migrated.countries.find(
        ({ id }) => id === country.id,
      )!;

      expect(migratedCountry.cities[0].places.slice(0, 2)).toEqual([
        { ...place, links: [{ ...source, url: currentUrl }, personal] },
        customPlace,
      ]);
      expect(place.links[0].url).toBe(previousUrl);
      expect(migrateCatalog(migrated)).toEqual(migrated);
    },
  );

  it('dates the original route guidance and preserves edited notes', () => {
    const saved = structuredClone(defaultSeed);
    const country = saved.countries.find(({ id }) => id === vietnam.id)!;
    const originalBody =
      'Выберите базы по погоде и интересам. На Севере в это время прохладно, в Центре возможны дожди, а за купанием лучше ехать на Юг. В карточках время на дорогу указано в одну сторону от выбранной базы. Заложите запас на праздничные очереди.';
    const route = { id: 'route', title: 'Мой маршрут', body: originalBody };
    const archived = { ...route, id: 'my-notes', title: 'Мои заметки' };
    country.sections = [route, archived];

    const migrated = migrateCatalog(saved);
    expect(
      migrated.countries.find(({ id }) => id === vietnam.id)?.sections,
    ).toEqual([{ ...route, body: vietnamRouteSummary }, archived]);
    expect(migrateCatalog(migrated)).toEqual(migrated);

    route.body = 'Мои планы с учётом погоды';
    expect(
      migrateCatalog(saved).countries.find(({ id }) => id === vietnam.id)
        ?.sections,
    ).toEqual(country.sections);
  });
});

describe('Regional guide order', () => {
  it('restores missing guides in seed order', () => {
    for (const missingIds of [
      [laos.id, thailand.id],
      [laos.id, cambodia.id, thailand.id],
      [vietnam.id, laos.id, thailand.id],
      [vietnam.id, laos.id, cambodia.id, thailand.id],
    ]) {
      const saved = structuredClone(defaultSeed);
      saved.countries = saved.countries.filter(
        ({ id }) => !missingIds.includes(id),
      );
      saved.countries[0].intro = 'Моя Малайзия';

      const migrated = migrateCatalog(saved);

      expect(migrated.countries.map(({ id }) => id)).toEqual(
        defaultSeed.countries.map(({ id }) => id),
      );
      expect(
        migrated.countries.filter(({ id }) => !missingIds.includes(id)),
      ).toEqual(saved.countries);
      expect(migrated.countries.find(({ id }) => id === laos.id)).toEqual(laos);
      expect(catalogSchema.safeParse(migrated).success).toBe(true);
      expect(migrateCatalog(migrated)).toEqual(migrated);
    }
  });

  it('groups the guides at the first saved position', () => {
    const saved = structuredClone(defaultSeed);
    const savedCambodia = saved.countries.find(({ id }) => id === cambodia.id)!;
    saved.countries = [
      savedCambodia,
      ...saved.countries.filter(
        ({ id }) => id !== laos.id && id !== cambodia.id,
      ),
    ];

    const migrated = migrateCatalog(saved);
    expect(migrated.countries.slice(0, 4).map(({ id }) => id)).toEqual([
      thailand.id,
      vietnam.id,
      laos.id,
      cambodia.id,
    ]);
    expect(migrated.countries[3]).toEqual(savedCambodia);
    expect(migrated.countries.slice(4)).toEqual(defaultSeed.countries.slice(0, 5));
    expect(migrateCatalog(migrated)).toEqual(migrated);
  });

  it('updates the order of fully saved guides and preserves their edits', () => {
    const saved = structuredClone(defaultSeed);
    const savedLaos = saved.countries.find(({ id }) => id === laos.id)!;
    const thailandIndex = saved.countries.findIndex(
      ({ id }) => id === thailand.id,
    );
    const [savedThailand] = saved.countries.splice(thailandIndex, 1);
    saved.countries.push(savedThailand);
    savedLaos.nameRu = 'Мой Лаос';

    const migrated = migrateCatalog(saved);
    expect(migrated.countries.map(({ id }) => id)).toEqual(
      defaultSeed.countries.map(({ id }) => id),
    );
    expect(migrated.countries.find(({ id }) => id === laos.id)).toEqual(savedLaos);
    expect(migrateCatalog(migrated)).toEqual(migrated);
  });
});

describe('Laos migration', () => {
  it('fills a saved partial Laos guide and preserves edits and personal marks', () => {
    const catalog = structuredClone(defaultSeed);
    const country = catalog.countries.find(({ id }) => id === laos.id)!;
    const region = country.cities.find(({ id }) => id === 'luang-prabang')!;
    const cave = region.places.find(({ slug }) => slug === 'pak-ou-tham-ting')!;
    const customStop = { ...cave, slug: 'my-stop', nameRu: 'Моя остановка' };
    country.nameRu = 'Мой Лаос';
    country.sections = [
      { id: 'my-plan', title: 'Мой план', body: 'Утром на Меконг' },
    ];
    region.nameRu = 'Мой Луангпхабанг';
    cave.note = 'Личная заметка о причале';
    cave.links = [{ label: 'Мой маршрут', url: 'https://example.org/pak-ou' }];
    region.places = [customStop, cave];
    country.cities = [region];
    const saved = {
      format: 'travel-atlas',
      version: 1,
      exportedAt: '2026-11-26T00:00:00Z',
      favorites: ['laos:luang-prabang:pak-ou-tham-ting', 'osaka:dotonbori'],
      visited: ['laos:luang-prabang:my-stop', 'vietnam:hanoi:ha-long-bay'],
      booked: ['laos:luang-prabang:pak-ou-tham-ting'],
    };

    const migrated = migrateCatalog(catalog);
    const expanded = migrated.countries.find(({ id }) => id === country.id)!;

    expect(expanded.nameRu).toBe(country.nameRu);
    expect(expanded.sections).toEqual(country.sections);
    expect(expanded.cities[0].id).toBe(region.id);
    expect(expanded.cities[0].nameRu).toBe(region.nameRu);
    expect(expanded.cities[0].places.slice(0, 2)).toEqual(region.places);
    expect(expanded.cities[0].places).toHaveLength(5);
    expect(expanded.cities).toHaveLength(10);
    expect(expanded.cities.flatMap(({ places }) => places)).toHaveLength(21);
    expect(country.cities).toHaveLength(1);
    expect(migrateCatalog(migrated)).toEqual(migrated);

    const restored = parseBackup(
      JSON.stringify({ ...saved, catalog: migrated }),
    );
    expect(restored.favorites).toEqual(saved.favorites);
    expect(restored.visited).toEqual(saved.visited);
    expect(restored.booked).toEqual(saved.booked);
    expect(stateKey(expanded.id, region.id, cave.slug)).toBe(
      saved.favorites[0],
    );
  });
});

describe('Cambodia migration', () => {
  it('adds Cambodia once to a saved catalog and keeps the existing guides', () => {
    const catalog = structuredClone(defaultSeed);
    catalog.countries = catalog.countries.filter(
      ({ id }) => id !== cambodia.id,
    );
    catalog.countries[0].intro = 'Моя Малайзия';

    const migrated = migrateCatalog(catalog);
    expect(migrated.countries).toEqual([...catalog.countries, cambodia]);
    expect(migrateCatalog(migrated)).toEqual(migrated);
    expect(catalogSchema.safeParse(migrated).success).toBe(true);
  });

  it('fills missing Cambodia regions and places while preserving personal data and keys', () => {
    const catalog = structuredClone(defaultSeed);
    const edited = catalog.countries.find(({ id }) => id === cambodia.id)!;
    const firstBase = edited.cities[0];
    const angkorWat = firstBase.places[0];
    angkorWat.note = 'Ветрено у пруда утром';
    firstBase.nameRu = 'Мой Сиемреап';
    firstBase.places = [
      angkorWat,
      { ...angkorWat, slug: 'my-stop', nameRu: 'Моя остановка' },
    ];
    edited.cities = [firstBase];
    edited.sections = [
      { id: 'my-plan', title: 'Мой план', body: 'Встреча в Сиемреапе' },
    ];
    const saved = {
      format: 'travel-atlas',
      version: 1,
      exportedAt: '2026-11-26T00:00:00Z',
      favorites: ['cambodia:siem-reap:angkor-wat', 'osaka:dotonbori'],
      visited: ['cambodia:siem-reap:my-stop', 'vietnam:hanoi:ha-long-bay'],
      booked: ['cambodia:siem-reap:angkor-wat'],
    };

    const migrated = migrateCatalog(catalog);
    const expanded = migrated.countries.find(
      ({ id }) => id === cambodia.id,
    )!;
    expect(expanded.sections).toEqual(edited.sections);
    expect(expanded.cities[0].nameRu).toBe('Мой Сиемреап');
    expect(expanded.cities[0].places.slice(0, 2)).toEqual(firstBase.places);
    expect(expanded.cities).toHaveLength(7);
    expect(expanded.cities.flatMap((city) => city.places)).toHaveLength(21);
    expect(edited.cities).toHaveLength(1);
    expect(migrateCatalog(migrated)).toEqual(migrated);

    const restored = parseBackup(
      JSON.stringify({ ...saved, catalog: migrated }),
    );
    expect(restored.favorites).toEqual(saved.favorites);
    expect(restored.visited).toEqual(saved.visited);
    expect(restored.booked).toEqual(saved.booked);
    expect(stateKey(expanded.id, firstBase.id, angkorWat.slug)).toBe(
      saved.favorites[0],
    );
    expect(guideUrl(expanded)).toBe('/guide/cambodia/siem-reap');
  });
});

describe('Thailand migration', () => {
  it('restores Thailand before Vietnam and keeps the order of unrelated guides', () => {
    const saved = structuredClone(defaultSeed);
    saved.countries = saved.countries.filter(({ id }) => id !== thailand.id);
    const first = saved.countries.shift()!;
    first.intro = 'Моя Малайзия';
    saved.countries.push(first);

    const migrated = migrateCatalog(saved);

    const vietnamIndex = migrated.countries.findIndex(
      ({ id }) => id === vietnam.id,
    );
    expect(migrated.countries[vietnamIndex - 1]).toEqual(thailand);
    expect(migrated.countries.filter(({ id }) => id !== thailand.id)).toEqual(
      saved.countries,
    );
    expect(catalogSchema.parse(migrated)).toEqual(migrated);
    expect(migrateCatalog(migrated)).toEqual(migrated);
  });

  it('fills a partial Thailand guide while preserving user notes, photos and marks', () => {
    const saved = structuredClone(defaultSeed);
    const country = structuredClone(thailand);
    const andaman = country.cities[0];
    const maya = andaman.places.find(({ slug }) => slug === 'maya-bay')!;
    maya.note = 'Моя заметка о высадке';
    maya.photo = 'https://example.org/my-maya-bay.jpg';
    maya.photoCredit = 'Мой снимок';
    maya.links = [{ label: 'Моя лодка', url: 'https://example.org/boat' }];
    andaman.nameRu = 'Мой Андаман';
    andaman.places = [
      { ...maya, slug: 'my-stop', nameRu: 'Моя остановка' },
      maya,
    ];
    country.cities = [andaman];
    country.sections = [
      { id: 'my-plan', title: 'Мой план', body: 'Ранняя лодка' },
    ];
    saved.countries = [
      country,
      ...saved.countries.filter(({ id }) => id !== country.id),
    ];
    const flags = {
      favorites: ['thailand:andaman:maya-bay', 'osaka:dotonbori'],
      visited: ['thailand:andaman:my-stop', 'vietnam:hanoi:ha-long-bay'],
      booked: ['thailand:andaman:maya-bay'],
    };

    const migrated = withLicensedPhotos(migrateCatalog(saved));
    const expanded = migrated.countries[0];

    expect(expanded.id).toBe(thailand.id);
    expect(expanded.sections).toEqual(country.sections);
    expect(expanded.cities[0].nameRu).toBe(andaman.nameRu);
    expect(expanded.cities[0].places.slice(0, 2)).toEqual(andaman.places);
    expect(expanded.cities).toHaveLength(7);
    expect(expanded.cities.flatMap(({ places }) => places)).toHaveLength(21);
    expect(withLicensedPhotos(migrateCatalog(migrated))).toEqual(migrated);

    const restored = parseBackup(
      JSON.stringify({
        format: 'travel-atlas',
        version: 1,
        exportedAt: '2026-11-26T00:00:00Z',
        catalog: migrated,
        ...flags,
      }),
    );
    expect(restored).toMatchObject(flags);
    expect(stateKey(expanded.id, andaman.id, maya.slug)).toBe(
      flags.favorites[0],
    );
  });
});
