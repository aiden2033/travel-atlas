import type { Catalog } from './model';

const islandNames: Record<string, [string, string]> = {
  java: ['Ява', 'о. Ява'],
  lombok: ['Ломбок', 'о. Ломбок'],
  gili: ['Острова Гили', 'о. Гили'],
  flores: ['Флорес и Комодо', 'о. Флорес и о. Комодо'],
  kalimantan: ['Калимантан', 'о. Калимантан'],
};

export const migrateCatalog = (catalog: Catalog): Catalog => ({
  ...catalog,
  countries: catalog.countries.map((country) =>
    country.id !== 'indonesia'
      ? country
      : {
          ...country,
          cities: country.cities.map((city) => {
            const names = islandNames[city.id];
            return {
              ...city,
              nameRu:
                names && city.nameRu === names[0] ? names[1] : city.nameRu,
              places: city.places.map((place) =>
                city.id === 'gili' &&
                place.slug === 'gili-trawangan' &&
                place.nameRu === 'Гили Траванган'
                  ? { ...place, nameRu: 'о. Гили Траванган' }
                  : place,
              ),
            };
          }),
        },
  ),
});
