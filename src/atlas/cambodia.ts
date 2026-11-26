import type { Country, GuideCity, GuidePlace } from './model';

type CambodiaPlace = Omit<GuidePlace, 'city' | 'sections'> & {
  pin: string;
};

const base = (
  details: Pick<GuideCity, 'id' | 'nameRu' | 'nameEn' | 'intro'>,
  places: CambodiaPlace[],
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
    sections: [
      {
        id: 'map-pin',
        title: 'Ориентир',
        body: `${place.mapsQuery}. ${pin}`,
      },
    ],
  })),
});

export const cambodia: Country = {
  id: 'cambodia',
  nameRu: 'Камбоджа',
  nameEn: 'Cambodia',
  intro:
    'Храмы Ангкора, деревни на Тонлесапе, дельфины Меконга и южное побережье. Семь баз для поездки на одну или две недели.',
  cover: 'atlas/cambodia-angkor-wat.jpg',
  sections: [
    {
      id: 'route',
      title: '3–4 полных дня в Сиемреапе',
      body: `День 1 — Ангкор-Ват, Байон и Та-Пром. День 2 — Бантей-Срей и Пре-Руп. День 3 — Национальный музей Ангкора и Кампонгплук на Тонлесапе. На четвёртый день — водопад Пномкулен или отдых. Дни прилёта и отъезда считайте отдельно.

Для группы из пяти человек удобно взять минивэн или два тук-тука. В карточках время в дороге указано в одну сторону от базы. Осмотр, ожидание и переезды между базами считайте отдельно.`,
    },
    {
      id: 'one-week',
      title: 'Если есть неделя',
      body: 'Добавьте две ночи в Баттамбанге ради рынка Псар-Нат, старого города и вылета летучих мышей у Пномсампо либо две ночи в Пномпене ради Королевского дворца и музея Туолсленг. Из Сиемреапа до Пномпеня закладывайте 5,5–7 ч.',
    },
    {
      id: 'ten-to-fourteen-days',
      title: 'Если есть 10–14 дней',
      body: 'К Сиемреапу и Пномпеню добавьте Кампот с выездами в Кеп или 2–3 ночи в бухте Сарасен. Из Пномпеня до Кампота около 3–4 ч. Для природы Меконга выделите две ночи в Кратьэхе на лодку к дельфинам в Кампи и велопрогулку по острову Кохтронг.',
    },
    {
      id: 'angkor-pass',
      title: 'Билеты в Ангкор',
      body: `Angkor Pass действует в Ангкор-Вате, Байоне, Та-Проме, Пре-Рупе и Бантей-Срее. Для двух дней в храмах подходит трёхдневный билет за 62 USD. Три дня посещения можно выбрать в течение семи дней. У водопада Пномкулен и Национального музея Ангкора отдельные билеты. Тариф и срок действия проверены 26.11.2026.

Angkor Enterprise · билеты — https://www.angkorenterprise.gov.kh/en/available-tickets
Angkor Enterprise · вопросы о пропуске — https://www.angkorenterprise.gov.kh/en/faqs`,
    },
    {
      id: 'season-and-airport',
      title: 'Сезон и аэропорт Сиемреапа',
      body: `Сухой сезон длится с ноября по апрель. В декабре и январе обычно прохладнее, а на побережье высокий сезон. На острове согласуйте причал прибытия с жильём.

Для Сиемреапа ищите перелёты в международный аэропорт SAI. Из аэропорта есть шаттл до 7 Makara Road. На поездку до центра заложите около часа по оценке исходника от 26.11.2026. Сезон и шаттл проверены 26.11.2026.

Министерство туризма Камбоджи · климат — https://mail.tourismcambodia.org/public/blog/about-cambodia/cambodia-fact-sheet
Аэропорт SAI · трансфер — https://english.sai-airport.com/jcjtjb/38836.jhtml`,
    },
    {
      id: 'transfers',
      title: 'Переезды между базами',
      body: `У Giant Ibis в пути около 6 ч между Сиемреапом и Пномпенем, 4 ч из Пномпеня в Кампот и 3 ч из Сиемреапа в Баттамбанг через Сисопхон. Направление Сиануквиль — Кохронгсамлоем подтверждает GTVC. Маршруты операторов проверены 26.11.2026.

Диапазоны в карточках и сценариях — ориентиры исходника от 26.11.2026. Учитывайте пробки, остановки, уровень воды и расписание. Для бухты Сарасен уточните у перевозчика причал и оставьте запас перед обратным рейсом.

Giant Ibis · Пномпень и Сиемреап — https://online.giantibis.com/routes/phnom-penh-to-siem-reap
Giant Ibis · Пномпень — Кампот — https://online.giantibis.com/routes/phnom-penh-to-kampot
Giant Ibis · Сиемреап — Баттамбанг — https://online.giantibis.com/routes/siem-reap-to-battambang
GTVC · Сиануквиль — Кохронгсамлоем — https://www.gtvcspeedboatcambodia.com/en/transport/Sihanoukville/Koh%20Rong%20Sanloem`,
    },
    {
      id: 'thailand-border',
      title: 'Граница с Таиландом',
      body: `На 26.11.2026 сухопутные переходы с Таиландом закрыты по опубликованным рекомендациям. Великобритания предостерегает от необязательных поездок в пределах 20 км от границы. Австралия рекомендует избегать поездок в пределах 50 км в указанных провинциях, в том числе Баттамбанге и Бантеймеанчее.

Перед выездом в Баттамбанг уточните трассу автобуса или машины через Сисопхон. Часть маршрутов проходит ближе 50 км к границе. При сомнениях выберите Пномпень. Из-за этих рекомендаций исходный маршрут обходит приграничный храм Прэахвихеа.

Великобритания · рекомендации для Камбоджи — https://www.gov.uk/foreign-travel-advice/cambodia/warnings-and-insurance
Австралия · рекомендации для Камбоджи — https://www.smartraveller.gov.au/destinations/asia/cambodia`,
    },
    {
      id: 'cover-credit',
      title: 'Обложка · Ангкор-Ват',
      body: `Фото Ангкор-Вата с северного пруда — Gisling. Кадрирование 3:2.
Лицензия CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/
Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Angkor_Wat_from_north_pond.JPG`,
    },
  ],
  cities: [
    base(
      {
        id: 'siem-reap',
        nameRu: 'Сиемреап и Ангкор',
        nameEn: 'Siem Reap and Angkor',
        intro:
          'Три полных дня на храмы, музей и деревню на Тонлесапе. На водопад Пномкулен оставьте четвёртый день.',
      },
      [
        {
          slug: 'angkor-wat',
          nameRu: 'Ангкор-Ват',
          nameEn: 'Angkor Wat',
          description:
            'Пять башен отражаются в прудах у западного подхода. Внутри обойдите галереи с барельефами и найдите сцену «Пахтание Молочного океана».',
          tags: ['sight', 'temple-shrine'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч',
          transport:
            'Из центра Сиемреапа 15–25 мин на тук-туке или минивэне.',
          coords: { lat: 13.4125, lng: 103.867 },
          mapsQuery: 'Angkor Wat',
          pin: 'Метка на главном храме. Обычный подход проходит с запада через ров.',
          note: 'День 1 вместе с Байоном и Та-Промом. На рассвете у прудов многолюдно. Доступ на верхний ярус зависит от очереди и религиозного календаря.',
          links: [
            {
              label: 'APSARA · Ангкор-Ват',
              url: 'https://apsaraauthority.gov.kh/2021/06/14/angkor-wat/',
            },
            {
              label: 'Карта храма',
              url: 'https://angkorwat-guide.com/plan-your-visit/angkor-wat-map/',
            },
          ],
        },
        {
          slug: 'bayon',
          nameRu: 'Байон',
          nameEn: 'Bayon Temple',
          description:
            'С башен над храмом смотрят огромные каменные лица. В нижних галереях ищите высеченные сцены повседневной жизни и сражений.',
          tags: ['sight', 'temple-shrine'],
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport: 'Из Сиемреапа 25–35 мин на тук-туке или минивэне.',
          coords: { lat: 13.4413, lng: 103.8588 },
          mapsQuery: 'Bayon Temple',
          pin: 'Храм в центре Ангкор-Тхома.',
          note: 'День 1 вместе с Ангкор-Ватом и Та-Промом. В исходнике от 26.11.2026 отмечены возможные ограничения на верхних террасах из-за реставрации. Уточните доступ на входе.',
          links: [
            {
              label: 'История Байона',
              url: 'https://en.wikipedia.org/wiki/Bayon',
            },
            {
              label: 'APSARA · реставрация в Ангкор-Тхоме',
              url: 'https://apsaraauthority.gov.kh/2026/06/04/restoration-sites-in-the-former-capital-angkor-thom/',
            },
            {
              label: 'Дорога из Сиемреапа',
              url: 'https://gosiemreaplocals.com/guides/visiting-angkor-wat-from-siem-reap/',
            },
          ],
        },
        {
          slug: 'ta-prohm',
          nameRu: 'Та-Пром',
          nameEn: 'Ta Prohm Temple',
          description:
            'Корни больших деревьев оплетают стены и дверные проёмы монастыря. Пройдите по размеченному маршруту через дворы, где лес сросся с постройками.',
          tags: ['sight', 'temple-shrine', 'walk'],
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport:
            'Из Сиемреапа 25–35 мин на тук-туке или минивэне. Согласуйте с водителем, у какого выхода встретиться.',
          coords: { lat: 13.4348, lng: 103.8892 },
          mapsQuery: 'Ta Prohm Temple',
          pin: 'Метка на храме. Есть западный и восточный подходы.',
          note: 'День 1 вместе с Ангкор-Ватом и Байоном. У самых известных деревьев возможна очередь на фото.',
          links: [
            {
              label: 'История Та-Прома',
              url: 'https://en.wikipedia.org/wiki/Ta_Prohm',
            },
            {
              label: 'Дорога из Сиемреапа',
              url: 'https://gosiemreaplocals.com/guides/visiting-angkor-wat-from-siem-reap/',
            },
          ],
        },
        {
          slug: 'pre-rup',
          nameRu: 'Пре-Руп',
          nameEn: 'Pre Rup Temple',
          description:
            'С открытой ступенчатой храмовой горы видно пять святилищ и зелёную равнину. В низком свете кирпич и латерит становятся ярче.',
          tags: ['sight', 'temple-shrine', 'view'],
          timeEstimateHours: [35 / 60, 1],
          visitDuration: '35–60 мин',
          transport:
            'Из Сиемреапа 30–40 мин на тук-туке или минивэне. В храме крутые каменные ступени.',
          coords: { lat: 13.434983, lng: 103.920603 },
          mapsQuery: 'Pre Rup Temple',
          pin: 'Ступенчатая храмовая гора к востоку от Ангкор-Тхома.',
          note: 'День 2 по дороге обратно из Бантей-Срея. Оставьте запас до закрытия.',
          links: [
            {
              label: 'APSARA · Пре-Руп',
              url: 'https://apsaraauthority.gov.kh/2021/08/12/pre-rup-temple/',
            },
            {
              label: 'История Пре-Рупа',
              url: 'https://en.wikipedia.org/wiki/Pre_Rup',
            },
            {
              label: 'Храмы Ангкора',
              url: 'https://travelguidestip.com/best-temples-in-angkor/',
            },
          ],
        },
        {
          slug: 'banteay-srei',
          nameRu: 'Бантей-Срей',
          nameEn: 'Banteay Srei Temple',
          description:
            'Подойдите к фронтонам компактного храма из розового песчаника. Тонкая резьба и мифологические сцены читаются даже с прогулочной дорожки.',
          tags: ['sight', 'temple-shrine', 'day-trip'],
          timeEstimateHours: [0.75, 1.25],
          visitDuration: '45–75 мин',
          transport:
            'Из Сиемреапа 45–60 мин. Минивэн занимает около 45–50 мин, тук-тук — около часа.',
          coords: { lat: 13.5989, lng: 103.9628 },
          mapsQuery: 'Banteay Srei Temple',
          pin: 'Компактный храм к северо-востоку от Сиемреапа.',
          note: 'День 2 вместе с Пре-Рупом. Начните с Бантей-Срея, пока у резных порталов меньше людей.',
          links: [
            {
              label: 'APSARA · Бантей-Срей',
              url: 'https://apsaraauthority.gov.kh/2021/08/04/banteay-srei/',
            },
            {
              label: 'История Бантей-Срея',
              url: 'https://en.wikipedia.org/wiki/Banteay_Srei',
            },
            {
              label: 'Angkor Tourism · выезды из Сиемреапа',
              url: 'https://www.angkortourism.org/day-trips-from-siem-reap/',
            },
          ],
        },
        {
          slug: 'phnom-kulen-waterfall',
          nameRu: 'Водопад Пномкулен',
          nameEn: 'Phnom Kulen Waterfall',
          description:
            'Спуститесь по лестнице к каскадам, чтобы увидеть поток в лесной чаше. По дороге можно остановиться у резьбы в русле реки и лежащего Будды.',
          tags: ['nature', 'day-trip', 'walk'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч',
          transport:
            'Из Сиемреапа 1 ч 30 мин — 2 ч на минивэне или машине с водителем. Для подъёма и спуска по горной дороге сверяйте график, выезжайте утром.',
          coords: { lat: 13.569114, lng: 104.108317 },
          mapsQuery: 'Phnom Kulen Waterfall',
          pin: 'Метка у каскадов, к нижней чаше ведёт лестница.',
          note: 'Выделите день. В декабре и начале января вода обычно ещё есть, но поток слабее, чем после дождей. Для парка нужен отдельный билет.',
          links: [
            {
              label: 'Маршрут по Пномкулену',
              url: 'https://themapcambodia.com/en/journal/phnom-kulen-day-trip',
            },
            {
              label: 'Angkor Tourism · Пномкулен',
              url: 'https://www.angkortourism.org/phnom-kulen/',
            },
            {
              label: 'Полевое исследование с координатами',
              url: 'https://pisum.icgbio.ru/kosterin/pdf/kosterin_2020_butterflies.pdf',
            },
            {
              label: 'Visit Cambodia · водопад',
              url: 'https://visitcambodia.info/places/kulen-waterfall/',
            },
          ],
        },
        {
          slug: 'kampong-phluk',
          nameRu: 'Кампонгплук на Тонлесапе',
          nameEn: 'Kampong Phluk Floating Village',
          description:
            'С моторной лодки видно жилые дома на высоких сваях и рыбацкие лодки. При подходящем уровне воды можно выйти на Тонлесап и пересесть в маленькую лодку для прогулки по затопленному лесу.',
          tags: ['sight', 'nature', 'day-trip'],
          timeEstimateHours: [1.5, 2.5],
          visitDuration: '1,5–2,5 ч на воде',
          transport:
            'Из Сиемреапа 45–60 мин до лодок на минивэне или тук-туке, затем местная моторная лодка. После кассы нужно проехать дальше к посадке.',
          coords: { lat: 13.28779, lng: 103.996591 },
          mapsQuery: 'Kampong Phluk Floating Village · Ticket Office',
          pin: 'Касса лодочных экскурсий на подъездной дороге. Точка посадки смещается вместе с уровнем воды.',
          note: 'В конце декабря и начале января вода обычно убывает, и сваи лучше видны. Сроки прогулок по лесу различаются по источникам. В день поездки отдельно уточните выход в озеро и проход в лес.',
          links: [
            {
              label: 'Hello Angkor · деревня',
              url: 'https://helloangkor.com/attractions/kompong-phluk/',
            },
            {
              label: 'Кампонгплук · планирование визита',
              url: 'https://kampongphluk.org/plan-your-visit/',
            },
            {
              label: 'Siem Reap Shuttle · поездка к лодкам',
              url: 'https://www.siemreapshuttle.com/how-late-can-you-leave-for-beng-mealea-and-kampong-phluk/',
            },
            {
              label: 'Angkor Tourism · декабрь и январь',
              url: 'https://www.angkortourism.org/siem-reap-december-january/',
            },
            {
              label: 'Касса в OpenStreetMap',
              url: 'https://www.openstreetmap.org/node/569030600',
            },
          ],
        },
        {
          slug: 'angkor-national-museum',
          nameRu: 'Национальный музей Ангкора',
          nameEn: 'Angkor National Museum',
          description:
            'Кхмерские статуи, надписи и модели храмов. Галерея будд и залы об Ангкор-Вате и Ангкор-Тхоме помогают разобраться в деталях перед поездкой к руинам.',
          tags: ['museum', 'sight'],
          timeEstimateHours: [1.5, 2],
          visitDuration: '1,5–2 ч',
          transport:
            'Из центра Сиемреапа 5–10 мин на тук-туке или 20–30 мин пешком от Старого рынка.',
          coords: { lat: 13.36639, lng: 103.85952 },
          mapsQuery: 'Angkor National Museum',
          pin: 'Здание музея на бульваре Шарля де Голля.',
          note: 'У музея свой билет. Совместите с Кампонгплуком или зайдите в день раннего прилёта.',
          links: [
            {
              label: 'Национальный музей Ангкора',
              url: 'https://angkornationalmuseum.com/',
            },
            {
              label: 'Музей · адрес и контакты',
              url: 'https://angkornationalmuseum.com/contact-us/',
            },
            {
              label: 'Здание на карте',
              url: 'https://mapcarta.com/W322700733',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'battambang',
        nameRu: 'Баттамбанг',
        nameEn: 'Battambang',
        intro:
          'Две ночи на старые торговые улицы, набережную Сангкера и выезд к Пномсампо на закате.',
      },
      [
        {
          slug: 'psar-nat-market',
          nameRu: 'Рынок Псар-Нат',
          nameEn: 'Phsar Nath Market',
          description:
            'Рынок с башней сохранил французскую архитектуру. Зайдите за завтраком, потом пройдитесь по торговым улицам старого города и вдоль Сангкера.',
          tags: ['sight', 'food', 'walk'],
          timeEstimateHours: [0.75, 1.5],
          visitDuration: '45–90 мин',
          transport:
            'Из центра Баттамбанга 5–15 мин пешком или короткая поездка на тук-туке.',
          coords: { lat: 13.10198, lng: 103.1991 },
          mapsQuery: 'Phsar Nath Market · Battambang',
          pin: 'Здание рынка с башней в старом городе.',
          note: 'Совместите с пещерой летучих мышей Пномсампо и ночёвкой. Из Сиемреапа 3–4 ч на автобусе или машине по оценке исходника от 26.11.2026. При выборе трансфера уточните трассу через Сисопхон и сверьте рекомендации о поездках у тайской границы.',
          links: [
            {
              label: 'Hello Angkor · рынок',
              url: 'https://helloangkor.com/attractions/phsar-nath-market/',
            },
            {
              label: 'Giant Ibis · расписание',
              url: 'https://online.giantibis.com/schedule',
            },
            {
              label: 'Cambodia Experiences · трансферы',
              url: 'https://cambodiaexperiences.com/transfers',
            },
            {
              label: 'Здание рынка на карте',
              url: 'https://mapcarta.com/W48681402',
            },
            {
              label: 'Asia Vela · Баттамбанг',
              url: 'https://asiavela.com/en/cambodia/battambang/',
            },
          ],
        },
        {
          slug: 'phnom-sampov-bat-cave',
          nameRu: 'Пещера летучих мышей Пномсампо',
          nameEn: 'Phnom Sampov Bat Cave',
          description:
            'В сумерках из отверстия скалы вылетает длинная лента летучих мышей. Приезжайте заранее. Если есть время, поднимитесь на холм до вылета.',
          tags: ['nature', 'wildlife', 'sunset'],
          timeEstimateHours: [1, 1.5],
          visitDuration: '1–1,5 ч у пещеры',
          transport: 'Из Баттамбанга 25–40 мин на минивэне или тук-туке.',
          coords: { lat: 13.026907, lng: 103.100101 },
          mapsQuery: 'Battambang Bat Cave · Phnom Sampov',
          pin: 'Площадка у дороги под скалой, откуда виден выход пещеры.',
          note: 'Время вылета зависит от сумерек и поведения колонии. На прогулку по холму добавьте 1–1,5 ч. Удобно совместить с рынком Псар-Нат.',
          links: [
            {
              label: 'Visit Cambodia · Пномсампо',
              url: 'https://visitcambodia.info/places/phnom-sampeau/',
            },
            {
              label: 'Lonely Planet · Пномсампо',
              url: 'https://www.lonelyplanet.com/points-of-interest/phnom-sampeau/499500',
            },
            {
              label: 'Wikimedia Commons · вылет летучих мышей',
              url: 'https://commons.wikimedia.org/wiki/File:02-Wrinkle-lipped_Bats_Phnom_Sampeau_nX-07328.jpg',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'kampong-thom',
        nameRu: 'Кампонгтхом',
        nameEn: 'Kampong Thom',
        intro:
          'Остановка между Сиемреапом и Пномпенем ради доангкорских храмов Самбор-Прей-Кука.',
      },
      [
        {
          slug: 'sambor-prei-kuk',
          nameRu: 'Самбор-Прей-Кук · храм львов',
          nameEn: 'Sambor Prei Kuk · Prasat Tao',
          description:
            'В лесу стоят кирпичные башни доангкорского города. У лестницы Прасат-Тао — каменные львы, в соседних группах — восьмиугольные святилища и резные изображения дворцов.',
          tags: ['sight', 'temple-shrine', 'walk'],
          timeEstimateHours: [1.5, 2.5],
          visitDuration: '1,5–2,5 ч по комплексу',
          transport:
            'Из Стынгсаена в Кампонгтхоме 35–50 мин на машине или тук-туке. Между группами храмов идут лесные тропы.',
          coords: { lat: 12.867633, lng: 105.038361 },
          mapsQuery: 'Prasat Tao · Sambor Prei Kuk',
          pin: 'Центральное святилище Прасат-Тао.',
          note: 'Оставьте полдня на остановку между Сиемреапом и Пномпенем. Из Сиемреапа можно выделить отдельный день на раннюю кхмерскую архитектуру.',
          links: [
            {
              label: 'Туристическое ведомство Кампонгтхома',
              url: 'https://kampongthom.tourism.gov.kh/attractions/sambor-prei-kuk',
            },
            {
              label: 'ЮНЕСКО · объект Всемирного наследия',
              url: 'https://whc.unesco.org/en/list/1532/',
            },
            {
              label: 'ЮНЕСКО · документы объекта',
              url: 'https://whc.unesco.org/document/155674',
            },
            {
              label: 'Hello Angkor · Прасат-Тао',
              url: 'https://helloangkor.com/attractions/tao-pr/',
            },
            {
              label: 'Святилище на карте',
              url: 'https://mapcarta.com/W391561298',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'phnom-penh',
        nameRu: 'Пномпень',
        nameEn: 'Phnom Penh',
        intro:
          'Две ночи на столицу, набережную, Королевский дворец и музей Туолсленг.',
      },
      [
        {
          slug: 'royal-palace',
          nameRu: 'Королевский дворец',
          nameEn: 'Royal Palace of Cambodia',
          description:
            'Со двора видна золотая крыша Тронного зала. Рядом — Серебряная пагода и детали более поздней кхмерской архитектуры.',
          tags: ['sight', 'castle', 'walk'],
          timeEstimateHours: [1.5, 2],
          visitDuration: '1,5–2 ч',
          transport:
            'От центральной набережной Пномпеня 5–15 мин пешком или на тук-туке.',
          coords: { lat: 11.56365, lng: 104.93081 },
          mapsQuery: 'Royal Palace · Phnom Penh',
          pin: 'Метка на Тронном зале. Вход для посетителей со стороны бульвара Сотеарос по указателям.',
          note: 'Удобнее приехать утром. Доступ и время входа могут меняться из-за церемоний. Уточнение проверено 26.11.2026.',
          links: [
            {
              label: 'Cambodia Tourism Board · Королевский дворец',
              url: 'https://tourismcambodia.org/provinces/search/detail/127/royal-palace-1548301051',
            },
            {
              label: 'История Королевского дворца',
              url: 'https://en.wikipedia.org/wiki/Royal_Palace_of_Cambodia',
            },
            {
              label: 'Lonely Planet · Королевский дворец',
              url: 'https://www.lonelyplanet.com/points-of-interest/royal-palace/436451',
            },
          ],
        },
        {
          slug: 'tuol-sleng',
          nameRu: 'Музей Туолсленг',
          nameEn: 'Tuol Sleng Genocide Museum',
          description:
            'В бывшей школе, превращённой в тюрьму S‑21, сохранились дворы и корпуса. Документы, фотографии и аудиогид объясняют, как работала система репрессий красных кхмеров.',
          tags: ['museum', 'sight'],
          timeEstimateHours: [1.5, 2.5],
          visitDuration: '1,5–2,5 ч',
          transport: 'От набережной Пномпеня 10–25 мин на тук-туке.',
          coords: { lat: 11.549342, lng: 104.917658 },
          mapsQuery: 'Tuol Sleng Genocide Museum',
          pin: 'Вход у пересечения улиц 113 и 350.',
          note: 'Эмоционально тяжёлое посещение. Если в тот же день идёте в Королевский дворец, оставьте время на обед или прогулку между ними.',
          links: [
            {
              label: 'Туолсленг · о музее',
              url: 'https://tuolsleng.gov.kh/en/museum/',
            },
            {
              label: 'Туолсленг · постоянная экспозиция',
              url: 'https://tuolsleng.gov.kh/en/exhibition/permanent/',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'kratie',
        nameRu: 'Кратьэх',
        nameEn: 'Kratie',
        intro:
          'Две ночи на Меконге для лодки в Кампи и велосипедной прогулки по острову Кохтронг.',
      },
      [
        {
          slug: 'kampi-dolphins',
          nameRu: 'Дельфины Меконга в Кампи',
          nameEn: 'Mekong Dolphins at Kampi',
          description:
            'С местной лодки ищите иравадийских дельфинов, которые всплывают в широкой заводи Меконга.',
          tags: ['nature', 'wildlife', 'day-trip'],
          timeEstimateHours: [0.75, 1.5],
          visitDuration: '45–90 мин на воде',
          transport:
            'Из Кратьэха 25–35 мин на тук-туке или машине, затем местная лодка.',
          coords: { lat: 12.606057, lng: 106.022677 },
          mapsQuery: 'Mekong Dolphin Pleasance · Kampi',
          pin: 'Касса и спуск к лодкам. Место наблюдения выбирает лодочник.',
          note: 'Встречу с дельфинами предсказать нельзя. Из Пномпеня до Кратьэха 5–6 ч по оценке исходника от 26.11.2026. Удобно остаться на две ночи и съездить на Кохтронг.',
          links: [
            {
              label: 'Hello Angkor · дельфины Меконга',
              url: 'https://helloangkor.com/attractions/kratie-mekong-river-dolphins/',
            },
            {
              label: 'Visit Cambodia · заводь Кампи',
              url: 'https://visitcambodia.info/places/kampi-dolphin-pool/',
            },
            {
              label: 'Soriyabori · как добраться до Кратьэха',
              url: 'https://www.soriyabori.com/en/how-to-get-there/',
            },
            {
              label: 'Полевой отчёт с координатами спуска',
              url: 'https://www.mammalwatching.com/wp-content/uploads/2024/07/Bird_Mammal_tripreport_Laos_Cambodia_2024_02.pdf',
            },
          ],
        },
        {
          slug: 'koh-trong',
          nameRu: 'Остров Кохтронг',
          nameEn: 'Koh Trong Island',
          description:
            'Возьмите велосипед и проедьте среди деревень и садов помело. У переправы виден Кратьэх, а при низкой воде на Меконге появляются песчаные отмели.',
          tags: ['nature', 'walk', 'adventure'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч',
          transport:
            'Из Кратьэха 5–15 мин пешком или на тук-туке до причала, затем 5–10 мин на пароме. Время последней лодки уточните утром.',
          coords: { lat: 12.49396, lng: 106.01528 },
          mapsQuery: 'Ferry to Koh Trong · Kratie',
          pin: 'Отправление с берега Кратьэха. На острове ищите Koh Trong Ferry у центра общины CBET. Место высадки зависит от уровня воды.',
          note: 'Совместите с лодкой в Кампи. В сухой сезон от высадки до дорожки иногда нужно идти по песку.',
          links: [
            {
              label: 'Причал Кратьэха на карте',
              url: 'https://mapcarta.com/N678469505',
            },
            {
              label: 'Причал Кохтронга на карте',
              url: 'https://mapcarta.com/N2598300077',
            },
            {
              label: 'Soriyabori · дорога и переправа',
              url: 'https://www.soriyabori.com/en/how-to-get-there/',
            },
            {
              label: 'Visit Cambodia · Кохтронг',
              url: 'https://visitcambodia.info/places/koh-trong-island/',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'kampot-kep',
        nameRu: 'Кампот и Кеп',
        nameEn: 'Kampot and Kep',
        intro:
          'Из Кампота удобно съездить на перечную ферму, плато Бокор и в Кеп. В Кепе совместите лесную тропу и обед у моря.',
      },
      [
        {
          slug: 'la-plantation',
          nameRu: 'Перечная ферма La Plantation',
          nameEn: 'La Plantation Pepper Farm',
          description:
            'Пройдите между рядами перечных лиан и попробуйте несколько видов кампотского перца. На дегустации можно сравнить вкус в зависимости от зрелости и обработки.',
          tags: ['food', 'sight', 'tickets-ahead'],
          timeEstimateHours: [1, 2],
          visitDuration: '1–2 ч',
          transport:
            'Из Кампота 35–50 мин на минивэне или тук-туке. На последних километрах возможны пыль и неровности.',
          coords: { lat: 10.61106, lng: 104.31656 },
          mapsQuery: 'La Plantation · Kampot',
          pin: 'Ферма и начало экскурсии.',
          note: 'С ноября по март ферма просит бронировать время экскурсии заранее. Проверено 26.11.2026. Можно совместить с Крабовым рынком Кепа, оставив время на сельские дороги.',
          links: [
            {
              label: 'La Plantation · визит на ферму',
              url: 'https://laplantation.com/en/visit-us/our-farm-kampot/',
            },
            {
              label: 'The Map Cambodia · La Plantation',
              url: 'https://themapcambodia.com/en/kampot/la-plantation',
            },
          ],
        },
        {
          slug: 'bokor-old-church',
          nameRu: 'Старая церковь на Бокоре',
          nameEn: 'Old Catholic Church on Mount Bokor',
          description:
            'Каменная церковь напоминает о французской горной станции. С плато в ясную погоду видно побережье. Иногда облака стелются прямо по дороге.',
          tags: ['sight', 'view', 'day-trip'],
          timeEstimateHours: [0.5, 1],
          visitDuration: '30–60 мин у церкви',
          transport:
            'Из Кампота 1 ч — 1 ч 20 мин на машине или минивэне по серпантину.',
          coords: { lat: 10.627, lng: 104.0226 },
          mapsQuery: 'Old Catholic Church · Bokor Hill Station',
          pin: 'Церковь бывшей горной станции, примерно в километре над морем.',
          note: 'Оставьте полдня с остановками на плато. Полный день имеет смысл с другими местами Бокора. На высоте прохладнее, возможен туман.',
          links: [
            {
              label: 'The Map Cambodia · выезды из Кампота',
              url: 'https://themapcambodia.com/en/kampot/day-trips',
            },
            {
              label: 'История горной станции Бокор',
              url: 'https://en.wikipedia.org/wiki/Bokor_Hill_Station',
            },
            {
              label: 'История церкви на Бокоре',
              url: 'https://en.wikipedia.org/wiki/Church_of_Mount_Bokor',
            },
          ],
        },
        {
          slug: 'kep-crab-market',
          nameRu: 'Крабовый рынок Кепа',
          nameEn: 'Kep Crab Market',
          description:
            'Продавцы поднимают крабовые корзины прямо из моря. На набережной можно пообедать крабом с зелёным кампотским перцем.',
          tags: ['food', 'sight', 'morning'],
          timeEstimateHours: [1, 1.5],
          visitDuration: '1–1,5 ч',
          transport:
            'Из Кампота 35–45 мин на минивэне или тук-туке, из центра Кепа обычно 5–15 мин.',
          coords: { lat: 10.4889, lng: 104.2863 },
          mapsQuery: 'Kep Crab Market',
          pin: 'Рыночный ряд у воды.',
          note: 'Утром рынок активнее. Совместите с Национальным парком Кепа за один день.',
          links: [
            {
              label: 'Источники о Крабовом рынке',
              url: 'https://kepcrabmarket.com/en/sources/',
            },
            {
              label: 'Kampot Life · выезд из Кампота в Кеп',
              url: 'https://kampot.life/discover-kampot/kep-day-trip-from-kampot/',
            },
          ],
        },
        {
          slug: 'kep-national-park',
          nameRu: 'Национальный парк Кепа',
          nameEn: 'Kep National Park',
          description:
            'Тропа огибает лесистые холмы. На просветах видно море и прибрежную равнину. Пройдите весь круг или развернитесь после первых смотровых площадок.',
          tags: ['nature', 'walk', 'view'],
          timeEstimateHours: [2, 3],
          visitDuration: '2–3 ч на круг',
          transport:
            'Из Кампота 40–50 мин на тук-туке или минивэне. Основной круг пешком — около 8 км.',
          coords: { lat: 10.486971, lng: 104.295438 },
          mapsQuery: 'Kep National Park Entrance · Veranda',
          pin: 'Главный вход за Veranda Natural Resort, начало прогулки.',
          note: 'В декабре и январе удобнее идти с утра. Затем спуститесь к Крабовому рынку Кепа.',
          links: [
            {
              label: 'Seth Kampot · прогулка по парку',
              url: 'https://sethkampot.com/guide/kep-national-park-hike/',
            },
            {
              label: 'Mingliang Travel · вход и тропы',
              url: 'https://www.mingliangtravel.com/kep-national-park/',
            },
            {
              label: 'Вход в OpenStreetMap',
              url: 'https://www.openstreetmap.org/node/1063602691',
            },
          ],
        },
      ],
    ),
    base(
      {
        id: 'koh-rong-sanloem',
        nameRu: 'Кохронгсамлоем',
        nameEn: 'Koh Rong Samloem',
        intro:
          'На бухту Сарасен выделите 2–3 ночи. Паромы идут из Сиануквиля, причал прибытия согласуйте с жильём.',
      },
      [
        {
          slug: 'saracen-bay',
          nameRu: 'Бухта Сарасен на Кохронгсамлоеме',
          nameEn: 'Saracen Bay · Koh Rong Samloem',
          description:
            'Длинный песчаный пляж и мелководье для спокойного купания. Останьтесь на пару ночей, чтобы погулять вдоль берега и при хорошей видимости выйти на снорклинг с местной лодкой.',
          tags: ['beach', 'nature', 'relax', 'tickets-ahead'],
          timeEstimateHours: [48, 72],
          visitDuration: '2–3 ночи',
          transport:
            'В Сиануквиле 15–30 мин на тук-туке или такси до Sihanoukville Autonomous Port, затем 40–60 мин на скоростном пароме по оценке исходника от 26.11.2026. Выбирайте рейс до Saracen Bay.',
          coords: { lat: 10.58056, lng: 103.30769 },
          mapsQuery: 'Saracen Bay · Orchid Pier · Koh Rong Samloem',
          pin: 'Orchid Pier. Некоторые рейсы приходят к Soon Noeng или Freedom Pier, поэтому сверяйте причал с жильём и перевозчиком.',
          note: 'Конец декабря и начало января обычно сухие и популярные. Бронируйте жильё и паром заранее. Оставьте запас на ветер, ожидание и остановки. Из Кампота до порта 2,5–3,5 ч по оценке исходника от 26.11.2026.',
          links: [
            {
              label: 'Travelfish · паромы из Сиануквиля',
              url: 'https://www.travelfish.org/transport/cambodia/southern_cambodia/sihanoukville/koh_rong_samloem/all',
            },
            {
              label: 'Cambodia Transport Guide · Кохронгсамлоем',
              url: 'https://cambodiatransportguide.com/koh-rong-samloem/',
            },
            {
              label: 'Bookaway · Orchid Pier',
              url: 'https://www.bookaway.com/routes/cambodia/koh-rong-samloem/orchid-pier',
            },
            {
              label: 'Travelfish · погода по сезону',
              url: 'https://www.travelfish.org/weather/cambodia',
            },
            {
              label: 'redBus · Кампот — Сиануквиль',
              url: 'https://www.redbus.com.kh/bus-tickets/routes/kampot-to-sihanoukville',
            },
          ],
        },
      ],
    ),
  ],
};
