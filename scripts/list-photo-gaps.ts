import { defaultSeed } from '../src/atlas/seed';
import { licensedPhotos } from '../src/atlas/photos';

const licensed = new Set(licensedPhotos.map((photo) => photo.key));

for (const country of defaultSeed.countries)
  for (const city of country.cities)
    for (const place of city.places) {
      const key = `${country.id}/${city.id}/${place.slug}`;
      if (licensed.has(key) || place.photo || place.remotePhoto) continue;
      const description = place.description.slice(0, 160).replace(/\s+/g, ' ');
      console.log([key, place.nameRu, place.mapsQuery, place.foodSpot ? 'FOOD' : '', description].join(' | '));
    }
