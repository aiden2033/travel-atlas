import type { Country, GuideCity, GuidePlace } from './model';

type VietnamPlace = Omit<
  GuidePlace,
  'city' | 'mapsQuery' | 'sections' | 'links'
> & {
  pin: string;
  sourceUrl: string;
  googleMapsUrl?: string;
};

const base = (
  details: Pick<GuideCity, 'id' | 'nameRu' | 'nameEn' | 'intro'>,
  places: VietnamPlace[],
): GuideCity => ({
  ...details,
  cover: '',
  nights: 0,
  stay: [],
  tips: [],
  sections: [],
  places: places.map(({ pin, sourceUrl, googleMapsUrl, ...place }) => ({
    ...place,
    city: details.id,
    mapsQuery: place.nameEn,
    sections: [{ id: 'map-pin', title: 'Ориентир', body: pin }],
    links: [
      { label: 'Источник', url: sourceUrl },
      ...(googleMapsUrl ? [{ label: 'Google Maps', url: googleMapsUrl }] : []),
    ],
  })),
});

export const vietnam: Country = {
  id: 'vietnam',
  nameRu: 'Вьетнам',
  nameEn: 'Vietnam',
  intro:
    'Карстовые реки Ниньбиня, горы Сапы, старые города Хюэ и Хойан, дельта Меконга и западные пляжи Фукуока. Девять баз для поездки в конце декабря и начале января.',
  cover: 'atlas/vietnam.jpg',
  sections: [
    {
      id: 'route',
      title: 'Как собрать поездку',
      body: 'Выберите базы по погоде и интересам. На Севере в это время прохладно, в Центре возможны дожди, а за купанием лучше ехать на Юг. В карточках время на дорогу указано в одну сторону от выбранной базы. Заложите запас на праздничные очереди.',
    },
    {
      id: 'north',
      title: 'Север · карст, бухта и горы',
      body: `Ханой на 3–4 ночи с дневным выездом в Халонг. Ниньбинь на 2–3 ночи, от Ханоя примерно 2–2,5 ч. Сапа на 2–3 ночи, если готовы к 5,5–6,5 ч дороги из Ханоя в одну сторону.

В Халонге и горах возможен туман. На террасах Сапы к этому времени рис обычно уже убран. Подъём на Фансипан удобнее оставить на день с хорошей видимостью.`,
    },
    {
      id: 'central',
      title: 'Центр · история и подземная река',
      body: `Хойан на 4–5 ночей, Хюэ на 2–3. Фонгня ещё на 2 ночи с запасом по погоде для поездки в пещеру. На машине из аэропорта Дананга до Хойана 45–60 мин, между Хойаном и Хюэ через туннель около 2 ч 40 мин – 3 ч 30 мин. Из Хюэ до Донгхоя около 3 ч поездом, затем 45–60 мин до Фонгни на машине.

В Хюэ, Хойане и на побережье возможны прохлада, дожди и волны. Запланируйте прогулки по старым городам и оставьте пляжные дни для юга.`,
    },
    {
      id: 'south',
      title: 'Юг · море и дельта Меконга',
      body: `На Фукуоке можно провести 5–7 ночей с одной базой в Зыонгдонге. Для смены впечатлений добавьте Хошимин на 2–3 ночи или Кантхо на 2 ночи. Из Хошимина в Кантхо 3–4 ч машиной, на Фукуок около 1 ч в воздухе.

Обычно тепло и сухо. Западный берег Фукуока подходит для купания, а в Кантхо лучше выйти на воду на рассвете, пока меньше жары.`,
    },
    {
      id: 'flights',
      title: 'Аэропорты и стыковки',
      body: `Маршруты перелётов в исходном путеводителе проверены по опубликованным сеткам на 26 ноября 2026. Сверьте расписание и стыковки на даты поездки.

Север. Для Ханоя (HAN) проверьте прямой рейс Vietnam Airlines из Москвы и стыковки из Краби через Куала-Лумпур или Бангкок.
Vietnam Airlines — https://www.vietnamairlines.com/en-vn/flights-from-moscow
Краби — Ханой — https://www.flightconnections.com/flights-from-kbv-to-han

Центр. Для Дананга (DAD) проверьте варианты из Москвы со стыковкой, в том числе через Ханой, и из Краби через Куала-Лумпур или Бангкок.
Краби — Дананг — https://www.flightconnections.com/flights-from-kbv-to-dad
Хойан — Хюэ — https://www.rome2rio.com/s/H%E1%BB%99i-An/Hu%E1%BA%BF

Юг. Для Хошимина (SGN) и Фукуока (PQC) проверьте прямые рейсы из Москвы и стыковки из Краби через Куала-Лумпур или Бангкок.
Москва — Вьетнам — https://vietgid.com/en/nha-trang/articles/skolko-letet-iz-moskvy-vo-vetnam
Краби — Хошимин — https://www.flightconnections.com/flights-from-kbv-to-sgn
Краби — Фукуок — https://www.flightconnections.com/es/vuelos-desde-kbv-a-pqc`,
    },
    {
      id: 'season-sources',
      title: 'Источники по сезону',
      body: `Vietnam Tourism · климат по регионам — https://vietnam.travel/things-to-do/weather-and-climate-vietnam/
Vietnam Airlines · зима в Сапе — https://www.vietnamairlines.com/us/en/plan-book/travel/travel-guide/sapa-winter
The Vietnam Guides · террасы Сапы по сезонам — https://www.thevietnamguides.com/city/sapa/`,
    },
    {
      id: 'cover-credit',
      title: 'Обложка · лодки Чангана',
      body: `Фото: Jakub Hałun. Лодки в ландшафтном комплексе Чанган, 2 февраля 2024. Кадрирование 3:2.
Лицензия CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
Wikimedia Commons — https://commons.wikimedia.org/wiki/File%3ATour_boats_at_Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1446_5308.jpg`,
    },
  ],
  cities: [
    base(
      {
        id: 'hanoi',
        nameRu: 'Ханой',
        nameEn: 'Hanoi',
        intro:
          'Старый квартал — база на 3–4 ночи для прогулок у озера, Храма литературы и дневного круиза в Халонге.',
      },
      [
        {
          slug: 'hoan-kiem-old-quarter',
          nameRu: 'Озеро Хоанкьем и Старый квартал',
          nameEn: 'Hoan Kiem Lake and Hanoi Old Quarter',
          nameLocal: 'Hồ Hoàn Kiếm · Phố cổ Hà Nội',
          description:
            'От красного моста Тхехук пройдите вдоль озера с Черепашьей башней и сверните в торговые улочки Старого квартала. В конце декабря и начале января в Ханое прохладно, возможна дымка, для прогулки удобно взять лёгкую куртку.',
          tags: ['walk', 'sight'],
          timeEstimateHours: [1.5, 3],
          visitDuration: '1,5–3 ч',
          transport: 'Пешком 5–20 мин из Старого квартала.',
          coords: { lat: 21.03075, lng: 105.8528 },
          pin: 'Красный мост Cầu Thê Húc у улицы Đinh Tiên Hoàng.',
          sourceUrl:
            'https://vietnam.travel/places-to-go/northern-vietnam/ha-noi',
        },
        {
          slug: 'temple-of-literature',
          nameRu: 'Храм литературы',
          nameEn: 'Temple of Literature',
          nameLocal: 'Văn Miếu – Quốc Tử Giám',
          description:
            'Пройдите через дворы старой академии к павильону Кхуэван и каменным стелам на черепахах. Зимой здесь прохладно, и даже пасмурный день подходит для знакомства с архитектурой.',
          tags: ['sight', 'temple-shrine'],
          timeEstimateHours: [1, 2],
          visitDuration: '1–2 ч',
          transport:
            'Такси 15–25 мин или пешком 25–40 мин из Старого квартала.',
          coords: { lat: 21.02743, lng: 105.8354 },
          pin: 'Главный вход Văn Miếu Môn с улицы Quốc Tử Giám.',
          sourceUrl: 'https://vanmieu.gov.vn/',
        },
        {
          slug: 'ha-long-bay',
          nameRu: 'Бухта Халонг',
          nameEn: 'Ha Long Bay and International Cruise Port',
          nameLocal: 'Vịnh Hạ Long · Cảng tàu khách Quốc tế Hạ Long',
          description:
            'С воды виден целый архипелаг известняковых башен. Для классического дневного маршрута можно выбрать рейс с пещерой Шынгшот и островом Титоп. В конце декабря и начале января бывает прохладно и туманно, дальние виды зависят от дня, купание лучше не закладывать.',
          tags: ['nature', 'day-trip', 'tickets-ahead'],
          timeEstimateHours: [4, 6],
          visitDuration: '4–6 ч на круиз, включая стоянки',
          transport:
            'Микроавтобус из Ханоя до порта в Байчае, примерно 2,5–3 ч.',
          coords: { lat: 20.95328, lng: 107.05571 },
          pin: 'Посадка в Cảng tàu khách Quốc tế Hạ Long, Байчай. Выбирайте круиз с отправлением именно из этого порта.',
          sourceUrl: 'https://halongport.vn/gioi-thieu/',
          googleMapsUrl:
            'https://www.google.com/maps/search/?api=1&query=C%E1%BA%A3ng+t%C3%A0u+kh%C3%A1ch+Qu%E1%BB%91c+t%E1%BA%BF+H%E1%BA%A1+Long%2C+B%C3%A3i+Ch%C3%A1y',
        },
      ],
    ),
    base(
      {
        id: 'ninh-binh',
        nameRu: 'Ниньбинь',
        nameEn: 'Ninh Binh',
        intro:
          'На лодки Чангана и подъём к Хангмуа заложите 2–3 ночи. Из Ханоя до Ниньбиня примерно 2–2,5 ч.',
      },
      [
        {
          slug: 'trang-an',
          nameRu: 'Лодки Чангана',
          nameEn: 'Trang An Boat Tour',
          nameLocal: 'Khu du lịch sinh thái Tràng An',
          description:
            'Лодочник проведёт вас по карстовым протокам, сквозь низкие пещеры и к храмам на берегу. Зимой скалы и маршрут остаются главным впечатлением, а на воде бывает зябко. Для пятерых рассчитывайте на две обычные лодки, если на месте действует лимит в четыре пассажира.',
          tags: ['nature', 'adventure'],
          timeEstimateHours: [2.5, 3.5],
          visitDuration: '2,5–3,5 ч, из них 2–3 ч на лодке с остановками',
          transport: 'Такси 15–25 мин из центра Ниньбиня до пристани.',
          coords: { lat: 20.25333, lng: 105.91884 },
          pin: 'Кассы и посадка Bến thuyền Tràng An.',
          sourceUrl:
            'https://www.vietnamtourism.com/en/trang-an-boat-tours-the-complete-guide-to-ninh-binh-s-karst-waterways',
        },
        {
          slug: 'hang-mua',
          nameRu: 'Смотровая Хангмуа',
          nameEn: 'Hang Mua Viewpoint',
          nameLocal: 'Hang Múa · Núi Ngọa Long',
          description:
            'С гребня видны петля реки Нго Донг и карстовые холмы Тамкока. Зимой поля часто пустые после сбора урожая, а дымка может скрыть дальние скалы. Совместите с Чанганом, если видимость в этот день хорошая.',
          tags: ['view', 'nature', 'walk'],
          timeEstimateHours: [1.5, 2.5],
          visitDuration: '1,5–2,5 ч с подъёмом и спуском',
          transport:
            'Такси 15–25 мин из Ниньбиня. От касс до гребня около 500 ступеней, на подъём 20–40 мин.',
          coords: { lat: 20.23091, lng: 105.93757 },
          pin: 'Кассы у Hang Múa Ecolodge, откуда начинается подъём.',
          sourceUrl:
            'https://vietnamwherestay.com/local-guide-to-hang-mua-cave-best-hike-viewpoint-in-ninh-binh/',
        },
      ],
    ),
    base(
      {
        id: 'sapa',
        nameRu: 'Сапа',
        nameEn: 'Sapa',
        intro:
          'На Фансипан и долину Мыонгхоа заложите 2–3 ночи. Из Ханоя до Сапы 5,5–6,5 ч на машине или автобусе в одну сторону.',
      },
      [
        {
          slug: 'fansipan',
          nameRu: 'Вершина Фансипан',
          nameEn: 'Fansipan Summit',
          nameLocal: 'Đỉnh Phan Xi Păng',
          description:
            'С вершины выше 3 100 м в ясные часы виден хребет Хоангльеншон. Зимой вершину часто закрывают облака, возможны сильный ветер и иней, поэтому подъём лучше оставить на окно с хорошей видимостью. Из Ханоя до Сапы 5,5–6,5 ч на машине или автобусе, и этот выезд имеет смысл на 2–3 ночи вместе с долиной.',
          tags: ['nature', 'view', 'adventure'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч на горе и площадках, дорога отдельно',
          transport:
            'Из Сапы 10–15 мин на такси до нижней станции, затем 15–20 мин на канатной дороге. Наверху короткий фуникулёр или около 600 ступеней. Всего 40–75 мин в одну сторону с переходами, без длинных очередей.',
          coords: { lat: 22.3033, lng: 103.775 },
          pin: 'Метка на вершине. Нижняя станция для такси называется Ga Hoàng Liên.',
          sourceUrl: 'https://mountfansipan.com/getting-there/',
        },
        {
          slug: 'muong-hoa-valley',
          nameRu: 'Террасы долины Мыонгхоа',
          nameEn: 'Muong Hoa Valley Rice Terraces',
          nameLocal: 'Thung lũng Mường Hoa · Lao Chải – Tả Van',
          description:
            'Здесь можно пройти между домами и террасированными склонами долины Мыонгхоа. В конце декабря и начале января рис уже убран, поля обычно бурые или с водой, а утром нередок туман. Сюда стоит ехать за рельефом и прогулкой по деревне, особенно если вершина Фансипана закрыта облаками.',
          tags: ['nature', 'walk', 'view'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч на прогулку по деревне и долине',
          transport:
            'Из Сапы 20–35 мин на такси по извилистой дороге к спуску в долину. На обратном пути можно заказать машину из Тавана.',
          coords: { lat: 22.32404, lng: 103.85132 },
          pin: 'Метка у северного склона долины, у места съёмки. Для прогулки попросите водителя высадить вас у начала маршрута Lao Chải – Tả Van.',
          sourceUrl:
            'https://www.vietnamairlines.com/us/en/plan-book/travel/travel-guide/sapa-winter',
        },
      ],
    ),
    base(
      {
        id: 'phong-nha',
        nameRu: 'Фонгня',
        nameEn: 'Phong Nha',
        intro:
          'Две ночи в деревне дают запас по погоде для поездки по подземной реке. От вокзала Донгхоя 45–60 мин на машине.',
      },
      [
        {
          slug: 'phong-nha-cave',
          nameRu: 'Пещера Фонгня',
          nameEn: 'Phong Nha Cave and Boat Wharf',
          nameLocal: 'Động Phong Nha · Bến thuyền Phong Nha',
          description:
            'Лодка идёт по реке Шон и заходит прямо в подземный зал, где видно сталактиты над водой. Зимой прохладно, после сильных дождей и при высоком уровне воды рейсы могут приостановить. От вокзала Донгхоя до базы около 45–60 мин на машине, ради подземной реки стоит оставить 2 ночи с запасом по погоде.',
          tags: ['nature', 'adventure'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч на весь выезд с лодкой и осмотром',
          transport:
            'Из деревни Фонгня пешком 5–20 мин до причала. Оттуда около 30 мин на лодке в одну сторону до устья пещеры.',
          coords: { lat: 17.61268, lng: 106.3062 },
          pin: 'Кассы и причал Bến thuyền Phong Nha у туристического центра в деревне.',
          sourceUrl:
            'https://govietnam.travel/destination/thuyen-phong-nha-wharf/',
        },
      ],
    ),
    base(
      {
        id: 'hue',
        nameRu: 'Хюэ',
        nameEn: 'Hue',
        intro:
          'На Императорский город и пагоду Тхьенму хватит 2–3 ночей. Из Хойана около 2 ч 40 мин – 3 ч 30 мин на машине.',
      },
      [
        {
          slug: 'hue-imperial-city',
          nameRu: 'Императорский город Хюэ',
          nameEn: 'Hue Imperial City and Meridian Gate',
          nameLocal: 'Đại Nội Huế · Ngọ Môn',
          description:
            'За воротами Нгомон находятся церемониальные залы, дворы и следы запретного города династии Нгуен. В это время года часто сыро и облачно, на часть маршрута под открытым небом пригодится дождевик.',
          tags: ['sight', 'castle', 'walk'],
          timeEstimateHours: [2.5, 4],
          visitDuration: '2,5–4 ч',
          transport:
            'Из центра Хюэ на такси 10–20 мин или 20–40 мин пешком через Ароматную реку.',
          coords: { lat: 16.46768, lng: 107.57918 },
          pin: 'Парадные ворота Ngọ Môn и входная зона у южной стены.',
          sourceUrl: 'https://whc.unesco.org/en/list/678/',
        },
        {
          slug: 'thien-mu-pagoda',
          nameRu: 'Пагода Тхьенму',
          nameEn: 'Thien Mu Pagoda',
          nameLocal: 'Chùa Thiên Mụ',
          description:
            'Семиярусная башня встречает у лестницы с видом на Ароматную реку. Зимой над водой возможна лёгкая дымка, а короткий визит удобно поставить до или после Императорского города.',
          tags: ['temple-shrine', 'sight'],
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport: 'Такси из центра Хюэ, 15–25 мин.',
          coords: { lat: 16.45315, lng: 107.54483 },
          pin: 'Семиярусная башня, вход со стороны Nguyễn Phúc Nguyên.',
          sourceUrl: 'https://whc.unesco.org/en/list/678/multipleelements/',
        },
      ],
    ),
    base(
      {
        id: 'hoi-an',
        nameRu: 'Хойан',
        nameEn: 'Hoi An',
        intro:
          'Остановитесь на 4–5 ночей рядом со старым кварталом, чтобы съездить в Мишон и Мраморные горы. Из аэропорта Дананга 45–60 мин на машине.',
      },
      [
        {
          slug: 'hoi-an-old-town',
          nameRu: 'Старый Хойан и Японский мост',
          nameEn: 'Hoi An Old Town and Japanese Covered Bridge',
          nameLocal: 'Phố cổ Hội An · Chùa Cầu',
          description:
            'Начните у крытого Японского моста, затем пройдите по старым торговым улицам и вернитесь к реке, когда зажгут фонари. В конце декабря и начале января возможны дожди и пасмурные вечера, поэтому удобно ночевать рядом с кварталом.',
          tags: ['sight', 'walk', 'nightlife'],
          timeEstimateHours: [2, 4],
          visitDuration: '2–4 ч',
          transport:
            'Пешком 5–20 мин из центра Хойана. Из аэропорта Дананга до базы около 45–60 мин на машине.',
          coords: { lat: 15.87707, lng: 108.32601 },
          pin: 'Японский мост Chùa Cầu на улице Trần Phú.',
          sourceUrl: 'https://whc.unesco.org/en/list/948/',
        },
        {
          slug: 'my-son',
          nameRu: 'Храмы Мишона',
          nameEn: 'My Son Sanctuary',
          nameLocal: 'Thánh địa Mỹ Sơn',
          description:
            'В лесной долине стоят кирпичные башни государства Чампа, прежде всего группы B, C и D. В конце декабря погода ещё может быть сырой, с мокрыми тропами. На сухое утро удобно поставить Мишон, оставив вторую половину дня для Хойана.',
          tags: ['sight', 'temple-shrine', 'morning'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч от кассы, включая шаттл',
          transport:
            'Машина или шаттл из Хойана, 60–80 мин до касс. Внутренний электрошаттл около 5–10 мин в каждую сторону, затем пешком.',
          coords: { lat: 15.77364, lng: 108.10923 },
          pin: 'Кассы у моста Khe Thẻ, откуда идут к внутреннему шаттлу.',
          sourceUrl: 'https://cityguide.vn/en/da-nang/places/thanh-dia-my-son',
        },
        {
          slug: 'huyen-khong-cave',
          nameRu: 'Пещера Хюенкхонг в Мраморных горах',
          nameEn: 'Huyen Khong Cave in the Marble Mountains',
          nameLocal: 'Động Huyền Không · Núi Thủy Sơn',
          description:
            'Свет падает через отверстия в своде на святилища в известняковой пещере. В пасмурный день лучи менее заметны, а после дождя каменные ступени скользкие.',
          tags: ['nature', 'temple-shrine', 'adventure'],
          timeEstimateHours: [1.5, 2.5],
          visitDuration: '1,5–2,5 ч',
          transport:
            'Такси из Хойана 25–40 мин до входа № 2. От входа есть лифт на часть подъёма, дальше лестницы пешком.',
          coords: { lat: 16.00357, lng: 108.26468 },
          pin: 'Вход № 2 на Тхюишон со стороны улицы Huyền Trân Công Chúa, у лифта.',
          sourceUrl: 'https://cityguide.vn/en/da-nang/places/ngu-hanh-son',
        },
      ],
    ),
    base(
      {
        id: 'ho-chi-minh',
        nameRu: 'Хошимин',
        nameEn: 'Ho Chi Minh City',
        intro:
          'Центральная часть района 1 — база на 2–3 ночи для Дворца Независимости и выезда в Тёлон.',
      },
      [
        {
          slug: 'independence-palace',
          nameRu: 'Дворец Независимости',
          nameEn: 'Independence Palace',
          nameLocal: 'Dinh Độc Lập',
          description:
            'Во дворце сохранились приёмные залы и подземный командный пункт, связанные с событиями апреля 1975 года. На новогодний период обычно приходится сухой сезон, открытый двор удобнее смотреть утром.',
          tags: ['sight', 'museum', 'morning'],
          timeEstimateHours: [1.5, 2.5],
          visitDuration: '1,5–2,5 ч',
          transport:
            'Пешком 10–25 мин или такси 5–15 мин из центральной части района 1.',
          coords: { lat: 10.77637, lng: 106.69749 },
          pin: 'Главный вход со стороны 135 Nam Kỳ Khởi Nghĩa.',
          sourceUrl: 'https://dinhdoclap.gov.vn/en/',
        },
        {
          slug: 'thien-hau-temple',
          nameRu: 'Храм Тхьенхау в Тёлоне',
          nameEn: 'Thien Hau Temple in Cho Lon',
          nameLocal: 'Chùa Bà Thiên Hậu · Chợ Lớn',
          description:
            'В кантонском храме морской богини стоит посмотреть керамические сцены на крыше и спирали благовоний, затем прогуляться по улицам Тёлона. В конце декабря и начале января обычно тепло и сухо, в полуденную жару часть визита проходит в тени.',
          tags: ['temple-shrine', 'walk'],
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport:
            'Такси из центральной части района 1, 25–45 мин в зависимости от трафика.',
          coords: { lat: 10.75291, lng: 106.66117 },
          pin: 'Вход с улицы Nguyễn Trãi, дом 710.',
          sourceUrl:
            'https://en.wikipedia.org/wiki/Thi%C3%AAn_H%E1%BA%ADu_Temple,_Ho_Chi_Minh_City',
        },
      ],
    ),
    base(
      {
        id: 'can-tho',
        nameRu: 'Кантхо',
        nameEn: 'Can Tho',
        intro:
          'Заложите 2 ночи в Кантхо и отправляйтесь на плавучий рынок с набережной рано утром. Из Хошимина 3–4 ч на машине.',
      },
      [
        {
          slug: 'cai-rang-floating-market',
          nameRu: 'Плавучий рынок Кайранг',
          nameEn: 'Cai Rang Floating Market and Ninh Kieu Wharf',
          nameLocal: 'Chợ nổi Cái Răng · Bến Ninh Kiều',
          description:
            'С воды видно, как торгуют фруктами с лодок, и можно позавтракать с плавучей кухни. В начале сухого сезона обычно удобно выходить рано, пока меньше жары. Фотография архивная, число торговых лодок меняется, поэтому лучше воспринимать рынок как часть утренней прогулки по дельте.',
          tags: ['morning', 'sight', 'shopping'],
          timeEstimateHours: [2, 3],
          visitDuration:
            '2–3 ч на весь выезд с лодкой, лучше отправляться около 6:00',
          transport:
            'Пешком 5–15 мин из центра Кантхо до причала, затем 30–45 мин на лодке до рынка.',
          coords: { lat: 10.03358, lng: 105.78847 },
          pin: 'Туристические лодки отправляются от Bến Ninh Kiều на набережной Hai Bà Trưng.',
          sourceUrl: 'https://canthotourism.vn/en/tourdetail/?tourid=2186',
        },
        {
          slug: 'binh-thuy-ancient-house',
          nameRu: 'Старинный дом Биньтхюи',
          nameEn: 'Binh Thuy Ancient House',
          nameLocal: 'Nhà cổ Bình Thủy',
          description:
            'Семейный дом рода Зыонг объединяет французский фасад и традиционный южновьетнамский интерьер. Тёплое сухое утро подходит для двора, а после ранней лодки на Кайранг сюда удобно заехать по дороге к обеду.',
          tags: ['sight'],
          timeEstimateHours: [0.75, 1],
          visitDuration: '45–60 мин',
          transport: 'Такси от набережной Кантхо, 15–25 мин.',
          coords: { lat: 10.06702, lng: 105.74959 },
          pin: 'Вход по адресу 144 Bùi Hữu Nghĩa.',
          sourceUrl: 'https://canthotourism.vn/en/detailtravelplace/?id=535',
          googleMapsUrl: 'https://goo.gl/maps/LotqVzcjmg1sWkN4A',
        },
      ],
    ),
    base(
      {
        id: 'phu-quoc',
        nameRu: 'Фукуок',
        nameEn: 'Phu Quoc',
        intro:
          'Зыонгдонг (Dương Đông) — база на 5–7 ночей у западного берега. Отсюда удобно съездить на Хонтхом и встретить закат у Лонг-Бич или Зинькау.',
      },
      [
        {
          slug: 'long-beach',
          nameRu: 'Лонг-Бич, западный берег Фукуока',
          nameEn: 'Long Beach on Phu Quoc',
          nameLocal: 'Bãi Trường',
          description:
            'Песчаный берег на западе острова подходит для отдыха и закатов. В конце декабря и начале января на Фукуоке обычно тепло и сухо, западный берег часто спокойный для купания, ориентируйтесь на волну и флаги на месте.',
          tags: ['beach', 'relax', 'sunset'],
          timeEstimateHours: [2, 4],
          visitDuration: '2–4 ч или до заката',
          transport:
            'Такси 10–20 мин из центра Зыонгдонга до северного участка пляжа. Пешком 5–15 мин из ближайших отелей.',
          coords: { lat: 10.19495, lng: 103.96364 },
          pin: 'Северный участок пляжа у съезда с Trần Hưng Đạo в сторону Phương Bình House.',
          sourceUrl:
            'https://www.vietnamtourism.com/en/long-beach-phu-quoc-the-complete-guide-to-bai-truong',
        },
        {
          slug: 'dinh-cau',
          nameRu: 'Храм Зинькау на мысе',
          nameEn: 'Dinh Cau Temple and Lighthouse',
          nameLocal: 'Dinh Cậu',
          description:
            'Небольшое святилище рыбаков и маяк стоят на скале у устья реки Зыонгдонг. В сухой сезон сюда удобно выйти к закату перед ужином рядом с ночным рынком. Это короткая городская прогулка с видом на порт.',
          tags: ['temple-shrine', 'view', 'sunset'],
          timeEstimateHours: [0.5, 1],
          visitDuration: '30–60 мин',
          transport:
            'Пешком 5–15 мин из центра Зыонгдонга или такси 10–20 мин от северного Лонг-Бич.',
          coords: { lat: 10.2172, lng: 103.9564 },
          pin: 'Лестница к святыне у окончания улицы Bạch Đằng, метка на мысе.',
          sourceUrl:
            'https://thayungkhiem.vn/en/van-dao/places/dinh-cau-phu-quoc',
        },
        {
          slug: 'hon-thom-cable-car',
          nameRu: 'Остров Хонтхом по канатной дороге',
          nameEn: 'Hon Thom Island and Cable Car',
          nameLocal: 'Hòn Thơm · Ga Ánh Dương',
          description:
            'Кабина проходит над рыбацкой гаванью и островами архипелага Антхой, а на Хонтхоме можно провести несколько часов в аквапарке Aquatopia. Это оборудованный курортный остров, и главная причина выезда — виды с канатной дороги. В сухой сезон видимость обычно лучше, в сильный ветер возможны паузы, а на праздники — очереди.',
          tags: ['view', 'adventure'],
          timeEstimateHours: [3, 5],
          visitDuration: '3–5 ч на острове',
          transport:
            'Машина 40–55 мин до станции в Антхое, затем около 15 мин в кабине. Всего 55–70 мин в одну сторону плюс очередь.',
          coords: { lat: 10.02704, lng: 104.00724 },
          pin: 'Посадка на станции Ga Ánh Dương в Sunset Town на юге Фукуока.',
          sourceUrl: 'https://phuquoc.world/en/guides/original-hon-thom/',
        },
      ],
    ),
  ],
};
