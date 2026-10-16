import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  DownloadSimple,
  UploadSimple,
  ArrowUpRight,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import Editor, { type EditorTarget } from './Editor';
import { useCatalog, downloadJson } from './store';
import {
  parseBackup,
  guideUrl,
  type Backup,
  type Catalog,
  type Country,
} from './model';
import { Modal } from './ui';

export default function Builder() {
  const { country: countryId } = useParams();
  const navigate = useNavigate();
  const { catalog, update, restore, exportData } = useCatalog();
  const country =
    catalog.countries.find((c) => c.id === countryId) ?? catalog.countries[0];
  const [cityId, setCityId] = useState('');
  const city = country.cities.find((c) => c.id === cityId) ?? country.cities[0];
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState<{
    label: string;
    remove: () => void;
  } | null>(null);
  const [backup, setBackup] = useState<{ value: Backup; raw: string } | null>(
    null,
  );
  const [undo, setUndo] = useState<Catalog | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');

  const editCountry = (updater: (country: Country) => Country) =>
    update((current) => ({
      ...current,
      countries: current.countries.map((c) =>
        c.id === country.id ? updater(c) : c,
      ),
    }));
  const remove = (label: string, mutation: () => void) =>
    setPending({
      label,
      remove: () => {
        setUndo(structuredClone(catalog));
        mutation();
        setPending(null);
        setMessage('Удалено. Можно отменить последнее удаление.');
      },
    });

  const reorder = (
    kind: 'countries' | 'cities' | 'places',
    index: number,
    delta: number,
  ) => {
    update((current) => {
      const next = structuredClone(current);
      const selected = next.countries.find((c) => c.id === country.id)!;
      const list =
        kind === 'countries'
          ? next.countries
          : kind === 'cities'
            ? selected.cities
            : selected.cities.find((c) => c.id === city?.id)!.places;
      const target = index + delta;
      if (target >= 0 && target < list.length)
        [list[index], list[target]] = [list[target], list[index]];
      return next;
    });
  };

  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('Файл больше 10 МБ');
      const raw = await file.text();
      setBackup({ value: parseBackup(raw), raw });
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Неверный файл');
    }
    if (input.current) input.current.value = '';
  };

  const orderActions = (
    kind: 'countries' | 'cities' | 'places',
    index: number,
    length: number,
    label: string,
  ) => (
    <>
      <button
        className="icon-button"
        disabled={index === 0}
        title="Выше"
        aria-label={`Выше: ${label}`}
        onClick={() => reorder(kind, index, -1)}
      >
        <ArrowUp size={17} />
      </button>
      <button
        className="icon-button"
        disabled={index === length - 1}
        title="Ниже"
        aria-label={`Ниже: ${label}`}
        onClick={() => reorder(kind, index, 1)}
      >
        <ArrowDown size={17} />
      </button>
    </>
  );

  return (
    <div className="workspace-page builder-page">
      <span className="eyebrow">ВАШ ПУТЕВОДИТЕЛЬ</span>
      <div className="page-heading">
        <div>
          <h1>Конструктор</h1>
          <p className="muted">Одна структура. Любая следующая страна.</p>
        </div>
        <button
          className="primary"
          onClick={() => setEditor({ kind: 'country' })}
        >
          <Plus size={20} />
          Добавить страну
        </button>
      </div>
      <div className="backup-bar">
        <span>Сохранение в этом браузере</span>
        <div>
          <button
            className="text-link"
            onClick={() => {
              downloadJson(
                `atlas-${new Date().toISOString().slice(0, 10)}.json`,
                exportData(),
              );
              setMessage('Резервная копия скачана');
            }}
          >
            <DownloadSimple size={18} />
            Экспорт
          </button>
          <button className="text-link" onClick={() => input.current?.click()}>
            <UploadSimple size={18} />
            Импорт
          </button>
          <input
            ref={input}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => void importFile(e.target.files?.[0])}
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="notice error">
          {error}
        </p>
      )}
      {message && (
        <div role="status" className="notice">
          {message}
          {undo && (
            <button
              className="text-link"
              onClick={() => {
                update(() => undo);
                setUndo(null);
                setMessage('Удаление отменено');
              }}
            >
              <ArrowCounterClockwise size={17} />
              Отменить
            </button>
          )}
        </div>
      )}
      <div className="builder-layout">
        <aside className="builder-countries">
          <h2>Страны</h2>
          {catalog.countries.map((item, index) => (
            <div
              className={`builder-country ${item.id === country.id ? 'selected' : ''}`}
              key={item.id}
            >
              <button
                className="entity-select"
                onClick={() => {
                  navigate(`/builder/${item.id}`);
                  setCityId('');
                  setSearch('');
                }}
              >
                {item.nameRu}
                <small>Городов и регионов: {item.cities.length}</small>
              </button>
              <div className="entity-actions">
                {orderActions(
                  'countries',
                  index,
                  catalog.countries.length,
                  item.nameRu,
                )}
              </div>
            </div>
          ))}
        </aside>
        <section className="builder-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">СТРАНА</span>
              <h2>{country.nameRu}</h2>
            </div>
            <div className="entity-actions">
              <button
                className="secondary"
                onClick={() => setEditor({ kind: 'country', country })}
              >
                <PencilSimple size={17} />
                Настроить
              </button>
              <button
                className="icon-button danger"
                disabled={catalog.countries.length === 1}
                aria-label="Удалить страну"
                onClick={() =>
                  remove(`${country.nameRu} и все её города и места`, () =>
                    update((current) => ({
                      ...current,
                      countries: current.countries.filter(
                        (c) => c.id !== country.id,
                      ),
                    })),
                  )
                }
              >
                <Trash size={19} />
              </button>
              <Link
                className="icon-button"
                aria-label="Открыть путеводитель"
                to={guideUrl(country)}
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
          <p className="prose country-preview">{country.intro}</p>
          <div className="section-heading">
            <h3>Города и регионы</h3>
            <button
              className="text-link"
              onClick={() => setEditor({ kind: 'city', country })}
            >
              <Plus size={18} />
              Добавить
            </button>
          </div>
          <div className="builder-city-list">
            {country.cities.map((item, index) => (
              <div
                className={`builder-city ${item.id === city?.id ? 'selected' : ''}`}
                key={item.id}
              >
                <button
                  className="entity-select"
                  onClick={() => {
                    setCityId(item.id);
                    setSearch('');
                  }}
                >
                  {item.nameRu}
                  <small>Мест: {item.places.length}</small>
                </button>
                <div className="entity-actions">
                  {orderActions(
                    'cities',
                    index,
                    country.cities.length,
                    item.nameRu,
                  )}
                  <button
                    className="icon-button"
                    aria-label={`Редактировать город: ${item.nameRu}`}
                    onClick={() =>
                      setEditor({ kind: 'city', country, city: item })
                    }
                  >
                    <PencilSimple size={18} />
                  </button>
                  <button
                    className="icon-button danger"
                    aria-label={`Удалить город: ${item.nameRu}`}
                    onClick={() =>
                      remove(`${item.nameRu} и все места в нём`, () =>
                        editCountry((c) => ({
                          ...c,
                          cities: c.cities.filter(
                            (city) => city.id !== item.id,
                          ),
                        })),
                      )
                    }
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {city ? (
            <>
              <div className="section-heading place-list-heading">
                <div>
                  <span className="eyebrow">МЕСТА</span>
                  <h3>{city.nameRu}</h3>
                </div>
                <button
                  className="primary"
                  onClick={() => setEditor({ kind: 'place', country, city })}
                >
                  <Plus size={19} />
                  Добавить место
                </button>
              </div>
              <input
                className="builder-search"
                aria-label="Поиск места в конструкторе"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Найти место в этом городе…"
              />
              <div className="builder-place-list">
                {city.places
                  .map((place, index) => ({ place, index }))
                  .filter(({ place }) =>
                    `${place.nameRu} ${place.nameEn}`
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                  )
                  .map(({ place, index }) => (
                    <div className="builder-place" key={place.slug}>
                      <div>
                        <strong>{place.nameRu}</strong>
                        <small>
                          {place.tags
                            .map(
                              (id) =>
                                catalog.tags.find((t) => t.id === id)?.label ??
                                id,
                            )
                            .join(' · ')}
                        </small>
                      </div>
                      <div className="entity-actions">
                        {orderActions(
                          'places',
                          index,
                          city.places.length,
                          place.nameRu,
                        )}
                        <button
                          className="icon-button"
                          aria-label={`Редактировать место: ${place.nameRu}`}
                          onClick={() =>
                            setEditor({ kind: 'place', country, city, place })
                          }
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          className="icon-button danger"
                          aria-label={`Удалить место: ${place.nameRu}`}
                          onClick={() =>
                            remove(place.nameRu, () =>
                              editCountry((c) => ({
                                ...c,
                                cities: c.cities.map((item) =>
                                  item.id === city.id
                                    ? {
                                        ...item,
                                        places: item.places.filter(
                                          (p) => p.slug !== place.slug,
                                        ),
                                      }
                                    : item,
                                ),
                              })),
                            )
                          }
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                {!city.places.length && (
                  <div className="empty-state">
                    <h3>Начните с первого места</h3>
                    <p>
                      Добавьте название, теги и описание. Остальное можно
                      заполнить позже.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>Добавьте первый город или регион</h3>
              <p>Затем в нём можно будет собирать места.</p>
            </div>
          )}
        </section>
      </div>
      {editor && (
        <Editor
          target={editor}
          close={() => setEditor(null)}
          saved={(id) => {
            navigate(`/builder/${id}`);
            setMessage('Изменения сохранены');
          }}
        />
      )}
      {pending && (
        <Modal title="Удалить раздел?" close={() => setPending(null)}>
          <div className="dialog-content">
            <p>
              Будет удалено: {pending.label}. Последнее удаление можно отменить
              до следующей перезагрузки страницы.
            </p>
            <div className="form-footer">
              <button className="secondary" onClick={() => setPending(null)}>
                Отмена
              </button>
              <button className="primary destructive" onClick={pending.remove}>
                Удалить
              </button>
            </div>
          </div>
        </Modal>
      )}
      {backup && (
        <Modal
          title="Восстановить резервную копию?"
          close={() => setBackup(null)}
        >
          <div className="dialog-content">
            <p>
              В файле: {backup.value.catalog.countries.length} стран,{' '}
              {backup.value.catalog.countries.flatMap((c) => c.cities).length}{' '}
              городов и регионов. Импорт заменит текущий каталог, избранное и
              отметки посещения.
            </p>
            <p className="muted">
              Сначала скачайте текущую копию, если хотите сохранить её.
            </p>
            <div className="form-footer">
              <button
                className="secondary"
                onClick={() =>
                  downloadJson('atlas-before-import.json', exportData())
                }
              >
                Скачать текущую
              </button>
              <button
                className="primary"
                onClick={() => {
                  restore(backup.raw);
                  setBackup(null);
                  setMessage('Резервная копия восстановлена');
                  navigate('/builder');
                }}
              >
                Восстановить
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
