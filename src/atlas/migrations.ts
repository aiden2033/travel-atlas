import type { Catalog, Country, GuideCity, GuidePlace } from './model';
import { malaysiaDining } from './malaysia-dining';
import { indonesiaAdditions, indonesiaNewCities } from './indonesia-expansion';
import { australia } from './australia';

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

const expandCountry = (country: Country): Country => {
  if (country.id === 'malaysia')
    return { ...country, cities: expandCities(country.cities, malaysiaDining) };
  if (country.id === australia.id)
    return {
      ...country,
      cities: expandCities(country.cities, {}, australia.cities),
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

export const migrateCatalog = (catalog: Catalog): Catalog => ({
  ...catalog,
  countries: appendMissing(
    catalog.countries,
    [australia],
    (country) => country.id,
  ).map(expandCountry),
});
