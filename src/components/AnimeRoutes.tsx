import { lazy, Suspense, useMemo, useState } from 'react';
import type { CityId, Place } from '../data/types';
import type { AnimeRoute } from '../data/animeRoutes';
import { mapsUrl } from '../lib/tags';
import { useSavedRoutes } from '../lib/sync/localState';

const CityMap = lazy(() => import('./CityMap'));

interface AnimeRoutesProps {
  city: CityId;
  routes: AnimeRoute[];
  cityPlaces: Place[];
  onOpen: (slug: string) => void;
}

export default function AnimeRoutes({ city, routes, cityPlaces, onOpen }: AnimeRoutesProps) {
  const savedRoutes = useSavedRoutes();
  const placeBySlug = useMemo(
    () => new Map(cityPlaces.map((p) => [p.slug, p])),
    [cityPlaces],
  );

  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Маршруты по местам аниме-съёмок: остановки со ссылкой ведут на карточку места, остальные —
        реальные под-локации рядом.
      </p>
      {routes.map((route) => (
        <AnimeRouteCard
          key={route.id}
          city={city}
          route={route}
          placeBySlug={placeBySlug}
          onOpen={onOpen}
          saved={savedRoutes.isSaved(route.id)}
          onToggleSaved={() =>
            savedRoutes.toggleRoute(route.id, city, route.routeName, route)
          }
        />
      ))}
    </section>
  );
}

function AnimeRouteCard({
  city,
  route,
  placeBySlug,
  onOpen,
  saved,
  onToggleSaved,
}: {
  city: CityId;
  route: AnimeRoute;
  placeBySlug: Map<string, Place>;
  onOpen: (slug: string) => void;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const [showMap, setShowMap] = useState(false);

  const routePlaces = useMemo(
    () =>
      route.stops
        .filter((s) => s.inDataset)
        .map((s) => placeBySlug.get(s.slug))
        .filter((p): p is Place => Boolean(p?.coords)),
    [route, placeBySlug],
  );

  return (
    <article className="rounded-2xl border-2 border-dashed border-fuchsia-300 bg-fuchsia-50/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-fuchsia-900">🎬 {route.routeName}</h3>
          <p className="mt-0.5 text-sm font-semibold text-fuchsia-700">{route.animeTitle}</p>
        </div>
        <button
          type="button"
          onClick={onToggleSaved}
          aria-pressed={saved}
          aria-label={saved ? 'Убрать маршрут из сохранённых' : 'Сохранить маршрут'}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
            saved
              ? 'border-fuchsia-500 bg-fuchsia-600 text-white shadow'
              : 'border-fuchsia-200 bg-white text-fuchsia-700 hover:bg-fuchsia-100'
          }`}
        >
          {saved ? '★' : '☆'}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-600">{route.description}</p>

      <ol className="mt-3 flex flex-col gap-2">
        {route.stops.map((stop, index) => {
          const place = stop.inDataset ? placeBySlug.get(stop.slug) : undefined;
          return (
            <li
              key={`${stop.slug}-${index}`}
              className="rounded-xl border border-fuchsia-200 bg-white/70 p-3"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {place ? (
                    <button
                      type="button"
                      onClick={() => onOpen(place.slug)}
                      className="text-left text-sm font-bold text-fuchsia-800 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
                    >
                      {stop.nameRu} →
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{stop.nameRu}</span>
                      <a
                        href={mapsUrl(`${stop.nameRu} ${city}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      >
                        🗺 Google Maps
                      </a>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-slate-600">{stop.why}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <dl className="mt-3 flex flex-col gap-1 text-xs text-slate-600">
        <div className="flex gap-1.5">
          <dt className="font-semibold text-slate-700">⏱ Время:</dt>
          <dd>{route.totalTimeHint}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="font-semibold text-slate-700">🧭 Логистика:</dt>
          <dd>{route.mapNote}</dd>
        </div>
      </dl>

      {routePlaces.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            aria-pressed={showMap}
            className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
              showMap
                ? 'bg-fuchsia-600 text-white shadow'
                : 'bg-white text-fuchsia-700 hover:bg-fuchsia-100'
            }`}
          >
            {showMap ? '🗺 Скрыть карту' : '🗺 Показать на карте'}
          </button>
          {showMap && (
            <div className="mt-3">
              <Suspense
                fallback={<div className="h-[60vh] animate-pulse rounded-2xl bg-slate-100" />}
              >
                <CityMap
                  city={city}
                  cityPlaces={routePlaces}
                  dayTripPlaces={[]}
                  onOpen={onOpen}
                />
              </Suspense>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
