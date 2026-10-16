import { useEffect, useMemo, useState } from 'react';
import type { Place } from '../data/types';
import PlaceholderImage from './PlaceholderImage';
import { assetUrl } from '../atlas/model';
import { getLicensedPhoto } from '../atlas/photos';

interface PlaceImageProps {
  place: Place;
}

export default function PlaceImage({ place }: PlaceImageProps) {
  const licensed = getLicensedPhoto('japan', place.city, place.slug);
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = useMemo(
    () =>
      licensed
        ? [assetUrl(licensed.photo)]
        : [
            place.remotePhoto,
            place.photo ? import.meta.env.BASE_URL + place.photo : undefined,
          ].filter((src): src is string => Boolean(src)),
    [licensed, place.photo, place.remotePhoto],
  );

  useEffect(() => {
    setSourceIndex(0);
  }, [place.slug, sources]);

  const placeholder = (
    <PlaceholderImage
      nameEn={place.nameEn}
      nameRu={place.nameRu}
      city={place.city}
      slug={place.slug}
    />
  );

  const src = sources[sourceIndex];

  if (!src) {
    return placeholder;
  }

  return (
    <figure className="m-0">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
        <img
          src={src}
          alt={
            licensed?.illustrative
              ? licensed.illustrationCaption
              : `${place.nameEn} — ${place.nameRu}`
          }
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() =>
            setSourceIndex((value) => Math.min(value + 1, sources.length))
          }
          className="h-full w-full object-cover"
        />
        {licensed?.illustrative && (
          <span className="photo-illustration-badge">Иллюстрация</span>
        )}
        {!licensed &&
          place.remotePhoto &&
          src === place.remotePhoto &&
          place.photoCredit && (
            <span className="pointer-events-none absolute bottom-1 right-1 max-w-[75%] truncate rounded-full bg-slate-950/65 px-1.5 py-0.5 text-[10px] font-medium text-white">
              Фото: {place.photoCredit}
            </span>
          )}
      </div>
      {licensed && (
        <figcaption className="px-2 py-1 text-right text-[10px] text-slate-500">
          {licensed.illustrative && <p>{licensed.illustrationCaption}</p>}
          <a
            href={licensed.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {licensed.author}
          </a>
          {' · кадрирование 3:2 · '}
          <a
            href={licensed.licenseUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {licensed.license}
          </a>
        </figcaption>
      )}
    </figure>
  );
}
