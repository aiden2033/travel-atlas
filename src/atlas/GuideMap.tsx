import '../lib/leaflet-setup';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { GuidePlace } from './model';

function Fit({ places }: { places: GuidePlace[] }) {
  const map = useMap();
  useEffect(() => {
    const points = places.flatMap((p) =>
      p.coords ? [[p.coords.lat, p.coords.lng] as [number, number]] : [],
    );
    if (points.length)
      map.fitBounds(L.latLngBounds(points), { padding: [35, 35], maxZoom: 14 });
  }, [map, places]);
  return null;
}

export default function GuideMap({
  places,
  open,
}: {
  places: GuidePlace[];
  open: (place: GuidePlace) => void;
}) {
  const points = places.filter((p) => p.coords);
  if (!points.length)
    return (
      <div className="empty-state">
        <h3>У этих мест пока нет координат</h3>
        <p>
          У каждого места есть ссылка на поиск в Google Maps. Координаты можно
          добавить в конструкторе.
        </p>
      </div>
    );
  return (
    <div className="guide-map">
      <MapContainer
        center={[points[0].coords!.lat, points[0].coords!.lng]}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Fit places={points} />
        {points.map((place) => (
          <Marker
            key={place.slug}
            title={place.nameRu}
            alt={place.nameRu}
            position={[place.coords!.lat, place.coords!.lng]}
          >
            <Popup>
              <strong>{place.nameRu}</strong>
              <p>{place.summary || place.description.slice(0, 160)}</p>
              <button className="text-link" onClick={() => open(place)}>
                Подробнее
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="map-note">
        Показано {points.length} из {places.length} мест. Остальным можно
        добавить координаты в конструкторе. Для загрузки карты нужен интернет.
      </p>
    </div>
  );
}
