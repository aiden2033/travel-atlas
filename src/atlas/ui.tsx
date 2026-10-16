import { useEffect, useId, useRef, type ReactNode } from 'react';
import {
  X,
  MapPin,
  Heart,
  Check,
  Clock,
  ArrowUpRight,
  PencilSimple,
} from '@phosphor-icons/react';
import {
  assetUrl,
  placePhoto,
  stateKey,
  type Country,
  type GuideCity,
  type GuidePlace,
} from './model';
import { useCatalog, useFlags } from './store';

export function Photo({
  src,
  fallback,
  alt,
  className = '',
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        const image = event.currentTarget;
        if (fallback && image.src !== new URL(fallback, location.href).href) {
          image.src = fallback;
          image.alt = 'Обложка региона';
        }
      }}
    />
  );
}

export function Modal({
  title,
  children,
  close,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`atlas-dialog ${wide ? 'wide' : ''}`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-button" aria-label="Закрыть" onClick={close}>
            <X size={23} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

export function Tags({ tags }: { tags: string[] }) {
  const { catalog } = useCatalog();
  return (
    <div className="place-tags">
      {tags.map((id) => {
        const tag = catalog.tags.find((t) => t.id === id);
        return (
          <span className={`tag ${tag?.tone ?? 'green'}`} key={id}>
            {tag?.label ?? id}
          </span>
        );
      })}
    </div>
  );
}

export function PlaceCard({
  country,
  city,
  place,
  open,
}: {
  country: Country;
  city: GuideCity;
  place: GuidePlace;
  open: () => void;
}) {
  const { favorites, visited } = useFlags();
  const key = stateKey(country.id, city.id, place.slug);
  return (
    <article
      className={`place-card ${visited.hasKey(key) ? 'is-visited' : ''}`}
    >
      <div
        className={`card-photo ${!placePhoto(place, city.cover || country.cover) ? 'without-photo' : ''}`}
      >
        <button
          className="photo-open"
          onClick={open}
          aria-label={`Подробнее: ${place.nameRu}`}
        >
          <Photo
            src={placePhoto(place, city.cover || country.cover)}
            fallback={assetUrl(city.cover || country.cover)}
            alt={place.nameRu}
          />
        </button>
        <button
          className={`favorite-button ${favorites.hasKey(key) ? 'active' : ''}`}
          aria-label={`${favorites.hasKey(key) ? 'Убрать из избранного' : 'В избранное'}: ${place.nameRu}`}
          aria-pressed={favorites.hasKey(key)}
          onClick={() => favorites.toggleKey(key)}
        >
          <Heart
            size={23}
            weight={favorites.hasKey(key) ? 'fill' : 'regular'}
          />
        </button>
      </div>
      <div className="card-body">
        <button className="card-title" onClick={open}>
          {place.nameRu}
        </button>
        <span className="location-label">
          <MapPin size={15} weight="fill" />
          {city.nameRu}
        </span>
        <p>{place.summary || place.description}</p>
        <Tags tags={place.tags.slice(0, 3)} />
        <footer>
          <span>
            <Clock size={16} />
            {place.timeEstimateHours.join('–')} ч
          </span>
          <button
            className={visited.hasKey(key) ? 'visited active' : 'visited'}
            aria-pressed={visited.hasKey(key)}
            onClick={() => visited.toggleKey(key)}
          >
            <Check size={16} />
            {visited.hasKey(key) ? 'Посещено' : 'Отметить'}
          </button>
        </footer>
      </div>
    </article>
  );
}

export function PlaceDetails({
  country,
  city,
  place,
  close,
  edit,
}: {
  country: Country;
  city: GuideCity;
  place: GuidePlace;
  close: () => void;
  edit: () => void;
}) {
  const { favorites, visited } = useFlags();
  const key = stateKey(country.id, city.id, place.slug);
  const mapsQuery = place.coords
    ? `${place.coords.lat},${place.coords.lng}`
    : place.mapsQuery || `${place.nameEn} ${city.nameEn} ${country.nameEn}`;
  return (
    <Modal title={place.nameRu} close={close} wide>
      <Photo
        className="detail-photo"
        src={placePhoto(place, city.cover || country.cover)}
        fallback={assetUrl(city.cover || country.cover)}
        alt={place.nameRu}
      />
      {place.photoCredit && (
        <p className="photo-credit">
          {place.photoSourceUrl ? (
            <a href={place.photoSourceUrl} target="_blank" rel="noreferrer">
              {place.photoCredit}
            </a>
          ) : (
            place.photoCredit
          )}
        </p>
      )}
      <div className="detail-content">
        <div className="detail-meta">
          <span>
            <MapPin size={17} />
            {country.nameRu} · {city.nameRu}
          </span>
          <span>
            <Clock size={17} />
            {place.timeEstimateHours.join('–')} ч · ориентир
          </span>
        </div>
        <Tags tags={place.tags} />
        <p className="prose">{place.description}</p>
        {place.nameEn !== place.nameRu && (
          <p className="muted">
            {place.nameEn}
            {place.nameJa && ` · ${place.nameJa}`}
          </p>
        )}
        {[
          ['Когда идти', place.bestTime],
          ['Как добраться', place.transport],
          ['Часы · исходные заметки', place.hours],
          ['Заметка', place.note],
        ].map(
          ([label, value]) =>
            value && (
              <section key={label}>
                <h3>{label}</h3>
                <p className="prose">{value}</p>
              </section>
            ),
        )}
        {place.anime?.length ? (
          <section>
            <h3>Связанные аниме</h3>
            <p>{place.anime.join(', ')}</p>
          </section>
        ) : null}
        {place.incompatibleWith?.length ? (
          <section>
            <h3>На разные дни</h3>
            <p>
              {place.incompatibleWith
                .map(
                  (slug) =>
                    country.cities
                      .flatMap((c) => c.places)
                      .find((p) => p.slug === slug)?.nameRu ?? slug,
                )
                .join(', ')}
            </p>
          </section>
        ) : null}
        {place.combinesWith?.length ? (
          <section>
            <h3>Можно совместить</h3>
            <p>
              {place.combinesWith
                .map(
                  (slug) =>
                    country.cities
                      .flatMap((c) => c.places)
                      .find((p) => p.slug === slug)?.nameRu ?? slug,
                )
                .join(', ')}
            </p>
          </section>
        ) : null}
        {place.sections?.map((section) => (
          <section key={section.id}>
            <h3>{section.title}</h3>
            <p className="prose">{section.body}</p>
          </section>
        ))}
        <div className="detail-actions">
          <a
            className="primary"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
            target="_blank"
            rel="noreferrer"
          >
            Открыть карту
            <ArrowUpRight size={18} />
          </a>
          <button
            className="secondary"
            onClick={() => favorites.toggleKey(key)}
          >
            <Heart
              size={18}
              weight={favorites.hasKey(key) ? 'fill' : 'regular'}
            />
            {favorites.hasKey(key) ? 'В избранном' : 'В избранное'}
          </button>
          <button className="secondary" onClick={() => visited.toggleKey(key)}>
            <Check size={18} />
            {visited.hasKey(key) ? 'Посещено' : 'Уже посетил'}
          </button>
        </div>
        {place.links?.map((link) => (
          <a
            className="text-link"
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
            <ArrowUpRight size={16} />
          </a>
        ))}
        <div className="detail-bottom">
          <span className="muted">
            {place.source && `Источник: ${place.source}`}
          </span>
          <button className="text-link" onClick={edit}>
            <PencilSimple size={16} />
            Редактировать
          </button>
        </div>
      </div>
    </Modal>
  );
}
