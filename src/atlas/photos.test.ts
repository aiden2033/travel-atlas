import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { defaultSeed } from './seed';
import {
  getLicensedPhoto,
  licensedPhotos,
  photoManifestSchema,
  withLicensedPhotos,
} from './photos';

describe('licensed photographs', () => {
  it('keeps a unique source and a bundled landscape image for every selection', () => {
    const places = new Set(
      defaultSeed.countries.flatMap((country) =>
        country.cities.flatMap((city) =>
          city.places.map((place) => `${country.id}/${city.id}/${place.slug}`),
        ),
      ),
    );
    expect(licensedPhotos.length).toBeGreaterThan(0);
    expect(new Set(licensedPhotos.map((photo) => photo.key)).size).toBe(
      licensedPhotos.length,
    );
    for (const photo of licensedPhotos) {
      expect(places.has(photo.key), photo.key).toBe(true);
      expect(
        existsSync(new URL(`../../public/${photo.photo}`, import.meta.url)),
        photo.photo,
      ).toBe(true);
      expect(photo.width).toBeGreaterThanOrEqual(1000);
    }
  });

  it('never shows the same original photograph for two places', () => {
    const repeated = licensedPhotos.filter(
      (photo, index) =>
        licensedPhotos.findIndex(
          (other) => other.originalUrl === photo.originalUrl,
        ) !== index,
    );
    expect(repeated.map((photo) => photo.key)).toEqual([]);
  });

  it('keeps bundled and explicit catalog photographs licensed', () => {
    const bundled = new Set(licensedPhotos.map((photo) => photo.key));
    const withoutLicense = defaultSeed.countries.flatMap((country) =>
      country.cities.flatMap((city) =>
        city.places
          .filter(
            (place) =>
              !place.photoLicense &&
              (place.photo ||
                place.remotePhoto ||
                bundled.has(`${country.id}/${city.id}/${place.slug}`)),
          )
          .map((place) => `${country.id}/${city.id}/${place.slug}`),
      ),
    );
    expect(withoutLicense).toEqual([]);
  });

  it.each(['vietnam', 'laos', 'cambodia', 'thailand'])(
    'provides a local cover and a captioned photograph for every %s place',
    (countryId) => {
      const country = defaultSeed.countries.find(({ id }) => id === countryId)!;
      const places = country.cities.flatMap(({ places }) => places);

      expect(country.cover).toMatch(/^atlas\/.+\.jpg$/);
      expect(
        existsSync(new URL(`../../public/${country.cover}`, import.meta.url)),
      ).toBe(true);
      expect(places).toHaveLength(20);
      for (const place of places) {
        const photo = getLicensedPhoto(countryId, place.city, place.slug);
        expect(photo?.photo, place.slug).toContain(
          `photos/licensed/${countryId}-`,
        );
        expect(photo?.caption, place.slug).toBeTruthy();
        expect(place.photo, place.slug).toBe(photo?.photo);
        expect(place.photoCaption, place.slug).toBe(photo?.caption);
        expect(place.photoCredit, place.slug).toContain(photo?.author);
        expect(place.photoLicense, place.slug).toBe(photo?.license);
        expect(place.photoLicenseUrl, place.slug).toBe(photo?.licenseUrl);
        expect(place.photoSourceUrl, place.slug).toBe(photo?.sourceUrl);
      }
    },
  );

  it('rejects restricted licenses, portrait images and insecure sources', () => {
    const photo = licensedPhotos[0];
    expect(
      photoManifestSchema.safeParse([{ ...photo, license: 'CC BY-NC 4.0' }])
        .success,
    ).toBe(false);
    expect(
      photoManifestSchema.safeParse([{ ...photo, width: 800, height: 1200 }])
        .success,
    ).toBe(false);
    expect(
      photoManifestSchema.safeParse([
        { ...photo, sourceUrl: 'http://example.com/image' },
      ]).success,
    ).toBe(false);
    expect(
      photoManifestSchema.safeParse([
        { ...photo, illustrative: true, illustrationCaption: undefined },
      ]).success,
    ).toBe(false);
  });

  it('preserves a photograph and credit supplied through the constructor', () => {
    const catalog = structuredClone(defaultSeed);
    const [countryId, cityId, slug] = licensedPhotos[0].key.split('/');
    const place = catalog.countries
      .find((country) => country.id === countryId)!
      .cities.find((city) => city.id === cityId)!
      .places.find((place) => place.slug === slug)!;
    place.photo = 'https://example.com/my-travel-photo.jpg';
    place.photoCredit = 'My photograph';
    const saved = withLicensedPhotos(catalog)
      .countries.find((country) => country.id === countryId)!
      .cities.find((city) => city.id === cityId)!
      .places.find((place) => place.slug === slug)!;
    expect(saved).toEqual(place);
  });

  it.each([
    ['vietnam', 'can-tho', 'cai-rang-floating-market'],
    ['thailand', 'andaman', 'maya-bay'],
  ])(
    'keeps a custom photograph and caption for %s/%s/%s',
    (country, city, slug) => {
      const catalog = structuredClone(defaultSeed);
      const place = catalog.countries
        .find(({ id }) => id === country)!
        .cities.find(({ id }) => id === city)!
        .places.find((entry) => entry.slug === slug)!;
      place.photo = 'https://example.com/my-travel-photo.jpg';
      place.photoCredit = 'Автор поездки';
      place.photoCaption = 'Лодки перед рассветом';

      expect(withLicensedPhotos(catalog)).toEqual(catalog);
    },
  );

  it('preserves edited attribution and illustration captions for a bundled image', () => {
    const catalog = structuredClone(defaultSeed);
    const [countryId, cityId, slug] = licensedPhotos[0].key.split('/');
    const place = catalog.countries
      .find((country) => country.id === countryId)!
      .cities.find((city) => city.id === cityId)!
      .places.find((place) => place.slug === slug)!;
    place.photoCredit = 'Edited attribution';
    place.photoIllustration = 'Edited illustration caption';
    expect(withLicensedPhotos(catalog)).toEqual(catalog);
  });
});
