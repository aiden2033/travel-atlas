import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  BOOKED_KEY,
  FAVORITES_KEY,
  VISITED_KEY,
  PREFLIGHT_KEY,
  readStoredKeys,
  replaceStoredKeys,
  useStoredKeySet,
} from '../lib/useStoredSet';
import {
  TRIP_EVENTS_KEY,
  SAVED_ROUTES_KEY,
  readPersonalTripEvents,
  readSavedRoutes,
  replacePersonalTripEvents,
  replaceSavedRoutes,
} from '../lib/sync/localState';
import { catalogSchema, parseBackup, type Catalog, type Backup } from './model';
import { seed } from './seed';
import { migrateCatalog } from './migrations';
import { withLicensedPhotos } from './photos';

export const CATALOG_KEY = 'atlas:catalog:v1';

const loadCatalog = () => {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    return {
      catalog: withLicensedPhotos(
        migrateCatalog(raw ? catalogSchema.parse(JSON.parse(raw)) : seed),
      ),
      warning: '',
    };
  } catch {
    return {
      catalog: seed,
      warning:
        'Не удалось прочитать сохранённый каталог. Исходные данные показаны временно. Перед изменениями сохраните резервную копию.',
    };
  }
};

type Store = {
  catalog: Catalog;
  warning: string;
  update: (updater: (catalog: Catalog) => Catalog) => void;
  restore: (raw: string) => void;
  exportData: () => Backup;
};

const CatalogContext = createContext<Store | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadCatalog);
  const save = (catalog: Catalog) => {
    let warning = '';
    try {
      localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
    } catch {
      warning =
        'Хранилище браузера недоступно или заполнено. Изменения доступны до закрытия страницы — экспортируйте резервную копию.';
    }
    setState({ catalog, warning });
  };

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CATALOG_KEY) setState(loadCatalog());
      if ([FAVORITES_KEY, VISITED_KEY, BOOKED_KEY].includes(event.key ?? '')) {
        replaceStoredKeys(event.key!, readStoredKeys(event.key!));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const exportData = (): Backup => ({
    format: 'travel-atlas',
    version: 1,
    exportedAt: new Date().toISOString(),
    catalog: state.catalog,
    favorites: [...readStoredKeys(FAVORITES_KEY)],
    visited: [...readStoredKeys(VISITED_KEY)],
    booked: [...readStoredKeys(BOOKED_KEY)],
    legacy: {
      [PREFLIGHT_KEY]: [...readStoredKeys(PREFLIGHT_KEY)],
      [TRIP_EVENTS_KEY]: readPersonalTripEvents(),
      [SAVED_ROUTES_KEY]: readSavedRoutes(),
    },
  });

  const restore = (raw: string) => {
    const backup = parseBackup(raw);
    save(withLicensedPhotos(migrateCatalog(backup.catalog)));
    replaceStoredKeys(FAVORITES_KEY, backup.favorites);
    replaceStoredKeys(VISITED_KEY, backup.visited);
    replaceStoredKeys(BOOKED_KEY, backup.booked);
    const legacy = backup.legacy;
    if (legacy && Array.isArray(legacy[PREFLIGHT_KEY]))
      replaceStoredKeys(
        PREFLIGHT_KEY,
        legacy[PREFLIGHT_KEY].filter((v): v is string => typeof v === 'string'),
      );
    if (legacy && Array.isArray(legacy[TRIP_EVENTS_KEY]))
      replacePersonalTripEvents(
        legacy[TRIP_EVENTS_KEY] as ReturnType<typeof readPersonalTripEvents>,
      );
    if (legacy && Array.isArray(legacy[SAVED_ROUTES_KEY]))
      replaceSavedRoutes(
        legacy[SAVED_ROUTES_KEY] as ReturnType<typeof readSavedRoutes>,
      );
  };

  return (
    <CatalogContext.Provider
      value={{
        ...state,
        update: (updater) => save(catalogSchema.parse(updater(state.catalog))),
        restore,
        exportData,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export const useCatalog = () => {
  const store = useContext(CatalogContext);
  if (!store) throw new Error('CatalogProvider is required');
  return store;
};

export const useFlags = () => ({
  favorites: useStoredKeySet(FAVORITES_KEY),
  visited: useStoredKeySet(VISITED_KEY),
  booked: useStoredKeySet(BOOKED_KEY),
});

export const downloadJson = (name: string, value: unknown) => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
