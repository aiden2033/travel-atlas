import { cities as japanCities } from '../data/cities';
import { places as japanPlaces } from '../data/places';
import { friendsMapPlaces } from '../data/friendsMapPlaces';
import { trip } from '../data/trip';
import winter from './winter.json';
import published from './published.json';
import gardensCredit from '../../public/atlas/singapore-gardens-credit.json';
import merlionCredit from '../../public/atlas/singapore-merlion-credit.json';
import galleryCredit from '../../public/atlas/singapore-gallery-credit.json';
import {
  catalogSchema,
  placeSchema,
  type Country,
  type GuideCity,
  type GuidePlace,
} from './model';

const city = (
  id: string,
  nameRu: string,
  nameEn: string,
  intro: string,
  cover: string,
  places: GuidePlace[] = [],
): GuideCity => ({
  id,
  nameRu,
  nameEn,
  intro,
  cover,
  places,
  nights: 0,
  stay: [],
  tips: [],
  sections: [],
});

const spot = (
  cityId: string,
  slug: string,
  nameRu: string,
  nameEn: string,
  description: string,
  tags: string[],
  coords?: [number, number],
  extra: Partial<GuidePlace> = {},
): GuidePlace => ({
  city: cityId,
  slug,
  nameRu,
  nameEn,
  description,
  tags,
  timeEstimateHours: [1, 2],
  mapsQuery: nameEn,
  coords: coords ? { lat: coords[0], lng: coords[1] } : undefined,
  ...extra,
});

const originalNotes = (country: 'malaysia' | 'indonesia') => ({
  id: 'original-notes',
  title: 'Заметки исходной поездки · архив',
  body: `Материалы winter26 для поездки 20 декабря — 11 января. Цены, расписания и правила въезда из исходного проекта не перепроверялись.\n\n${winter.notes[country].join('\n\n')}`,
});

const malaysiaCities = [
  city(
    'langkawi',
    'Лангкави',
    'Langkawi',
    'Пляжи Андаманского моря, мангровые леса и прогулки над джунглями.',
    'atlas/malaysia-hero.jpg',
    winter.cities.langkawi.map((p) => placeSchema.parse(p)),
  ),
  city(
    'kuala-lumpur',
    'Куала-Лумпур',
    'Kuala Lumpur',
    'Башни, рынки и кварталы, в которых встречаются разные культуры.',
    'atlas/kuala-lumpur.jpg',
    winter.cities['kuala-lumpur'].map((p) => placeSchema.parse(p)),
  ),
  city(
    'penang',
    'Пенанг',
    'Penang',
    'Пляжи, колониальные улицы Джорджтауна, стрит-арт и уличная еда.',
    'atlas/penang.jpg',
    winter.cities.penang.map((p) => placeSchema.parse(p)),
  ),
];

malaysiaCities[0].places[0] = {
  ...malaysiaCities[0].places[0],
  slug: 'pantai-cenang',
  nameRu: 'Pantai Cenang',
  nameEn: 'Pantai Cenang',
  photo: 'atlas/cenang.jpg',
  description:
    'Популярный пляж с белым песком, кафе, водными развлечениями и красивыми закатами.',
  coords: { lat: 6.294, lng: 99.724 },
  tags: ['beach', 'relax', 'sunset'],
};
const bridge = malaysiaCities[0].places.find((p) =>
  p.nameRu.includes('Sky Bridge'),
)!;
Object.assign(bridge, {
  slug: 'sky-bridge',
  photo: 'atlas/sky-bridge.jpg',
  photoCredit: 'Иллюстрация создана с помощью ИИ',
  coords: { lat: 6.3864, lng: 99.6621 },
  tags: ['nature', 'view', 'adventure'],
});
malaysiaCities[0].places.splice(
  2,
  0,
  spot(
    'langkawi',
    'kilim',
    'Геопарк Килим',
    'Kilim Karst Geoforest Park, Langkawi',
    'Мангровые леса, известняковые скалы и водные маршруты среди островов. Идея для отдельной экскурсии.',
    ['nature', 'day-trip', 'wildlife'],
    [6.405, 99.858],
    {
      photo: 'atlas/kilim.jpg',
      photoCredit: 'Иллюстрация создана с помощью ИИ',
      timeEstimateHours: [3, 5],
    },
  ),
);
const bridgeIndex = malaysiaCities[0].places.indexOf(bridge);
malaysiaCities[0].places.splice(bridgeIndex, 1);
malaysiaCities[0].places.splice(1, 0, bridge);
const kilim = malaysiaCities[0].places.find((p) => p.slug === 'kilim')!;
malaysiaCities[0].places = [
  malaysiaCities[0].places[0],
  bridge,
  kilim,
  ...malaysiaCities[0].places.filter(
    (p) => !['pantai-cenang', 'sky-bridge', 'kilim'].includes(p.slug),
  ),
];
for (const [slug, name] of [
  ['pasir-hitam', 'Pantai Pasir Hitam'],
  ['pantai-kok', 'Pantai Kok'],
  ['lagenda-beach', 'Lagenda Beach'],
]) {
  malaysiaCities[0].places.push(
    spot(
      'langkawi',
      slug,
      name,
      `${name}, Langkawi`,
      'Запасная пляжная точка из исходного путеводителя. Перед купанием проверьте условия на месте.',
      ['beach'],
      undefined,
      { source: 'winter26' },
    ),
  );
}

const singaporeSource =
  'https://www.visitsingapore.com/travel-tips/travelling-to-singapore/itineraries/7-days-in-singapore/';
const sg = (
  area: string,
  slug: string,
  nameRu: string,
  nameEn: string,
  description: string,
  tags: string[],
  coords: [number, number],
  hours: [number, number] = [1, 2],
) =>
  spot(area, slug, nameRu, nameEn, description, tags, coords, {
    timeEstimateHours: hours,
    source: 'Visit Singapore · 16.10.2026',
    links: [{ label: 'Visit Singapore', url: singaporeSource }],
  });
const singaporeCities = [
  city(
    'marina-bay',
    'Марина-Бэй',
    'Marina Bay',
    'Современная архитектура, набережная и сады у залива.',
    'atlas/singapore.jpg',
    [
      sg(
        'marina-bay',
        'gardens-by-the-bay',
        'Gardens by the Bay',
        'Gardens by the Bay, Singapore',
        'Сады у залива с оранжереями и рощей Supertree Grove. Отдельная остановка для прогулки среди растений.',
        ['nature', 'sight', 'tickets-ahead'],
        [1.2816, 103.8636],
        [2, 4],
      ),
      sg(
        'marina-bay',
        'merlion',
        'Мерлион и набережная',
        'Merlion Park, Singapore',
        'Символ города у воды. Отсюда удобно продолжить прогулку по набережной залива.',
        ['sight', 'walk', 'view'],
        [1.2868, 103.8545],
      ),
      sg(
        'marina-bay',
        'national-gallery',
        'Национальная галерея',
        'National Gallery Singapore',
        'Художественная коллекция в исторических зданиях мэрии и Верховного суда.',
        ['museum', 'sight'],
        [1.29, 103.8516],
        [2, 3],
      ),
      sg(
        'marina-bay',
        'marina-bay-sands',
        'Marina Bay Sands',
        'Marina Bay Sands, Singapore',
        'Архитектурный ориентир залива и торговая галерея. Условия доступа на смотровую уточняются отдельно.',
        ['view', 'shopping', 'tickets-ahead'],
        [1.2834, 103.8607],
      ),
    ],
  ),
  city(
    'neighbourhoods',
    'Старые кварталы',
    'Historic neighbourhoods',
    'Чайнатаун, Маленькая Индия и Кампонг-Глам — пешком и с остановками на еду.',
    'atlas/singapore.jpg',
    [
      sg(
        'neighbourhoods',
        'chinatown',
        'Чайнатаун',
        'Chinatown Singapore',
        'Исторический квартал с храмами, лавками и традиционной архитектурой.',
        ['walk', 'sight', 'food'],
        [1.2838, 103.8439],
      ),
      sg(
        'neighbourhoods',
        'chinatown-food',
        'Chinatown Complex Food Centre',
        'Chinatown Complex Food Centre, Singapore',
        'Хокер-центр для знакомства с местными блюдами и разными кулинарными традициями города.',
        ['food'],
        [1.282, 103.8432],
      ),
      sg(
        'neighbourhoods',
        'little-india',
        'Маленькая Индия',
        'Little India Singapore',
        'Цветные фасады, индийские лавки и прогулка по одному из исторических кварталов.',
        ['walk', 'food', 'sight'],
        [1.3066, 103.8518],
      ),
      sg(
        'neighbourhoods',
        'kampong-glam',
        'Кампонг-Глам',
        'Kampong Glam Singapore',
        'Исторический квартал вокруг мечети Султана, небольшие магазины и переулки для прогулки.',
        ['walk', 'sight', 'cafe'],
        [1.3023, 103.859],
      ),
    ],
  ),
  city(
    'islands-and-gardens',
    'Острова и сады',
    'Islands & gardens',
    'Зелёные пространства и отдельные выезды за пределы центра.',
    'atlas/singapore.jpg',
    [
      sg(
        'islands-and-gardens',
        'botanic-gardens',
        'Ботанический сад',
        'Singapore Botanic Gardens',
        'Большой тропический сад с озёрами и прогулочными маршрутами. Внутри находится Национальный сад орхидей.',
        ['nature', 'walk'],
        [1.3138, 103.8159],
        [2, 4],
      ),
      sg(
        'islands-and-gardens',
        'sentosa',
        'Сентоза',
        'Sentosa Singapore',
        'Остров с пляжами и развлечениями. Удобно выделить на него отдельный день.',
        ['beach', 'day-trip'],
        [1.2494, 103.8303],
        [4, 8],
      ),
      sg(
        'islands-and-gardens',
        'pulau-ubin',
        'Пулау-Убин',
        'Pulau Ubin Singapore',
        'Остров для знакомства с природой и мангровыми ландшафтами за пределами плотного городского центра.',
        ['nature', 'day-trip', 'adventure'],
        [1.4126, 103.9579],
        [4, 7],
      ),
    ],
  ),
];

for (const [index, filename, credit] of [
  [0, 'singapore-gardens.jpg', gardensCredit],
  [1, 'singapore-merlion.jpg', merlionCredit],
  [2, 'singapore-gallery.jpg', galleryCredit],
] as const) {
  Object.assign(singaporeCities[0].places[index], {
    photo: `atlas/${filename}`,
    photoCredit: `${credit.author} · ${credit.license} · кадрирование при отображении`,
    photoSourceUrl: credit.descriptionurl,
  });
}

const indonesiaCities = [
  city(
    'java',
    'Ява',
    'Java',
    'Вулканические пейзажи и культурные остановки.',
    'atlas/indonesia.jpg',
    [
      spot(
        'java',
        'ijen',
        'Вулкан Иджен',
        'Ijen Crater, East Java, Indonesia',
        'Вулканический кратер на востоке Явы. В исходном проекте отмечен ради необычного ночного пейзажа; доступ и условия посещения требуют проверки у оператора.',
        ['nature', 'adventure', 'day-trip'],
        [-8.058, 114.242],
        {
          timeEstimateHours: [6, 10],
          links: [
            {
              label: 'Indonesia Travel',
              url: 'https://www.indonesia.travel/id/id/destination/java/east-java/ijen-crater',
            },
          ],
          source: 'winter26',
        },
      ),
    ],
  ),
  city(
    'lombok',
    'Ломбок',
    'Lombok',
    'Пляжи, серфинг и горные маршруты.',
    'atlas/indonesia.jpg',
    [
      spot(
        'lombok',
        'kuta-lombok',
        'Кута и южные пляжи',
        'Kuta Lombok Indonesia',
        'Пляжная база на юге Ломбока: побережье, небольшие бухты и идеи для серфинга из исходного проекта.',
        ['beach', 'relax', 'adventure'],
        [-8.892, 116.278],
      ),
      spot(
        'lombok',
        'rinjani',
        'Ринджани',
        'Mount Rinjani Lombok Indonesia',
        'Горная идея из исходного проекта. Это отдельный поход, для которого нужно заранее уточнять маршрут, допуск и сопровождение.',
        ['nature', 'adventure', 'day-trip'],
        [-8.411, 116.457],
        { timeEstimateHours: [24, 72] },
      ),
    ],
  ),
  city(
    'gili',
    'Острова Гили',
    'Gili Islands',
    'Островной отдых и прогулки у воды.',
    'atlas/indonesia.jpg',
    [
      spot(
        'gili',
        'gili-trawangan',
        'Гили Траванган',
        'Gili Trawangan Indonesia',
        'Остров для пляжного отдыха и снорклинга. В исходном плане — остановка ради моря и черепах.',
        ['beach', 'nature', 'relax'],
        [-8.348, 116.038],
        { source: 'winter26', timeEstimateHours: [3, 6] },
      ),
    ],
  ),
  city(
    'flores',
    'Флорес и Комодо',
    'Flores & Komodo',
    'Лабуан-Баджо как отправная точка к островам и морским маршрутам.',
    'atlas/indonesia.jpg',
    [
      spot(
        'flores',
        'komodo',
        'Национальный парк Комодо',
        'Komodo National Park Indonesia',
        'Островные маршруты и наблюдение за комодскими варанами с местным сопровождением.',
        ['nature', 'wildlife', 'day-trip'],
        [-8.55, 119.489],
        { source: 'winter26', timeEstimateHours: [6, 10] },
      ),
      spot(
        'flores',
        'pink-beach',
        'Pink Beach',
        'Pink Beach Komodo Indonesia',
        'Пляж с розовым оттенком песка в районе Комодо. Одна из точек лодочного выезда из Лабуан-Баджо.',
        ['beach', 'nature', 'day-trip'],
        [-8.602, 119.519],
        { source: 'winter26' },
      ),
      spot(
        'flores',
        'manta-point',
        'Морская прогулка к мантам',
        'Manta Point Komodo Indonesia',
        'Идея для морского маршрута из исходного путеводителя. Выбор оператора и возможность выхода зависят от условий на месте.',
        ['nature', 'wildlife', 'adventure', 'day-trip'],
        [-8.538, 119.582],
        { source: 'winter26', timeEstimateHours: [3, 6] },
      ),
    ],
  ),
  city(
    'kalimantan',
    'Калимантан',
    'Kalimantan',
    'Речные маршруты и тропические леса Борнео.',
    'atlas/indonesia.jpg',
    [
      spot(
        'kalimantan',
        'tanjung-puting',
        'Танджунг-Путинг',
        'Tanjung Puting National Park Indonesia',
        'Идея поездки в тропический лес ради орангутанов. Из исходного проекта: отдельная остановка на Калимантане.',
        ['nature', 'wildlife', 'day-trip'],
        [-2.831, 111.899],
        { source: 'winter26', timeEstimateHours: [24, 72] },
      ),
    ],
  ),
];

const indonesiaPhotos: Record<string, string> = {
  ijen: 'https://static.mybalitrips.com/tickets/ijen/525-73_FThF5Yl.jpg',
  komodo:
    'https://www.svoiludi.ru/images/tb/4781/komodo-16957137487356_w687h357.jpg',
  'pink-beach':
    'https://i.pinimg.com/736x/df/bf/3b/dfbf3bc714551bd3cc54d466398d4863.jpg',
  'gili-trawangan':
    'https://nomadz.life/wp-content/uploads/2018/11/gili-islands2.jpg',
  'tanjung-puting':
    'https://www.eden-tour.ru/wp-content/uploads/2019/03/%D0%BA%D0%B0%D0%BB%D0%B8%D0%BC%D0%B0%D0%BD%D1%82%D0%B0%D0%BD-%D0%B1%D0%BE%D1%80%D0%BD%D0%B5%D0%BE-8.jpg',
  'manta-point':
    'https://diveclub.ru/view/images/upload/nicedit/194235885scd0419_todd-winner-97a0838.jpg',
};
indonesiaCities.forEach((city) =>
  city.places.forEach((place) => {
    place.remotePhoto = indonesiaPhotos[place.slug];
  }),
);

const japan: Country = {
  id: 'japan',
  nameRu: 'Япония',
  nameEn: 'Japan',
  intro:
    'Неоновые улицы Осаки, тихие храмы Киото и многоликий Токио. Собирайте свою Японию — место за местом.',
  cover: 'photos/kyoto/yasaka_pagoda.jpeg',
  sections: [
    {
      id: 'trip',
      title: 'Исходная поездка · август — сентябрь 2026',
      body: `${trip.summary}\n${trip.dates}`,
    },
    ...trip.globalTips.map((group, index) => ({
      id: `tips-${index}`,
      title: `${group.category} · заметки исходной поездки`,
      body: group.items.join('\n\n'),
    })),
  ],
  cities: japanCities.map((meta) => ({
    ...meta,
    cover: {
      osaka: 'photos/osaka/dotonbori.webp',
      kyoto: 'photos/kyoto/yasaka_pagoda.jpeg',
      tokyo: 'photos/tokyo/shibuya_cross.jpg',
      other: 'photos/tokyo/hakone.webp',
    }[meta.id],
    sections: [],
    places: [
      ...japanPlaces
        .filter((p) => p.city === meta.id)
        .map((p) => ({
          ...p,
          photoSourceUrl: p.photoSourceUrl?.replace(/^http:/, 'https:'),
          source: 'japan-trip',
        })),
      ...friendsMapPlaces
        .filter((p) => p.city === meta.id)
        .map((p) =>
          spot(
            meta.id,
            `friends-${p.id}`,
            p.name,
            p.name,
            p.note ?? 'Точка из общего Google Maps списка.',
            p.isDayTrip ? ['day-trip', 'friends'] : ['friends'],
            [p.coords.lat, p.coords.lng],
            { source: 'Google Maps · japan-trip', isDayTrip: p.isDayTrip },
          ),
        ),
    ],
  })),
};

export const defaultSeed = catalogSchema.parse({
  version: 1,
  countries: [
    {
      id: 'malaysia',
      nameRu: 'Малайзия',
      nameEn: 'Malaysia',
      cover: 'atlas/malaysia-hero.jpg',
      heroBanner: 'atlas/malaysia-banner.jpg',
      intro:
        'Тропические острова, древние джунгли, колониальные города и невероятная кухня. Путешествие, в котором есть время и для открытий, и для моря.',
      cities: malaysiaCities,
      sections: [
        {
          id: 'route',
          title: 'Идея маршрута',
          body: 'Лангкави → Куала-Лумпур → Пенанг. Пляжная остановка, большой город и гастрономический финал — в любом удобном темпе.',
        },
        originalNotes('malaysia'),
      ],
    },
    {
      id: 'singapore',
      nameRu: 'Сингапур',
      nameEn: 'Singapore',
      cover: 'atlas/singapore.jpg',
      intro:
        'Город-сад между небоскрёбами и тропиками. Прогулки у залива, старые кварталы и остановки на еду в одном компактном путешествии.',
      cities: singaporeCities,
      sections: [
        {
          id: 'route',
          title: 'Идея маршрута',
          body: 'Марина-Бэй → старые кварталы → острова и сады. Здесь вместо городов — районы и отдельные выезды.',
        },
        {
          id: 'source',
          title: 'Об этом разделе',
          body: `Стартовый каталог составлен 16 октября 2026 по Visit Singapore. Длительность посещений — ориентир для планирования. Расписания и билеты уточняйте у площадок.\n${singaporeSource}`,
        },
      ],
    },
    {
      id: 'indonesia',
      nameRu: 'Индонезия',
      nameEn: 'Indonesia',
      cover: 'atlas/indonesia.jpg',
      intro:
        'Вулканы Явы, спокойные пляжи Ломбока, острова Гили и морские маршруты Комодо. Большая поездка, которую удобно собирать по островам.',
      cities: indonesiaCities,
      sections: [
        {
          id: 'route',
          title: 'Идея маршрута',
          body: 'Ява → Ломбок → Гили → Флорес → Калимантан. Это набор идей исходного проекта: выберите подходящие остановки, а переезды планируйте отдельно.',
        },
        originalNotes('indonesia'),
      ],
    },
    japan,
  ],
  tags: [
    ['food', 'Еда', 'sand'],
    ['sight', 'Достопримечательности', 'sand'],
    ['nature', 'Природа', 'green'],
    ['beach', 'Пляжи', 'blue'],
    ['day-trip', 'Выезды', 'blue'],
    ['view', 'Смотровые', 'blue'],
    ['walk', 'Прогулки', 'green'],
    ['temple-shrine', 'Храмы', 'sand'],
    ['cafe', 'Кафе', 'sand'],
    ['museum', 'Музеи', 'rose'],
    ['shopping', 'Шопинг', 'rose'],
    ['nightlife', 'Вечером', 'blue'],
    ['relax', 'Отдых', 'sand'],
    ['sunset', 'Закаты', 'sand'],
    ['adventure', 'Активный отдых', 'sand'],
    ['wildlife', 'Животные', 'green'],
    ['morning', 'Утром', 'sand'],
    ['castle', 'Замки', 'rose'],
    ['tickets-ahead', 'Билеты заранее', 'rose'],
    ['low-mobility', 'Без подъёмов', 'green'],
    ['anime', 'Аниме', 'rose'],
    ['nastya-rec', 'От Насти', 'green'],
    ['friends', 'Из общего списка', 'blue'],
  ].map(([id, label, tone]) => ({ id, label, tone })),
});

export const seed = published ? catalogSchema.parse(published) : defaultSeed;
