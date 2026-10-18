import type { GuidePlace } from './model';

type HighlightEntry = {
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  tags: string[];
  time: [number, number];
  mapsQuery: string;
  coords: NonNullable<GuidePlace['coords']>;
  bestTime: string;
  note: string;
  food?: boolean;
  sourceLabel: string;
  sourceUrl: string;
};

const highlightPlace = (city: string, entry: HighlightEntry): GuidePlace => ({
  slug: `${city}-${entry.slug}`,
  city,
  nameRu: entry.name,
  nameEn: entry.nameEn ?? entry.name,
  description: entry.description,
  tags: entry.tags,
  timeEstimateHours: entry.time,
  mapsQuery: entry.mapsQuery,
  coords: entry.coords,
  bestTime: entry.bestTime,
  note: entry.note,
  ...(entry.food ? { foodSpot: true } : {}),
  source: `${entry.sourceLabel}; проверено онлайн 18.10.2026. Время посещения — редакционная оценка; часы работы и цены уточняйте перед визитом.`,
  links: [{ label: entry.sourceLabel, url: entry.sourceUrl }],
});

const penang: HighlightEntry[] = [
  {
    slug: 'habitat',
    name: 'The Habitat Penang Hill',
    description:
      'Тропа длиной 1,6 км через дождевой лес на вершине Penang Hill и Curtis Crest Treetop Walk: круговая площадка над кронами с видом на Джорджтаун и пролив. Идите утром, чтобы застать птиц и тёмных лангуров; дополнительные активности вроде Glide of the Draco оплачиваются отдельно.',
    tags: ['nature', 'view', 'walk', 'wildlife', 'tickets-ahead'],
    time: [2, 3],
    mapsQuery:
      'The Habitat Penang Hill, Jalan Tuanku Yahya Petra, Bukit Bendera, Penang, Malaysia',
    coords: { lat: 5.4228, lng: 100.2652 },
    bestTime:
      'С открытия, в будни: меньше очередь на фуникулёр и больше шансов увидеть лангуров.',
    note: 'Входной билет — от RM54 в официальной онлайн-кассе (book.thehabitat.my), фуникулёр Penang Hill оплачивается отдельно. С 13.05.2026 на Curtis Crest идёт обновление: парк открыт, но отдельные зоны временно закрывают. Часы работы уточняйте.',
    sourceLabel: 'The Habitat — официальный сайт и онлайн-касса',
    sourceUrl: 'https://www.thehabitat.my/',
  },
  {
    slug: 'blue-mansion',
    name: 'Cheong Fatt Tze — The Blue Mansion',
    description:
      'Особняк XIX века цвета индиго, построенный по фэншуй для торгового магната Чён Фатт Цзе. Внутрь пускают только с экскурсией (около 45 минут): гид рассказывает о планировке с внутренними дворами, витражах и шотландском чугунном литье.',
    tags: ['sight', 'museum', 'tickets-ahead'],
    time: [1, 1.5],
    mapsQuery:
      'Cheong Fatt Tze The Blue Mansion, 14 Lebuh Leith, George Town, Penang, Malaysia',
    coords: { lat: 5.4215, lng: 100.3348 },
    bestTime: 'На первую утреннюю экскурсию; приходите за 15 минут до начала.',
    note: 'Особняк работает как бутик-отель, гостей без брони пускают только на экскурсии по расписанию (в путеводителях — около 11:00, 14:00 и 15:30). Билет — около RM25 со взрослого по данным блогов, без возврата. Расписание и цену уточняйте на официальном сайте.',
    sourceLabel: 'Cheong Fatt Tze Mansion — официальный сайт',
    sourceUrl: 'https://www.cheongfatttzemansion.com/',
  },
  {
    slug: 'peranakan-mansion',
    name: 'Pinang Peranakan Mansion',
    description:
      'Дом капитана Чун Кенг Ки, ставший музеем быта перанаканов (потомков китайских переселенцев, смешавших китайскую и малайскую культуры): зелёный фасад, позолоченная резьба, кафель и более тысячи предметов антиквариата. Главное — центральный двор с фонарями и галереей второго этажа; загляните и в соседний родовой храм Чун Кенг Ки.',
    tags: ['sight', 'museum'],
    time: [1, 1.5],
    mapsQuery:
      'Pinang Peranakan Mansion, 29 Lebuh Gereja, George Town, Penang, Malaysia',
    coords: { lat: 5.4178, lng: 100.3411 },
    bestTime: 'К открытию в 9:30, до тургрупп.',
    note: 'По данным путеводителей открыт ежедневно 9:30–17:00, взрослый билет около RM20 (дети до 6 лет бесплатно) — уточняйте на кассе.',
    sourceLabel: 'Pinang Peranakan Mansion — официальный сайт',
    sourceUrl: 'https://www.pinangperanakanmansion.com.my/',
  },
  {
    slug: 'khoo-kongsi',
    name: 'Khoo Kongsi',
    nameEn: 'Leong San Tong Khoo Kongsi',
    description:
      'Самый пышный клановый храм Пенанга, спрятанный внутри квартала старых домов клана Ху: крыша с фарфоровыми фигурками, резные балки и позолота повсюду. На первом этаже небольшой музей об истории клана и китайских переселенцев.',
    tags: ['temple-shrine', 'sight'],
    time: [1, 1.5],
    mapsQuery:
      'Leong San Tong Khoo Kongsi, 18 Cannon Square, George Town, Penang, Malaysia',
    coords: { lat: 5.4143, lng: 100.3376 },
    bestTime:
      'Утром в будни или за час до закрытия, когда во дворе меньше людей.',
    note: 'Обычно ежедневно 9:00–17:00; вход RM10–15 со взрослого (источники расходятся) — уточняйте на кассе. Это действующее святилище: плечи и колени закрыты. До Clan Jetties — 5–10 минут пешком.',
    sourceLabel: 'Khoo Kongsi — официальный сайт',
    sourceUrl: 'https://www.khookongsi.com.my/',
  },
  {
    slug: 'clan-jetties',
    name: 'Clan Jetties (Chew Jetty)',
    description:
      'Деревни на сваях, где с XIX века живут семьи китайских кланов. Пройдите по деревянному настилу Chew Jetty до конца, к виду на пролив, а потом загляните на соседние, более тихие Tan Jetty и Lim Jetty.',
    tags: ['walk', 'sight', 'sunset'],
    time: [0.5, 1.5],
    mapsQuery: 'Chew Jetty, Weld Quay, George Town, Penang, Malaysia',
    coords: { lat: 5.412, lng: 100.34 },
    bestTime: 'На закате или рано утром: днём на Chew Jetty людно и жарко.',
    note: 'Бесплатно. Это жилые дома: не заходите в открытые двери, не снимайте жильцов без спроса, вечером не шумите. Сувенирные лавки работают в основном днём.',
    sourceLabel: 'Wikipedia — Clan Jetties',
    sourceUrl: 'https://en.wikipedia.org/wiki/Clan_Jetties',
  },
  {
    slug: 'hin-bus-depot',
    name: 'Hin Bus Depot',
    description:
      'Бывшее автобусное депо, ставшее арт-кварталом: выставочный зал, муралы, мастерские художников, кофейни и бары. Приходите на выходных: работает маркет местных мастеров с керамикой, принтами, винтажем и уличной едой.',
    tags: ['sight', 'shopping', 'cafe'],
    time: [1, 2],
    mapsQuery:
      'Hin Bus Depot, 31A Jalan Gurdwara, George Town, Penang, Malaysia',
    coords: { lat: 5.412, lng: 100.3278 },
    bestTime:
      'В дни маркета: пятница 12:00–19:00, суббота и воскресенье 10:00–17:00.',
    note: 'Территория открыта ежедневно 10:00–22:00, выставочный зал — пн–пт 12:00–19:00, сб–вс 10:00–19:00; у кафе и магазинов свой график (официальный гид). Парковки мало — удобнее Grab или пешком от Komtar (~600 м). С животными нельзя.',
    sourceLabel: 'Hin Bus Depot — официальный гид для посетителей',
    sourceUrl: 'https://hinbusdepot.com/visitor-guide',
  },
  {
    slug: 'entopia',
    name: 'Entopia by Penang Butterfly Farm',
    description:
      'Крытый сад с тысячами живых бабочек и интерактивным павильоном о насекомых и других мелких животных. Бабочки активнее всего солнечным утром; с четверга по воскресенье вечером работает Entopia by Night — сад с биофлуоресцентной подсветкой.',
    tags: ['nature', 'wildlife', 'tickets-ahead'],
    time: [2, 3],
    mapsQuery:
      'Entopia by Penang Butterfly Farm, 830 Jalan Teluk Bahang, Teluk Bahang, Penang, Malaysia',
    coords: { lat: 5.4476, lng: 100.2151 },
    bestTime:
      'С открытия в 9:00 в солнечный день; ночная программа — после 19:00.',
    note: 'Днём ежедневно 9:00–18:00 (последний вход в 17:00): взрослый RM75, ребёнок 4–12 лет RM55. Entopia by Night — чт–вс 19:00–22:00, взрослый RM40, билеты только онлайн заранее. Рядом ESCAPE и вход в нацпарк — удобно объединить в один день.',
    sourceLabel: 'Entopia — официальная страница для посетителей',
    sourceUrl: 'https://www.entopia.com/visitor-info/',
  },
  {
    slug: 'national-park-kerachut',
    name: 'Национальный парк Пенанга и пляж Kerachut',
    nameEn: 'Penang National Park & Kerachut Beach',
    description:
      'От входа в Teluk Bahang лесная тропа (около 3 км, до полутора часов) ведёт к пустынному пляжу Kerachut с черепашьим питомником и сезонным меромиктическим озером, где пресная вода лежит поверх солёной. Обратно можно вернуться на лодке, договорившись у пирса у входа.',
    tags: ['nature', 'beach', 'adventure', 'wildlife', 'morning'],
    time: [4, 6],
    mapsQuery:
      'Penang National Park, Jalan Hassan Abas, Teluk Bahang, Penang, Malaysia',
    coords: { lat: 5.4598, lng: 100.206 },
    bestTime: 'Выходите к 8:00, пока не жарко; озеро заметнее в сухой сезон.',
    note: 'На входе нужно зарегистрироваться; сборы и состояние троп уточняйте в офисе парка, подвесной мост-канопи закрыт. Купаться у Kerachut не советуют: течения и медузы. Лодка от Teluk Bahang — порядка RM100 и выше (неофициально, договаривайтесь заранее). Возьмите воду и закрытую обувь.',
    sourceLabel: 'NRES — Pulau Pinang National Park',
    sourceUrl:
      'https://www.nres.gov.my/en-my/KetsaEcoPark/Pages/PulauPinangNationalPark.aspx',
  },
  {
    slug: 'the-top-komtar',
    name: 'The TOP Komtar (Rainbow Skywalk)',
    description:
      'Смотровая на крыше башни Komtar: Rainbow Skywalk со стеклянным полом на высоте 249 м и обзорная палуба с видом на крыши старого города, пролив и мосты на материк. Поднимайтесь за час до заката, чтобы застать город и днём, и в огнях.',
    tags: ['view', 'sunset', 'tickets-ahead', 'low-mobility'],
    time: [1, 2],
    mapsQuery: 'THE TOP Komtar, Jalan Penang, George Town, Penang, Malaysia',
    coords: { lat: 5.4146, lng: 100.3298 },
    bestTime: 'За час до заката; в дождь Rainbow Skywalk закрывают.',
    note: 'Билеты продаются пакетами (Skywalk, Observatory, Skybridge и др.); по данным касс и путеводителей открыто 10:00–22:00, по вторникам до 19:00. Онлайн обычно дешевле, чем в кассе. Цены и часы уточняйте на официальном сайте. Внизу — торговый центр и главный автобусный узел Komtar.',
    sourceLabel: 'THE TOP Penang — официальный сайт',
    sourceUrl: 'https://thetop.com.my/',
  },
  {
    slug: 'wat-chaiya-burmese',
    name: 'Wat Chaiyamangkalaram и Dhammikarama Burmese Temple',
    nameEn: 'Wat Chaiyamangkalaram & Dhammikarama Burmese Temple',
    description:
      'Два буддийских храма друг напротив друга на Lorong Burma. В тайском Wat Chaiyamangkalaram лежит позолоченный Будда длиной 33 м, в бирманском Dhammikarama — белые слоны у ворот, пагода и резные залы.',
    tags: ['temple-shrine', 'sight'],
    time: [1, 1.5],
    mapsQuery:
      'Wat Chaiyamangkalaram, 17 Lorong Burma, Pulau Tikus, George Town, Penang, Malaysia',
    coords: { lat: 5.4317, lng: 100.3134 },
    bestTime: 'Утром, до жары.',
    note: "Вход бесплатный, пожертвования приветствуются. Часы по разным источникам — примерно с 6:00–7:00 до 17:30–18:00. Плечи и колени закрыты, обувь снимают у входа в залы. Рядом Ravi's Famous Apom Manis и Gurney Drive.",
    sourceLabel: 'Time Out Penang — Wat Chayamangkalaram',
    sourceUrl:
      'https://www.timeout.com/penang/attractions/wat-chayamangkalaram-buddhist-temple',
  },
  {
    slug: 'little-india-kapitan-keling',
    name: 'Little India и мечеть Kapitan Keling',
    nameEn: 'Little India & Kapitan Keling Mosque',
    description:
      'Квартал вокруг Lebuh Queen и Lebuh Pasar с лавками специй и сари, гирляндами из жасмина и музыкой из колонок. Зайдите в индуистский храм Sri Mahamariamman и в мечеть Kapitan Keling начала XIX века: туристам выдают халаты, волонтёры проводят бесплатные экскурсии.',
    tags: ['walk', 'temple-shrine', 'shopping'],
    time: [1, 2],
    mapsQuery:
      'Masjid Kapitan Keling, Jalan Masjid Kapitan Keling, George Town, Penang, Malaysia',
    coords: { lat: 5.417, lng: 100.3371 },
    bestTime:
      'Ближе к вечеру, когда спадает жара; в пятницу днём мечеть закрыта для туристов из-за молитвы.',
    note: 'Часы посещения мечети для немусульман в источниках расходятся (обычно днём, с перерывами на молитву) — уточняйте на месте. Халаты и платки бесплатно, в молельный зал не пускают. Перед Дипавали квартал особенно людный и украшен.',
    sourceLabel: 'OnPenang — Kapitan Keling Mosque',
    sourceUrl: 'https://onpenang.com/kapitan-keling-mosque/',
  },
  {
    slug: 'escape',
    name: 'ESCAPE Penang',
    description:
      'Парк приключений в джунглях Teluk Bahang: верёвочные трассы, тарзанки, вышки для прыжков в воду и аквазона с трубчатой горкой — рекордсменом Книги Гиннесса по длине. Аттракционы работают на мускульной силе и гравитации, поэтому подходят и детям, и взрослым.',
    tags: ['adventure', 'tickets-ahead'],
    time: [4, 6],
    mapsQuery:
      'ESCAPE Penang, 828 Jalan Teluk Bahang, Teluk Bahang, Penang, Malaysia',
    coords: { lat: 5.4487, lng: 100.2166 },
    bestTime: 'С открытия в будни; после обеда часто бывают ливни.',
    note: 'Ежедневно 10:00–18:00 (официальный сайт). Онлайн-билеты дешевле, до −30%; перед визитом просят зарегистрировать лицо для входа. Дети до 3 лет и сеньоры 61+ с MyKad проходят бесплатно. Возьмите купальник и сменную одежду. Цены уточняйте.',
    sourceLabel: 'ESCAPE Penang — официальный сайт',
    sourceUrl: 'https://escape.my/pg',
  },
  {
    slug: 'fort-cornwallis',
    name: 'Форт Корнуоллис',
    nameEn: 'Fort Cornwallis',
    description:
      'Звездообразный форт на месте, где в 1786 году высадился Фрэнсис Лайт, основатель британского Пенанга. 25 июля 2026 года форт открылся после десятилетней реставрации: южный и западный рвы впервые за сто лет снова с водой, внутри восстановленные сводчатые склады и 10 новых экспозиционных галерей.',
    tags: ['sight', 'museum', 'walk'],
    time: [1, 2],
    mapsQuery:
      'Fort Cornwallis, Jalan Tun Syed Sheh Barakbah, George Town, Penang, Malaysia',
    coords: { lat: 5.4204, lng: 100.3443 },
    bestTime:
      'Утром или после 16:00, когда спадает жара; закат — на соседней набережной Esplanade.',
    note: 'До 31.08.2026 вход был бесплатным; часы и цены после этой даты уточняйте. Рядом часовая башня Queen Victoria и обновлённый Penang State Museum (открылся 23.07.2026 после реставрации).',
    sourceLabel: 'Aga Khan Development Network — о реставрации Fort Cornwallis',
    sourceUrl:
      'https://the.akdn/en/resources-media/multimedia/video/what-has-changed-at-fort-cornwallis',
  },
  {
    slug: 'gurney-drive-hawker',
    name: 'Gurney Drive Hawker Centre',
    description:
      'Вечерний фудкорт на набережной Persiaran Gurney — самое туристическое место, чтобы попробовать пенангскую уличную еду за один заход. Возьмите на компанию пасембур (индийский салат под сладко-острым соусом), фруктовый рохак с креветочной пастой, устричный омлет oh chien и char koay teow, а потом пройдитесь по набережной Gurney Bay.',
    tags: ['food', 'sunset'],
    time: [1, 1.5],
    mapsQuery:
      'Gurney Drive Hawker Centre, Persiaran Gurney, George Town, Penang, Malaysia',
    coords: { lat: 5.4341, lng: 100.3149 },
    bestTime: 'С 18:00 до 22:00; перед ужином — закат на набережной.',
    note: 'Бюджет — несколько ринггитов за блюдо, платят в основном наличными; у каждой стойки свой выходной. Штат планирует перевести хокеров в новый фудкорт Gurney Bay к 2027 году — перед поездкой проверьте, где они работают.',
    food: true,
    sourceLabel: 'SAYS — о переезде хокеров Gurney Drive в Gurney Bay',
    sourceUrl:
      'https://says.com/my/lifestyle/eats/penangs-gurney-drive-hawkers-to-relocate-to-new-gurney-bay-by-2027',
  },
  {
    slug: 'chulia-kimberley-hawkers',
    name: 'Ночные хокеры Chulia и Kimberley Street',
    nameEn: 'Chulia Street & Kimberley Street Night Hawkers',
    description:
      'Вечером тележки и столики выстраиваются вдоль Lebuh Kimberley, Lebuh Carnarvon и Chulia Street — получается уличная столовая старого города. На Kimberley работает суп с лапшой Super Star Koay Teow Soup из Bib Gourmand Мишлен, у Chulia — известная wantan mee Mother & Son; попробуйте пару блюд у разных ларьков и закончите соком сахарного тростника.',
    tags: ['food', 'nightlife', 'walk'],
    time: [1, 2],
    mapsQuery: 'Lebuh Kimberley, George Town, Penang, Malaysia',
    coords: { lat: 5.4152, lng: 100.3347 },
    bestTime: 'С 19:00 до 23:00; в выходные очереди длиннее.',
    note: 'Несколько ринггитов за блюдо, только наличные. Super Star Koay Teow Soup (78 Lebuh Kimberley) по данным Мишлен открыт 8:00–22:00, в среду выходной; у уличных ларьков свои выходные, часть стоек Chulia переехала на угол с Lebuh Carnarvon — уточняйте на месте.',
    food: true,
    sourceLabel: 'MICHELIN Guide — Super Star Koay Teow Soup',
    sourceUrl:
      'https://guide.michelin.com/en/pulau-pinang/my-george-town/restaurant/super-star-koay-teow-soup',
  },
  {
    slug: 'siam-road-char-koay-teow',
    name: 'Siam Road Char Koay Teow',
    description:
      'Уличный ларёк из Bib Gourmand Мишлен с одним блюдом — char koay teow: плоская рисовая лапша, обжаренная на углях с сильным «дыханием вока». Берите острую версию с добавкой креветок и моллюсков-кокли: гид Мишлен считает доплату оправданной.',
    tags: ['food'],
    time: [0.5, 1.5],
    mapsQuery:
      'Siam Road Char Koay Teow, 82 Jalan Siam, George Town, Penang, Malaysia',
    coords: { lat: 5.4148, lng: 100.321 },
    bestTime: 'К открытию в 12:00: очередь собирается заранее.',
    note: 'Вт–сб 12:00–18:00, вс и пн выходной (по данным Мишлен); только наличные, порция — несколько ринггитов. В очереди можно простоять долго; ларёк иногда закрывается без предупреждения — проверьте свежие отзывы.',
    food: true,
    sourceLabel: 'MICHELIN Guide — Siam Road Char Koay Teow (Bib Gourmand)',
    sourceUrl:
      'https://guide.michelin.com/en/pulau-pinang/my-george-town/restaurant/siam-road-char-koay-teow',
  },
  {
    slug: 'teochew-chendul',
    name: 'Penang Road Famous Teochew Chendul',
    description:
      'Ларёк в переулке Keng Kwee у Penang Road, где семья Тан продаёт чендол с 1936 года: колотый лёд, зелёная лапша из рисовой муки с панданом, красная фасоль, кокосовое молоко и сироп из пальмового сахара гула-мелака. Едят стоя у ларька или в соседней кофейне; рядом Penang Road Famous Laksa из каталога.',
    tags: ['food'],
    time: [0.25, 0.5],
    mapsQuery:
      'Penang Road Famous Teochew Chendul, 27 Lebuh Keng Kwee, George Town, Penang, Malaysia',
    coords: { lat: 5.4171, lng: 100.3307 },
    bestTime: 'Днём, в самую жару; очередь движется быстро.',
    note: 'Несколько ринггитов, наличные. Филиалы с тем же названием есть по всей Малайзии, но оригинальный ларёк — здесь, на Lebuh Keng Kwee. Часы уточняйте.',
    food: true,
    sourceLabel: 'Timothy Tye — Penang Road Famous Teochew Chendul',
    sourceUrl:
      'https://penang-traveltips.com/penang-road-famous-teochew-chendul.htm',
  },
  {
    slug: 'toh-soon-cafe',
    name: 'Toh Soon Cafe',
    description:
      'Кофейня-копитиам прямо в узком переулке у Campbell Street: хлеб поджаривают на углях, кофе заваривают по-старому, через тканевый фильтр. Классический заказ — тост с кая (кокосово-яичный джем) и маслом, яйца всмятку с соевым соусом и перцем и кофе kopi со сгущёнкой.',
    tags: ['food', 'cafe', 'morning'],
    time: [0.5, 1],
    mapsQuery:
      'Toh Soon Cafe, 184 Lebuh Campbell, George Town, Penang, Malaysia',
    coords: { lat: 5.4188, lng: 100.3321 },
    bestTime:
      'С открытия около 8:00: к середине утра собирается очередь за столиками.',
    note: 'По данным Time Out — пн–сб 8:00–18:00, вс выходной; другие источники пишут о закрытии раньше, уточняйте. Бюджет — несколько ринггитов, наличные; столики общие, места мало.',
    food: true,
    sourceLabel: 'Time Out Penang — Toh Soon Cafe',
    sourceUrl:
      'https://www.timeout.com/penang/restaurants-and-cafes/toh-soon-cafe',
  },
  {
    slug: 'ravis-apom-manis',
    name: "Ravi's Famous Apom Manis",
    description:
      'Ларёк из Bib Gourmand Мишлен, где с 1920-х годов пекут апом манис — тонкие кокосовые блинчики в глиняных горшочках на углях: края хрустят, середина мягкая и пышная. Берите сразу несколько штук, пока горячие, и кофе в кофейне, где стоит ларёк.',
    tags: ['food', 'morning'],
    time: [0.25, 0.5],
    mapsQuery:
      "Ravi's Famous Apom Manis, 319 Jalan Burma, Pulau Tikus, George Town, Penang, Malaysia",
    coords: { lat: 5.4305, lng: 100.3126 },
    bestTime: 'Рано утром: по данным Мишлен, к 9:30 всё раскупают.',
    note: 'Ларёк стоит в кофейне Keat Hoe (бывшая Swee Kong) на Jalan Burma в Пулау-Тикус. По свежим обзорам открывается около 6:00, в четверг выходной; на сайте Мишлен указаны другие часы — уточняйте. В 2025 году пять штук стоили около RM6, только наличные. Рядом храмы Wat Chaiyamangkalaram и Dhammikarama.',
    food: true,
    sourceLabel: "MICHELIN Guide — Ravi's Famous Apom Manis (Bib Gourmand)",
    sourceUrl:
      'https://guide.michelin.com/en/pulau-pinang/my-george-town/restaurant/ravi-s-famous-apom-manis',
  },
];

export const malaysiaHighlights: Record<string, GuidePlace[]> = {
  penang: penang.map((entry) => highlightPlace('penang', entry)),
};
