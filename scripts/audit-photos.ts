import { defaultSeed } from '../src/atlas/seed';
import { licensedPhotos } from '../src/atlas/photos';

type Row = { key: string; image: string; licensed: boolean; illustrative: boolean };

const rows: Row[] = defaultSeed.countries.flatMap((country) =>
  country.cities.flatMap((city) =>
    city.places.map((place) => {
      const key = `${country.id}/${city.id}/${place.slug}`;
      const image = place.photo || place.remotePhoto || '';
      return {
        key,
        image,
        licensed: licensedPhotos.some((photo) => photo.key === key && photo.photo === image),
        illustrative: Boolean(place.photoIllustration),
      };
    }),
  ),
);

const groupBy = <T>(items: T[], keyOf: (item: T) => string, valueOf: (item: T) => string) =>
  items.reduce((groups, item) => {
    const key = keyOf(item);
    if (key) groups.set(key, [...(groups.get(key) ?? []), valueOf(item)]);
    return groups;
  }, new Map<string, string[]>());

const duplicates = (groups: Map<string, string[]>) =>
  [...groups].filter(([, keys]) => keys.length > 1);

const summary = groupBy(rows, (row) => row.key.split('/')[0], (row) =>
  row.licensed ? 'licensed' : row.image ? 'unverified' : 'none',
);

console.log('total', rows.length, 'illustrative', rows.filter((row) => row.illustrative).length);
for (const [country, states] of summary)
  console.log(country, Object.fromEntries(['licensed', 'unverified', 'none'].map((s) => [s, states.filter((x) => x === s).length])));
console.log('--- unverified');
for (const row of rows.filter((row) => row.image && !row.licensed)) console.log(row.key, row.image.slice(0, 100));
console.log('--- without photo');
for (const row of rows.filter((row) => !row.image)) console.log(row.key);
console.log('--- same image on several places');
for (const [image, keys] of duplicates(groupBy(rows, (row) => row.image, (row) => row.key))) console.log(image.slice(0, 90), keys);
console.log('--- same source on several manifest entries');
for (const [source, keys] of duplicates(groupBy(licensedPhotos, (photo) => photo.originalUrl, (photo) => photo.key))) console.log(source.slice(-70), keys);
console.log('--- low resolution originals (<1500px wide)');
for (const photo of licensedPhotos.filter((photo) => photo.width < 1500)) console.log(photo.key, photo.width, photo.height);
