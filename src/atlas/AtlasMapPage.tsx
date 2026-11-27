import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AtlasMap from './AtlasMap';
import { getMapPlaces, type MapPoint } from './mapPlaces';
import { getMapCountryColor } from './mapCountryColors';
import { useCatalog } from './store';
import './AtlasMap.css';

export default function AtlasMapPage() {
  const { catalog } = useCatalog();
  const [countryId, setCountryId] = useState('');
  const places = useMemo(() => getMapPlaces(catalog), [catalog]);
  const countries = useMemo(() => {
    const names = new Map(
      catalog.countries.map(({ id, nameRu }) => [id, nameRu]),
    );
    for (const place of places) names.set(place.countryId, place.countryName);
    return names;
  }, [catalog, places]);
  const selectedCountry = countries.has(countryId) ? countryId : '';
  const visiblePlaces = useMemo(
    () =>
      places.filter(
        (place) => !selectedCountry || place.countryId === selectedCountry,
      ),
    [places, selectedCountry],
  );
  const points = useMemo(
    () => visiblePlaces.filter((place): place is MapPoint => !!place.coords),
    [visiblePlaces],
  );
  const unlocated = visiblePlaces.filter((place) => !place.coords);
  const visibleCountries = new Map(
    points.map(({ countryId, countryName }) => [countryId, countryName]),
  );

  return (
    <div className="workspace-page atlas-map-page">
      <header className="page-heading atlas-map-heading">
        <div>
          <h1>Карта</h1>
          <p className="atlas-map-count" role="status">
            На карте {points.length} из {visiblePlaces.length} мест
          </p>
        </div>
        <div className="atlas-map-filter">
          <label htmlFor="atlas-map-country">Страна</label>
          <select
            id="atlas-map-country"
            value={selectedCountry}
            onChange={(event) => setCountryId(event.target.value)}
          >
            <option value="">Все страны</option>
            {Array.from(countries, ([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </header>
      {points.length > 0 ? (
        <>
          <AtlasMap points={points} />
          <div className="atlas-map-legend">
            <ul aria-label="Цвета стран на карте">
              {Array.from(visibleCountries, ([id, name]) => (
                <li key={id}>
                  <span
                    className="atlas-map-country-swatch"
                    style={{ background: getMapCountryColor(id) }}
                    aria-hidden="true"
                  />
                  {name}
                </li>
              ))}
            </ul>
            <p>
              Число в круге — места рядом.
              {visibleCountries.size > 1 &&
                ' Разноцветное кольцо — места из нескольких стран.'}
            </p>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>
            {visiblePlaces.length
              ? 'У этих мест пока нет координат.'
              : 'В этой стране пока нет мест.'}
          </p>
        </div>
      )}
      {unlocated.length > 0 && (
        <details className="atlas-map-unlocated">
          <summary>Места без координат ({unlocated.length})</summary>
          <ul role="list">
            {unlocated.map((place) => (
              <li key={place.path}>
                <Link to={place.path}>{place.name}</Link>
                <span>
                  {place.cityName} · {place.countryName}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
