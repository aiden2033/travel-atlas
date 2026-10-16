import { z } from 'zod';
import type { Catalog } from './model';
import manifest from './photo-manifest.json';

const httpsUrl = z.url().refine((value) => value.startsWith('https://'));

export const photoManifestSchema = z.array(
  z
    .object({
      key: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/),
      photo: z.string().regex(/^photos\/licensed\/[\w-]+\.jpg$/),
      author: z.string().min(1),
      license: z
        .string()
        .regex(
          /^(CC0|Public domain|CC BY(?:-SA)? (?:1\.0|2\.0|2\.5|3\.0|4\.0))$/,
        ),
      licenseUrl: httpsUrl,
      sourceUrl: httpsUrl,
      originalUrl: httpsUrl,
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      replaces: z.array(z.string()),
      illustrative: z.boolean().default(false),
      illustrationCaption: z.string().optional(),
    })
    .refine(
      (photo) =>
        !photo.illustrative || Boolean(photo.illustrationCaption?.trim()),
      'Нужна подпись к иллюстрации',
    )
    .refine(
      (photo) => photo.width > photo.height,
      'Нужен горизонтальный снимок',
    ),
);

export const licensedPhotos = photoManifestSchema.parse(manifest);
const photosByKey = new Map(licensedPhotos.map((photo) => [photo.key, photo]));

export const getLicensedPhoto = (country: string, city: string, slug: string) =>
  photosByKey.get(`${country}/${city}/${slug}`);

export const withLicensedPhotos = (catalog: Catalog): Catalog => ({
  ...catalog,
  countries: catalog.countries.map((country) => ({
    ...country,
    cities: country.cities.map((city) => ({
      ...city,
      places: city.places.map((place) => {
        const photo = getLicensedPhoto(country.id, city.id, place.slug);
        const current = place.photo || place.remotePhoto;
        if (
          !photo ||
          current === photo.photo ||
          (current && !photo.replaces.includes(current))
        )
          return place;
        return {
          ...place,
          photo: photo.photo,
          remotePhoto: undefined,
          photoCredit: `${photo.author} · кадрирование 3:2`,
          photoSourceUrl: photo.sourceUrl,
          photoLicense: photo.license,
          photoLicenseUrl: photo.licenseUrl,
          photoIllustration: photo.illustrative
            ? photo.illustrationCaption
            : undefined,
        };
      }),
    })),
  })),
});
