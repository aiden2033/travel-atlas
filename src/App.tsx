import { lazy, Suspense, useEffect } from 'react';
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  Compass,
  GlobeHemisphereEast,
  MapTrifold,
  Heart,
  CheckCircle,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { CatalogProvider, useCatalog } from './atlas/store';
import { assetUrl, guideUrl } from './atlas/model';
import Guide, { Collection, Notes, NotFound } from './atlas/Guide';
import Builder from './atlas/Builder';
import './atlas/atlas.css';

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
  const activeId = /^\/(?:guide|notes|builder)\/([^/]+)/.exec(pathname)?.[1];
  const activeCountry = catalog.countries.find((c) => c.id === activeId);
  const isLegacy =
    !['/guide', '/notes', '/builder', '/favorites', '/visited'].some((prefix) =>
      pathname.startsWith(prefix),
    ) && pathname !== '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${activeCountry?.nameRu ?? (pathname.startsWith('/builder') ? 'Конструктор' : 'Мой путеводитель')} · Атлас`;
  }, [pathname, activeCountry?.nameRu]);

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
        <nav className="country-nav" aria-label="Страны">
          {catalog.countries.map((country) => (
            <Link
              key={country.id}
              to={guideUrl(country)}
              className={
                country.id === activeId || (country.id === 'japan' && isLegacy)
                  ? 'active'
                  : ''
              }
              aria-current={country.id === activeId ? 'page' : undefined}
            >
              {country.cover || country.cities[0]?.cover ? (
                <img
                  src={assetUrl(country.cover || country.cities[0]?.cover)}
                  alt=""
                />
              ) : (
                <GlobeHemisphereEast size={36} />
              )}
              <span>{country.nameRu}</span>
            </Link>
          ))}
        </nav>
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
            <Route path="/notes/:country" element={<Notes />} />
            <Route path="/builder/:country?" element={<Builder />} />
            <Route path="/favorites" element={<Collection kind="favorite" />} />
            <Route path="/visited" element={<Collection kind="visited" />} />
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
