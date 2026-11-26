import type { Country, GuideCity, GuidePlace } from './model';

type ThailandPlace = Omit<GuidePlace, 'city' | 'sections'> & {
  base: string;
  difficulty: string;
  practical: string;
  pin: string;
};

const region = (
  details: Pick<GuideCity, 'id' | 'nameRu' | 'nameEn' | 'intro' | 'stay'>,
  places: ThailandPlace[],
): GuideCity => ({
  ...details,
  cover: '',
  nights: 0,
  tips: [],
  sections: [],
  places: places.map(({ base, difficulty, practical, pin, ...place }) => ({
    ...place,
    city: details.id,
    sections: [
      { id: 'base', title: 'Удобная база', body: base },
      {
        id: 'difficulty',
        title: 'Сложность и нюансы',
        body: `${difficulty}. ${practical}`,
      },
      { id: 'map-pin', title: 'Ориентир', body: pin },
    ],
  })),
});

const andamanSeason = {
  label: 'TAT · открытие сезона и электронные билеты',
  url: 'https://www.tatnews.org/2026/10/the-andaman-opens-its-doors-again/',
};

export const thailand: Country = {
  id: 'thailand',
  nameRu: 'Таиланд',
  nameEn: 'Thailand',
  intro:
    'Известняковые бухты Краби, храмы старых столиц и прохладные горы Чиангмая. Двадцать мест в семи регионах, между которыми стоит заложить отдельные переезды.',
  cover: 'atlas/thailand.jpg',
  sections: [
    {
      id: 'route',
      title: 'Как собрать поездку',
      body: `20 декабря 2026 — 6–10 января 2027. Для морского начала поселитесь в Ао-Нанге или Краби-Тауне. Отсюда удобно съездить на Рейли, Хонг и к Тигровой пещере. Майя-Бэй можно добавить однодневным туром или с ночёвкой на Пхи-Пхи-Доне. Для пляжных дней выделите Ко-Ланту, для Симилан — ночь в Као-Лаке и полный день на лодку.

К морю добавьте один или два блока: Бангкок со старыми столицами, горы Чиангмая или озеро Чео-Лан. На Самуи и Ко-Тао, в Исан и на Ко-Чанг закладывайте отдельные переезды. В карточках время дороги указано в одну сторону без ожидания, если не оговорено иначе.`,
    },
    {
      id: 'climate',
      title: 'Климат в конце декабря и начале января',
      body: `На Андаманском побережье обычно сухой сезон. В конце декабря у Самуи и Ко-Тао ещё бывают ливни и волна, к январю обычно суше. Оставьте запасной день на паром и снорклинг. На островах Трата в это время обычно суше. На севере чаще сухо, утра и ночи прохладные, в горах возможны холод и туман.

Климатические ориентиры описывают типичный сезон. Прогноз и морские предупреждения на конкретную дату смотрите ближе к выезду.
Климат и муссоны · метеослужба Таиланда — https://www.thailand.go.th/useful-information-detail/099_143?hl=en
Прогноз и предупреждения TMD — https://www.tmd.go.th/en`,
    },
    {
      id: 'access',
      title: 'Морские парки и высадка',
      body: `Майя-Бэй была закрыта с 1 августа по 30 сентября и снова открылась 1 октября 2026. Высадка через пирс Ло-Сама с другой стороны острова. Плавание в бухте не планируйте, для снорклинга выбирайте отдельную остановку. Симиланы открылись 15 октября 2026. На Пхи-Пхи, Симиланах, в заливе Пхангнга и на Ко-Ланте действует электронный билет в морские парки.

Перед поездкой уточните слот и правила доступа в Майя-Бэй, наличие билетов и высадку на острове № 8 на Симиланах, прилив на Хонге и в заливе Пхангнга, расписание праздничных паромов и прогноз волнения.
DNP · сезонное закрытие Майя-Бэй — https://news.dnp.go.th/news/48996
TAT · открытие сезона и электронные билеты — https://www.tatnews.org/2026/10/the-andaman-opens-its-doors-again/
TAT · пирс Ло-Сама — https://www.tatnews.org/2021/11/krabis-world-famous-maya-bay-eyeing-1-january-2022-reopening/
DNP · открытие Симилан — https://news.dnp.go.th/news/50049`,
    },
    {
      id: 'cover-credit',
      title: 'Обложка · Майя-Бэй',
      body: `Фото: Mike Clegg (Mikecleggphoto). Изображение уменьшено.
Лицензия CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/
Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Maya_Bay,_Thailand_by_Mike_Clegg_Photography.jpg`,
    },
  ],
  cities: [
    region(
      {
        id: 'andaman',
        nameRu: 'Андаманское побережье',
        nameEn: 'Andaman Coast',
        intro:
          'Рейли, Хонг и Тигровая пещера доступны из Краби. Ко-Ланта, Пхи-Пхи-Дон и Као-Лак удобны как отдельные базы.',
        stay: [
          {
            area: 'Ао-Нанг или Краби-Таун',
            why: 'Ао-Нанг ближе к морским отправлениям, Краби-Таун — к Тигровой пещере и дороге на Ко-Ланту.',
          },
          {
            area: 'Пхи-Пхи-Дон и Ко-Ланта',
            why: 'Тон-Сай даёт короткий выезд в Майя-Бэй. На Ланте стоит переночевать, чтобы оставить больше времени на пляж.',
          },
          {
            area: 'Као-Лак и Пхангнга',
            why: 'Као-Лак удобен для полного дня на Симиланах, Пхангнга — для короткого подъезда к лодкам на Ко-Тапу.',
          },
        ],
      },
      [
        {
          slug: 'phra-nang-beach',
          nameRu: 'Пра-Нанг',
          nameEn: 'Phra Nang Cave Beach',
          summary:
            'Пещера-святилище под скалой Рейли. Из Ао-Нанга 10–15 мин на лодке и 15–20 мин пешком.',
          description:
            'На южном краю пляжа под отвесной стеной находится пещера-святилище. Выделите время на купание и прогулку по Рейли. Можно добавить скалолазание с инструктором.',
          coords: { lat: 8.00489, lng: 98.83979 },
          mapsQuery: 'Phra Nang Cave Beach, Railay',
          pin: 'Южный край пляжа Пра-Нанг у пещеры, за пешеходной тропой с Рейли.',
          tags: ['beach', 'walk', 'nature'],
          base: 'Ао-Нанг. Из Краби-Тауна удобна посадка на Ao Nam Mao Pier.',
          visitDuration: '3–5 ч',
          timeEstimateHours: [3, 5],
          transport:
            'Из Ао-Нанга 5–15 мин до кассы на пляже, 10–15 мин на лонгтейле до Railay West и 15–20 мин пешком. Из Краби-Тауна 20–30 мин машиной до Ao Nam Mao Pier, 15–20 мин лодкой до Railay East и 10–15 мин пешком.',
          bestTime:
            'Зимой море обычно спокойнее. Утром меньше людей, прилив меняет ширину пляжа.',
          difficulty: 'Легко',
          practical:
            'Заложите ожидание пассажиров. При волнении посадка с пляжа сложнее.',
          links: [
            {
              label: 'Рейли и Пра-Нанг',
              url: 'https://thaipedia.asia/en/travel/krabi/sights/railay-beach/',
            },
          ],
        },
        {
          slug: 'koh-hong-beach',
          nameRu: 'Пляж острова Хонг',
          nameEn: 'Koh Hong Beach',
          summary:
            'Бухта Пелай и круговая смотровая. Из Ао-Нанга 20–30 мин на спидботе.',
          description:
            'Известняковые стены обрамляют песчаную бухту Пелай. После купания можно подняться на смотровую и отдельно зайти на лодке в лагуну на другом конце острова.',
          coords: { lat: 8.07882, lng: 98.68035 },
          mapsQuery: 'Koh Hong Beach, Krabi',
          pin: 'Песчаный пляж Пелай на Ко-Хонге, рядом с началом подъёма к смотровой.',
          tags: ['beach', 'view', 'day-trip'],
          base: 'Ао-Нанг. Из Краби-Тауна добавьте 25–40 мин на машине.',
          visitDuration: '2–3 ч на острове',
          timeEstimateHours: [2, 3],
          transport:
            'Из Ао-Нанга 5–15 мин до пляжа или Ноппарат-Тхары, далее 20–30 мин на спидботе или 40–60 мин на лонгтейле. Дневная экскурсия со всеми остановками занимает 5–7 ч.',
          bestTime:
            'Зимой обычно удобнее выходить в море. Возможность захода в лагуну зависит от прилива и маршрута.',
          difficulty: 'Умеренно',
          practical:
            'К смотровой около 420 ступеней. Перед выездом подтвердите высадку и заход в лагуну.',
          links: [
            {
              label: 'Лодки, лагуна и подъём',
              url: 'https://thaipedia.asia/en/travel/krabi/excursions/hong-islands-from-ao-nang/',
            },
            {
              label: 'DNP · доступ в морские парки',
              url: 'https://news.dnp.go.th/news/51000',
            },
          ],
        },
        {
          slug: 'tiger-cave-temple',
          nameRu: 'Тигровая пещера и вершина',
          nameEn: 'Tiger Cave Temple · Mountain Viewpoint',
          summary:
            'Золотой Будда и панорама Краби. Из Краби-Тауна 15–20 мин до входа, затем 30–60 мин вверх.',
          description:
            'К площадке с золотым Буддой ведут более 1 200 ступеней. Сверху видны известняковые холмы и побережье. Внизу можно посетить пещеру и храмовый двор.',
          coords: { lat: 8.12625, lng: 98.92277 },
          mapsQuery: 'Tiger Cave Temple Mountain Viewpoint, Krabi',
          pin: 'Верхняя площадка с золотым Буддой. Лестница начинается в нижнем храмовом комплексе Wat Tham Suea.',
          tags: ['view', 'temple-shrine', 'adventure', 'morning'],
          base: 'Краби-Таун или Ао-Нанг.',
          visitDuration: '1,5–2,5 ч',
          timeEstimateHours: [1.5, 2.5],
          transport:
            'Такси или минивэн до нижнего входа: 15–20 мин из Краби-Тауна или 25–40 мин из Ао-Нанга. Подъём от входа занимает 30–60 мин. На выезд удобно выделить полдня.',
          bestTime:
            'В сухой сезон идти проще. Даже зимой на лестнице жарко, выходите утром.',
          difficulty: 'Требует усилий',
          practical:
            'Ступени крутые и местами высокие. Можно ограничиться нижним храмом.',
          links: [
            {
              label: 'Дорога и лестница',
              url: 'https://bookkrabitours.com/tiger-cave-temple/',
            },
          ],
        },
        {
          slug: 'maya-bay',
          nameRu: 'Майя-Бэй',
          nameEn: 'Maya Bay',
          summary:
            'Белый пляж в кольце скал. Из Тон-Сая 30–45 мин лодкой до Ло-Самы и 5–10 мин пешком.',
          description:
            'С белого пляжа видна бухта из фильма «Пляж», почти замкнутая известняковыми стенами. Здесь гуляют по берегу. Для купания и снорклинга выберите отдельную остановку тура.',
          coords: { lat: 7.67663, lng: 98.76612 },
          mapsQuery: 'Maya Bay Beach Viewpoint, Ko Phi Phi Leh',
          pin: 'Смотровая у пляжа в конце настила. Высадка на противоположном берегу у пирса Loh Samah.',
          tags: ['beach', 'sight', 'day-trip', 'tickets-ahead'],
          base: 'Пхи-Пхи-Дон, район Тон-Сай. Из Ао-Нанга возможен однодневный тур.',
          visitDuration: '30–60 мин в бухте',
          timeEstimateHours: [0.5, 1],
          transport:
            'Из Тон-Сая 5–15 мин пешком до посадки, 30–45 мин на лонгтейле до Loh Samah и 5–10 мин по настилу. Из Ао-Нанга 5–15 мин до пирса и около 1–1,5 ч морем с остановками. Из Краби-Тауна до отправления обычно 25–40 мин.',
          bestTime:
            'Бухта снова открылась 1 октября 2026 после закрытия 1 августа — 30 сентября. Высадка зависит от волнения и распоряжений парка.',
          difficulty: 'Умеренно',
          practical:
            'Из Краби переход по открытому морю. Возможна очередь на высадку. Заранее проверьте электронный билет, слот и правила у парка, в бухте не планируйте плавание.',
          links: [
            andamanSeason,
            {
              label: 'DNP · сезонное закрытие в 2026',
              url: 'https://news.dnp.go.th/news/48996',
            },
            {
              label: 'TAT · высадка в Ло-Саме',
              url: 'https://www.tatnews.org/2021/11/krabis-world-famous-maya-bay-eyeing-1-january-2022-reopening/',
            },
            {
              label: 'Правила посещения в сезоне 2026–27',
              url: 'https://www.timeout.com/bangkok/news/thailand-famous-maya-bay-reopens-092926',
            },
            {
              label: 'Отправление из Тон-Сай',
              url: 'https://phiphimayabaytour.com/maya-bay-from-ton-sai-pier/',
            },
            {
              label: 'Тур из Ао-Нанга',
              url: 'https://thaipedia.asia/en/travel/krabi/excursions/phi-phi-from-ao-nang/',
            },
          ],
        },
        {
          slug: 'kantiang-bay',
          nameRu: 'Бухта Кантьянг',
          nameEn: 'Ba Kantiang Beach',
          summary:
            'Длинная пляжная пауза на Ко-Ланте. От пирса Саладан 35–45 мин на такси.',
          description:
            'Пологая песчаная бухта под зелёными склонами подходит для купания, обеда у берега и заката. Удобно приехать на несколько часов или остаться на ночь.',
          coords: { lat: 7.4962, lng: 99.0742 },
          mapsQuery: 'Ba Kantiang Beach, Koh Lanta',
          pin: 'Песчаный берег бухты Кантьянг на юге Ко-Ланта-Яй.',
          tags: ['beach', 'relax', 'sunset'],
          base: 'Ко-Ланта. Из Краби возможен дневной выезд, с ночёвкой больше времени у моря.',
          visitDuration: '3–6 ч',
          timeEstimateHours: [3, 6],
          transport:
            'От Saladan Pier 35–45 мин на такси. Из Краби-Тауна 1–1,5 ч до парома Ban Hua Hin, 10–20 мин переправа без очереди, ещё 50–65 мин по дороге через мост. Из Ао-Нанга добавьте 25–40 мин.',
          bestTime:
            'Конец декабря и начало января — высокий сезон. Перед купанием смотрите флаги и волну.',
          difficulty: 'Легко с острова',
          practical:
            'В праздники заложите запас на очередь к автомобильному парому.',
          links: [
            {
              label: 'Пляж и дорога от Саладана',
              url: 'https://bookkrabitours.com/kantiang-bay/',
            },
            {
              label: 'Автомобильный паром из Краби',
              url: 'https://privatetaxikrabi.com/guides/krabi-to-koh-lanta-by-taxi/',
            },
          ],
        },
        {
          slug: 'donald-duck-bay',
          nameRu: 'Симиланы · бухта Дональда Дака',
          nameEn: 'Donald Duck Bay (Ao Kueak Beach)',
          summary:
            'Белый песок и гранит острова № 8. Из Као-Лака 20–30 мин до пирса и 60–90 мин морем.',
          description:
            'От бухты на острове № 8 можно подняться к гранитному Sail Rock. Для снорклинга выбирайте тур с отдельными остановками над рифом.',
          coords: { lat: 8.66565, lng: 97.64775 },
          mapsQuery: 'Donald Duck Bay (Ao Kueak Beach), Ko Similan',
          pin: 'Пляж бухты Ао-Куэк у начала подъёма к Sail Rock на острове № 8.',
          tags: ['beach', 'view', 'day-trip', 'tickets-ahead'],
          base: 'Као-Лак. Из Краби разумнее приехать накануне.',
          visitDuration: '1–2 ч в бухте',
          timeEstimateHours: [1, 2],
          transport:
            'Из Као-Лака 20–30 мин до Thap Lamu Pier, далее 60–90 мин на спидботе. Весь выезд с другими островами обычно 7–9 ч. Сверьте фактический пирс и порядок остановок у оператора.',
          bestTime:
            'DNP открыл сезон 15 октября 2026. На праздники бронируйте лодку и электронный билет заранее. При сильной волне рейс могут перенести.',
          difficulty: 'Долгая дорога',
          practical:
            'Переход идёт по открытому морю. Подтвердите высадку именно в этой бухте и условия подъёма к Sail Rock.',
          links: [
            {
              label: 'DNP · открытие Симилан',
              url: 'https://news.dnp.go.th/news/50049',
            },
            andamanSeason,
            {
              label: 'Дорога от Као-Лака',
              url: 'https://www.khaolaklanddiscovery.com/how-to-get-to-similan-islands/',
            },
            {
              label: 'Открытый сезон 2026–27',
              url: 'https://www.siamtourandrealty.com/similan-islands-season/',
            },
            {
              label: 'DNP · страница парка',
              url: 'https://booking.dnp.go.th/parksdetail.php?id=46',
            },
          ],
        },
        {
          slug: 'khao-phing-kan',
          nameRu: 'Кхао-Пинг-Кан · вид на Ко-Тапу',
          nameEn: 'Khao Phing Kan (James Bond Island)',
          summary:
            'Вид на скалу Ко-Тапу с острова. Из Пхангнга 15–25 мин до пирса и 15–40 мин на лодке.',
          description:
            'С берега видно тонкую известняковую скалу Ко-Тапу из фильма о Бонде. Остановку удобно совместить с лодкой по манграм и каяком у пещер, если позволяет прилив.',
          coords: { lat: 8.27468, lng: 98.50041 },
          mapsQuery: 'Khao Phing Kan (James Bond Island), Ko Tapu Viewpoint',
          pin: 'Береговая площадка на Кхао-Пинг-Кане с видом на Ко-Тапу.',
          tags: ['view', 'nature', 'day-trip', 'tickets-ahead'],
          base: 'Пхангнга. Из Краби-Тауна и Ао-Нанга можно съездить на день.',
          visitDuration: '30–60 мин на острове',
          timeEstimateHours: [0.5, 1],
          transport:
            'Из Пхангнга 15–25 мин машиной до Surakul Pier, затем около 15–40 мин на лонгтейле. Из Краби или Ао-Нанга до пирса около 1–1,5 ч. На лодочный маршрут с остановками выделите 3–5 ч.',
          bestTime:
            'Зимой залив обычно доступен. В праздники у площадки многолюдно, каяки и пещеры зависят от прилива.',
          difficulty: 'Умеренно',
          practical:
            'Уточните высадку, время прилива и включён ли электронный билет парка.',
          links: [
            andamanSeason,
            {
              label: 'Причал и лодочный маршрут',
              url: 'https://destinationkrabi.com/james-bond-island-tour-from-krabi-by-longtail-boat/',
            },
            {
              label: 'Точка высадки и вид на скалу',
              url: 'https://www.lovethailand.org/travel/en/68-Phang-Nga/4105-Khao-Tapu-and-Khao-Phing-Kan.html',
            },
          ],
        },
      ],
    ),
    region(
      {
        id: 'central',
        nameRu: 'Центр и запад',
        nameEn: 'Central and Western Thailand',
        intro:
          'Бангкок и Аюттхая подходят для храмов и руин. Для каскадов Эравана удобнее Канчанабури, для пещеры Прайя-Накхон — Хуахин.',
        stay: [
          {
            area: 'Бангкок и Аюттхая',
            why: 'Старый Бангкок удобен для речной прогулки, Аюттхая — для отдельного дня в историческом парке.',
          },
          {
            area: 'Канчанабури и Хуахин',
            why: 'Выбирайте базу по выезду: Канчанабури для Эравана, Хуахин для прибрежной тропы и пещеры.',
          },
        ],
      },
      [
        {
          slug: 'erawan-waterfall',
          nameRu: 'Водопад Эраван · начало тропы',
          nameEn: 'Erawan Waterfall Trailhead',
          summary:
            'Семь лесных каскадов. Из Канчанабури 1–1,5 ч на машине, от парковки 10–15 мин до первых чаш.',
          description:
            'Тропа поднимается вдоль семи известняковых каскадов. На нижних чашах достаточно короткой прогулки, на верхние ярусы выделите несколько часов.',
          coords: { lat: 14.37449, lng: 99.14533 },
          mapsQuery: 'Erawan Waterfall Trailhead, Erawan National Park',
          pin: 'Начало подхода к каскадам у парковки и зоны посетителей Эравана.',
          tags: ['nature', 'walk', 'day-trip'],
          base: 'Канчанабури.',
          visitDuration: '2–4 ч',
          timeEstimateHours: [2, 4],
          transport:
            'Из Канчанабури 1–1,5 ч машиной или 1,5–2 ч местным автобусом. От парковки до первых каскадов 10–15 мин пешком. Подъём к верхним ярусам занимает 45–75 мин в одну сторону с остановками.',
          bestTime:
            'К январю воды обычно меньше, чем в сезон дождей. Доступ и купание проверяйте у парка по уровню воды.',
          difficulty: 'Умеренно',
          practical:
            'Выше третьего яруса мокрые ступени и камни. Для короткой прогулки хватит нижних каскадов.',
          links: [
            {
              label: 'Тропа и правила парка',
              url: 'https://www.thainationalparks.com/erawan-national-park',
            },
            {
              label: 'Путь от Канчанабури',
              url: 'https://www.kanchanaburitaxis.com/guide/erawan-waterfalls-national-parks',
            },
          ],
        },
        {
          slug: 'phraya-nakhon-cave',
          nameRu: 'Пещера Прайя-Накхон',
          nameEn: 'Phraya Nakhon Cave',
          summary:
            'Королевский павильон под лучом света. Из Хуахина 50–75 мин до Bang Pu, дальше лодка или тропа и подъём.',
          description:
            'Королевский павильон стоит под естественным проёмом в своде. В ясную погоду луч часто виден к середине утра, точное время зависит от солнца и облаков.',
          coords: { lat: 12.19761, lng: 100.0114 },
          mapsQuery: 'Phraya Nakhon Cave, Khao Sam Roi Yot',
          pin: 'Пещера с павильоном. Подъём начинается от пляжа Laem Sala.',
          tags: ['nature', 'adventure', 'morning', 'day-trip'],
          base: 'Хуахин.',
          visitDuration: '1,5–2,5 ч у пещеры и на тропе',
          timeEstimateHours: [1.5, 2.5],
          transport:
            'Из Хуахина 50–75 мин на машине до Bang Pu. До Laem Sala 5–15 мин на лонгтейле или 25–40 мин по прибрежной тропе. От Laem Sala до пещеры 25–45 мин по крутому подъёму.',
          bestTime:
            'В конце декабря и начале января обычно удобно идти пешком. При волнении вместо лодки выбирайте прибрежную тропу.',
          difficulty: 'Требует усилий',
          practical:
            'Каменистый подъём от Laem Sala остаётся и при поездке на лодке.',
          links: [
            {
              label: 'Точки входа, тропа и лодка',
              url: 'https://www.thainationalparks.com/khao-sam-roi-yot-national-park',
            },
            {
              label: 'DNP · пещера и павильон',
              url: 'https://news.dnp.go.th/news/46543',
            },
          ],
        },
        {
          slug: 'wat-arun',
          nameRu: 'Ват Арун',
          nameEn: 'Wat Arun Ratchawararam',
          summary:
            'Фарфоровая башня над Чаупхраей. От MRT Itsaraphap 10–15 мин пешком.',
          description:
            'Центральную башню покрывают узоры из фарфора и керамики. Детали хорошо видны из двора, весь силуэт — с противоположного берега реки.',
          coords: { lat: 13.74361, lng: 100.48889 },
          mapsQuery: 'Wat Arun Ratchawararam, Bangkok',
          pin: 'Храмовый двор у центральной башни на западном берегу Чаупхраи.',
          tags: ['temple-shrine', 'sight', 'sunset'],
          base: 'Бангкок, старый город.',
          visitDuration: '60–90 мин',
          timeEstimateHours: [1, 1.5],
          transport:
            'От MRT Itsaraphap 10–15 мин пешком. Из старого города от MRT Sanam Chai 5–10 мин до Tha Tien, затем 3–5 мин на пароме без ожидания.',
          bestTime:
            'Конец декабря обычно сухой. Во дворе спокойнее утром, с другого берега хорошо смотреть вечером.',
          difficulty: 'Легко',
          practical: 'В праздники на переправе возможна очередь.',
          links: [
            {
              label: 'TAT · храм и контакты',
              url: 'https://www.tourismthailand.org/Attraction/wat-arun-ratchawararam-ratchawaramahawihan',
            },
            {
              label: 'Переправа через реку и метро',
              url: 'https://wat-arun.org/getting-there/',
            },
          ],
        },
        {
          slug: 'wat-mahathat',
          nameRu: 'Ват Махатхат в Аюттхае',
          nameEn: 'Wat Mahathat, Ayutthaya',
          summary:
            'Голова Будды в корнях среди руин столицы. Из старого города 5–15 мин пешком.',
          description:
            'Среди кирпичных башен найдите песчаниковую голову Будды в корнях дерева. Отсюда удобно продолжить прогулку по историческому острову к Ват Ратчабурана.',
          coords: { lat: 14.3569, lng: 100.5675 },
          mapsQuery: 'Wat Mahathat, Ayutthaya',
          pin: 'Руины Ват Махатхат на историческом острове, рядом с деревом с головой Будды.',
          tags: ['temple-shrine', 'sight', 'walk'],
          base: 'Аюттхая, старый город.',
          visitDuration: '45–90 мин',
          timeEstimateHours: [0.75, 1.5],
          transport:
            'От Ayutthaya Railway Station 10–20 мин на тук-туке или такси. От жилья у Naresuan Road 5–15 мин пешком.',
          bestTime:
            'Зимой обычно сухо. На открытой территории даже зимой жарко в полдень.',
          difficulty: 'Легко',
          practical:
            'Если едете впятером, заранее уточните вместимость тук-тука.',
          links: [
            {
              label: 'Проезд и время осмотра',
              url: 'https://thailandnavigator.com/guides/ayutthaya-day-trip-by-train',
            },
            {
              label: 'ЮНЕСКО · исторический город',
              url: 'https://whc.unesco.org/en/list/576/',
            },
          ],
        },
      ],
    ),
    region(
      {
        id: 'north',
        nameRu: 'Север',
        nameEn: 'Northern Thailand',
        intro:
          'Из Чиангмая выделите разные дни на Дойсутхеп и Дойинтханон. Чианграй и Сукхотай удобнее смотреть с отдельной ночёвкой.',
        stay: [
          {
            area: 'Чиангмай',
            why: 'Старый город удобен для двух горных выездов с возвращением в тот же день.',
          },
          {
            area: 'Чианграй и Старый Сукхотай',
            why: 'Чианграй — отдельная база для Белого храма. В Старом Сукхотае проще добираться между зонами парка на велосипеде.',
          },
        ],
      },
      [
        {
          slug: 'wat-si-chum',
          nameRu: 'Ват Си-Чум в Сукхотае',
          nameEn: 'Wat Si Chum, Sukhothai',
          summary:
            'Гигантский Будда за узким проёмом. От центральной зоны Старого Сукхотая 10–15 мин на велосипеде.',
          description:
            'Сидящий Будда Пхра Ачана виден сквозь высокий проём кирпичного павильона. Храм находится в северной зоне парка, которую удобно добавить к велопрогулке по руинам.',
          coords: { lat: 17.02708, lng: 99.69329 },
          mapsQuery: 'Wat Si Chum, Sukhothai Historical Park',
          pin: 'Павильон Пхра Ачаны в северной зоне исторического парка.',
          tags: ['temple-shrine', 'sight', 'morning'],
          base: 'Старый Сукхотай. Из других городов удобнее приехать с ночёвкой.',
          visitDuration: '30–60 мин',
          timeEstimateHours: [0.5, 1],
          transport:
            'От центрального входа в Старом Сукхотае 10–15 мин на велосипеде или 20–30 мин пешком. Из нового города 25–40 мин на сонгтхэу или такси и короткий переезд до северной зоны.',
          bestTime:
            'Зимой утра прохладные и обычно сухие. На остальные зоны парка добавьте полдня.',
          difficulty: 'Умеренно',
          practical: 'У северной зоны отдельный вход и билет.',
          links: [
            {
              label: 'Маршрут по парку',
              url: 'https://en.wikivoyage.org/wiki/Sukhothai',
            },
            {
              label: 'ЮНЕСКО · исторический город',
              url: 'https://whc.unesco.org/en/list/574/',
            },
          ],
        },
        {
          slug: 'doi-suthep',
          nameRu: 'Ват Пхра Тхат Дойсутхеп',
          nameEn: 'Wat Phra That Doi Suthep',
          summary:
            'Золотая ступа над Чиангмаем. Из Старого города 35–55 мин до лестницы.',
          description:
            'Золотая ступа стоит над лесистыми склонами. С террасы видно Чиангмай, к храмовому двору ведёт лестница с перилами в виде нагов.',
          coords: { lat: 18.80498, lng: 98.92156 },
          mapsQuery: 'Wat Phra That Doi Suthep, Chiang Mai',
          pin: 'Храмовый комплекс наверху. Лестница и наклонный подъёмник начинаются у нижней площадки.',
          tags: ['temple-shrine', 'view', 'day-trip'],
          base: 'Чиангмай, Старый город.',
          visitDuration: '1–2 ч',
          timeEstimateHours: [1, 2],
          transport:
            'Из Старого города 35–55 мин на такси или красном сонгтхэу. От высадки 10–20 мин по лестнице. У нижней площадки есть наклонный подъёмник.',
          bestTime:
            'Зимой на горе прохладнее, чем в городе. Утренняя дымка может закрыть вид на Чиангмай.',
          difficulty: 'Легко',
          practical:
            'Дорога идёт по серпантину. Сонгтхэу может ждать набора пассажиров.',
          links: [
            {
              label: 'TAT · подъезд к храму и подъёмник',
              url: 'https://www.tourismthailand.org/Attraction/wat-phra-that-doi-suthep',
            },
            {
              label: 'Провинция Чиангмай',
              url: 'https://www.chiangmai.go.th/english/index.php/welcome/tourism',
            },
            {
              label: 'Дорога и время посещения',
              url: 'https://www.thailand-tourism.net/attractions/chiang-mai/doi-suthep-temple/',
            },
          ],
        },
        {
          slug: 'doi-inthanon-royal-pagodas',
          nameRu: 'Королевские пагоды Дойинтханона',
          nameEn: 'Twin Royal Pagodas, Doi Inthanon',
          summary:
            'Пагоды и сады над горными хребтами. Из Чиангмая 1 ч 45 мин – 2 ч 30 мин на машине.',
          description:
            'Две пагоды и сады стоят высоко на склоне Дойинтханона. В ясный день видны хребты. С вершиной, облачным лесом и тропой Кью-Мэ-Пан получится полноценный горный день.',
          coords: { lat: 18.55296, lng: 98.47947 },
          mapsQuery: 'Twin Royal Pagodas, Doi Inthanon',
          pin: 'Сад между королевскими пагодами. Тропа Кью-Мэ-Пан начинается отдельно.',
          tags: ['view', 'nature', 'day-trip'],
          base: 'Чиангмай.',
          visitDuration: '1–1,5 ч у пагод',
          timeEstimateHours: [1, 1.5],
          transport:
            'Из Чиангмая 1 ч 45 мин – 2 ч 30 мин на машине или минивэне до парковки. С вершиной и тропой закладывайте почти весь день.',
          bestTime:
            'На высоте зимой холодно, возможны туман и заморозки. DNP открыл Кью-Мэ-Пан 1 ноября 2026. Перед выездом подтвердите доступ и условия прогулки с местным проводником.',
          difficulty: 'Умеренно',
          practical: 'Долгий серпантин. При плотном тумане хребты не видны.',
          links: [
            {
              label: 'Парк, пагоды и тропы',
              url: 'https://www.thainationalparks.com/doi-inthanon-national-park',
            },
            {
              label: 'Время в дороге',
              url: 'https://www.maehia.com/en/chiang-mai/day-trips/doi-inthanon/',
            },
            {
              label: 'DNP · открытие тропы Кью-Мэ-Пан',
              url: 'https://news.dnp.go.th/news/50596',
            },
          ],
        },
        {
          slug: 'wat-rong-khun',
          nameRu: 'Белый храм Ват Ронг-Кхун',
          nameEn: 'Wat Rong Khun (White Temple)',
          summary:
            'Зеркальная мозаика и необычные росписи. Из Чианграя 20–30 мин на такси или автобусе.',
          description:
            'Белый храм Чалермчая Коситпипата покрыт зеркальной мозаикой. За мостом над скульптурами рук находится главный зал с росписями и отсылками к поп-культуре.',
          coords: { lat: 19.82373, lng: 99.7634 },
          mapsQuery: 'Wat Rong Khun (White Temple) Main Entrance, Chiang Rai',
          pin: 'Главный вход в комплекс Белого храма.',
          tags: ['temple-shrine', 'sight', 'morning'],
          base: 'Чианграй. Из Чиангмая удобнее с ночёвкой.',
          visitDuration: '1–1,5 ч',
          timeEstimateHours: [1, 1.5],
          transport:
            'Из центра Чианграя 20–30 мин на такси или местном автобусе от Bus Terminal 1, затем несколько минут пешком. Из Чиангмая 3–4 ч в одну сторону.',
          bestTime:
            'Зимой обычно сухо. В праздники утром проще попасть на мост без длинной очереди.',
          difficulty: 'Легко',
          practical:
            'Путь из Чианграя простой. Из Чиангмая дорога туда и обратно займёт большую часть дня.',
          links: [
            {
              label: 'Автобус и такси из Чианграя',
              url: 'https://whitetemplechiangrai.com/getting-there/',
            },
          ],
        },
      ],
    ),
    region(
      {
        id: 'gulf',
        nameRu: 'Сиамский залив',
        nameEn: 'Gulf of Thailand',
        intro:
          'Самуи и Ко-Тао — разные островные базы. На паром и снорклинг оставьте запасной день из-за зимнего волнения.',
        stay: [
          {
            area: 'Бопхут, Самуи',
            why: 'Короткое такси до храма. С материка паром идёт из Донсака.',
          },
          {
            area: 'Мэ-Хад, Ко-Тао',
            why: 'Удобная ночёвка у паромного причала с выездом к бухте Танот по погоде.',
          },
        ],
      },
      [
        {
          slug: 'wat-plai-laem',
          nameRu: 'Ват Плай-Лаем',
          nameEn: 'Wat Plai Laem',
          summary:
            'Храмовые павильоны над прудом и многорукая Гуаньинь. Из Бопхута 10–20 мин на такси.',
          description:
            'На северо-востоке Самуи мостики соединяют храмовые павильоны над прудом. Над ними возвышается многорукая Гуаньинь.',
          coords: { lat: 9.5716, lng: 100.0666 },
          mapsQuery: 'Wat Plai Laem, Koh Samui',
          pin: 'Храмовый комплекс с мостиками и прудом на северо-востоке Самуи.',
          tags: ['temple-shrine', 'sight', 'walk'],
          base: 'Самуи, Бопхут.',
          visitDuration: '45–75 мин',
          timeEstimateHours: [0.75, 1.25],
          transport:
            'Из Бопхута 10–20 мин на такси, из аэропорта Самуи 10–15 мин. С материка: из Сураттхани 1–1,5 ч до Donsak Pier, около 1,5 ч паромом Seatran до Nathon Pier и 40–55 мин на такси.',
          bestTime:
            'В конце декабря ещё возможны ливни и волна. Осмотр легко подстроить под сухое окно.',
          difficulty: 'Легко с острова',
          practical:
            'При поездке с материка заложите посадку и проверьте рейс при сильном ветре.',
          links: [
            {
              label: 'Дорога по Самуи',
              url: 'https://samui69.com/temples/wat-plai-laem',
            },
            {
              label: 'Seatran · расписание и бронирование',
              url: 'https://www.seatranferry.com/',
            },
            {
              label: 'Seatran · список рейсов',
              url: 'https://www.seatranferry.com/booking/trip_list',
            },
          ],
        },
        {
          slug: 'tanote-bay',
          nameRu: 'Бухта Танот',
          nameEn: 'Tanote Bay Beach',
          summary:
            'Риф и гранитные валуны у берега. От Мэ-Хада 10–20 мин на пикапе-такси.',
          description:
            'На востоке Ко-Тао песчаный берег выходит к бухте с одинокой скалой. В спокойный день можно зайти с маской прямо с пляжа.',
          coords: { lat: 10.08475, lng: 99.848 },
          mapsQuery: 'Tanote Bay Beach, Koh Tao',
          pin: 'Песчаный берег Ао-Танот у спуска к воде.',
          tags: ['beach', 'nature', 'adventure'],
          base: 'Ко-Тао, Мэ-Хад. Лучше с ночёвкой на острове.',
          visitDuration: '2–4 ч',
          timeEstimateHours: [2, 4],
          transport:
            'От Mae Haad 10–20 мин на пикапе-такси. Из Чумпхона 30–45 мин до Thung Makham Noi Pier и около 1 ч 45 мин катамараном до Mae Haad. Из Самуи время и причал зависят от рейса.',
          bestTime:
            'В конце декабря возможны волна и мутная вода. Для маски выбирайте спокойный день и оставьте запас по датам.',
          difficulty: 'Долгая дорога',
          practical:
            'На пароме есть открытый участок, а дорога к пляжу крутая. Сверьте рейс перед выездом.',
          links: [
            {
              label: 'Транспорт от Мэ-Хада',
              url: 'https://asiaroamer.com/en/koh-tao/getting-there/',
            },
            {
              label: 'Катамаран из Чумпхона',
              url: 'https://www.visitthailandtoday.com/guides/chumphon-to-koh-tao',
            },
          ],
        },
      ],
    ),
    region(
      {
        id: 'south',
        nameRu: 'Юг / Сураттхани',
        nameEn: 'South / Surat Thani',
        intro:
          'Чео-Лан удобно посетить отдельным выездом из Бан-Та-Кхуна или Као-Сока. Из Краби получится длинный день.',
        stay: [
          {
            area: 'Бан-Та-Кхун или Као-Сок',
            why: 'Бан-Та-Кхун ближе к причалу. Ночёвка у озера помогает попасть на раннюю лодку.',
          },
        ],
      },
      [
        {
          slug: 'cheow-lan-three-brothers',
          nameRu: 'Скалы «Три брата» на Чео-Лане',
          nameEn: 'Khao Sam Kloe (Three Brothers)',
          summary:
            'Три карстовые башни над озером. Из Бан-Та-Кхуна 15–25 мин до причала и 30–60 мин лодкой.',
          description:
            'Три известняковые скалы поднимаются из водохранилища Као-Сок. На лодке видны лесистые стены озера. У плавучих домиков можно добавить каяк, обед или ночёвку.',
          coords: { lat: 8.99678, lng: 98.70913 },
          mapsQuery: 'Khao Sam Kloe (Three Brothers), Cheow Lan Lake',
          pin: 'Точка на воде рядом со скалами Кхао-Сам-Клё. Лодка отправляется от Ratchaprapha Municipal Pier.',
          tags: ['nature', 'view', 'day-trip'],
          base: 'Бан-Та-Кхун или деревня Као-Сок.',
          visitDuration: '15–30 мин у скал',
          timeEstimateHours: [0.25, 0.5],
          transport:
            'До Ratchaprapha Municipal Pier 15–25 мин из Бан-Та-Кхуна, 50–70 мин из Као-Сока или 2,5–3,5 ч из Краби. До скал 30–60 мин на лонгтейле. Короткий лодочный маршрут занимает 2–4 ч.',
          bestTime:
            'Зимой выезды обычно доступны, на ранней лодке возможен туман. На праздники согласуйте рейс заранее.',
          difficulty: 'Умеренно',
          practical:
            'Из Краби выезжайте рано. Время на воде зависит от остановок и погоды.',
          links: [
            {
              label: 'Координаты скал и схема озера',
              url: 'https://www.thainationalparks.com/khao-sok-national-park/cheow-lan-lake',
            },
            {
              label: 'Причал и лодочный маршрут',
              url: 'https://www.khaosoktravel.com/khao-sok-local-experiences/cheow-lan-lake-experience',
            },
          ],
        },
      ],
    ),
    region(
      {
        id: 'isan',
        nameRu: 'Исан',
        nameEn: 'Isan',
        intro:
          'Пхимай лучше вписать в отдельную поездку по северо-востоку. Ближайшая удобная база — Корат.',
        stay: [
          {
            area: 'Накхонратчасима (Корат)',
            why: 'До Пхимая около 1–1,5 ч. При поездке автобусом заранее проверьте обратный рейс.',
          },
        ],
      },
      [
        {
          slug: 'phimai-historical-park',
          nameRu: 'Кхмерский храм Пхимай',
          nameEn: 'Prasat Hin Phimai (Phimai Historical Park)',
          summary:
            'Кхмерские башни и мост нагов. Из Кората примерно 1–1,5 ч на машине или автобусе.',
          description:
            'В центре Пхимая стоит кхмерское святилище с мостом нагов, каменными башнями и резными перемычками.',
          coords: { lat: 15.22083, lng: 102.49389 },
          mapsQuery: 'Prasat Hin Phimai (Phimai Historical Park)',
          pin: 'Главное святилище внутри исторического парка в центре Пхимая.',
          tags: ['temple-shrine', 'sight', 'day-trip'],
          base: 'Накхонратчасима (Корат).',
          visitDuration: '1–2 ч',
          timeEstimateHours: [1, 2],
          transport:
            'Из Кората 1–1,25 ч на машине или 1–1,5 ч автобусом от Bus Terminal 2. От остановки в Пхимае 5–15 мин пешком или на местном транспорте.',
          bestTime:
            'Зимой обычно сухо. На открытой территории удобнее рассматривать рельефы утром.',
          difficulty: 'Умеренно',
          practical:
            'Проверьте последний обратный автобус. Выезд проще совместить с другими местами Исана.',
          links: [
            {
              label: 'Описание комплекса',
              url: 'https://www.thailandtourismdirectory.go.th/en/attraction/725',
            },
            {
              label: 'Дорога из Кората',
              url: 'https://asiaroamer.com/en/korat/phimai/',
            },
          ],
        },
      ],
    ),
    region(
      {
        id: 'east',
        nameRu: 'Восток Сиамского залива',
        nameEn: 'Eastern Gulf of Thailand',
        intro:
          'Ко-Чанг удобнее выделить как отдельную базу на несколько ночей. Переезд из Краби требует отдельного дня.',
        stay: [
          {
            area: 'Уайт-Сэнд-Бич, Ко-Чанг',
            why: 'Жильё и кафе рядом с водой. От Трата до острова ехать через переправу Ao Thammachat.',
          },
        ],
      },
      [
        {
          slug: 'white-sand-beach',
          nameRu: 'Уайт-Сэнд-Бич на Ко-Чанге',
          nameEn: 'White Sand Beach (Hat Sai Khao)',
          summary:
            'Длинный песчаный пляж и закат на Ко-Чанге. От островного причала 15–25 мин на такси.',
          description:
            'На длинном песчаном берегу можно купаться, гулять и остаться на ужин к закату. Рядом с пляжем есть кафе, жильё и выходы к воде.',
          coords: { lat: 12.10303, lng: 102.27389 },
          mapsQuery: 'White Sand Beach Public Beach Access, Koh Chang',
          pin: 'Общедоступный проход на Уайт-Сэнд-Бич рядом с прибрежной дорогой.',
          tags: ['beach', 'relax', 'sunset'],
          base: 'Ко-Чанг. Трат подходит как промежуточная остановка перед паромом.',
          visitDuration: '3–6 ч',
          timeEstimateHours: [3, 6],
          transport:
            'Из Трата 35–50 мин до Ao Thammachat, 25–40 мин на автопароме до Ao Sapparot и 15–25 мин на такси или сонгтхэу до пляжа. Из Краби планируйте отдельный переезд с ночёвкой.',
          bestTime:
            'В конце декабря и начале января обычно суше, чем на Самуи и Ко-Тао. В праздники пляж и паром загружены.',
          difficulty: 'Легко с острова',
          practical:
            'Заложите очередь на паром и крутой участок дороги после высадки.',
          links: [
            {
              label: 'Переправа и дорога к пляжу',
              url: 'https://www.kohchangtaxis.com/guide/getting-to-koh-chang',
            },
            {
              label: 'Описание пляжа',
              url: 'https://en.wikivoyage.org/wiki/Ko_Chang',
            },
            {
              label: 'Общедоступный проход к пляжу',
              url: 'https://evendo.com/locations/thailand/koh-chang/attraction/public-beach-access',
            },
          ],
        },
      ],
    ),
  ],
};
