import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { catalogSchema, countrySchema, parseBackup, type Backup } from '../src/atlas/model';
import { seed } from '../src/atlas/seed';

const [command, filename] = process.argv.slice(2);
if (!filename || !['apply', 'export', 'add-country'].includes(command)) {
  throw new Error('Usage: npm run catalog -- <apply|export|add-country> <file.json>');
}

if (command === 'export') {
  const backup: Backup = { format: 'travel-atlas', version: 1, exportedAt: new Date().toISOString(), catalog: seed, favorites: [], visited: [], booked: [] };
  await writeFile(filename, `${JSON.stringify(backup, null, 2)}\n`);
  console.log(`Exported ${seed.countries.length} countries to ${filename}`);
} else {
  const raw = await readFile(filename, 'utf8');
  const input = JSON.parse(raw);
  const catalog = command === 'add-country'
    ? catalogSchema.parse({ ...seed, countries: [...seed.countries, countrySchema.parse(input)] })
    : input.format === 'travel-atlas' ? parseBackup(raw).catalog : catalogSchema.parse(input);
  const destination = fileURLToPath(new URL('../src/atlas/published.json', import.meta.url));
  await writeFile(destination, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Applied ${catalog.countries.length} countries. Personal marks were not included. Run npm test and npm run build before committing.`);
}
