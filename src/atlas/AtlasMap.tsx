import '../lib/leaflet-setup';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import type { MapPoint } from './mapPlaces';

const overviewOptions: L.FitBoundsOptions = {
  padding: [24, 24],
  maxZoom: 14,
  animate: false,
};

const placeIcon = L.divIcon({
  className: 'atlas-map-pin',
  iconSize: [30, 32],
  iconAnchor: [15, 32],
  popupAnchor: [0, -28],
});

function createMarker(place: MapPoint) {
  const marker = L.marker(place.coords, { icon: placeIcon, title: place.name });
  const location = `${place.cityName} · ${place.countryName}`;

  marker.on('add', () => {
    marker
      .getElement()
      ?.setAttribute('aria-label', `${place.name}, ${location}`);
  });

  marker.bindPopup(
    () => {
      const content = L.DomUtil.create('div', 'atlas-map-popup');
      L.DomUtil.create('strong', '', content).textContent = place.name;
      L.DomUtil.create('div', 'atlas-map-popup-location', content).textContent =
        location;
      const link = L.DomUtil.create('a', 'atlas-map-popup-link', content);
      link.href = `#${place.path}`;
      link.textContent =
        place.kind === 'stay' ? 'Открыть на карте поездки' : 'Открыть карточку';
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
    const group = new MarkerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      clusterLabel: (cluster) => `Группа мест (${cluster.getChildCount()})`,
      iconCreateFunction: (cluster) =>
        L.divIcon({
          className: 'atlas-map-cluster',
          html: String(cluster.getChildCount()),
          iconSize: [44, 44],
        }),
    }) as MarkerClusterGroup & L.Layer;

    map.fitBounds(bounds, overviewOptions);
    group.addLayers(points.map(createMarker));
    group.addTo(map);

    return () => {
      group.remove();
    };
  }, [map, points, bounds]);

  return null;
}

export default function AtlasMap({ points }: { points: MapPoint[] }) {
  const bounds = useMemo(
    () => L.latLngBounds(points.map(({ coords }) => coords)),
    [points],
  );

  return (
    <section className="atlas-map-frame" aria-label="Карта мест">
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
    </section>
  );
}
