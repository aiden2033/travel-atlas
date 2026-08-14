import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { CityId, Place, Tag } from '../data/types';
import { cities } from '../data/cities';
import { friendsMapPlaces } from '../data/friendsMapPlaces';
import { places } from '../data/places';
import { tripStays } from '../data/stays';
import { dayTripGroups } from '../data/trip';
import { animeRoutesByCity } from '../data/animeRoutes';
import { CITY_ACCENT } from '../lib/tags';
import { haversineKm } from '../lib/geo';
import { useGeolocation } from '../lib/useGeolocation';
import { placeKey, useVisited } from '../lib/useStoredSet';
import Collapsible from '../components/Collapsible';
import PlaceCard from '../components/PlaceCard';
import TagChip from '../components/TagChip';

const CityMap = lazy(() => import('../components/CityMap'));
const AnimeRoutes = lazy(() => import('../components/AnimeRoutes'));

const CITY_IDS: CityId[] = ['osaka', 'kyoto', 'tokyo', 'other'];

const isCityId = (value: string | undefined): value is CityId =>
  Boolean(value) && CITY_IDS.includes(value as CityId);

export default function CityPage() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [view, setView] = useState<'list' | 'map' | 'anime'>('list');
  const [sortByDistance, setSortByDistance] = useState(false);
  const [showFoodMapPlaces, setShowFoodMapPlaces] = useState(false);
  const [showFriendsMapPlaces, setShowFriendsMapPlaces] = useState(false);
  const [showNastyaMapPlaces, setShowNastyaMapPlaces] = useState(false);
  const visited = useVisited();
  const visitedItems = visited.items;
  const geo = useGeolocation();
  const position = geo.position;

  const cityMeta = useMemo(
    () => (isCityId(city) ? cities.find((c) => c.id === city) : undefined),
    [city],
  );

  const cityPlaces = useMemo(
    () => (isCityId(city) ? places.filter((p) => p.city === city) : []),
    [city],
  );

  const regularPlaces = useMemo(
    () => cityPlaces.filter((p) => !p.isDayTrip && matchesTags(p, activeTags)),
    [cityPlaces, activeTags],
  );

  const distanceFor = useCallback(
    (place: Place): number | undefined =>
      position && place.coords ? haversineKm(position, place.coords) : undefined,
    [position],
  );

  const activeSort = sortByDistance && Boolean(position);

  const mainPlaces = useMemo(
    () =>
      orderPlaces(
        regularPlaces.filter((p) => !p.foodSpot && !isNastyaRecommendation(p)),
        visitedItems,
        activeSort,
        distanceFor,
      ),
    [regularPlaces, visitedItems, activeSort, distanceFor],
  );

  const cafePlaces = useMemo(
    () =>
      orderPlaces(
        regularPlaces.filter((p) => p.foodSpot && !isNastyaRecommendation(p)),
        visitedItems,
        activeSort,
        distanceFor,
      ),
    [regularPlaces, visitedItems, activeSort, distanceFor],
  );

  const nastyaPlaces = useMemo(
    () =>
      orderPlaces(
        regularPlaces.filter(isNastyaRecommendation),
        visitedItems,
        activeSort,
        distanceFor,
      ),
    [regularPlaces, visitedItems, activeSort, distanceFor],
  );

  const dayTripPlaces = useMemo(
    () => cityPlaces.filter((p) => p.isDayTrip && matchesTags(p, activeTags)),
    [cityPlaces, activeTags],
  );

  const groupsForCity = useMemo(
    () => dayTripGroups.filter((group) => dayTripPlaces.some((p) => p.dayTripGroup === group.id)),
    [dayTripPlaces],
  );

  const mapCityPlaces = useMemo(
    () => [
      ...mainPlaces,
      ...(showFoodMapPlaces ? cafePlaces : []),
      ...(showNastyaMapPlaces ? nastyaPlaces : []),
    ],
    [cafePlaces, mainPlaces, nastyaPlaces, showFoodMapPlaces, showNastyaMapPlaces],
  );

  const cityFriendsMapPlaces = useMemo(
    () => (isCityId(city) ? friendsMapPlaces.filter((p) => p.city === city) : []),
    [city],
  );

  const cityStays = useMemo(
    () => (isCityId(city) ? tripStays.filter((stay) => stay.city === city) : []),
    [city],
  );

  const animeRoutes = useMemo(
    () => (isCityId(city) ? animeRoutesByCity[city] : []),
    [city],
  );

  useEffect(() => {
    if (cityMeta?.id === 'other') {
      setView('map');
      setShowFriendsMapPlaces(true);
    } else {
      setShowFriendsMapPlaces(false);
    }
    setShowFoodMapPlaces(false);
    setShowNastyaMapPlaces(false);
  }, [cityMeta?.id]);

  if (!cityMeta) {
    return <Navigate to="/" replace />;
  }

  const accent = CITY_ACCENT[cityMeta.id];
  const availableTags = uniqueTags(cityPlaces);

  const toggleTag = (tag: Tag) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const openPlace = (slug: string) => navigate(`/${cityMeta.id}/${slug}`);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-3 py-4">
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold"
            style={{ backgroundColor: accent.bg, color: accent.text }}
          >
            {cityMeta.nameRu}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {cityMeta.nameEn}
          </span>
        </div>
        <p className="text-sm text-slate-600">{cityMeta.intro}</p>
      </section>

      <Collapsible title="🏨 Где остановиться">
        <ul className="flex flex-col gap-1.5">
          {cityMeta.stay.map((area) => (
            <li key={area.area} className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{area.area}</span>
              {' — '}
              {area.why}
            </li>
          ))}
        </ul>
      </Collapsible>

      <Collapsible title="Советы по городу">
        <ul className="flex list-disc flex-col gap-2 pl-4">
          {cityMeta.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </Collapsible>

      {availableTags.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-800">Фильтр по тегам</h2>
            {activeTags.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTags([])}
                className="inline-flex min-h-[44px] items-center rounded-full px-2 text-xs font-semibold text-slate-500 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Сбросить ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                tag={tag}
                active={activeTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <section className="flex items-center gap-1 self-start rounded-full bg-slate-100 p-1">
          {(['list', 'map', ...(animeRoutes.length > 0 ? ['anime' as const] : [])] as const).map(
            (v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  view === v ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {v === 'list' ? '☰ Список' : v === 'map' ? '🗺 Карта' : '🎬 Аниме'}
              </button>
            ),
          )}
        </section>

        {view === 'list' && geo.supported && (
          <button
            type="button"
            disabled={geo.status === 'locating'}
            onClick={() => {
              if (!position) geo.request();
              setSortByDistance((prev) => !prev);
            }}
            aria-pressed={sortByDistance}
            className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60 ${
              activeSort
                ? 'bg-sky-600 text-white shadow'
                : 'bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            {geo.status === 'locating' ? '📍 Определяю…' : '📍 Рядом со мной'}
          </button>
        )}

        {view === 'map' && cafePlaces.length > 0 && (
          <label
            className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-rose-400 ${
              showFoodMapPlaces
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={showFoodMapPlaces}
              onChange={(event) => setShowFoodMapPlaces(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-400"
            />
            <span>Еда · {cafePlaces.length}</span>
          </label>
        )}

        {view === 'map' && nastyaPlaces.length > 0 && (
          <label
            className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-amber-400 ${
              showNastyaMapPlaces
                ? 'bg-amber-400 text-amber-950 shadow'
                : 'bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={showNastyaMapPlaces}
              onChange={(event) => setShowNastyaMapPlaces(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <span>От Насти · {nastyaPlaces.length}</span>
          </label>
        )}

        {view === 'map' && cityFriendsMapPlaces.length > 0 && (
          <label
            className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-emerald-400 ${
              showFriendsMapPlaces
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={showFriendsMapPlaces}
              onChange={(event) => setShowFriendsMapPlaces(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
            />
            <span>Google точки · {cityFriendsMapPlaces.length}</span>
          </label>
        )}
      </div>

      {view === 'anime' ? (
        <Suspense
          fallback={<div className="h-[60vh] animate-pulse rounded-2xl bg-slate-100" />}
        >
          <AnimeRoutes
            city={cityMeta.id}
            routes={animeRoutes}
            cityPlaces={cityPlaces}
            onOpen={openPlace}
          />
        </Suspense>
      ) : view === 'map' ? (
        <Suspense
          fallback={<div className="h-[60vh] animate-pulse rounded-2xl bg-slate-100" />}
        >
          <CityMap
            city={cityMeta.id}
            cityPlaces={mapCityPlaces}
            dayTripPlaces={dayTripPlaces}
            friendsPlaces={cityFriendsMapPlaces}
            showFriendsPlaces={showFriendsMapPlaces}
            stays={cityStays}
            onOpen={openPlace}
            userPosition={position}
          />
        </Suspense>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mainPlaces.map((place) => (
              <PlaceCard
                key={place.slug}
                place={place}
                places={places}
                onOpen={openPlace}
                distanceKm={activeSort ? distanceFor(place) : undefined}
              />
            ))}
          </section>

          {cafePlaces.length > 0 && (
            <Collapsible title={`🍴 Еда, кафе и бары · ${cafePlaces.length}`} defaultCollapsed>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cafePlaces.map((place) => (
                  <PlaceCard
                    key={place.slug}
                    place={place}
                    places={places}
                    onOpen={openPlace}
                    distanceKm={activeSort ? distanceFor(place) : undefined}
                  />
                ))}
              </div>
            </Collapsible>
          )}

          {nastyaPlaces.length > 0 && (
            <Collapsible title={`⭐ Рекомендации от Насти · ${nastyaPlaces.length}`} defaultCollapsed>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nastyaPlaces.map((place) => (
                  <PlaceCard
                    key={place.slug}
                    place={place}
                    places={places}
                    onOpen={openPlace}
                    distanceKm={activeSort ? distanceFor(place) : undefined}
                  />
                ))}
              </div>
            </Collapsible>
          )}

          {regularPlaces.length === 0 && dayTripPlaces.length === 0 && (
            <p className="text-sm text-slate-500">
              Ничего не найдено под выбранные теги. Сбрось фильтр.
            </p>
          )}

          {groupsForCity.map((group) => {
            const groupPlaces = orderPlaces(
              dayTripPlaces.filter((p) => p.dayTripGroup === group.id),
              visitedItems,
              activeSort,
              distanceFor,
            );
            if (groupPlaces.length === 0) return null;
            return (
              <section
                key={group.id}
                className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-3"
              >
                <h2 className="text-sm font-bold text-amber-800">🚆 {group.label}</h2>
                {group.note && (
                  <p className="mt-1 text-xs text-amber-700">{group.note}</p>
                )}
                <p className="mt-1 text-xs font-medium text-amber-700">
                  Выбери один на день — взаимоисключающие варианты.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {groupPlaces.map((place) => (
                    <PlaceCard
                      key={place.slug}
                      place={place}
                      places={places}
                      onOpen={openPlace}
                      distanceKm={activeSort ? distanceFor(place) : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

const isNastyaRecommendation = (place: Place): boolean => place.tags.includes('nastya-rec');

const matchesTags = (place: Place, activeTags: Tag[]): boolean =>
  activeTags.length === 0 || activeTags.every((tag) => place.tags.includes(tag));

const visitedLast = (list: Place[], visitedItems: Set<string>): Place[] => [
  ...list.filter((p) => !visitedItems.has(placeKey(p))),
  ...list.filter((p) => visitedItems.has(placeKey(p))),
];

const orderPlaces = (
  list: Place[],
  visitedItems: Set<string>,
  byDistance: boolean,
  distanceFor: (place: Place) => number | undefined,
): Place[] => {
  if (!byDistance) return visitedLast(list, visitedItems);
  const withDistance = [...list].sort(
    (a, b) => (distanceFor(a) ?? Infinity) - (distanceFor(b) ?? Infinity),
  );
  return visitedLast(withDistance, visitedItems);
};

const uniqueTags = (list: Place[]): Tag[] => {
  const set = new Set<Tag>();
  list.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return [...set];
};
