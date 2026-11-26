import type { Country, GuideCity, GuidePlace } from './model';

type LaosPlace = Omit<GuidePlace, 'city' | 'mapsQuery' | 'sections'> & {
  pin: string;
};

const base = (
  details: Pick<GuideCity, 'id' | 'nameRu' | 'nameEn' | 'intro'>,
  places: LaosPlace[],
): GuideCity => ({
  ...details,
  cover: '',
  nights: 0,
  stay: [],
  tips: [],
  sections: [],
  places: places.map(({ pin, ...place }) => ({
    ...place,
    city: details.id,
    mapsQuery: place.nameEn,
    sections: [{ id: 'map-pin', title: 'Ориентир', body: pin }],
  })),
});

export const laos: Country = {
  id: 'laos',
  nameRu: 'Лаос',
  nameEn: 'Laos',
  intro:
    'Храмы Луангпхабанга, карстовые горы Вангвьенга, подземная река Конглора и острова Меконга. Десять районов для поездки в декабре и январе.',
  cover: 'atlas/laos.jpg',
  sections: [
    {
      id: 'route',
      title: 'Как собрать поездку в декабре и январе',
      body: `На 8–10 дней соберите маршрут через Луангпхабанг, Вангвьенг и Вьентьян. В Луангпхабанге оставьте 3–4 ночи на старый город и отдельные выезды к Пак-У и Куанг-Си. В Вангвьенге хватит 2–3 ночей на пещеру и выезд к Нам-Сай и Голубой лагуне. Во Вьентьяне разделите два дня между городскими храмами, COPE и Парком Будды.

В карточках время в дороге указано в одну сторону. Время на месте вынесено отдельно. Диапазоны зависят от остановок, состояния дорог и уровня воды. На праздничные даты оставьте запас на переезды.`,
    },
    {
      id: 'north',
      title: 'Север · Нонгкхиау и Пхонсаван',
      body: 'К северному маршруту можно добавить 1–2 ночи в Нонгкхиау, чтобы выбрать ясное утро для подъёма. Пхонсаван — отдельный выезд с ночёвкой и длинным горным переездом из Луангпхабанга. На плато по утрам прохладно и ветрено.',
    },
    {
      id: 'central',
      title: 'Кхаммуан · пещеры из двух баз',
      body: 'Из Тхакхэка удобно съездить в Тхам Па Фа. Дорога до Конглора занимает несколько часов, поэтому для лодки по подземной реке лучше заночевать в деревне у западного входа. Доступность лодочного маршрута зависит от уровня воды.',
    },
    {
      id: 'south',
      title: 'Юг · Болавен, Ват-Пху и острова',
      body: `Отведите 2–3 ночи на Паксе. Съездите на Болавен к Тад-Фан, а Тямпасак и подъём к Ват-Пху оставьте на другое утро. Золотого Будду у Паксе удобно посмотреть перед закатом.

На Си-Фан-Дон добавьте 2–3 ночи. До моста между Дон-Детом и Дон-Кхоном добираются по островам. Пороги Кхон-Пхапхенг смотрят с материка, поэтому их удобно добавить до лодки из Накасанга или после возвращения.`,
    },
    {
      id: 'season',
      title: 'Сухой сезон',
      body: `Декабрь и январь подходят для пеших маршрутов. На севере по утрам бывает прохладно и туманно. На водопадах поток обычно слабее, чем в дождливые месяцы, а в открытых чашах вода прохладная. На Меконге в это время чаще видны каменные гряды у порогов.
Tourism Laos · погода и занятия по сезонам — https://www.tourismlaos.org/2022/12/23/laos-is-open-and-simply-beautiful-in-any-season%EF%BF%BC/`,
    },
    {
      id: 'cover-credit',
      title: 'Обложка · водопад Куанг-Си',
      body: `Водопад Куанг-Си. © Justin Vidamo - 2012. Кадрирование 3:2.
Лицензия CC BY 2.0 — https://creativecommons.org/licenses/by/2.0
Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Kuang_Si_Falls,_Laos.jpg`,
    },
  ],
  cities: [
    base(
      {
        id: 'nong-khiaw',
        nameRu: 'Нонгкхиау',
        nameEn: 'Nong Khiaw',
        intro:
          'Горы над рекой Нам-У. Останьтесь на ночь, чтобы выбрать ясное утро для подъёма на Пха Дэнг.',
      },
      [
        {
          slug: 'phadeng-peak',
          nameRu: 'Вершина Пха Дэнг',
          nameEn: 'Phadeng Peak Viewpoint',
          description:
            'С вершины видно, как Нам-У огибает Нонгкхиау между рядами известняковых гор. На рассвете из тумана иногда выступают только вершины.',
          tags: ['nature', 'view', 'adventure'],
          coords: { lat: 20.570587, lng: 102.625439 },
          timeEstimateHours: [20 / 60, 40 / 60],
          visitDuration: '20–40 мин на вершине',
          transport:
            'Из Луангпхабанга до Нонгкхиау ориентировочно 3–4 ч на машине или минивэне. От моста 5–10 мин пешком до кассы и ещё 1–1,5 ч вверх по тропе.',
          bestTime:
            'В декабре и январе утром возможен туман. Для вида на долину дождитесь, пока он рассеется.',
          note: 'Крутая лесная тропа с набором около 460 м. На спуск заложите ещё 45–60 мин.',
          pin: 'Верхняя площадка у лаосского флага над изгибом Нам-У.',
          links: [
            {
              label: 'Tourism Laos',
              url: 'https://www.tourismlaos.org/2023/08/16/hiking-camping-at-the-best-viewpoint-in-laos-pha-daeng-peak/',
            },
            {
              label: 'Тропа и набор высоты',
              url: 'https://www.easia-travel.com/agent-hub/product_activity/38617/',
            },
            {
              label: 'Дорога в Нонгкхиау',
              url: 'https://laosexplore.com/destinations/nong-khiaw/',
            },
            {
              label: 'Координаты вершины',
              url: 'https://www.openstreetmap.org/node/4059892472',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'luang-prabang',
        nameRu: 'Луангпхабанг',
        nameEn: 'Luang Prabang',
        intro:
          'В старом городе — храм Сиенг Тхонг и холм Пхуси. Для пещеры Пак-У и водопада Куанг-Си выделите отдельные полудни.',
      },
      [
        {
          slug: 'pak-ou-tham-ting',
          nameRu: 'Нижняя пещера Пак-У (Тхам-Тинг)',
          nameEn: 'Pak Ou Caves – Tham Ting (Lower Cave)',
          description:
            'В открытом гроте над Меконгом стоят ряды фигурок Будды, оставленных паломниками. С террасы видно устье Нам-У.',
          tags: ['nature', 'temple-shrine', 'day-trip'],
          coords: { lat: 20.04931, lng: 102.21077 },
          timeEstimateHours: [0.5, 0.75],
          visitDuration: '30–45 мин в нижней пещере и у причала',
          transport:
            'От речной пристани Луангпхабанга примерно 1,5–2 ч вверх по Меконгу без экскурсионных остановок. От причала к гроту ведёт короткая лестница.',
          bestTime:
            'Зимой утром в открытой лодке прохладно. Время в пути зависит от течения и остановок.',
          pin: 'Вход в нижнюю пещеру Тхам-Тинг сразу над лодочной пристанью.',
          links: [
            {
              label: 'Турофис Луангпхабанга',
              url: 'https://tourismluangprabang.org/things-to-do/nature/pak-ou-cave-tham-ting/',
            },
            {
              label: 'Время на реке',
              url: 'https://luangprabang.com/destinations/pak-ou-caves/',
            },
            {
              label: 'Вход в нижнюю пещеру',
              url: 'https://grottomap.org/en/entrance/8m5fZkEQ/ting',
            },
            {
              label: 'Нижний вход в OpenStreetMap',
              url: 'https://www.openstreetmap.org/node/247853616',
            },
          ],
        },
        {
          slug: 'wat-xieng-thong',
          nameRu: 'Храм Ват Сиенг Тхонг',
          nameEn: 'Wat Xieng Thong',
          description:
            'Крыша главного зала спускается ярусами почти до земли. Обойдите храм, чтобы увидеть на задней стене мозаику «Дерево жизни».',
          tags: ['sight', 'temple-shrine', 'walk'],
          coords: { lat: 19.8975, lng: 102.14306 },
          timeEstimateHours: [0.75, 1],
          visitDuration: '45–60 мин',
          transport:
            'От Королевского дворца в старом городе примерно 12–20 мин пешком.',
          bestTime:
            'В декабре и январе храм удобно включить в пешую прогулку по полуострову. Учитывайте местные церемонии.',
          note: 'Подход по улице Саккалин почти ровный. От набережной придётся подняться по лестнице.',
          pin: 'Главный зал в храмовом комплексе на конце полуострова.',
          links: [
            {
              label: 'Турофис Луангпхабанга',
              url: 'https://tourismluangprabang.org/things-to-do/buddhism/wat-xiengthong/',
            },
            {
              label: 'Подход и координаты',
              url: 'https://thayungkhiem.vn/en/van-dao/places/chua-wat-xieng-thong',
            },
          ],
        },
        {
          slug: 'mount-phousi',
          nameRu: 'Холм Пхуси',
          nameEn: 'Mount Phousi – That Chomsi',
          description:
            'От золотой ступы Тхат Чомси видны крыши старого города, Меконг и горы за водой. Спуститься можно по другой стороне холма к реке Нам-Кхан.',
          tags: ['sight', 'view', 'sunset'],
          coords: { lat: 19.89032, lng: 102.13706 },
          timeEstimateHours: [20 / 60, 40 / 60],
          visitDuration: '20–40 мин наверху',
          transport:
            'От входа напротив Королевского дворца ориентировочно 15–25 мин пешком до вершины.',
          bestTime:
            'Около Нового года к закату места у ограждения быстро занимают. На рассвете возможна дымка.',
          note: 'Со стороны Королевского дворца до ступы 328 ступеней.',
          pin: 'Ступа Тхат Чомси на вершине холма.',
          links: [
            {
              label: 'Турофис Луангпхабанга',
              url: 'https://tourismluangprabang.org/things-to-do/nature/phou-si-mountain/',
            },
            {
              label: 'Ступа на вершине',
              url: 'https://www.openstreetmap.org/way/374819322',
            },
          ],
        },
        {
          slug: 'kuang-si-waterfall',
          nameRu: 'Водопад Куанг-Си',
          nameEn: 'Kuang Si Waterfall',
          description:
            'Тропа вдоль бирюзовых известняковых чаш выводит к высокому каскаду. Главный поток хорошо видно с мостика, а в некоторых нижних чашах можно купаться.',
          tags: ['nature', 'walk', 'day-trip'],
          coords: { lat: 19.7488, lng: 101.99133 },
          timeEstimateHours: [1.5, 3],
          visitDuration: '1,5–3 ч на каскад, чаши и прогулку',
          transport:
            'Из Луангпхабанга около 45–70 мин на машине или минивэне до парковки. Дальше короткий электрошаттл или пеший подход к тропе, затем примерно 15–25 мин до каскада.',
          bestTime:
            'В декабре и январе поток обычно слабее, чем в сезон дождей, а чаши часто прозрачнее. Вода прохладная.',
          note: 'Дорога к парку извилистая. Главный каскад виден с мостика у конца нижней тропы.',
          pin: 'Главный каскад у мостика в конце нижней тропы.',
          links: [
            {
              label: 'Турофис Луангпхабанга',
              url: 'https://tourismluangprabang.org/things-to-do/nature/kuang-si-waterfall/',
            },
            {
              label: 'Дорога и пеший участок',
              url: 'https://www.savethemekong.org/en/stops/luang-prabang/kuang-si-falls',
            },
            {
              label: 'Координаты главного каскада',
              url: 'https://www.openstreetmap.org/node/325960544',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'phonsavan',
        nameRu: 'Пхонсаван',
        nameEn: 'Phonsavan',
        intro:
          'За каменными кувшинами стоит ехать на плато Сиангкхуанг. Первый участок находится недалеко от города.',
      },
      [
        {
          slug: 'plain-of-jars-site-1',
          nameRu: 'Долина кувшинов — участок № 1',
          nameEn: 'Plain of Jars Site 1 (Thong Hai Hin)',
          description:
            'По травянистым холмам разбросаны высеченные из камня сосуды. У первой группы кувшинов видны военные воронки. Археологи связывают сосуды с погребальными обрядами.',
          tags: ['sight', 'walk'],
          coords: { lat: 19.43154, lng: 103.15394 },
          timeEstimateHours: [1, 2],
          visitDuration: '1–2 ч на участок № 1',
          transport:
            'Из Пхонсавана примерно 15–25 мин на машине или тук-туке до визит-центра. Дальше около 10–15 мин пешком либо местный шаттл и короткий пеший участок.',
          bestTime:
            'В декабре и январе на открытом плато прохладно и ветрено, особенно утром.',
          note: 'Из Луангпхабанга до Пхонсавана около 6–8 ч по горной дороге. На участке держитесь размеченных дорожек из-за неразорвавшихся боеприпасов.',
          pin: 'Первая группа каменных кувшинов на участке № 1.',
          links: [
            {
              label: 'Карты объекта ЮНЕСКО',
              url: 'https://whc.unesco.org/en/list/1587/maps',
            },
            {
              label: 'Метка первой группы',
              url: 'https://www.openstreetmap.org/node/6183490834',
            },
            {
              label: 'Дорога и посещение',
              url: 'https://www.travelfish.org/sight_profile/laos/northern_laos/xieng_khuang/phonsavan/234',
            },
            {
              label: 'Как добраться до Пхонсавана',
              url: 'https://en.wikivoyage.org/wiki/Phonsavan',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'vang-vieng',
        nameRu: 'Вангвьенг',
        nameEn: 'Vang Vieng',
        intro:
          'Карстовые пики по обе стороны Нам-Сонг. Смотровую Нам-Сай удобно совместить с купанием в Голубой лагуне, а Тхам-Чанг оставить на отдельное утро.',
      },
      [
        {
          slug: 'nam-xay-viewpoint',
          nameRu: 'Смотровая Нам-Сай',
          nameEn: 'Nam Xay Viewpoint',
          description:
            'С каменистой вершины открывается вид на карстовые пики западнее Вангвьенга, поля и деревни внизу.',
          tags: ['nature', 'view', 'adventure'],
          coords: { lat: 18.923681, lng: 102.386783 },
          timeEstimateHours: [20 / 60, 40 / 60],
          visitDuration: '20–40 мин наверху',
          transport:
            'Из Вангвьенга ориентировочно 15–25 мин на тук-туке или машине до кассы и 25–45 мин вверх пешком.',
          bestTime:
            'Зимняя дымка иногда закрывает дальние пики. В декабре и январе рис на многих полях уже убран.',
          note: 'Верхний участок крутой, с камнями и корнями. На спуск заложите ещё 25–40 мин.',
          pin: 'Верхняя смотровая площадка на Нам-Сай.',
          links: [
            {
              label: 'Тропа и время подъёма',
              url: 'https://matthieuandsebastien.com/en/recommendations/nam-xay-viewpoint/',
            },
            {
              label: 'Смотровая на карте',
              url: 'https://www.openstreetmap.org/node/11127497437',
            },
          ],
        },
        {
          slug: 'blue-lagoon-1',
          nameRu: 'Голубая лагуна № 1',
          nameEn: 'Blue Lagoon 1',
          description:
            'Голубовато-зелёная вода течёт вдоль тенистых берегов у подножия горы. Здесь удобно искупаться после подъёма на Нам-Сай.',
          tags: ['nature', 'relax'],
          coords: { lat: 18.926695, lng: 102.395634 },
          timeEstimateHours: [0.75, 1.5],
          visitDuration: '45–90 мин у воды',
          transport:
            'Из Вангвьенга около 20–30 мин на машине или тук-туке, от парковки ещё 2–5 мин пешком.',
          bestTime:
            'В декабре и январе вода прохладная. В праздники у лагуны тише утром.',
          note: 'На западном берегу встречаются неровные участки дороги. От парковки к воде ведёт короткий ровный подход.',
          pin: 'Лагуна № 1 у подножия горы западнее Вангвьенга.',
          links: [
            {
              label: 'Дорога из Вангвьенга',
              url: 'https://laosexplore.com/destinations/vang-vieng/',
            },
            {
              label: 'Лагуна на карте',
              url: 'https://www.openstreetmap.org/node/1530714712',
            },
            {
              label: 'Посещение',
              url: 'https://riderchris.com/blue-lagoon-in-vang-vieng/',
            },
          ],
        },
        {
          slug: 'tham-chang-cave',
          nameRu: 'Пещера Тхам-Чанг',
          nameEn: 'Tham Chang Cave (Tham Jang)',
          description:
            'В освещённых залах видны сталактиты и известняковые натёки. С площадки у входа открывается вид на долину.',
          tags: ['nature', 'adventure', 'view'],
          coords: { lat: 18.909317, lng: 102.44211 },
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport:
            'Из центра Вангвьенга около 10–15 мин на тук-туке либо 25–40 мин пешком до зоны входа. Ещё 10–15 мин занимает подход по территории и лестнице.',
          bestTime:
            'В сухой сезон подход обычно удобнее. Внутри круглый год прохладно и влажно.',
          note: 'К входу на скале ведёт примерно 150 ступеней. Внутри местами скользко.',
          pin: 'Вход в Тхам-Чанг в верхней части лестницы.',
          links: [
            {
              label: 'Пещеры и подход',
              url: 'https://laosexplore.com/destinations/vang-vieng/',
            },
            {
              label: 'Вход на карте',
              url: 'https://www.openstreetmap.org/node/653284512',
            },
            {
              label: 'Турофис Лаоса · подход к пещере',
              url: 'https://www.tourismlaos.org/central-provinces/vientiane-province/',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'vientiane',
        nameRu: 'Вьентьян',
        nameEn: 'Vientiane',
        intro:
          'Ступа Пха Тхат Луанг, храм Сисакет и музей COPE в городе. На Парк Будды выделите полдня с дорогой.',
      },
      [
        {
          slug: 'pha-that-luang',
          nameRu: 'Золотая ступа Пха Тхат Луанг',
          nameEn: 'Pha That Luang',
          description:
            'Золотая ступа Пха Тхат Луанг возвышается над открытой площадью. Обойдите её, чтобы рассмотреть ярусы и ряды малых шпилей.',
          tags: ['sight', 'temple-shrine'],
          coords: { lat: 17.976169, lng: 102.63425 },
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport:
            'Из центра Вьентьяна ориентировочно 10–20 мин на такси или тук-туке, затем 3–8 мин пешком через площадь.',
          bestTime:
            'В декабре и январе открытую площадь удобнее обходить в первой половине дня.',
          pin: 'Главная ступа в центре комплекса Пха Тхат Луанг.',
          links: [
            {
              label: 'Турофис Лаоса · золотая ступа',
              url: 'https://www.tourismlaos.org/central-provinces/vientiane-capital/',
            },
            {
              label: 'Описание и координаты',
              url: 'https://en.wikipedia.org/wiki/Pha_That_Luang',
            },
            {
              label: 'Что посмотреть во Вьентьяне',
              url: 'https://en.wikivoyage.org/wiki/Vientiane',
            },
            {
              label: 'Координаты ступы',
              url: 'https://www.wikidata.org/wiki/Q1059720',
            },
          ],
        },
        {
          slug: 'wat-sisaket',
          nameRu: 'Храм Ват Сисакет',
          nameEn: 'Wat Sisaket',
          description:
            'В крытой галерее вокруг храма крошечные фигуры Будды сидят в нишах над рядами больших статуй. Во дворе хорошо видна пятиъярусная крыша святилища.',
          tags: ['sight', 'temple-shrine'],
          coords: { lat: 17.96315, lng: 102.61151 },
          timeEstimateHours: [0.75, 1],
          visitDuration: '45–60 мин',
          transport:
            'От рынка Талат Сао примерно 5–10 мин пешком до перекрёстка улицы Сеттхатхират и проспекта Лансанг.',
          bestTime: 'В декабре и январе удобно прийти утром, пока двор в тени.',
          note: 'Подход проходит через оживлённый перекрёсток. Во дворе ровно, у святилища невысокие ступени.',
          pin: 'Храмовый двор с галереей у перекрёстка Сеттхатхират и Лансанг.',
          links: [
            {
              label: 'Турофис Лаоса · храм Сисакет',
              url: 'https://www.tourismlaos.org/central-provinces/vientiane-capital/',
            },
            {
              label: 'Храм и расположение',
              url: 'https://laosnow.org/en/places/wat-si-saket',
            },
            {
              label: 'Подход от рынка',
              url: 'https://thayungkhiem.vn/en/van-dao/places/chua-wat-si-saket',
            },
          ],
        },
        {
          slug: 'cope-visitor-centre',
          nameRu: 'Музей центра COPE',
          nameEn: 'COPE Visitor Centre',
          description:
            'В экспозиции висят старые протезы, а истории их владельцев знакомят с последствиями бомбардировок Лаоса и работой центра реабилитации.',
          tags: ['museum', 'sight'],
          coords: { lat: 17.95795, lng: 102.62032 },
          timeEstimateHours: [1, 1.5],
          visitDuration: '1–1,5 ч',
          transport:
            'От Ват Сисакет примерно 20–30 мин пешком или 5–15 мин на тук-туке до ворот центра на улице Кхувиенг. До музея ещё несколько минут по территории.',
          bestTime:
            'Экспозиция в помещении. Её удобно оставить на жаркий полдень или дождливый час.',
          note: 'После ворот поверните направо у крытого стадиона. Музей в белом здании с надписью COPE Visitor Centre.',
          pin: 'Белое здание музея на территории центра реабилитации.',
          links: [
            {
              label: 'Экспозиция и схема входа от COPE',
              url: 'https://copelaos.org/visit-us/',
            },
            {
              label: 'Здание на карте',
              url: 'https://mapcarta.com/W202507944',
            },
          ],
        },
        {
          slug: 'buddha-park',
          nameRu: 'Парк Будды Сиенгкуан',
          nameEn: 'Buddha Park (Wat Xieng Khuan)',
          description:
            'Между деревьями стоят лежащий Будда, фигуры божеств и бетонная «тыква» с входом через раскрытую пасть. Внутри лестница соединяет три яруса и выводит на крышу над садом.',
          tags: ['sight', 'walk', 'view'],
          coords: { lat: 17.91229, lng: 102.765397 },
          timeEstimateHours: [1, 1.5],
          visitDuration: '1–1,5 ч',
          transport:
            'От автостанции Талат Сао во Вьентьяне автобусом № 14 примерно 45–60 мин до остановки у парка. Затор у моста может удлинить поездку.',
          bestTime:
            'В сухой сезон открытые дорожки быстро прогреваются. Для прогулки удобнее утро.',
          note: 'Лестница внутри «тыквы» крутая и тесная. По саду можно гулять без подъёма.',
          pin: 'Сад скульптур Сиенгкуан у дороги Тхадэуа.',
          links: [
            {
              label: 'Скульптуры и посещение',
              url: 'https://www.travelfish.org/sight_profile/laos/vientiane_and_surrounds/vientiane/vientiane/556',
            },
            {
              label: 'Автобус и подъезд',
              url: 'https://buddhaparkvientiane.com/en/how-to-get-there/',
            },
            {
              label: 'Парк на карте',
              url: 'https://en.wikipedia.org/wiki/Buddha_Park',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'khammouane',
        nameRu: 'Кхаммуан',
        nameEn: 'Khammouane',
        intro:
          'Тхам Па Фа рядом с Тхакхэком. Ради лодочной поездки через Конглор стоит переночевать у западного входа.',
      },
      [
        {
          slug: 'kong-lor-cave',
          nameRu: 'Пещера Конглор — западный вход',
          nameEn: 'Kong Lor Cave',
          description:
            'Лодка из деревни Конглор проходит по подземной реке до долины на другой стороне горы. По пути можно выйти у подсвеченных сталактитов.',
          tags: ['nature', 'adventure', 'day-trip'],
          coords: { lat: 17.95609, lng: 104.76161 },
          timeEstimateHours: [2.5, 3],
          visitDuration: '2,5–3 ч на экскурсию с лодкой туда и обратно',
          transport:
            'Из Тхакхэка через Бан-Нахин около 3,5–4,5 ч машиной до деревни Конглор. От парковки до западного входа ещё примерно 5–15 мин пешком.',
          bestTime:
            'В январе вода обычно ниже. После сильных дождей уточните, ходят ли лодки.',
          note: 'Трасса № 8 извилистая. При низкой воде лодочник может попросить выйти на мокрые камни. На воде нужен спасательный жилет.',
          pin: 'Западный вход в пещеру со стороны деревни Конглор.',
          links: [
            {
              label: 'Подъезд от Тхакхэка',
              url: 'https://laoparks.la/wp-content/uploads/2025/09/Phou-Hin-Poun-Prospectus-English-2025.09.03-final.pdf',
            },
            {
              label: 'Продолжительность экскурсии',
              url: 'https://www.showcaves.com/english/la/showcaves/Konglor.html',
            },
            {
              label: 'Западный вход на карте',
              url: 'https://mapcarta.com/N6150289914',
            },
            {
              label: 'Западный вход в OpenStreetMap',
              url: 'https://www.openstreetmap.org/node/6150289914',
            },
            {
              label: 'Турофис Кхаммуана · лодочная экскурсия',
              url: 'https://www.khammouanetourism.org/en/places/Kong-lor-cave',
            },
          ],
        },
        {
          slug: 'tham-pa-fa',
          nameRu: 'Пещера Будды Тхам Па Фа',
          nameEn: 'Buddha Cave (Tham Pa Fa)',
          description:
            'В верхней камере над водой находится небольшое святилище. В 2004 году здесь нашли 229 статуй Будды. К камере ведут мостки и ступени вдоль скалы.',
          tags: ['nature', 'temple-shrine', 'sight'],
          coords: { lat: 17.47658, lng: 104.851984 },
          timeEstimateHours: [0.75, 1],
          visitDuration: '45–60 мин',
          transport:
            'Из Тхакхэка ориентировочно 20–40 мин на машине по трассе № 12 и боковой дороге, от парковки 5–15 мин пешком.',
          bestTime:
            'В сухом декабре и январе подъездная дорога бывает пыльной.',
          note: 'После съезда с шоссе дорога неровная. В святилище нужно подняться по ступеням. В зале со статуями фотографировать нельзя.',
          pin: 'Метка отмечает район святилища. Вход на OpenStreetMap примерно в 50 м к западу.',
          links: [
            {
              label: 'Турофис Кхаммуана · святилище и подъезд',
              url: 'https://www.khammouanetourism.org/en/places/Tham-pha-Buddha-cave',
            },
            {
              label: 'История находки',
              url: 'https://www.tourismlaos.org/caves/',
            },
            {
              label: 'Подъезд и точка на карте',
              url: 'https://en.wikivoyage.org/wiki/Thakhek',
            },
            {
              label: 'Время в дороге',
              url: 'https://laosexplore.com/destinations/thakhek/',
            },
            {
              label: 'Два уровня пещеры',
              url: 'https://www.showcaves.com/english/la/showcaves/PaFa.html',
            },
            {
              label: 'Вход в пещеру в OpenStreetMap',
              url: 'https://www.openstreetmap.org/node/640497458',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'bolaven-plateau',
        nameRu: 'Плато Болавен',
        nameEn: 'Bolaven Plateau',
        intro:
          'Плато с лесными каньонами и кофейными плантациями. К смотровой над каскадами Тад-Фан проще всего выехать из Паксе.',
      },
      [
        {
          slug: 'tad-fane',
          nameRu: 'Тад-Фан — два водопада',
          nameEn: 'Tad Fane Waterfall, Tad Fane Resort',
          description:
            'Из леса на противоположной стороне ущелья падают две струи высотой около 120 м. С площадки у Tad Fane Resort видны оба потока.',
          tags: ['nature', 'view', 'day-trip'],
          coords: { lat: 15.18245, lng: 106.12701 },
          timeEstimateHours: [0.5, 1],
          visitDuration: '30–60 мин',
          transport:
            'Из Паксе по дороге в Паксонг примерно 40–70 мин на машине. От парковки до смотровой ещё 5–10 мин пешком через территорию отеля.',
          bestTime:
            'В декабре и январе воды обычно меньше, чем после муссона. В туман оба потока могут скрыться.',
          note: 'С шоссе нужно свернуть по указателю. К площадке ведёт короткая лестница вниз.',
          pin: 'Смотровая на стороне курорта напротив двух каскадов.',
          links: [
            {
              label: 'Дорога из Паксе',
              url: 'https://www.tourismlaos.org/champasak-double-tap-tad-fane-waterfalls-reopen-in-southern-laos/',
            },
            {
              label: 'Вид и сезон',
              url: 'https://meridiela.com/laos/tad-fane-waterfall/',
            },
            {
              label: 'Смотровая на карте',
              url: 'https://www.openstreetmap.org/node/653299798',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'champasak',
        nameRu: 'Тямпасак',
        nameEn: 'Champasak',
        intro:
          'Берег Меконга и кхмерский комплекс Ват-Пху. Утром здесь удобнее идти от водоёмов к верхнему святилищу.',
      },
      [
        {
          slug: 'vat-phou',
          nameRu: 'Ват-Пху — верхнее святилище',
          nameEn: 'Vat Phou, Main Sanctuary',
          description:
            'Кхмерские террасы поднимаются от водоёмов к святилищу у скалы. Наверху видны резные каменные порталы, а с террасы — аллея и водоёмы внизу.',
          tags: ['sight', 'temple-shrine', 'walk'],
          coords: { lat: 14.84866, lng: 105.81446 },
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч на весь комплекс с подъёмом',
          transport:
            'Из Тямпасака до входа примерно 15–25 мин на машине или тук-туке, около 10 км. На территории до верхней террасы 20–40 мин в одну сторону, этот участок входит во время осмотра. Нижнюю часть можно сократить электрокаром, если он ходит.',
          bestTime:
            'В декабре и январе стоит приехать утром, пока открытая аллея внизу прохладная.',
          note: 'Верхний лестничный марш крутой, с неровными каменными ступенями.',
          pin: 'Главное святилище на верхней террасе под скалой.',
          links: [
            {
              label: 'План комплекса и подъезд',
              url: 'https://tourismchampasak.com/vat_phou',
            },
            {
              label: 'Описание ЮНЕСКО',
              url: 'https://whc.unesco.org/en/list/481/',
            },
            {
              label: 'Верхнее святилище на карте',
              url: 'https://www.openstreetmap.org/way/197958335',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'pakse',
        nameRu: 'Паксе',
        nameEn: 'Pakse',
        intro:
          'База для поездок на Болавен и в Тямпасак. В самом Паксе оставьте вечер на вид с террасы Ват Пху Салао.',
      },
      [
        {
          slug: 'wat-phou-salao',
          nameRu: 'Золотой Будда над Паксе',
          nameEn: 'Wat Phou Salao, Pakse Golden Buddha',
          description:
            'Золотой Будда на террасе обращён к Паксе. За статуей видно мост через Меконг и город на другом берегу.',
          tags: ['view', 'temple-shrine', 'sunset'],
          coords: { lat: 15.09536, lng: 105.81187 },
          timeEstimateHours: [0.5, 1],
          visitDuration: '30–60 мин',
          transport:
            'Из центра Паксе около 20–35 мин на машине через Лаосско-японский мост до верхней парковки. Оттуда 3–7 мин пешком.',
          bestTime:
            'В декабре и январе удобно приехать ближе к закату, когда на террасе прохладнее.',
          note: 'После моста начинается крутая извилистая дорога. У водителя тук-тука уточните, довезёт ли он до верхней парковки.',
          pin: 'Статуя золотого Будды над Паксе.',
          links: [
            {
              label: 'Подъезд к парковке и вид',
              url: 'https://megaworldasia.com/wp-content/uploads/2024/07/4000-islands.pdf',
            },
            {
              label: 'Храм над Паксе',
              url: 'https://www.tourismlaos.org/2022/12/28/cnn-lists-pakse-as-one-of-asias-most-underrated-places/',
            },
            {
              label: 'Статуя на карте',
              url: 'https://www.openstreetmap.org/node/12179170746',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'si-phan-don',
        nameRu: 'Си-Фан-Дон',
        nameEn: 'Si Phan Don',
        intro:
          'Меконг расходится на протоки вокруг островов. За старым мостом отправляйтесь на Дон-Дет и Дон-Кхон, за видом на Кхон-Пхапхенг — на материковый берег.',
      },
      [
        {
          slug: 'don-det-don-khon-bridge',
          nameRu: 'Старый мост Дон-Дет — Дон-Кхон',
          nameEn: 'Old French Bridge, Don Det–Don Khon',
          description:
            'Старый железнодорожный мост соединяет Дон-Дет и Дон-Кхон. По этой ветке грузы везли в обход порогов Меконга. За мостом со стороны Дон-Кхона сохранился паровоз.',
          tags: ['sight', 'walk'],
          coords: { lat: 13.96352, lng: 105.92083 },
          timeEstimateHours: [0.5, 1],
          visitDuration: '30–60 мин на мост и паровоз',
          transport:
            'От северной пристани Дон-Дета около 3 км до моста, примерно 15–25 мин на велосипеде или 40–55 мин пешком. Из материкового Накасанга на Дон-Дет ещё 15–30 мин лодкой без учёта ожидания.',
          bestTime:
            'В сухой сезон по острову удобнее ехать на велосипеде. После дождя грунтовые участки бывают грязными.',
          note: 'От пристани до моста путь ровный. При выезде с материка заложите время на ожидание лодки.',
          pin: 'Пролёт старого железнодорожного моста между островами.',
          links: [
            {
              label: 'Турофис Лаоса · железная дорога Дон-Кхона',
              url: 'https://www.tourismlaos.org/2023/08/28/4000-islands-in-southern-lao-pdr/',
            },
            {
              label: 'Железная дорога и расстояния',
              url: 'https://www.roughguides.com/laos/far-south/don-khon-don-det/',
            },
            {
              label: 'Лодки и велосипеды',
              url: 'https://www.travelfish.org/transport/laos/southern_laos/champasak/don_dhet/all',
            },
            {
              label: 'Мост на карте',
              url: 'https://www.openstreetmap.org/way/36778212',
            },
          ],
        },
        {
          slug: 'khone-phapheng-falls',
          nameRu: 'Кхон-Пхапхенг — пороги Меконга',
          nameEn: 'Khone Phapheng Falls',
          description:
            'С южной смотровой видно, как потоки Меконга расходятся между скальными грядами и перекатываются через длинный уступ.',
          tags: ['nature', 'view', 'day-trip'],
          coords: { lat: 13.95834, lng: 105.98733 },
          timeEstimateHours: [1, 1.5],
          visitDuration: '1–1,5 ч на дорожки и смотровые',
          transport:
            'Из материкового Накасанга примерно 20–30 мин на машине или тук-туке до входа, около 13 км. Дальше 10–20 мин пешком до смотровой.',
          bestTime:
            'В декабре и январе вода обычно ниже и видны отдельные каменные гряды. В половодье часть уступов скрывается.',
          note: 'С Дон-Дета сначала вернитесь лодкой в Накасанг. Подъезд к смотровой проходит по материку.',
          pin: 'Южная смотровая Кхон-Пхапхенг на материковом берегу.',
          links: [
            {
              label: 'Подъезд из Накасанга',
              url: 'https://www.lonelyplanet.com/points-of-interest/khon-phapheng-falls/1115111',
            },
            {
              label: 'Сезон и уровень Меконга',
              url: 'https://www.visitsoutheastasia.travel/activity/marvel-at-khone-phapheng-waterfalls/',
            },
            {
              label: 'Смотровая на карте',
              url: 'https://www.openstreetmap.org/node/1364451493',
            },
            {
              label: 'Турофис Лаоса · подъезд к порогам',
              url: 'https://www.tourismlaos.org/southern-provinces/champasak-province/',
            },
          ],
        },
      ],
    ),
  ],
};
