import '../lib/leaflet-setup';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { FriendsMapPlace } from '../data/friendsMapPlaces';
import type { CityId, Place } from '../data/types';
import type { LatLng } from '../lib/geo';
import { haversineKm } from '../lib/geo';
import { formatHours, mapsUrl } from '../lib/tags';
import { CITY_CENTER, friendsPlaceIcon, placeIcon, userIcon } from '../lib/mapIcons';
import { googleMapsMultiDir, MAX_GOOGLE_MAPS_ROUTE_POINTS } from '../lib/nav';
import { placeKey, useVisited } from '../lib/useStoredSet';
import PlaceImage from './PlaceImage';
import PlaceToggles from './PlaceToggles';
import TagChip from './TagChip';

interface CityMapProps {
  city: CityId;
  cityPlaces: Place[];
  dayTripPlaces: Place[];
  activePlaceKey?: string;
  friendsPlaces?: FriendsMapPlace[];
  showFriendsPlaces?: boolean;
  onOpen: (slug: string) => void;
  userPosition?: LatLng | null;
}

const USER_BOUNDS_RADIUS_KM = 50;
const FRIENDS_DEDUPE_RADIUS_KM = 0.075;
const ACTIVE_PLACE_ZOOM = 16;
const FOOD_PIN_EMOJI = '🍜';
const FRIENDS_FOOD_PATTERN =
  /\b(?:arabica|coffee|cafe|shokupan|bakery|ramen|sushi|restaurant|izakaya|yakitori|yakiniku|soba|udon|tempura|tonkatsu|matcha|mochi|dessert|tea|hario)\b|коф|кафе|ресторан|булоч|слад|кекс|матча|еда/i;

interface AccessibleMarkerProps {
  children: ReactNode;
  icon: L.Icon | L.DivIcon;
  keyboard?: boolean;
  label: string;
  position: [number, number];
  zIndexOffset?: number;
}

function AccessibleMarker({
  children,
  icon,
  keyboard,
  label,
  position,
  zIndexOffset,
}: AccessibleMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const element = markerRef.current?.getElement();
    if (!element) return;

    element.setAttribute('aria-label', label);
    element.setAttribute('title', label);
    element.setAttribute('alt', label);
  });

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      keyboard={keyboard}
      title={label}
      alt={label}
      zIndexOffset={zIndexOffset}
    >
      {children}
    </Marker>
  );
}

function FriendsFitBounds({
  activePlaceKey,
  points,
  resetKey,
  userPoint,
}: {
  activePlaceKey?: string;
  points: Array<{ city?: CityId; id?: string; slug?: string; coords?: LatLng }>;
  resetKey: string;
  userPoint: LatLng | null;
}) {
  const map = useMap();
  const lastFitResetKey = useRef<string | null>(null);

  useEffect(() => {
    if (lastFitResetKey.current === resetKey) return;
    lastFitResetKey.current = resetKey;

    const coords: [number, number][] = points
      .filter((p) => p.coords)
      .map((p) => [p.coords!.lat, p.coords!.lng]);
    if (userPoint) coords.push([userPoint.lat, userPoint.lng]);
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView(coords[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(coords), { padding: [48, 48], maxZoom: 14 });
  }, [map, points, resetKey, userPoint]);

  useEffect(() => {
    if (!activePlaceKey) return;
    const activePoint = points.find(
      (p) =>
        p.city &&
        p.slug &&
        p.coords &&
        placeKey({ city: p.city, slug: p.slug }) === activePlaceKey,
    );
    if (activePoint?.coords) {
      map.setView([activePoint.coords.lat, activePoint.coords.lng], ACTIVE_PLACE_ZOOM);
    }
  }, [activePlaceKey, map, points]);

  return null;
}

function EnableMapGestures() {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.enable();
    map.touchZoom.enable();
  }, [map]);

  return null;
}

function MapPopupCard({ place, onOpen }: { place: Place; onOpen: (slug: string) => void }) {
  const mapsHref = mapsUrl(
    place.coords ? `${place.coords.lat},${place.coords.lng}` : place.mapsQuery,
  );

  return (
    <div className="w-52 text-left">
      <div className="overflow-hidden rounded-lg">
        <PlaceImage place={place} />
      </div>
      <h3 className="mt-2 text-sm font-bold text-slate-900">{place.nameRu}</h3>
      <p className="text-xs text-slate-500">{place.nameEn}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {place.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>
      <p className="mt-1 text-xs font-medium text-slate-600">
        ⏱ {formatHours(place.timeEstimateHours)}
      </p>
      <div className="mt-2">
        <PlaceToggles place={place} variant="detail" />
      </div>
      <button
        type="button"
        onClick={() => onOpen(place.slug)}
        className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-slate-800 px-3 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        Подробнее →
      </button>
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 text-xs font-semibold !text-sky-800 hover:bg-sky-100 hover:!text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        📍 Открыть в Google Maps
      </a>
    </div>
  );
}

function FriendsPopupCard({ place }: { place: FriendsMapPlace }) {
  const query = encodeURIComponent(`${place.coords.lat},${place.coords.lng}`);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="w-52 text-left">
      <div className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
        Google Maps список
      </div>
      <h3 className="mt-2 text-sm font-bold text-slate-900">{place.name}</h3>
      {place.note && <p className="mt-1 text-xs text-slate-600">{place.note}</p>}
      {place.isDayTrip && (
        <p className="mt-1 text-xs font-semibold text-amber-700">Выездная точка</p>
      )}
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-700 px-3 text-xs font-semibold !text-white hover:!text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        📍 Открыть в Google Maps
      </a>
    </div>
  );
}

function TilesPlaceholder() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[900] flex justify-center p-2">
      <span className="pointer-events-auto rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-600 shadow">
        🗺️ Карта недоступна офлайн — штырьки и список работают
      </span>
    </div>
  );
}

const markerLabel = (place: Place): string => {
  const label = `${place.nameRu} (${place.nameEn})`;
  return place.isDayTrip ? `${label}, выездной пункт` : label;
};

const foodEmojiForPlace = (place: Place): string | undefined =>
  place.foodSpot || place.tags.some((tag) => tag === 'food' || tag === 'cafe')
    ? FOOD_PIN_EMOJI
    : undefined;

const foodEmojiForFriendsPlace = (place: FriendsMapPlace): string | undefined => {
  const foodText = `${place.name} ${place.note ?? ''}`;
  return FRIENDS_FOOD_PATTERN.test(foodText) ? FOOD_PIN_EMOJI : undefined;
};

const isNastyaPlace = (place: Place): boolean => place.tags.includes('nastya-rec');

const routeLinkTitle = (totalPoints: number, routePoints: number): string => {
  if (totalPoints === 1) return 'Открыть единственную видимую точку в Google Maps';
  if (totalPoints > routePoints) {
    return `Открыть маршрут по первым ${routePoints} из ${totalPoints} видимых точек в Google Maps`;
  }
  return `Открыть маршрут по ${routePoints} видимым точкам в Google Maps`;
};

export default function CityMap({
  city,
  cityPlaces,
  dayTripPlaces,
  activePlaceKey,
  friendsPlaces = [],
  showFriendsPlaces = false,
  onOpen,
  userPosition,
}: CityMapProps) {
  const [tilesFailed, setTilesFailed] = useState(false);
  const visited = useVisited();

  const cityPts = useMemo(() => cityPlaces.filter((p) => p.coords), [cityPlaces]);
  const dayTripPts = useMemo(() => dayTripPlaces.filter((p) => p.coords), [dayTripPlaces]);
  const visiblePoints = useMemo(
    () => [...cityPts, ...dayTripPts],
    [cityPts, dayTripPts],
  );
  const friendsVisiblePoints = useMemo(() => {
    if (!showFriendsPlaces) return [];
    return friendsPlaces.filter(
      (friendPlace) =>
        !visiblePoints.some(
          (place) =>
            place.coords &&
            haversineKm(friendPlace.coords, place.coords) <= FRIENDS_DEDUPE_RADIUS_KM,
        ),
    );
  }, [friendsPlaces, showFriendsPlaces, visiblePoints]);
  const mapFitPoints = useMemo(
    () => [...visiblePoints, ...friendsVisiblePoints],
    [friendsVisiblePoints, visiblePoints],
  );
  const routeCoords = useMemo(
    () => [
      ...visiblePoints.map((point) => point.coords!),
      ...friendsVisiblePoints.map((point) => point.coords),
    ],
    [friendsVisiblePoints, visiblePoints],
  );
  const routePoints = useMemo(
    () => routeCoords.slice(0, MAX_GOOGLE_MAPS_ROUTE_POINTS),
    [routeCoords],
  );
  const routeHref = useMemo(
    () => googleMapsMultiDir(routePoints, 'walking'),
    [routePoints],
  );
  const routeLabel = routeLinkTitle(routeCoords.length, routePoints.length);

  const nearUser = useMemo(() => {
    if (!userPosition) return null;
    const [lat, lng] = CITY_CENTER[city];
    return haversineKm(userPosition, { lat, lng }) <= USER_BOUNDS_RADIUS_KM ? userPosition : null;
  }, [userPosition, city]);

  if (mapFitPoints.length === 0) {
    return (
      <div className="flex h-[60vh] min-h-[360px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500">
        Ни у одного места под выбранный фильтр нет точки на карте.
      </div>
    );
  }

  return (
    <div className="relative isolate z-0 h-[60vh] min-h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapContainer
        center={CITY_CENTER[city]}
        zoom={13}
        scrollWheelZoom
        touchZoom
        className="h-full w-full"
        style={{ background: '#e2e8f0' }}
      >
        <EnableMapGestures />
        <TileLayer
          attribution="&copy; Google Maps"
          url="https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en"
          subdomains="0123"
          eventHandlers={{
            tileerror: () => setTilesFailed(true),
            tileload: () => setTilesFailed(false),
          }}
        />
        <FriendsFitBounds
          activePlaceKey={activePlaceKey}
          points={mapFitPoints}
          resetKey={city}
          userPoint={nearUser}
        />
        {nearUser && (
          <AccessibleMarker
            position={[nearUser.lat, nearUser.lng]}
            icon={userIcon()}
            zIndexOffset={1000}
            label="Вы здесь"
            keyboard={false}
          >
            <Popup>
              <span className="text-xs font-semibold text-slate-700">📍 Вы здесь</span>
            </Popup>
          </AccessibleMarker>
        )}
        {visiblePoints.map((p) => {
          const isActive = placeKey(p) === activePlaceKey;
          return (
            <AccessibleMarker
              key={placeKey(p)}
              position={[p.coords!.lat, p.coords!.lng]}
              icon={placeIcon(city, Boolean(p.isDayTrip), {
                active: isActive,
                emoji: foodEmojiForPlace(p),
                isNastya: isNastyaPlace(p),
                visited: visited.has(p),
              })}
              label={isActive ? `${markerLabel(p)}, текущая точка` : markerLabel(p)}
              keyboard
              zIndexOffset={isActive ? 1500 : undefined}
            >
              <Popup minWidth={208} maxWidth={224}>
                <MapPopupCard place={p} onOpen={onOpen} />
              </Popup>
            </AccessibleMarker>
          );
        })}
        {friendsVisiblePoints.map((p) => (
          <AccessibleMarker
            key={p.id}
            position={[p.coords.lat, p.coords.lng]}
            icon={friendsPlaceIcon(foodEmojiForFriendsPlace(p))}
            label={`${p.name}, точка из Google Maps списка`}
            keyboard
          >
            <Popup minWidth={208} maxWidth={224}>
              <FriendsPopupCard place={p} />
            </Popup>
          </AccessibleMarker>
        ))}
      </MapContainer>

      {routeHref && (
        <a
          href={routeHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={routeLabel}
          title={routeLabel}
          className="absolute bottom-3 left-3 z-[900] inline-flex min-h-[44px] max-w-[calc(100%-1.5rem)] items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          Маршрут по точкам
        </a>
      )}

      {tilesFailed && <TilesPlaceholder />}
    </div>
  );
}
