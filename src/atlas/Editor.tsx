import { useState, type FormEvent } from 'react';
import { Plus, Trash, FloppyDisk } from '@phosphor-icons/react';
import {
  countrySchema,
  citySchema,
  placeSchema,
  type Country,
  type GuideCity,
  type GuidePlace,
  type Section,
} from './model';
import { useCatalog } from './store';
import { Modal } from './ui';

export type EditorTarget =
  | { kind: 'country'; country?: Country }
  | { kind: 'city'; country: Country; city?: GuideCity }
  | { kind: 'place'; country: Country; city: GuideCity; place?: GuidePlace };

export function SectionFields({
  sections,
  setSections,
}: {
  sections: Section[];
  setSections: (value: Section[]) => void;
}) {
  return (
    <fieldset className="section-fields">
      <legend>Дополнительные разделы</legend>
      <p className="field-hint">
        Например: транспорт, жильё, бюджет или личные заметки.
      </p>
      {sections.map((section, index) => (
        <div className="section-edit" key={section.id}>
          <div className="field-row">
            <label>
              Заголовок
              <input
                required
                value={section.title}
                onChange={(e) =>
                  setSections(
                    sections.map((s, i) =>
                      i === index ? { ...s, title: e.target.value } : s,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              className="icon-button danger"
              aria-label={`Удалить раздел ${section.title}`}
              onClick={() =>
                setSections(sections.filter((_, i) => i !== index))
              }
            >
              <Trash size={19} />
            </button>
          </div>
          <label>
            Текст
            <textarea
              rows={4}
              value={section.body}
              onChange={(e) =>
                setSections(
                  sections.map((s, i) =>
                    i === index ? { ...s, body: e.target.value } : s,
                  ),
                )
              }
            />
          </label>
        </div>
      ))}
      <button
        className="text-link"
        type="button"
        onClick={() =>
          setSections([
            ...sections,
            { id: `section-${crypto.randomUUID()}`, title: '', body: '' },
          ])
        }
      >
        <Plus size={17} />
        Добавить раздел
      </button>
    </fieldset>
  );
}

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export default function Editor({
  target,
  close,
  saved,
}: {
  target: EditorTarget;
  close: () => void;
  saved?: (countryId: string) => void;
}) {
  const { catalog, update } = useCatalog();
  const entity =
    target.kind === 'country'
      ? target.country
      : target.kind === 'city'
        ? target.city
        : target.place;
  const [sections, setSections] = useState<Section[]>(entity?.sections ?? []);
  const [tags, setTags] = useState(
    target.kind === 'place' ? (target.place?.tags ?? []) : [],
  );
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [extraTags, setExtraTags] = useState<typeof catalog.tags>([]);
  const editing = Boolean(entity);
  const name = { country: 'страну', city: 'город или регион', place: 'место' }[
    target.kind
  ];
  const place = target.kind === 'place' ? target.place : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? '').trim();
    const number = (key: string) => Number(get(key));
    try {
      const countryId = target.country?.id ?? (get('id') || newId('country'));
      if (
        target.kind === 'place' &&
        Boolean(get('lat')) !== Boolean(get('lng'))
      )
        throw new Error('Укажите обе координаты или оставьте обе пустыми');
      const common = { nameRu: get('nameRu'), nameEn: get('nameEn'), sections };
      update((current) => {
        const next = structuredClone(current);
        next.tags.push(...extraTags);
        if (target.kind === 'country') {
          const country = countrySchema.parse({
            ...target.country,
            ...common,
            id: countryId,
            cover: get('cover'),
            heroBanner:
              target.country?.cover === get('cover')
                ? target.country?.heroBanner
                : undefined,
            intro: get('intro'),
            cities: target.country?.cities ?? [],
          });
          if (
            !target.country &&
            next.countries.some((c) => c.id === country.id)
          )
            throw new Error('Такой код страны уже существует');
          next.countries = target.country
            ? next.countries.map((c) => (c.id === countryId ? country : c))
            : [...next.countries, country];
          return next;
        }
        const country = next.countries.find((c) => c.id === countryId)!;
        if (target.kind === 'city') {
          const city = citySchema.parse({
            ...target.city,
            ...common,
            id: target.city?.id ?? (get('id') || newId('city')),
            intro: get('intro'),
            cover: get('cover'),
            nights: number('nights'),
            places: target.city?.places ?? [],
            stay: target.city?.stay ?? [],
            tips: get('tips').split('\n').filter(Boolean),
          });
          if (!target.city && country.cities.some((c) => c.id === city.id))
            throw new Error('Такой код города уже существует');
          country.cities = target.city
            ? country.cities.map((c) => (c.id === city.id ? city : c))
            : [...country.cities, city];
          return next;
        }
        const city = country.cities.find((c) => c.id === target.city.id)!;
        const place = placeSchema.parse({
          ...target.place,
          ...common,
          slug: target.place?.slug ?? (get('id') || newId('place')),
          city: city.id,
          description: get('description'),
          summary: get('summary'),
          tags,
          timeEstimateHours: [number('min'), number('max')],
          mapsQuery:
            get('mapsQuery') ||
            `${common.nameEn || common.nameRu}, ${city.nameEn}, ${country.nameEn}`,
          photo: get('cover'),
          photoCredit: get('photoCredit') || undefined,
          photoSourceUrl: get('photoSourceUrl') || undefined,
          photoLicense: get('photoLicense') || undefined,
          photoLicenseUrl: get('photoLicenseUrl') || undefined,
          photoIllustration: get('photoIllustration') || undefined,
          coords:
            get('lat') || get('lng')
              ? { lat: number('lat'), lng: number('lng') }
              : undefined,
          bestTime: get('bestTime'),
          transport: get('transport'),
          note: get('note'),
          isDayTrip: tags.includes('day-trip'),
          source: target.place?.source ?? 'Личная подборка',
        });
        if (!target.place && city.places.some((p) => p.slug === place.slug))
          throw new Error('Такой код места уже существует');
        city.places = target.place
          ? city.places.map((p) => (p.slug === place.slug ? place : p))
          : [...city.places, place];
        return next;
      });
      close();
      saved?.(countryId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не удалось сохранить');
    }
  };

  const addTag = () => {
    const label = newTag.trim();
    if (!label) return;
    const existing = [...catalog.tags, ...extraTags].find(
      (t) => t.label.toLocaleLowerCase() === label.toLocaleLowerCase(),
    );
    const id = existing?.id ?? newId('tag');
    if (!existing) setExtraTags([...extraTags, { id, label, tone: 'green' }]);
    setTags([...new Set([...tags, id])]);
    setNewTag('');
  };

  return (
    <Modal
      title={`${editing ? 'Редактировать' : 'Добавить'} ${name}`}
      close={close}
      wide
    >
      <form className="editor-form" onSubmit={submit}>
        {error && (
          <p role="alert" className="notice error">
            {error}
          </p>
        )}
        <div className="field-row">
          <label>
            Название
            <input
              name="nameRu"
              required
              maxLength={160}
              defaultValue={entity?.nameRu}
              autoFocus
            />
          </label>
          <label>
            Название на английском
            <input name="nameEn" defaultValue={entity?.nameEn} />
          </label>
        </div>
        {!editing && (
          <label>
            Код для ссылки
            <span className="field-hint">
              Латинские буквы и дефисы. Можно оставить пустым.
            </span>
            <input
              name="id"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder={
                target.kind === 'country'
                  ? 'vietnam'
                  : target.kind === 'city'
                    ? 'hanoi'
                    : 'old-quarter'
              }
            />
          </label>
        )}
        {target.kind === 'place' ? (
          <>
            <label>
              Описание
              <textarea
                name="description"
                rows={4}
                required
                defaultValue={place?.description}
              />
            </label>
            <label>
              Короткое описание для карточки
              <textarea name="summary" rows={2} defaultValue={place?.summary} />
            </label>
            <fieldset>
              <legend>Теги</legend>
              <div className="tag-choices">
                {[...catalog.tags, ...extraTags].map((tag) => (
                  <label
                    key={tag.id}
                    className={tags.includes(tag.id) ? 'chosen' : ''}
                  >
                    <input
                      type="checkbox"
                      checked={tags.includes(tag.id)}
                      onChange={() =>
                        setTags(
                          tags.includes(tag.id)
                            ? tags.filter((t) => t !== tag.id)
                            : [...tags, tag.id],
                        )
                      }
                    />
                    {tag.label}
                  </label>
                ))}
              </div>
              <div className="field-row new-tag">
                <input
                  aria-label="Новый тег"
                  placeholder="Свой тег"
                  maxLength={60}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button type="button" className="secondary" onClick={addTag}>
                  <Plus size={17} />
                  Добавить тег
                </button>
              </div>
            </fieldset>
            <div className="field-row">
              <label>
                Минимум часов
                <input
                  name="min"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.5"
                  required
                  defaultValue={place?.timeEstimateHours[0] ?? 1}
                />
              </label>
              <label>
                Максимум часов
                <input
                  name="max"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.5"
                  required
                  defaultValue={place?.timeEstimateHours[1] ?? 2}
                />
              </label>
            </div>
            <label>
              Когда идти
              <input
                name="bestTime"
                defaultValue={place?.bestTime}
                placeholder="Например, на закате"
              />
            </label>
            <label>
              Как добраться
              <textarea
                name="transport"
                rows={2}
                defaultValue={place?.transport}
              />
            </label>
            <label>
              Запрос для Google Maps
              <input name="mapsQuery" defaultValue={place?.mapsQuery} />
            </label>
            <div className="field-row">
              <label>
                Широта
                <input
                  name="lat"
                  type="number"
                  min="-90"
                  max="90"
                  step="any"
                  defaultValue={place?.coords?.lat}
                />
              </label>
              <label>
                Долгота
                <input
                  name="lng"
                  type="number"
                  min="-180"
                  max="180"
                  step="any"
                  defaultValue={place?.coords?.lng}
                />
              </label>
            </div>
            <label>
              Личная заметка
              <textarea name="note" rows={3} defaultValue={place?.note} />
            </label>
            <fieldset>
              <legend>Автор и лицензия фотографии</legend>
              <label>
                Автор и изменения снимка
                <input name="photoCredit" defaultValue={place?.photoCredit} />
              </label>
              <label>
                Страница источника
                <input
                  name="photoSourceUrl"
                  type="url"
                  defaultValue={place?.photoSourceUrl}
                />
              </label>
              <div className="field-row">
                <label>
                  Лицензия
                  <input
                    name="photoLicense"
                    defaultValue={place?.photoLicense}
                    placeholder="Например, CC BY-SA 4.0"
                  />
                </label>
                <label>
                  Ссылка на лицензию
                  <input
                    name="photoLicenseUrl"
                    type="url"
                    defaultValue={place?.photoLicenseUrl}
                  />
                </label>
              </div>
              <label>
                Подпись к иллюстрации
                <span className="field-hint">
                  Заполните, если фото показывает пример блюда или район вместо
                  самого места.
                </span>
                <input
                  name="photoIllustration"
                  defaultValue={place?.photoIllustration}
                />
              </label>
            </fieldset>
          </>
        ) : (
          <>
            <label>
              Описание
              <textarea
                name="intro"
                rows={4}
                required
                defaultValue={entity && 'intro' in entity ? entity.intro : ''}
              />
            </label>
            {target.kind === 'city' && (
              <>
                <label>
                  Ночей
                  <input
                    name="nights"
                    type="number"
                    min="0"
                    max="365"
                    defaultValue={target.city?.nights ?? 0}
                  />
                </label>
                <label>
                  Заметки по городу
                  <span className="field-hint">
                    Каждая заметка с новой строки.
                  </span>
                  <textarea
                    name="tips"
                    rows={4}
                    defaultValue={target.city?.tips.join('\n')}
                  />
                </label>
              </>
            )}
          </>
        )}
        <label>
          Фотография
          <span className="field-hint">
            Ссылка https:// или путь к фотографии в проекте. Без фото будет
            использована обложка страны.
          </span>
          <input
            name="cover"
            defaultValue={
              target.kind === 'place'
                ? place?.photo || place?.remotePhoto
                : entity && 'cover' in entity
                  ? entity.cover
                  : ''
            }
            placeholder="https://…"
          />
        </label>
        <SectionFields sections={sections} setSections={setSections} />
        <footer className="form-footer">
          <button type="button" className="secondary" onClick={close}>
            Отмена
          </button>
          <button className="primary" type="submit">
            <FloppyDisk size={19} />
            Сохранить
          </button>
        </footer>
      </form>
    </Modal>
  );
}
