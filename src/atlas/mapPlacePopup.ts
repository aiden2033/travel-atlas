import type { MapPoint } from './mapPlaces';

export function createMapPlacePopup(place: MapPoint) {
  const content = document.createElement('div');
  content.className = 'atlas-map-popup';
  const title = document.createElement('strong');
  title.textContent = place.name;
  const location = document.createElement('div');
  location.className = 'atlas-map-popup-location';
  location.textContent = `${place.cityName} · ${place.countryName}`;
  const link = document.createElement('a');
  link.className = 'atlas-map-popup-link';
  link.href = `#${place.path}`;
  link.textContent =
    place.kind === 'stay' ? 'Открыть на карте поездки' : 'Открыть карточку';
  content.append(title, location, link);
  return { content, link };
}
