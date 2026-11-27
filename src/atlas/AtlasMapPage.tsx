import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AtlasMap from './AtlasMap';
import { getMapPlaces, type MapPoint } from './mapPlaces';
import { getMapCountryColor } from './mapCountryColors';
import { useCatalog } from './store';
import './AtlasMap.css';

export default function AtlasMapPage() {
  const { catalog } = useCatalog();
  const [hiddenCountryIds, setHiddenCountryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const places = useMemo(() => getMapPlaces(catalog), [catalog]);
  const countries = useMemo(() => {
    const names = new Map(
      catalog.countries.map(({ id, nameRu }) => [id, nameRu]),
    );
    for (const place of places) names.set(place.countryId, place.countryName);
    return names;
  }, [catalog, places]);
  const selectedCountryCount = Array.from(countries.keys()).filter(
    (id) => !hiddenCountryIds.has(id),
  ).length;
  const visiblePlaces = useMemo(
    () => places.filter((place) => !hiddenCountryIds.has(place.countryId)),
    [places, hiddenCountryIds],
  );
  const points = useMemo(
    () => visiblePlaces.filter((place): place is MapPoint => !!place.coords),
    [visiblePlaces],
  );
  const unlocated = visiblePlaces.filter((place) => !place.coords);
  const visibleCountries = new Map(
    points.map(({ countryId, countryName }) => [countryId, countryName]),
  );

  function toggleCountry(id: string) {
    setHiddenCountryIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="workspace-page atlas-map-page">
      <header className="page-heading atlas-map-heading">
        <div>
          <h1>Карта</h1>
          <p className="atlas-map-count" role="status">
            На карте {points.length} из {visiblePlaces.length} мест
          </p>
        </div>
      </header>
      <fieldset className="atlas-map-filter">
        <legend>Страны на карте</legend>
        <div className="atlas-map-filter-toolbar">
          <span>
            Выбрано {selectedCountryCount} из {countries.size}
          </span>
          <div className="atlas-map-filter-actions">
            <button
              type="button"
              disabled={selectedCountryCount === countries.size}
              onClick={() => setHiddenCountryIds(new Set())}
            >
              Выбрать все
            </button>
            <button
              type="button"
              disabled={selectedCountryCount === 0}
              onClick={() => setHiddenCountryIds(new Set(countries.keys()))}
            >
              Снять все
            </button>
          </div>
        </div>
        <div className="atlas-map-country-options">
          {Array.from(countries, ([id, name]) => (
            <label key={id} className="atlas-map-country-option">
              <input
                type="checkbox"
                checked={!hiddenCountryIds.has(id)}
                onChange={() => toggleCountry(id)}
              />
              <span
                className="atlas-map-country-swatch"
                style={{ background: getMapCountryColor(id) }}
                aria-hidden="true"
              />
              {name}
            </label>
          ))}
        </div>
      </fieldset>
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
            {selectedCountryCount === 0
              ? 'Выберите хотя бы одну страну, чтобы увидеть места на карте.'
              : visiblePlaces.length
                ? 'У этих мест пока нет координат.'
                : 'В выбранных странах пока нет мест.'}
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
