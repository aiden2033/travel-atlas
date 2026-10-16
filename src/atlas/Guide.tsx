import { lazy, Suspense, useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  SquaresFour,
  ForkKnife,
  Mountains,
  Umbrella,
  Car,
  Plus,
  MagnifyingGlass,
  MapTrifold,
  List,
  Notebook,
  X,
  ArrowLeft,
  ArrowUpRight,
  Buildings,
} from '@phosphor-icons/react';
import {
  assetUrl,
  guideUrl,
  stateKey,
  type Country,
  type GuideCity,
  type GuidePlace,
} from './model';
import {
  useCatalog,
  useFlags,
  CATALOG_READ_ONLY,
  CATALOG_READ_ONLY_MESSAGE,
} from './store';
import { PlaceCard, PlaceDetails } from './ui';
import Editor, { type EditorTarget } from './Editor';

const GuideMap = lazy(() => import('./GuideMap'));
const primaryFilters = [
  { id: '', label: 'Все', Icon: SquaresFour },
  { id: 'food', label: 'Еда', Icon: ForkKnife },
  { id: 'nature', label: 'Природа', Icon: Mountains },
  { id: 'beach', label: 'Пляжи', Icon: Umbrella },
  { id: 'day-trip', label: 'Выезды', Icon: Car },
];

export default function Guide() {
  const { country: countryId, city: cityId, slug } = useParams();
  const { catalog } = useCatalog();
  const country = catalog.countries.find((c) => c.id === countryId);
  if (!country) return <NotFound />;
  return (
    <CountryGuide
      key={`${country.id}/${cityId}`}
      country={country}
      cityId={cityId}
      slug={slug}
    />
  );
}

function CountryGuide({
  country,
  cityId,
  slug,
}: {
  country: Country;
  cityId?: string;
  slug?: string;
}) {
  const { catalog } = useCatalog();
  const { favorites, visited } = useFlags();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const [showSearch, setShowSearch] = useState(Boolean(params.get('q')));
  const city = country.cities.find((c) => c.id === cityId);
  const heroPhoto = country.heroBanner || country.cover || country.cities[0]?.cover;
  const all = !cityId || cityId === 'all';
  const query = params.get('q') ?? '';
  const tag = params.get('tag') ?? '';
  const status = params.get('status') ?? '';
  const map = params.get('view') === 'map';
  const pairs = useMemo(
    () =>
      country.cities
        .filter((c) => all || c.id === cityId)
        .flatMap((city) => city.places.map((place) => ({ city, place }))),
    [country, cityId, all],
  );
  const index = useMemo(
    () =>
      new Fuse(
        pairs.map((pair) => ({
          ...pair,
          tagLabels: pair.place.tags
            .map((id) => catalog.tags.find((t) => t.id === id)?.label)
            .join(' '),
        })),
        {
          keys: [
            'place.nameRu',
            'place.nameEn',
            'place.description',
            'place.nameJa',
            'tagLabels',
          ],
          threshold: 0.35,
          ignoreLocation: true,
        },
      ),
    [pairs, catalog.tags],
  );
  const visible = (
    query.trim() ? index.search(query.trim()).map((r) => r.item) : pairs
  ).filter(
    ({ city, place }) =>
      (!tag || place.tags.includes(tag)) &&
      (!status ||
        (status === 'favorite' ? favorites : visited).hasKey(
          stateKey(country.id, city.id, place.slug),
        )),
  );
  const updateParam = (key: string, value: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  const close = () =>
    navigate(
      `/guide/${country.id}/${cityId || 'all'}${params.size ? `?${params}` : ''}`,
    );
  const selected = pairs.find((p) => p.place.slug === slug);
  const open = (city: GuideCity, place: GuidePlace) =>
    navigate(
      `/guide/${country.id}/${city.id}/${place.slug}${params.size ? `?${params}` : ''}`,
    );
  const availableTags = new Set(pairs.flatMap((p) => p.place.tags));
  const extraTags = catalog.tags.filter(
    (t) =>
      availableTags.has(t.id) && !primaryFilters.some((f) => f.id === t.id),
  );

  if (!all && !city) return <NotFound />;
  return (
    <div className="country-page">
      <section
        className={`country-hero ${heroPhoto ? 'has-banner' : 'no-photo'}`}
      >
        <div className="hero-copy">
          <span className="eyebrow">ЛИЧНЫЙ ПУТЕВОДИТЕЛЬ</span>
          <h1 className={country.nameRu.length > 12 ? 'long-name' : ''}>
            {country.nameRu}
          </h1>
          <p>{country.intro}</p>
          <Link className="hero-notes text-link" to={`/notes/${country.id}`}>
            <Notebook size={18} />
            Маршрут и заметки
            <ArrowUpRight size={15} />
          </Link>
        </div>
        {heroPhoto && (
          <img
            className={`hero-photo ${country.heroBanner ? 'preblended' : ''}`}
            src={assetUrl(heroPhoto)}
            alt={`Пейзаж: ${country.nameRu}`}
          />
        )}
      </section>
      <div className="guide-content">
        <nav className="city-tabs" aria-label="Города и регионы">
          {country.cities.map((item) => (
            <Link
              key={item.id}
              to={guideUrl(country, item)}
              className={city?.id === item.id ? 'active' : ''}
              aria-current={city?.id === item.id ? 'page' : undefined}
            >
              <Buildings size={20} />
              {item.nameRu}
            </Link>
          ))}
          {country.cities.length > 1 && (
            <Link
              className={all ? 'active' : ''}
              to={`/guide/${country.id}/all`}
            >
              Вся страна
            </Link>
          )}
          {!CATALOG_READ_ONLY && !country.cities.length && (
            <Link to={`/builder/${country.id}`}>
              <Plus size={18} />
              Добавить город
            </Link>
          )}
        </nav>
        <div className="places-toolbar">
          <div className="category-tabs" aria-label="Категории мест">
            {primaryFilters
              .filter((filter) => !filter.id || availableTags.has(filter.id))
              .map(({ id, label, Icon }) => (
                <button
                  key={id}
                  aria-pressed={tag === id}
                  className={tag === id ? 'active' : ''}
                  onClick={() => updateParam('tag', id)}
                >
                  <Icon size={21} />
                  {label}
                </button>
              ))}
            {extraTags.length > 0 && (
              <select
                aria-label="Другие категории"
                value={extraTags.some((t) => t.id === tag) ? tag : ''}
                onChange={(e) => updateParam('tag', e.target.value)}
              >
                <option value="">Ещё</option>
                {extraTags.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="toolbar-actions">
            <button
              className="icon-button"
              aria-label="Открыть поиск"
              aria-pressed={showSearch}
              onClick={() => setShowSearch(!showSearch)}
            >
              <MagnifyingGlass size={23} />
            </button>
            <button
              className="primary"
              disabled={CATALOG_READ_ONLY}
              title={CATALOG_READ_ONLY ? CATALOG_READ_ONLY_MESSAGE : undefined}
              aria-label={
                country.cities.length ? 'Добавить место' : 'Добавить город'
              }
              onClick={() =>
                setEditor(
                  city || country.cities[0]
                    ? {
                        kind: 'place',
                        country,
                        city: city ?? country.cities[0],
                      }
                    : { kind: 'city', country },
                )
              }
            >
              <Plus size={22} />
              <span>
                {country.cities.length ? 'Добавить место' : 'Добавить город'}
              </span>
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="search-row">
            <MagnifyingGlass size={20} />
            <input
              autoFocus
              aria-label="Поиск мест"
              placeholder={`Поиск ${city ? `в ${city.nameRu}` : 'по стране'} — на русском или английском`}
              value={query}
              onChange={(e) => updateParam('q', e.target.value)}
            />
            <button
              className="icon-button"
              aria-label="Очистить и закрыть поиск"
              onClick={() => {
                updateParam('q', '');
                setShowSearch(false);
              }}
            >
              <X size={19} />
            </button>
          </div>
        )}
        <div className="results-bar">
          <span aria-live="polite">
            Мест: {visible.length}
            {city ? ` · ${city.nameRu}` : ' · вся страна'}
          </span>
          <div>
            <select
              aria-label="Фильтр по отметкам"
              value={status}
              onChange={(e) => updateParam('status', e.target.value)}
            >
              <option value="">Все места</option>
              <option value="favorite">Избранное</option>
              <option value="visited">Посещено</option>
            </select>
            <div className="view-switch">
              <button
                className={!map ? 'active' : ''}
                aria-label="Карточки"
                aria-pressed={!map}
                onClick={() => updateParam('view', '')}
              >
                <List size={18} />
              </button>
              <button
                className={map ? 'active' : ''}
                aria-label="Карта"
                aria-pressed={map}
                onClick={() => updateParam('view', 'map')}
              >
                <MapTrifold size={18} />
              </button>
            </div>
          </div>
        </div>
        {!visible.length ? (
          <div className="empty-state">
            <MagnifyingGlass size={34} />
            <h2>
              {pairs.length
                ? 'Ничего не нашлось'
                : 'Здесь начинается новая поездка'}
            </h2>
            <p>
              {pairs.length
                ? 'Попробуйте другой запрос или сбросьте фильтры.'
                : CATALOG_READ_ONLY
                  ? CATALOG_READ_ONLY_MESSAGE
                  : 'Добавьте первое место в конструкторе.'}
            </p>
            {pairs.length > 0 && (
              <button className="secondary" onClick={() => setParams({})}>
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : map ? (
          <Suspense fallback={<p>Загружаем карту…</p>}>
            <GuideMap
              places={visible.map((p) => p.place)}
              open={(place) => {
                const pair = visible.find((p) => p.place === place)!;
                open(pair.city, place);
              }}
            />
          </Suspense>
        ) : (
          <div className="places-grid">
            {visible.map(({ city, place }) => (
              <PlaceCard
                key={`${city.id}/${place.slug}`}
                country={country}
                city={city}
                place={place}
                open={() => open(city, place)}
              />
            ))}
          </div>
        )}
        <footer className="guide-footer">
          <span>Атлас · места, к которым хочется вернуться</span>
          <Link to={`/builder/${country.id}`}>
            {CATALOG_READ_ONLY ? 'Просмотреть каталог' : 'Настроить страну'}
            <ArrowUpRight size={15} />
          </Link>
        </footer>
      </div>
      {slug && !selected && (
        <div className="notice error">
          Место не найдено.{' '}
          <button onClick={close}>Вернуться к каталогу</button>
        </div>
      )}
      {selected && !editor && (
        <PlaceDetails
          country={country}
          city={selected.city}
          place={selected.place}
          close={close}
          edit={() =>
            setEditor({
              kind: 'place',
              country,
              city: selected.city,
              place: selected.place,
            })
          }
        />
      )}
      {!CATALOG_READ_ONLY && editor && (
        <Editor target={editor} close={() => setEditor(null)} />
      )}
    </div>
  );
}

export function Notes() {
  const { country: countryId } = useParams();
  const { catalog } = useCatalog();
  const country = catalog.countries.find((c) => c.id === countryId);
  if (!country) return <NotFound />;
  const tools = [
    ['bookings', 'Брони и билеты'],
    ['calendar', 'Календарь поездки'],
    ['passport', 'Книжка странника'],
    ['preflight', 'Подготовка'],
    ['emergency', 'Экстренная помощь'],
    ['ic-cards', 'Транспортные карты'],
    ['events', 'События'],
    ['shopping-deals', 'Покупки'],
    ['trust', 'Источники'],
  ];
  return (
    <div className="workspace-page notes-page">
      <Link className="text-link" to={guideUrl(country)}>
        <ArrowLeft size={17} />К местам
      </Link>
      <span className="eyebrow">{country.nameEn.toLocaleUpperCase()}</span>
      <div className="page-heading">
        <div>
          <h1>Маршрут и заметки</h1>
          <p className="muted">{country.nameRu} · идеи и детали поездки</p>
        </div>
        <Link className="secondary" to={`/builder/${country.id}`}>
          {CATALOG_READ_ONLY ? 'Просмотреть каталог' : 'Редактировать'}
        </Link>
      </div>
      {country.id === 'japan' && (
        <section className="japan-tools">
          <h2>Из японского путеводителя</h2>
          <p className="muted">
            Материалы исходной поездки августа — сентября 2026. Даты, цены и
            правила сохранены как исторические заметки.
          </p>
          <div>
            {tools.map(([path, label]) => (
              <Link className="secondary" key={path} to={`/${path}`}>
                {label}
                <ArrowUpRight size={15} />
              </Link>
            ))}
            <Link className="secondary" to="/osaka">
              Подробные городские маршруты
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      )}
      <div className="notes-sections">
        {country.sections.map((section) => (
          <details
            key={section.id}
            open={section.id === 'route' || section.id === 'trip'}
          >
            <summary>{section.title}</summary>
            <p className="prose">{section.body}</p>
          </details>
        ))}
      </div>
      {country.cities.map((city) => (
        <section className="city-notes" key={city.id}>
          <h2>{city.nameRu}</h2>
          <p>{city.intro}</p>
          {city.nights > 0 && (
            <p className="muted">Ночей в исходном плане: {city.nights}</p>
          )}
          {city.stay.length > 0 && (
            <details>
              <summary>Где остановиться · исходные заметки</summary>
              {city.stay.map((stay, index) => (
                <p key={index}>
                  <strong>{stay.area}</strong> — {stay.why}
                </p>
              ))}
            </details>
          )}
          {city.tips.length > 0 && (
            <details>
              <summary>Городские заметки исходной поездки</summary>
              {city.tips.map((tip, index) => (
                <p key={index}>{tip}</p>
              ))}
            </details>
          )}
          {city.sections.map((section) => (
            <details key={section.id}>
              <summary>{section.title}</summary>
              <p className="prose">{section.body}</p>
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}

export function Collection({ kind }: { kind: 'favorite' | 'visited' }) {
  const { catalog } = useCatalog();
  const flags = useFlags();
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<{
    country: Country;
    city: GuideCity;
    place: GuidePlace;
  } | null>(null);
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const set = kind === 'favorite' ? flags.favorites : flags.visited;
  const selectedCountry = catalog.countries.find(
    (c) => c.id === selected?.country.id,
  );
  const selectedCity = selectedCountry?.cities.find(
    (c) => c.id === selected?.city.id,
  );
  const selectedPlace = selectedCity?.places.find(
    (p) => p.slug === selected?.place.slug,
  );
  const currentSelection =
    selectedCountry && selectedCity && selectedPlace
      ? { country: selectedCountry, city: selectedCity, place: selectedPlace }
      : null;
  const pairs = catalog.countries
    .filter((c) => !filter || c.id === filter)
    .flatMap((country) =>
      country.cities.flatMap((city) =>
        city.places
          .filter((place) =>
            set.hasKey(stateKey(country.id, city.id, place.slug)),
          )
          .map((place) => ({ country, city, place })),
      ),
    );
  return (
    <div className="workspace-page">
      <span className="eyebrow">МОЙ АТЛАС</span>
      <div className="page-heading">
        <div>
          <h1>{kind === 'favorite' ? 'Избранное' : 'Посещённые места'}</h1>
          <p className="muted">Ваши места во всех странах · {pairs.length}</p>
        </div>
        <select
          aria-label="Страна коллекции"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Все страны</option>
          {catalog.countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameRu}
            </option>
          ))}
        </select>
      </div>
      {pairs.length ? (
        <div className="places-grid">
          {pairs.map((pair) => (
            <PlaceCard
              key={stateKey(pair.country.id, pair.city.id, pair.place.slug)}
              {...pair}
              open={() => setSelected(pair)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Ваша коллекция впереди</h2>
          <p>
            {kind === 'favorite'
              ? 'Нажмите на сердечко у понравившегося места.'
              : 'Отмечайте места, в которых уже побывали.'}
          </p>
          <Link className="primary" to={guideUrl(catalog.countries[0])}>
            Открыть путеводитель
          </Link>
        </div>
      )}
      {currentSelection && !editor && (
        <PlaceDetails
          {...currentSelection}
          close={() => setSelected(null)}
          edit={() => setEditor({ kind: 'place', ...currentSelection })}
        />
      )}
      {!CATALOG_READ_ONLY && editor && (
        <Editor target={editor} close={() => setEditor(null)} />
      )}
    </div>
  );
}

export function NotFound() {
  const { catalog } = useCatalog();
  return (
    <div className="empty-state not-found">
      <h1>Такой страницы пока нет</h1>
      <p>Возможно, страна или город были переименованы или удалены.</p>
      <Link className="primary" to={guideUrl(catalog.countries[0])}>
        К путеводителю
      </Link>
    </div>
  );
}
