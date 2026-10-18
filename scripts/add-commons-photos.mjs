import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const manifestPath = new URL('../src/atlas/photo-manifest.json', import.meta.url);
const publicDir = new URL('../public/', import.meta.url);
const userAgent = 'travel-atlas-photo-import/1.0 (https://github.com/aiden2033/travel-atlas)';
const maxWidth = 1200;
const downloadWidth = 2400;

const licenseUrls = {
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0',
  'Public domain': 'https://creativecommons.org/publicdomain/mark/1.0',
};

const normalizeLicense = (shortName) => {
  const name = shortName.trim();
  if (/^CC0/i.test(name)) return 'CC0';
  if (/^(public domain|PD\b|pdm)/i.test(name)) return 'Public domain';
  const match = name.match(/^CC BY(-SA)? (1\.0|2\.0|2\.5|3\.0|4\.0)/i);
  return match ? `CC BY${match[1] ? '-SA' : ''} ${match[2]}` : undefined;
};

const licenseUrlOf = (license) => {
  if (licenseUrls[license]) return licenseUrls[license];
  const [, sa, version] = license.match(/^CC BY(-SA)? (.+)$/);
  return `https://creativecommons.org/licenses/by${sa ? '-sa' : ''}/${version}`;
};

const stripHtml = (html) =>
  html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
};

const commonsInfo = async (file) => {
  const title = `File:${file.replace(/^File:/, '').replace(/_/g, ' ')}`;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|mime',
    iiurlwidth: String(downloadWidth),
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const page = Object.values(data.query.pages)[0];
  const info = page.imageinfo?.[0];
  if (!info) throw new Error(`Нет файла на Commons: ${title}`);
  return { title: page.title, info };
};

const download = async (url, path) => {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
    if (response.ok) return writeFileSync(path, Buffer.from(await response.arrayBuffer()));
    if (attempt === 4 || response.status !== 429) throw new Error(`${response.status} ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
  }
};

const sips = (...args) => execFileSync('sips', args, { stdio: 'pipe' }).toString();

const dimensions = (path) => {
  const output = sips('-g', 'pixelWidth', '-g', 'pixelHeight', path);
  return [/pixelWidth: (\d+)/, /pixelHeight: (\d+)/].map((pattern) => Number(output.match(pattern)[1]));
};

const cropTo3x2 = (source, target) => {
  const [width, height] = dimensions(source);
  const [cropWidth, cropHeight] =
    width / height > 1.5 ? [Math.round(height * 1.5), height] : [width, Math.round(width / 1.5)];
  sips('-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '--cropToHeightWidth', String(cropHeight), String(cropWidth), source, '--out', target);
  if (cropWidth > maxWidth) sips('--resampleWidth', String(maxWidth), target);
};

const photoPathFor = (key, previous) => {
  const base = `photos/licensed/${key.replaceAll('/', '-')}`;
  if (!previous) return `${base}.jpg`;
  const version = Number(previous.photo.match(/-v(\d+)\.jpg$/)?.[1] ?? 1) + 1;
  return `${base}-v${version}.jpg`;
};

const toEntry = async (request, previous, manifest, workDir) => {
  const { title, info } = await commonsInfo(request.file);
  const originalUrl = info.url.split('?')[0];
  const duplicate = manifest.find((other) => other.originalUrl === originalUrl);
  if (duplicate) throw new Error(`${title}: снимок уже используется для ${duplicate.key}`);
  const meta = info.extmetadata ?? {};
  const license = normalizeLicense(meta.LicenseShortName?.value ?? '');
  if (!license) throw new Error(`${title}: неподходящая лицензия «${meta.LicenseShortName?.value}»`);
  if (info.width <= info.height) throw new Error(`${title}: снимок не горизонтальный`);
  if (info.width < 1000) throw new Error(`${title}: ширина ${info.width} < 1000`);
  const author = stripHtml(meta.Artist?.value ?? '') || 'Wikimedia Commons';
  const photo = photoPathFor(request.key, previous);
  const raw = join(workDir, 'raw');
  await download(info.thumburl ?? info.url, raw);
  cropTo3x2(raw, new URL(photo, publicDir).pathname);
  return {
    key: request.key,
    photo,
    author: author.slice(0, 200),
    license,
    licenseUrl: licenseUrlOf(license),
    sourceUrl: info.descriptionurl.split('?')[0],
    originalUrl,
    width: info.width,
    height: info.height,
    illustrative: Boolean(request.illustrative),
    ...(request.illustrative ? { illustrationCaption: request.illustrationCaption } : {}),
    replaces: [...new Set([...(previous?.replaces ?? []), ...(previous ? [previous.photo] : []), ...(request.replaces ?? [])])],
  };
};

const [requestsPath] = process.argv.slice(2);
if (!requestsPath) {
  console.error('Использование: node scripts/add-commons-photos.mjs requests.json');
  process.exit(1);
}

const requests = JSON.parse(readFileSync(requestsPath, 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const workDir = mkdtempSync(join(tmpdir(), 'atlas-photos-'));
const failures = [];

for (const request of requests) {
  try {
    const index = manifest.findIndex((other) => other.key === request.key);
    const previous = manifest[index];
    const entry = await toEntry(request, previous, manifest, workDir);
    if (previous) {
      manifest[index] = entry;
      unlinkSync(new URL(previous.photo, publicDir));
    } else manifest.push(entry);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`ok   ${entry.key} ← ${entry.license}, ${entry.author}`);
  } catch (error) {
    failures.push(request.key);
    console.log(`fail ${request.key}: ${error.message}`);
  }
}

rmSync(workDir, { recursive: true, force: true });
console.log(`готово: ${requests.length - failures.length}/${requests.length}`);
if (failures.length) process.exitCode = 1;
