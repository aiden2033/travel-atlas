import { z } from 'zod';

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
const text = z.string().max(30000);
const url = z
  .string()
  .max(3000)
  .refine((value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Нужна ссылка с https://');
const image = z
  .string()
  .max(3000)
  .refine(
    (value) =>
      !value ||
      url.safeParse(value).success ||
      (/^[\w-]+(?:\/[\w.-]+)+$/.test(value) && !value.includes('..')),
    'Укажите https-ссылку или путь к изображению в проекте',
  );

export const sectionSchema = z.object({
  id,
  title: z.string().min(1).max(160),
  body: text,
});

export const placeSchema = z.object({
  slug: id,
  city: id,
  nameRu: z.string().trim().min(1).max(200),
  nameEn: text,
  description: text,
  summary: text.optional(),
  tags: z.array(id).max(50),
  timeEstimateHours: z
    .tuple([z.number().min(0).max(1000), z.number().min(0).max(1000)])
    .refine(
      ([min, max]) => min <= max,
      'Минимальное время больше максимального',
    ),
  mapsQuery: text,
  coords: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  photo: image.optional(),
  remotePhoto: image.optional(),
  photoCredit: text.optional(),
  photoSourceUrl: url.optional(),
  photoLicense: text.optional(),
  photoLicenseUrl: url.optional(),
  photoIllustration: text.optional(),
  bestTime: text.optional(),
  note: text.optional(),
  transport: text.optional(),
  hours: text.optional(),
  nameJa: text.optional(),
  isDayTrip: z.boolean().optional(),
  dayTripGroup: text.optional(),
  combinesWith: z.array(id).optional(),
  incompatibleWith: z.array(id).optional(),
  anime: z.array(text).optional(),
  foodSpot: z.boolean().optional(),
  source: text.optional(),
  links: z
    .array(z.object({ label: z.string().min(1).max(160), url }))
    .max(50)
    .optional(),
  sections: z.array(sectionSchema).max(100).optional(),
});

export const citySchema = z.object({
  id,
  nameRu: z.string().trim().min(1).max(160),
  nameEn: text,
  intro: text,
  cover: image,
  nights: z.number().int().min(0).max(365).default(0),
  stay: z.array(z.object({ area: text, why: text })).default([]),
  tips: z.array(text).default([]),
  sections: z.array(sectionSchema).max(100).default([]),
  places: z.array(placeSchema).max(10000),
});

export const countrySchema = z.object({
  id,
  nameRu: z.string().trim().min(1).max(160),
  nameEn: text,
  intro: text,
  cover: image,
  heroBanner: image.optional(),
  sections: z.array(sectionSchema).max(100),
  cities: z.array(citySchema).max(500),
});

export const catalogSchema = z
  .object({
    version: z.literal(1),
    countries: z.array(countrySchema).min(1).max(100),
    tags: z
      .array(
        z.object({
          id,
          label: z.string().trim().min(1).max(60),
          tone: z.enum(['green', 'sand', 'blue', 'rose']).default('green'),
        }),
      )
      .max(300),
  })
  .superRefine((catalog, ctx) => {
    const unique = (values: string[], label: string) => {
      if (new Set(values).size !== values.length)
        ctx.addIssue({
          code: 'custom',
          message: `Повторяются идентификаторы: ${label}`,
        });
    };
    unique(
      catalog.countries.map((c) => c.id),
      'страны',
    );
    unique(
      catalog.tags.map((t) => t.id),
      'теги',
    );
    const tags = new Set(catalog.tags.map((t) => t.id));
    catalog.countries.forEach((country) => {
      unique(
        country.cities.map((c) => c.id),
        country.nameRu,
      );
      country.cities.forEach((city) => {
        unique(
          city.places.map((p) => p.slug),
          city.nameRu,
        );
        city.places.forEach((place) => {
          if (place.city !== city.id)
            ctx.addIssue({
              code: 'custom',
              message: `Город места «${place.nameRu}» не совпадает с разделом`,
            });
          if (place.tags.some((tag) => !tags.has(tag)))
            ctx.addIssue({
              code: 'custom',
              message: `Неизвестный тег у «${place.nameRu}»`,
            });
        });
      });
    });
  });

export type GuidePlace = z.infer<typeof placeSchema>;
export type GuideCity = z.infer<typeof citySchema>;
export type Country = z.infer<typeof countrySchema>;
export type Catalog = z.infer<typeof catalogSchema>;
export type Section = z.infer<typeof sectionSchema>;

const legacySchema = z.object({
  'jt:preflight': z.array(z.string()).optional(),
  'jt:trip-events': z
    .array(
      z.object({
        id: z.string(),
        date: z.string(),
        title: text,
        time: text.nullish(),
        detail: text.nullish(),
        city: text.nullish(),
        category: z.enum([
          'flight',
          'transport',
          'hotel',
          'activity',
          'food',
          'event',
          'note',
        ]),
        links: z.array(z.object({ label: text, url })),
        position: z.number(),
        deletedAt: text.nullish(),
        updatedAt: text,
      }),
    )
    .optional(),
  'jt:saved-routes': z
    .array(
      z.object({
        routeId: z.string(),
        city: z.string(),
        title: text,
        route: z.unknown(),
        enabled: z.boolean(),
        updatedAt: text,
      }),
    )
    .optional(),
});

export const backupSchema = z.object({
  format: z.literal('travel-atlas'),
  version: z.literal(1),
  exportedAt: z.string(),
  catalog: catalogSchema,
  favorites: z.array(z.string()),
  visited: z.array(z.string()),
  booked: z.array(z.string()),
  legacy: legacySchema.optional(),
});

export type Backup = z.infer<typeof backupSchema>;
export const stateKey = (country: string, city: string, slug: string) =>
  country === 'japan' ? `${city}:${slug}` : `${country}:${city}:${slug}`;

export const parseBackup = (raw: string): Backup => {
  if (new Blob([raw]).size > 10 * 1024 * 1024)
    throw new Error('Файл больше 10 МБ');
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    throw new Error('Файл не является корректным JSON');
  }
  if (
    !input ||
    typeof input !== 'object' ||
    !('format' in input) ||
    input.format !== 'travel-atlas'
  )
    throw new Error('Это не резервная копия Атласа');
  if (!('version' in input) || input.version !== 1)
    throw new Error('Версия резервной копии не поддерживается');
  const result = backupSchema.safeParse(input);
  if (!result.success)
    throw new Error(
      /^[А-Яа-яЁё]/.test(result.error.issues[0]?.message ?? '')
        ? result.error.issues[0].message
        : 'Структура файла повреждена. Проверьте поля каталога и личных отметок.',
    );
  return result.data;
};

export const assetUrl = (path?: string) =>
  !path
    ? ''
    : path.startsWith('https://')
      ? path
      : `${import.meta.env.BASE_URL}${path}`;
export const placePhoto = (place: GuidePlace, fallback: string) =>
  assetUrl(place.photo || place.remotePhoto || fallback);
export const guideUrl = (country: Country, city?: GuideCity) =>
  `/guide/${country.id}/${city?.id ?? country.cities[0]?.id ?? ''}`;
