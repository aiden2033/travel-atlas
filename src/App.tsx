import { lazy, Suspense, useEffect } from 'react';
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
} from 'react-router-dom';
import {
  Compass,
  MapTrifold,
  Heart,
  CheckCircle,
  ArrowUpRight,
  Wallet,
} from '@phosphor-icons/react';
import { CatalogProvider, useCatalog } from './atlas/store';
import { guideUrl } from './atlas/model';
import Guide, { Collection, Notes, NotFound } from './atlas/Guide';
import Builder from './atlas/Builder';
import './atlas/atlas.css';
import MainNavigation from './atlas/MainNavigation';

const legacy = {
  passport: lazy(() => import('./pages/Passport')),
  bookings: lazy(() => import('./pages/Bookings')),
  preflight: lazy(() => import('./pages/Preflight')),
  trust: lazy(() => import('./pages/Trust')),
  emergency: lazy(() => import('./pages/Emergency')),
  'ic-cards': lazy(() => import('./pages/IcCards')),
  'shopping-deals': lazy(() => import('./pages/ShoppingDeals')),
  events: lazy(() => import('./pages/Events')),
  calendar: lazy(() => import('./pages/Calendar')),
  account: lazy(() => import('./pages/Account')),
};
const CityPage = lazy(() => import('./pages/CityPage'));
const PlaceDetail = lazy(() => import('./pages/PlaceDetail'));
const Purchases = lazy(() => import('./pages/Purchases'));
const AtlasMapAccess = lazy(() => import('./atlas/AtlasMapAccess'));

export default function App() {
  return (
    <CatalogProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </CatalogProvider>
  );
}

function Shell() {
  const { catalog, warning } = useCatalog();
  const { pathname } = useLocation();
  const isMap = Boolean(useMatch('/map'));
  const activeId = /^\/(?:guide|notes|builder)\/([^/]+)/.exec(pathname)?.[1];
  const activeCountry = catalog.countries.find((c) => c.id === activeId);
  const isLegacy =
    !isMap &&
    ![
      '/guide',
      '/notes',
      '/builder',
      '/favorites',
      '/visited',
      '/purchases',
    ].some((prefix) => pathname.startsWith(prefix)) &&
    pathname !== '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    const title = isMap
      ? 'Карта'
      : (activeCountry?.nameRu ??
        (pathname.startsWith('/builder') ? 'Конструктор' : 'Мой путеводитель'));
    document.title = `${title} · Атлас`;
  }, [pathname, activeCountry?.nameRu, isMap]);

  return (
    <div className="atlas-app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        К содержимому
      </a>
      <aside className="atlas-sidebar">
        <Link className="brand" to={guideUrl(catalog.countries[0])}>
          <Compass size={38} weight="fill" />
          <span>Атлас</span>
        </Link>
        <MainNavigation
          activeCountryId={activeId ?? (isLegacy ? 'japan' : undefined)}
        />
        <nav className="sidebar-bottom" aria-label="Мой Атлас">
          <Link
            className={pathname.startsWith('/builder') ? 'active' : ''}
            to={`/builder/${activeCountry?.id ?? catalog.countries[0].id}`}
          >
            <MapTrifold size={24} />
            Конструктор
          </Link>
          <Link
            className={pathname === '/favorites' ? 'active' : ''}
            to="/favorites"
          >
            <Heart size={24} />
            Избранное
          </Link>
          <Link
            className={pathname === '/visited' ? 'active' : ''}
            to="/visited"
          >
            <CheckCircle size={24} />
            Посещено
          </Link>
          <Link
            className={pathname === '/purchases' ? 'active' : ''}
            to="/purchases"
          >
            <Wallet size={24} />
            Покупки
          </Link>
          <span className="sidebar-caption">ВАША СЛЕДУЮЩАЯ ИСТОРИЯ</span>
        </nav>
      </aside>
      <main id="main-content" className="atlas-main" tabIndex={-1}>
        {warning && (
          <p className="notice error storage-warning" role="alert">
            {warning}
          </p>
        )}
        {isLegacy && (
          <div className="legacy-banner">
            <Link to="/notes/japan">
              Япония · материалы поездки 2026
              <ArrowUpRight size={15} />
            </Link>
            <span>Сохранено из исходного путеводителя</span>
          </div>
        )}
        <Suspense
          fallback={<div className="empty-state">Загружаем раздел…</div>}
        >
          <Routes>
            <Route
              path="/"
              element={<Navigate to={guideUrl(catalog.countries[0])} replace />}
            />
            <Route path="/guide/:country/:city?/:slug?" element={<Guide />} />
            <Route path="/map" element={<AtlasMapAccess />} />
            <Route path="/notes/:country" element={<Notes />} />
            <Route path="/builder/:country?" element={<Builder />} />
            <Route path="/favorites" element={<Collection kind="favorite" />} />
            <Route path="/visited" element={<Collection kind="visited" />} />
            <Route
              path="/purchases"
              element={
                <div className="legacy-page">
                  <Purchases />
                </div>
              }
            />
            {Object.entries(legacy).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <div className="legacy-page">
                    <Page />
                  </div>
                }
              />
            ))}
            <Route
              path="/:city"
              element={
                <div className="legacy-page">
                  <CityPage />
                </div>
              }
            />
            <Route
              path="/:city/:slug"
              element={
                <div className="legacy-page">
                  <PlaceDetail />
                </div>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
