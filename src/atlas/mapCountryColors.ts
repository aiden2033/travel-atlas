import type { MapPoint } from './mapPlaces';

const countryColors = new Map([
  ['malaysia', '#1d4ed8'],
  ['singapore', '#be185d'],
  ['indonesia', '#c2410c'],
  ['japan', '#7e22ce'],
  ['australia', '#047857'],
  ['thailand', '#a16207'],
  ['vietnam', '#b91c1c'],
  ['laos', '#0e7490'],
  ['cambodia', '#4d7c0f'],
]);

type ClusterPlace = Pick<MapPoint, 'countryId' | 'countryName'>;

export function getMapCountryColor(countryId: string) {
  const color = countryColors.get(countryId);
  if (color) return color;

  let hash = 0;
  for (const character of countryId) {
    hash = (Math.imul(hash, 31) + character.charCodeAt(0)) >>> 0;
  }
  return `hsl(${hash % 360} 65% 35%)`;
}

export function getMapClusterLabel(places: ClusterPlace[]) {
  const countries = [...new Set(places.map(({ countryName }) => countryName))];
  return `Группа мест (${places.length}): ${countries.join(', ')}`;
}

export function createMapClusterBadge(places: ClusterPlace[]) {
  const counts = new Map<string, number>();
  for (const { countryId } of places) {
    counts.set(countryId, (counts.get(countryId) ?? 0) + 1);
  }

  const countries = [...counts].sort(([a], [b]) => a.localeCompare(b));
  let offset = 0;
  const segments = countries.map(([countryId, count]) => {
    const start = offset;
    offset += (count / places.length) * 100;
    return `${getMapCountryColor(countryId)} ${start}% ${offset}%`;
  });

  const badge = document.createElement('div');
  badge.className = 'atlas-map-cluster';
  badge.setAttribute('aria-hidden', 'true');
  badge.style.background =
    countries.length > 1
      ? `conic-gradient(${segments.join(', ')})`
      : getMapCountryColor(countries[0]?.[0] ?? '');
  badge.classList.toggle('atlas-map-cluster-mixed', countries.length > 1);

  const count = document.createElement('span');
  count.className = 'atlas-map-cluster-count';
  count.textContent = String(places.length);
  badge.append(count);
  return badge;
}
