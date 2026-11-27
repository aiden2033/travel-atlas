import '../lib/leaflet-setup';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import L from 'leaflet';
import { MarkerClusterGroup, type MarkerCluster } from 'leaflet.markercluster';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { createMapPlacePopup } from './mapPlacePopup';
import {
  createMapClusterBadge,
  getMapClusterLabel,
  getMapCountryColor,
} from './mapCountryColors';
import type { MapPoint } from './mapPlaces';

const GoogleAtlasMap = lazy(() => import('./GoogleAtlasMap'));
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
const googleMapId =
  import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() ||
  (import.meta.env.DEV ? 'DEMO_MAP_ID' : '');

const overviewOptions: L.FitBoundsOptions = {
  padding: [24, 24],
  maxZoom: 14,
  animate: false,
};

function createMarker(place: MapPoint) {
  const pin = document.createElement('span');
  pin.className = 'atlas-map-pin-shape';
  pin.style.setProperty(
    '--atlas-country-color',
    getMapCountryColor(place.countryId),
  );
  const marker = L.marker(place.coords, {
    icon: L.divIcon({
      className: 'atlas-map-pin',
      html: pin,
      iconSize: [30, 32],
      iconAnchor: [15, 32],
      popupAnchor: [0, -28],
    }),
    title: `${place.name} · ${place.countryName}`,
  });
  const location = `${place.cityName} · ${place.countryName}`;

  marker.on('add', () => {
    marker
      .getElement()
      ?.setAttribute('aria-label', `${place.name}, ${location}`);
  });

  marker.bindPopup(
    () => {
      const { content, link } = createMapPlacePopup(place);
      link.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        marker.closePopup();
        marker.getElement()?.focus({ preventScroll: true });
      });
      return content;
    },
    { minWidth: 150, maxWidth: 250 },
  );

  marker.on('keypress', (event: L.LeafletKeyboardEvent) => {
    if (event.originalEvent.key !== 'Enter') return;
    marker
      .getPopup()
      ?.getElement()
      ?.querySelector<HTMLElement>('.atlas-map-popup-link')
      ?.focus({ preventScroll: true });
  });

  return marker;
}

function ClusteredPlaces({
  points,
  bounds,
}: {
  points: MapPoint[];
  bounds: L.LatLngBounds;
}) {
  const map = useMap();

  useEffect(() => {
    const placesByMarker = new Map(
      points.map((place) => [createMarker(place), place] as const),
    );
    const clusterPlaces = (cluster: MarkerCluster) =>
      cluster.getAllChildMarkers().map((marker) => placesByMarker.get(marker)!);
    const group = new MarkerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      clusterLabel: (cluster) => getMapClusterLabel(clusterPlaces(cluster)),
      iconCreateFunction: (cluster) =>
        L.divIcon({
          className: 'atlas-map-cluster-marker',
          html: createMapClusterBadge(clusterPlaces(cluster)),
          iconSize: [44, 44],
        }),
    }) as MarkerClusterGroup & L.Layer;

    map.fitBounds(bounds, overviewOptions);
    group.addLayers([...placesByMarker.keys()]);
    group.addTo(map);

    return () => {
      group.remove();
    };
  }, [map, points, bounds]);

  return null;
}

function LeafletAtlasMap({ points }: { points: MapPoint[] }) {
  const bounds = useMemo(
    () => L.latLngBounds(points.map(({ coords }) => coords)),
    [points],
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={overviewOptions}
      maxZoom={19}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <ZoomControl zoomInTitle="Приблизить" zoomOutTitle="Отдалить" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ClusteredPlaces points={points} bounds={bounds} />
    </MapContainer>
  );
}

export default function AtlasMap({ points }: { points: MapPoint[] }) {
  const [googleUnavailable, setGoogleUnavailable] = useState(false);
  const onUnavailable = useCallback(() => setGoogleUnavailable(true), []);

  return (
    <section className="atlas-map-frame" aria-label="Карта мест">
      {googleApiKey && googleMapId && !googleUnavailable ? (
        <Suspense
          fallback={
            <div
              className="atlas-map-google atlas-map-google-loading"
              role="status"
            >
              Загружаем Google Maps…
            </div>
          }
        >
          <GoogleAtlasMap
            apiKey={googleApiKey}
            mapId={googleMapId}
            points={points}
            onUnavailable={onUnavailable}
          />
        </Suspense>
      ) : (
        <>
          {googleUnavailable && (
            <p className="atlas-map-google-fallback" role="status">
              Google Maps недоступна. Показана карта OpenStreetMap.
            </p>
          )}
          <LeafletAtlasMap points={points} />
        </>
      )}
    </section>
  );
}
