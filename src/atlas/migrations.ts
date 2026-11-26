import type { Catalog, Country, GuideCity, GuidePlace } from './model';
import { malaysiaDining } from './malaysia-dining';
import { malaysiaHighlights } from './penang-highlights';
import { indonesiaAdditions, indonesiaNewCities } from './indonesia-expansion';
import { australia } from './australia';
import {
  canThoSourceUrls,
  thienMuSourceUrl,
  vietnam,
  vietnamRouteSummary,
} from './vietnam';
import { defaultSeed, regionalGuides } from './seed';

const addedCountries = [australia, ...regionalGuides];
const regionalGuideIds = new Set(regionalGuides.map(({ id }) => id));

const appendMissing = <T>(
  existing: T[],
  additions: T[],
  key: (item: T) => string,
): T[] => {
  const keys = new Set(existing.map(key));
  return [...existing, ...additions.filter((item) => !keys.has(key(item)))];
};

const expandCities = (
  cities: GuideCity[],
  additions: Record<string, GuidePlace[]>,
  newCities: GuideCity[] = [],
): GuideCity[] =>
  appendMissing(cities, newCities, (city) => city.id).map((city) => ({
    ...city,
    places: appendMissing(
      city.places,
      [
        ...(additions[city.id] ?? []),
        ...(newCities.find((entry) => entry.id === city.id)?.places ?? []),
      ],
      (place) => place.slug,
    ),
  }));

const islandNames: Record<string, [string, string]> = {
  java: ['Ява', 'о. Ява'],
  lombok: ['Ломбок', 'о. Ломбок'],
  gili: ['Острова Гили', 'о. Гили'],
  flores: ['Флорес и Комодо', 'о. Флорес и о. Комодо'],
  kalimantan: ['Калимантан', 'о. Калимантан'],
};

const updateIslandLabels = (city: GuideCity): GuideCity => {
  const names = islandNames[city.id];
  return {
    ...city,
    nameRu: names && city.nameRu === names[0] ? names[1] : city.nameRu,
    places: city.places.map((place) =>
      city.id === 'gili' &&
      place.slug === 'gili-trawangan' &&
      place.nameRu === 'Гили Траванган'
        ? { ...place, nameRu: 'о. Гили Траванган' }
        : place,
    ),
  };
};

const vietnamSourceReplacements = new Map([
  [
    'can-tho/cai-rang-floating-market',
    {
      previousUrl: 'https://canthotourism.vn/en/tourdetail/?tourid=2186',
      currentUrl: canThoSourceUrls.caiRangFloatingMarket,
    },
  ],
  [
    'can-tho/binh-thuy-ancient-house',
    {
      previousUrl: 'https://canthotourism.vn/en/detailtravelplace/?id=535',
      currentUrl: canThoSourceUrls.binhThuyAncientHouse,
    },
  ],
  [
    'hue/thien-mu-pagoda',
    {
      previousUrl: 'https://whc.unesco.org/en/list/678/multipleelements/',
      currentUrl: thienMuSourceUrl,
    },
  ],
]);

const updateVietnamSources = (city: GuideCity): GuideCity => ({
  ...city,
  places: city.places.map((place) => {
    const replacement = vietnamSourceReplacements.get(
      `${city.id}/${place.slug}`,
    );
    if (!replacement || !place.links) return place;
    return {
      ...place,
      links: place.links.map((link) =>
        link.url === replacement.previousUrl
          ? { ...link, url: replacement.currentUrl }
          : link,
      ),
    };
  }),
});

const previousVietnamRouteSummary =
  'Выберите базы по погоде и интересам. На Севере в это время прохладно, в Центре возможны дожди, а за купанием лучше ехать на Юг. В карточках время на дорогу указано в одну сторону от выбранной базы. Заложите запас на праздничные очереди.';

const expandVietnam = (country: Country): Country => ({
  ...country,
  cities: expandCities(country.cities, {}, vietnam.cities).map(
    updateVietnamSources,
  ),
  sections: country.sections.map((section) =>
    section.id === 'route' && section.body === previousVietnamRouteSummary
      ? { ...section, body: vietnamRouteSummary }
      : section,
  ),
});

const malaysiaAdditions = Object.fromEntries(
  Object.keys({ ...malaysiaHighlights, ...malaysiaDining }).map((city) => [
    city,
    [...(malaysiaHighlights[city] ?? []), ...(malaysiaDining[city] ?? [])],
  ]),
);

const expandCountry = (country: Country): Country => {
  if (country.id === 'malaysia')
    return {
      ...country,
      cities: expandCities(country.cities, malaysiaAdditions),
    };
  if (country.id === vietnam.id) return expandVietnam(country);
  const added = addedCountries.find((entry) => entry.id === country.id);
  if (added)
    return {
      ...country,
      cities: expandCities(country.cities, {}, added.cities),
    };
  if (country.id !== 'indonesia') return country;
  return {
    ...country,
    cities: expandCities(
      country.cities,
      indonesiaAdditions,
      indonesiaNewCities,
    ).map(updateIslandLabels),
  };
};

const withRegionalGuideOrder = (countries: Country[]): Country[] => {
  const firstGuideIndex = countries.findIndex(({ id }) =>
    regionalGuideIds.has(id),
  );
  const otherCountries = countries.filter(({ id }) => !regionalGuideIds.has(id));
  const savedById = new Map(countries.map((country) => [country.id, country]));
  otherCountries.splice(
    firstGuideIndex < 0 ? otherCountries.length : firstGuideIndex,
    0,
    ...regionalGuides.map((guide) => savedById.get(guide.id) ?? guide),
  );
  return otherCountries;
};

export const migrateCatalog = (catalog: Catalog): Catalog => {
  const countries = withRegionalGuideOrder(
    appendMissing(catalog.countries, [australia], ({ id }) => id),
  ).map(expandCountry);
  const usedTags = new Set(
    countries.flatMap((country) =>
      country.cities.flatMap((city) =>
        city.places.flatMap((place) => place.tags),
      ),
    ),
  );
  return {
    ...catalog,
    countries,
    tags: appendMissing(
      catalog.tags,
      defaultSeed.tags.filter((tag) => usedTags.has(tag.id)),
      (tag) => tag.id,
    ),
  };
};
