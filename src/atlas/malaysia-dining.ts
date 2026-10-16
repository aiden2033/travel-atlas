import type { GuidePlace } from './model';

type DiningEntry = {
  slug: string;
  name: string;
  description: string;
  mapsQuery: string;
  time: [number, number];
  cafe?: boolean;
  bestTime: string;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
  coords?: GuidePlace['coords'];
  extraLinks?: GuidePlace['links'];
};

const michelin =
  'https://guide.michelin.com/my/en/pulau-pinang/my-george-town/restaurant/';
const langkawiFoodGuide =
  'https://naturallylangkawi.my/wp-content/uploads/2023/07/Langkawi-Food-Guide-2023.pdf';
const kedahDirectory =
  'https://www.kedah.gov.my/wp-content/uploads/2024/10/KEDAH-TOURISM-DIRECTORY.pdf';

const diningPlace = (city: string, entry: DiningEntry): GuidePlace => ({
  slug: `${city}-${entry.slug}`,
  city,
  nameRu: entry.name,
  nameEn: entry.name,
  description: entry.description,
  tags: entry.cafe ? ['food', 'cafe'] : ['food'],
  timeEstimateHours: entry.time,
  mapsQuery: entry.mapsQuery,
  ...(entry.coords ? { coords: entry.coords } : {}),
  bestTime: entry.bestTime,
  note: entry.note,
  foodSpot: true,
  source: `${entry.sourceLabel}; проверено онлайн 16.10.2026. Время посещения и бюджетная категория — редакционная оценка; меню и график уточняйте перед визитом.`,
  links: [
    { label: entry.sourceLabel, url: entry.sourceUrl },
    ...(entry.extraLinks ?? []),
  ],
});

const penang: DiningEntry[] = [
  {
    slug: 'ome-spacebar-coffee',
    name: 'Ome by Spacebar Coffee',
    description:
      'Маленький specialty-бар для знакомства с зерном разных обжарщиков: основной повод зайти — фильтр, а не большой завтрак. Попросите посоветовать кофе из текущей ротации и возьмите домашний фруктовый кекс. Хорошая остановка между прогулками по старому Джорджтауну.',
    mapsQuery:
      'Ome by Spacebar Coffee, 1 Lorong Toh Aka, George Town, Penang, Malaysia',
    time: [0.5, 1],
    cafe: true,
    bestTime:
      'Ранним утром; расписание на официальном сайте различается по дням.',
    note: 'Средний бюджет для кофе с выпечкой. Фильтр и ассортимент тортов меняются; конкретное зерно не гарантировано.',
    sourceLabel: 'Ome — официальный сайт и актуальный кофейный бар',
    sourceUrl: 'https://ome.coffee/',
  },
  {
    slug: 'norm-micro-roastery',
    name: 'Norm Micro Roastery',
    description:
      'Обжарочная и просторное кафе в переоборудованном здании на Gat Lebuh Gereja. Идти за кофе и спокойной паузой в современном интерьере: закажите чёрный кофе, чтобы познакомиться с обжаркой, и выберите десерт из сегодняшней витрины.',
    mapsQuery:
      'Norm Micro Roastery, 13 Gat Lebuh Gereja, George Town, Penang, Malaysia',
    time: [0.75, 1.5],
    cafe: true,
    bestTime: 'Днём между прогулками по набережной и историческому центру.',
    note: 'Средний бюджет; адрес относится к Micro Roastery, а не к другим точкам Norm. Меню и наличие мест уточняйте в день визита.',
    sourceLabel: 'Cafe Culture Malaysia — Norm Micro Roastery',
    sourceUrl:
      'https://cafeculture.my/cafes/penang/george-town/norm-micro-roastery/',
  },
  {
    slug: 'narrow-marrow',
    name: 'Narrow Marrow',
    description:
      'Кафе творческого сообщества с винтажными предметами и непринуждённой атмосферой. Сюда стоит идти за сочетанием кофе и тирамису; любителям необычных напитков можно спросить про toddy — пальмовое вино. Уточняйте алкоголь в составе десертов.',
    mapsQuery: 'Narrow Marrow, 312 Lebuh Pantai, George Town, Penang, Malaysia',
    time: [0.75, 1.25],
    cafe: true,
    bestTime:
      'На дневной десерт; сначала проверьте, работает ли кафе в выбранный день.',
    note: 'Средний бюджет. Действующий адрес — 312 Lebuh Pantai; в старых публикациях встречается прежнее помещение.',
    sourceLabel: 'Cafe Culture Malaysia — Narrow Marrow',
    sourceUrl: 'https://cafeculture.my/cafes/penang/george-town/narrow-marrow/',
  },
  {
    slug: 'black-kettle',
    name: 'Black Kettle',
    description:
      'Пекарня и кафе на Beach Street для тех, кому после местной уличной еды хочется европейского хлеба. Выберите хлеб на закваске или выпечку и кофе: собственный levain и французские пекарские техники — основа этого места.',
    mapsQuery: 'Black Kettle, 105 Beach Street, George Town, Penang, Malaysia',
    time: [0.5, 1],
    cafe: true,
    bestTime: 'Дневная пауза на Beach Street.',
    note: 'Средний бюджет. Это пекарня с кафе; доступный ассортимент выпечки смотрите на месте.',
    sourceLabel: 'Black Kettle — официальная пекарня и адрес',
    sourceUrl: 'https://blackkettle.com.my/our-bakery',
  },
  {
    slug: 'chinahouse',
    name: 'ChinaHouse',
    description:
      'Длинный комплекс исторических домов с двориком, кафе и художественными пространствами. Идти за атмосферой и витриной тортов: выберите кусок по вкусу, добавьте кофе и оставьте время заглянуть во внутренний двор. Музыкальную программу проверяйте отдельно.',
    mapsQuery: 'ChinaHouse, 153 Beach Street, George Town, Penang, Malaysia',
    time: [0.75, 1.5],
    cafe: true,
    bestTime:
      'После дневной прогулки; вечером — если подходит текущая программа.',
    note: 'Средний бюджет. Комплекс имеет входы с Beach Street и Victoria Street; это одна карточка, а не два филиала.',
    sourceLabel: 'ChinaHouse — официальный адрес и устройство комплекса',
    sourceUrl: 'https://chinahouse.com.my/location.html',
  },
  {
    slug: 'au-jardin',
    name: 'Au Jardin',
    description:
      'Особенный гастрономический вечер в The Warehouse при арт-пространстве Hin Bus Depot. Дегустационное меню соединяет европейскую технику с местными продуктами. У Michelin отмечены утка и домашний хлеб с томатным маслом; текущий состав сета может отличаться.',
    mapsQuery:
      'Restaurant Au Jardin, The Warehouse Hin Bus Depot, 125 Jalan Timah, George Town, Penang, Malaysia',
    time: [2, 3],
    bestTime: 'Заранее забронированный ужин.',
    note: 'Высокий бюджет; уточните стоимость сета, депозит и ограничения питания при бронировании. Одна звезда в MICHELIN Guide Kuala Lumpur & Penang 2026.',
    sourceLabel: 'MICHELIN Guide — Au Jardin',
    sourceUrl: `${michelin}au-jardin`,
    extraLinks: [
      {
        label: 'MICHELIN Guide 2026 — официальная подборка и звёзды',
        url: 'https://guide.michelin.com/my/en/article/michelin-guide-ceremony/full-list-michelin-guide-my-2026',
      },
    ],
  },
  {
    slug: 'auntie-gaik-lean',
    name: 'Auntie Gaik Lean’s Old School Eatery',
    description:
      'Кухня ньонья в ретро-зале на Lebuh Bishop: хороший адрес, чтобы попробовать перанаканские блюда за общим столом. Начните с хрустящих корзиночек pie tee, добавьте gulai tumis и ароматный рис nasi ulam — именно их выделяют инспекторы Michelin.',
    mapsQuery:
      "Auntie Gaik Lean's Old School Eatery, 1 Lebuh Bishop, George Town, Penang, Malaysia",
    time: [1.25, 2],
    bestTime: 'Обед или ужин с предварительным бронированием.',
    note: 'Средний–высокий бюджет, удобнее делить блюда на компанию. Одна звезда в MICHELIN Guide Kuala Lumpur & Penang 2026.',
    sourceLabel: 'MICHELIN Guide — Auntie Gaik Lean’s Old School Eatery',
    sourceUrl: `${michelin}auntie-gaik-lean-s-old-school-eatery`,
    extraLinks: [
      {
        label: 'MICHELIN Guide 2026 — официальная подборка и звёзды',
        url: 'https://guide.michelin.com/my/en/article/michelin-guide-ceremony/full-list-michelin-guide-my-2026',
      },
    ],
  },
  {
    slug: 'jawi-house',
    name: 'Jawi House',
    description:
      'Ресторан на Armenian Street знакомит с Jawi Peranakan: малайские, индийские и ближневосточные влияния встречаются в одной кухне. Попробуйте jawi laksa lemak с рыбой и кокосовым молоком либо один из вариантов бирьяни; к началу обеда подойдёт roti surai с карри.',
    mapsQuery:
      'Jawi House Cafe Gallery, 85 Lebuh Armenian, George Town, Penang, Malaysia',
    time: [1, 1.75],
    bestTime: 'Обед во время прогулки по Armenian Street.',
    note: 'Средний бюджет. Бронирование полезно для компании; актуальное меню доступно у ресторана.',
    sourceLabel: 'Jawi House — официальное меню',
    sourceUrl: 'https://www.jawihouse.com/menu?menu=ala-carte-jawi-house',
  },
  {
    slug: 'teksen',
    name: 'Teksen',
    description:
      'Семейная кантонская кухня с местными акцентами и блюдами в центр стола. Хороший выбор для компании: домашний жареный тофу с анчоусами, суп дня и рис дают больше представления о кухне, чем одна большая порция на человека.',
    mapsQuery:
      'Teksen Restaurant, 18 and 20 Lebuh Carnarvon, George Town, Penang, Malaysia',
    time: [1, 2],
    bestTime: 'На обед или ужин, оставив запас на очередь.',
    note: 'Средний бюджет. В опубликованных графиках есть расхождения: уточните день работы напрямую, прежде чем строить вокруг ресторана маршрут.',
    sourceLabel: 'MICHELIN Guide — Teksen',
    sourceUrl: `${michelin}teksen`,
  },
  {
    slug: 'deens-maju',
    name: 'Deens Maju Nasi Kandar',
    description:
      'Шумный адрес за nasi kandar: рис с несколькими карри и дополнениями, который собирают по вашему выбору. Начните с жареной курицы ayam goreng и попросите смешать подливы. Это остановка ради характерной пенангской еды, с очередью как частью опыта.',
    mapsQuery:
      'Deens Maju Nasi Kandar, 170 Jalan Gurdwara, George Town, Penang, Malaysia',
    time: [0.75, 1.5],
    bestTime: 'На обед с запасом на очередь.',
    note: 'Низкий–средний бюджет в зависимости от добавок. Попросите небольшую порцию соусов, если плохо переносите острое; цену морепродуктов уточняйте до заказа.',
    sourceLabel: 'PenangTime — Deens Maju, курица и nasi kandar',
    sourceUrl: 'https://site.penangtime.com/detail/deens-maju-nasi-kandar',
  },
  {
    slug: 'penang-road-famous-laksa',
    name: 'Penang Road Famous Laksa',
    description:
      'Конкретная точка для знакомства с asam laksa: толстая рисовая лапша в рыбном бульоне с кисло-острым балансом. Закажите фирменную лаксу; если хочется плотнее поесть, добавьте char koay teow с утиным яйцом. Это нынешний адрес семьи, ранее работавшей в Joo Hooi Café.',
    mapsQuery:
      'Penang Road Famous Laksa, 5 Lebuh Keng Kwee, George Town, Penang, Malaysia',
    time: [0.5, 1],
    bestTime: 'Дневной перекус между прогулками по George Town.',
    note: 'Низкий бюджет. Не путать с другим бизнесом в старом Joo Hooi Café; ориентир — дом 5 на Lebuh Keng Kwee.',
    sourceLabel: 'MICHELIN Guide — Penang Road Famous Laksa',
    sourceUrl: `${michelin}penang-road-famous-laksa`,
  },
  {
    slug: 'moh-teng-pheow',
    name: 'Moh Teng Pheow Nyonya Koay',
    description:
      'Историческая мастерская ньонья-сладостей с внутренним двориком. Берите маленькую подборку kuih: слоёный kueh lapis, кокосовый kueh talam и ang koo дают разные текстуры без большого обеда. Подходит для знакомства с местными десертами вместо привычного торта.',
    mapsQuery:
      'Moh Teng Pheow Nyonya Koay, Jalan Masjid off Lebuh Chulia, George Town, Penang, Malaysia',
    time: [0.5, 1],
    bestTime: 'Днём, пока есть выбор свежих kuih.',
    note: 'Низкий бюджет; популярные позиции могут закончиться. Вход ищите в переулке Jalan Masjid, отходящем от Chulia Street.',
    sourceLabel: 'MICHELIN Guide — Moh Teng Pheow Nyonya Koay',
    sourceUrl: `${michelin}moh-teng-pheow-nyonya-koay`,
  },
];

const langkawi: DiningEntry[] = [
  {
    slug: 'smiling-buffalo',
    name: 'Smiling Buffalo',
    description:
      'Садовое кафе среди деревянных построек недалеко от Cenang: один из самых приятных вариантов для неторопливого утра. Возьмите кофе и завтрак из текущего меню; главный повод приехать — сочетание кофейной паузы и зелёного двора.',
    mapsQuery:
      'Smiling Buffalo Cafe, 965 Jalan Pantai Cenang, Mukim Kedawang, Langkawi, Malaysia',
    coords: { lat: 6.30457, lng: 99.7219 },
    time: [0.75, 1.5],
    cafe: true,
    bestTime: 'Утро или бранч.',
    note: 'Средний бюджет. Дневное кафе; перед поездкой проверьте актуальное время закрытия кухни.',
    sourceLabel: 'Langkawi Development Authority — Food Guide, Smiling Buffalo',
    sourceUrl: langkawiFoodGuide,
  },
  {
    slug: 'coffeenuts',
    name: 'CoffeeNuts Cafe',
    description:
      'Небольшая кофейная остановка у подъезда к водопаду Telaga Tujuh. Сюда удобно заехать после подъёма: закажите кофе и отдохните в открытом пространстве с ручным декором. Это удачное дополнение к северо-западу острова, а не отдельная поездка через весь Лангкави.',
    mapsQuery: 'CoffeeNuts Cafe, 12 Jalan Telaga Tujuh, Langkawi, Malaysia',
    time: [0.5, 1],
    cafe: true,
    bestTime: 'Дневная пауза после Telaga Tujuh.',
    note: 'Низкий–средний бюджет. У справочников расходятся выходные, поэтому проверьте публикации кафе перед выездом к водопаду.',
    sourceLabel: 'ArrivalGuides — CoffeeNuts Cafe и адрес',
    sourceUrl:
      'https://www.arrivalguides.com/en/Travelguide/Langkawi/cafes/coffeenuts-cafe-124287',
  },
  {
    slug: 'arts-cafe',
    name: 'Arts Café Langkawi',
    description:
      'Кафе-галерея в Куахе с картинами на стенах: полезный адрес для спокойного обеда во время городских дел. Начните с кофе и посмотрите дневное меню местных и европейских блюд; здесь интереснее сделать полноценную паузу, чем брать напиток навынос.',
    mapsQuery:
      'Arts Cafe Langkawi, 54 Jalan Pandak Mayah 5, Kuah, Langkawi, Malaysia',
    coords: { lat: 6.3219, lng: 99.8514 },
    time: [0.75, 1.25],
    cafe: true,
    bestTime: 'Днём во время прогулки по Куаху.',
    note: 'Средний бюджет. График в разных каталогах отличается; конкретное время подтверждайте у кафе.',
    sourceLabel: 'Langkawi Development Authority — Food Guide, Arts Cafe',
    sourceUrl: langkawiFoodGuide,
  },
  {
    slug: 'koffeemilia',
    name: 'Koffeemilia Langkawi',
    description:
      'Кофейня на Jalan Pantai Tengah для паузы от пляжного солнца. Основной заказ здесь — кофе: начните с эспрессо или чёрного и спросите о зерне дня. Подходит для утренней остановки в районе Tengah и Cenang.',
    mapsQuery:
      'Koffeemilia Langkawi, 231 Jalan Pantai Tengah, Kampung Padang Putih, Langkawi, Malaysia',
    coords: { lat: 6.2888, lng: 99.7353 },
    time: [0.5, 1],
    cafe: true,
    bestTime: 'Утром или в первой половине дня.',
    note: 'Средний бюджет. Адрес взят из государственного туристического каталога; график и текущую кофейную карту подтвердите перед визитом.',
    sourceLabel: 'Kedah Tourism Directory — Koffeemilia Langkawi',
    sourceUrl: kedahDirectory,
  },
  {
    slug: 'sea-you-by-the-bay',
    name: 'Sea You By The Bay',
    description:
      'Кафе с видом на море в Куахе — вариант для фотографичного обеда без поездки на Cenang. В официальном меню есть nasi lemak с куриным сатэ и nasi lemak с жареной курицей; выберите одно из них и оставьте время посидеть у воды.',
    mapsQuery: 'Sea You By The Bay, Lot PT 1229 Mukim Kuah, Langkawi, Malaysia',
    time: [0.75, 1.5],
    cafe: true,
    bestTime: 'Дневной обед или ближе к закату.',
    note: 'Средний бюджет. Открытая прибрежная атмосфера зависит от погоды; режим работы и доступность столов смотрите у кафе.',
    sourceLabel: 'Sea You Langkawi — официальный сайт и меню',
    sourceUrl: 'https://seayoulangkawi.my/',
  },
  {
    slug: 'fatcupid',
    name: 'fatCUPID',
    description:
      'Небольшой ресторан в саду La Pari-Pari, спрятанный от главной дороги Pantai Tengah. Хороший выбор за семейными рецептами ньонья: попробуйте Nyonya laksa или медленно приготовленный beef rendang, а на десерт — саго с кокосовым молоком и пальмовым сахаром.',
    mapsQuery:
      'fatCUPID, La Pari-Pari, 2273 Jalan Teluk Baru Kampung Tasek Anak, Langkawi, Malaysia',
    coords: { lat: 6.2796, lng: 99.7341 },
    time: [1, 1.75],
    bestTime: 'Бранч или ранний ужин с бронированием.',
    note: 'Средний бюджет. У ресторана есть перерыв между бранчем и ужином и выходные; проверьте официальный сайт.',
    sourceLabel: 'La Pari-Pari — официальное меню fatCUPID',
    sourceUrl: 'https://laparipari.com/langkawi-restaurant/',
  },
  {
    slug: 'orkid-ria',
    name: 'Orkid Ria Seafood Restaurant',
    description:
      'Ресторан для большого ужина с морепродуктами: выберите рыбу, креветки или краба и договоритесь о способе приготовления. Удобно брать несколько блюд на компанию и добавлять рис с овощами. Актуальное помещение находится на Pantai Tengah.',
    mapsQuery:
      'Orkid Ria Seafood Restaurant, Lot 418 Jalan Pantai Tengah Jalan Teluk Baru, Langkawi, Malaysia',
    time: [1.25, 2],
    bestTime: 'Ужин компанией, при возможности с резервом.',
    note: 'Средний–высокий бюджет; подтвердите вес, цену и приготовление до заказа. Используйте новый адрес Lot 418, а не старый на Pantai Cenang.',
    sourceLabel: 'Orkid Ria — официальный сайт, новый адрес и заказ seafood',
    sourceUrl: 'https://orkidriaseafood.com/',
  },
  {
    slug: 'wonderland-food-store',
    name: 'Wonderland Food Store',
    description:
      'Непарадный ресторан Куаха для морепродуктов и китайской кухни за общим столом. В официальном гастрономическом гиде выделены рыба на пару по-тэочжоуски, краб с чёрным перцем и омлет с устрицами. Выберите несколько блюд для всей компании.',
    mapsQuery:
      'Wonderland Food Store, Lot 179 180 181 Pusat Dagangan Kelana Mas Jalan Trimula, Kuah, Langkawi, Malaysia',
    coords: { lat: 6.3255, lng: 99.8437 },
    time: [1, 1.75],
    bestTime: 'На ужин после прогулки по Куаху.',
    note: 'Низкий–средний бюджет относительно курортных seafood-ресторанов; крупные морепродукты могут стоить существенно дороже. График подтвердите отдельно.',
    sourceLabel:
      'Langkawi Development Authority — Food Guide, Wonderland Food Store',
    sourceUrl: langkawiFoodGuide,
  },
  {
    slug: 'gulai-house',
    name: 'The Gulai House',
    description:
      'Атмосферный ужин в тропическом лесу The Datai: ресторан устроен как традиционный малайский kampung-дом. Попробуйте малайские блюда из сезонного меню; для начала подойдёт крабовый суп с лемонграссом, затем сатэ или карри. Ценность здесь — и кухня, и лесная обстановка.',
    mapsQuery:
      'The Gulai House, The Datai Langkawi, Jalan Teluk Datai, Langkawi, Malaysia',
    time: [1.5, 2.5],
    bestTime: 'Ужин после предварительного бронирования.',
    note: 'Высокий бюджет. Для гостей не из отеля согласуйте доступ и стол заранее; уточните дресс-код и актуальное меню. Дорогу до Datai учитывайте отдельно.',
    sourceLabel: 'The Datai — The Gulai House и официальные меню',
    sourceUrl: 'https://www.thedatai.com/dining/the-gulai-house/',
  },
  {
    slug: 'kayuputi',
    name: 'Kayuputi — The St. Regis Langkawi',
    description:
      'Знаковый ресторан над водой у St. Regis для особого вечера и панорамного морского вида. Кухня соединяет азиатские вкусы с современной подачей: выбирайте блюда и морепродукты из текущего меню, а при бронировании попросите стол с подходящим видом.',
    mapsQuery:
      'Kayuputi Restaurant, The St. Regis Langkawi, Jalan Pantai Beringin, Langkawi, Malaysia',
    time: [1.5, 2.5],
    bestTime: 'Ранний ужин по брони, с учётом местного времени заката.',
    note: 'Высокий бюджет, smart casual. Уточните условия посещения для гостей вне отеля. Это Kayuputi на Лангкави, отдельный от одноимённого ресторана на Бали.',
    sourceLabel: 'Marriott — официальный Kayuputi, St. Regis Langkawi',
    sourceUrl:
      'https://www.marriott.com/en-us/hotels/lgkxr-the-st-regis-langkawi/dining/',
  },
  {
    slug: 'nasi-dagang-pak-malau',
    name: 'Nasi Dagang Pak Malau',
    description:
      'Завтрак у рисовых полей в традиционном малайском окружении — один из самых характерных гастрономических выездов острова. Берите nasi dagang, рис с кокосовым молоком, и выберите к нему gulai с рыбой либо мясом из дневного ассортимента.',
    mapsQuery:
      'Nasi Dagang Pak Malau, 186 Jalan Makam Mahsuri, Langkawi, Malaysia',
    time: [0.75, 1.25],
    bestTime: 'Утром; позже популярные дополнения могут закончиться.',
    note: 'Низкий–средний бюджет. Официальный профиль указывает выходной в среду; проверьте его перед поездкой. Насыщенность зелени на полях зависит от сезона.',
    sourceLabel:
      'Nasi Dagang Pak Malau — официальный профиль, адрес и контакты',
    sourceUrl: 'https://linktr.ee/nasidagangpakmalau',
  },
  {
    slug: 'yellow-beach-club',
    name: 'Yellow Beach Club / Yellow Beach Café',
    description:
      'Популярная точка на песке Pantai Cenang ради заката и пляжной атмосферы. Закажите еду для общего стола из актуального меню и тропический напиток, затем останьтесь на золотой час. Для спокойного разговора лучше прийти раньше вечерней музыкальной программы.',
    mapsQuery: 'Yellow Beach Cafe, Pantai Cenang, Langkawi, Malaysia',
    coords: { lat: 6.2897, lng: 99.7272 },
    time: [1, 2],
    bestTime: 'К закату; стол на террасе лучше бронировать.',
    note: 'Средний–высокий бюджет. Это beach club, а не specialty-кофейня. Не путать с Yellow’s Pizza: на официальном сайте она отмечена временно закрытой.',
    sourceLabel: 'Yellow Beach Club — официальный сайт и действующие зоны',
    sourceUrl: 'https://www.yellowbeachclublangkawi.com/ybc',
  },
];

export const malaysiaDining: Record<string, GuidePlace[]> = {
  penang: penang.map((entry) => diningPlace('penang', entry)),
  langkawi: langkawi.map((entry) => diningPlace('langkawi', entry)),
};
