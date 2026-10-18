import { cities as japanCities } from '../data/cities';
import { places as japanPlaces } from '../data/places';
import { friendsMapPlaces } from '../data/friendsMapPlaces';
import { trip } from '../data/trip';
import winter from './winter.json';
import published from './published.json';
import { malaysiaDining } from './malaysia-dining';
import { malaysiaHighlights } from './penang-highlights';
import { indonesiaAdditions, indonesiaNewCities } from './indonesia-expansion';
import { australia } from './australia';
import { withLicensedPhotos } from './photos';
import gardensCredit from './credits/singapore-gardens-credit.json';
import merlionCredit from './credits/singapore-merlion-credit.json';
import galleryCredit from './credits/singapore-gallery-credit.json';
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
      sg(
        'marina-bay',
        'artscience-museum',
        'Музей ArtScience',
        'ArtScience Museum, Singapore',
        'Музей в здании в форме цветка лотоса на набережной Марина-Бэй. Здесь проходят временные выставки на стыке искусства, науки и технологий.',
        ['museum', 'sight', 'tickets-ahead'],
        [1.2863, 103.8593],
        [1.5, 3],
      ),
      sg(
        'marina-bay',
        'esplanade',
        'Эспланада',
        'Esplanade – Theatres on the Bay, Singapore',
        'Театральный и концертный комплекс у залива, который за колючие купола сравнивают с дурианом. На открытых площадках у воды часто играют бесплатные концерты.',
        ['sight', 'walk', 'nightlife'],
        [1.2898, 103.8555],
      ),
      sg(
        'marina-bay',
        'lau-pa-sat',
        'Лау Па Сат',
        'Lau Pa Sat, Singapore',
        'Хокер-центр в чугунном викторианском павильоне XIX века посреди делового района. Вечером соседнюю Бун-Тат-стрит перекрывают, и там жарят сатай.',
        ['food', 'sight', 'nightlife'],
        [1.2806, 103.8504],
      ),
    ],
  ),
  city(
    'river-and-orchard',
    'Река и Орчард',
    'Singapore River & Orchard',
    'Набережные реки Сингапур, колониальный центр с музеями и торговая Орчард-роуд.',
    'atlas/singapore.jpg',
    [
      sg(
        'river-and-orchard',
        'clarke-quay',
        'Кларк-Ки',
        'Clarke Quay, Singapore',
        'Бывшие склады на берегу реки Сингапур, в которых теперь рестораны и бары. Отсюда отходят речные кораблики к заливу Марина-Бэй.',
        ['nightlife', 'food', 'walk'],
        [1.2906, 103.8465],
        [1, 3],
      ),
      sg(
        'river-and-orchard',
        'fort-canning',
        'Форт-Каннинг',
        'Fort Canning Park, Singapore',
        'Холм в центре города, где когда-то жили малайские правители, а позже стоял британский форт. Теперь это парк со старыми воротами, бывшим кладбищем, садом специй и тенистыми дорожками.',
        ['walk', 'nature', 'sight'],
        [1.2948, 103.846],
      ),
      sg(
        'river-and-orchard',
        'national-museum',
        'Национальный музей Сингапура',
        'National Museum of Singapore',
        'Старейший музей страны в здании 1887 года с куполом. Основная экспозиция рассказывает историю Сингапура от древнего порта до независимого государства.',
        ['museum', 'sight'],
        [1.2966, 103.8485],
        [2, 3],
      ),
      sg(
        'river-and-orchard',
        'asian-civilisations-museum',
        'Музей азиатских цивилизаций',
        'Asian Civilisations Museum, Singapore',
        'Музей в колониальном здании Эмпресс-Плейс на берегу реки. В коллекции искусство Китая, Юго-Восточной и Южной Азии и исламского мира, в том числе груз затонувшего корабля IX века.',
        ['museum', 'sight'],
        [1.2875, 103.8514],
        [2, 3],
      ),
      sg(
        'river-and-orchard',
        'raffles-hotel',
        'Отель Raffles',
        'Raffles Hotel Singapore',
        'Колониальный отель 1887 года, национальный памятник Сингапура. По преданию, в его баре Long Bar придумали коктейль «Сингапурский слинг».',
        ['sight', 'nightlife'],
        [1.2949, 103.8545],
      ),
      sg(
        'river-and-orchard',
        'orchard-road',
        'Орчард-роуд',
        'Orchard Road, Singapore',
        'Главная торговая улица города длиной больше двух километров, с крупными моллами вроде ION Orchard. Тенистые тротуары и подземные переходы между торговыми центрами выручают в жару и ливень.',
        ['shopping', 'walk'],
        [1.304, 103.8318],
        [2, 4],
      ),
      sg(
        'river-and-orchard',
        'newton-food-centre',
        'Newton Food Centre',
        'Newton Food Centre, Singapore',
        'Хокер-центр под открытым небом недалеко от Орчард-роуд, оживлённый по вечерам. Сюда идут за морепродуктами, сатаем и барбекю.',
        ['food', 'nightlife'],
        [1.3119, 103.8396],
      ),
      sg(
        'river-and-orchard',
        'song-fa-bak-kut-teh',
        'Song Fa Bak Kut Teh',
        'Song Fa Bak Kut Teh, 11 New Bridge Road, Singapore',
        'Ресторан бак-кут-тэ — прозрачного бульона из свиных рёбрышек с перцем и чесноком в теочжоуском стиле. Сеть выросла из уличной тележки 1969 года, главное заведение на Нью-Бридж-роуд рядом с Кларк-Ки.',
        ['food'],
        [1.2889, 103.8471],
        [0.5, 1],
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
      sg(
        'neighbourhoods',
        'buddha-tooth-relic-temple',
        'Храм Зуба Будды',
        'Buddha Tooth Relic Temple, Singapore',
        'Буддийский храм в Чайнатауне, построенный в 2007 году в стиле эпохи Тан. Считается, что в ступе на верхнем этаже хранится зуб Будды, а в здании есть музей буддийского искусства.',
        ['temple-shrine', 'sight', 'museum'],
        [1.2814, 103.8442],
      ),
      sg(
        'neighbourhoods',
        'sri-mariamman-temple',
        'Храм Шри Мариамман',
        'Sri Mariamman Temple, Singapore',
        'Старейший индуистский храм Сингапура, основанный в 1827 году. Башня-гопурам над входом покрыта ярусами раскрашенных фигур божеств.',
        ['temple-shrine', 'sight'],
        [1.2826, 103.8452],
        [0.5, 1],
      ),
      sg(
        'neighbourhoods',
        'thian-hock-keng',
        'Храм Тхиан Хок Кенг',
        'Thian Hock Keng Temple, Singapore',
        'Один из старейших китайских храмов города, построенный хоккиенскими переселенцами в 1839–1842 годах. Храм посвящён Мацзу, покровительнице мореплавателей.',
        ['temple-shrine', 'sight'],
        [1.2808, 103.8476],
        [0.5, 1],
      ),
      sg(
        'neighbourhoods',
        'maxwell-food-centre',
        'Maxwell Food Centre',
        'Maxwell Food Centre, Singapore',
        'Хокер-центр на краю Чайнатауна с десятками прилавков местной кухни. Здесь работает Tian Tian, один из самых известных прилавков с чикен-райсом.',
        ['food'],
        [1.2803, 103.8448],
      ),
      sg(
        'neighbourhoods',
        'tian-tian-chicken-rice',
        'Tian Tian Hainanese Chicken Rice',
        'Tian Tian Hainanese Chicken Rice, Maxwell Food Centre, Singapore',
        'Прилавок с хайнаньским чикен-райсом в Maxwell Food Centre: отварная курица, рис на курином бульоне и соус чили. В обед к нему обычно выстраивается очередь.',
        ['food'],
        [1.2804, 103.8446],
        [0.5, 1],
      ),
      sg(
        'neighbourhoods',
        'sultan-mosque',
        'Мечеть Султана',
        'Masjid Sultan, Singapore',
        'Главная мечеть Кампонг-Глама с золотыми куполами, построенная в 1920-х годах на месте мечети 1824 года. Туристов пускают в часть здания вне времени молитв, плечи и колени нужно закрыть.',
        ['temple-shrine', 'sight'],
        [1.3022, 103.8591],
        [0.5, 1],
      ),
      sg(
        'neighbourhoods',
        'haji-lane',
        'Хаджи-лейн',
        'Haji Lane, Singapore',
        'Узкий переулок в Кампонг-Гламе с росписями на стенах, маленькими магазинами, кафе и барами. Вечером здесь людно и шумно.',
        ['walk', 'shopping', 'cafe', 'nightlife'],
        [1.3007, 103.8588],
      ),
      sg(
        'neighbourhoods',
        'tekka-centre',
        'Tekka Centre',
        'Tekka Centre, Singapore',
        'Рынок и хокер-центр у входа в Маленькую Индию: на рынке продают рыбу, мясо, специи и овощи, а в фудкорте готовят бирьяни и прату. Наверху лавки с сари и тканями.',
        ['food', 'shopping', 'morning'],
        [1.3061, 103.8505],
      ),
      sg(
        'neighbourhoods',
        'sri-veeramakaliamman-temple',
        'Храм Шри Вирамакалиамман',
        'Sri Veeramakaliamman Temple, Singapore',
        'Индуистский храм на Серангун-роуд, посвящённый богине Кали. Его основали бенгальские рабочие в 1855 году.',
        ['temple-shrine', 'sight'],
        [1.3077, 103.8527],
        [0.5, 1],
      ),
      sg(
        'neighbourhoods',
        'mustafa-centre',
        'Mustafa Centre',
        'Mustafa Centre, Singapore',
        'Огромный универмаг в Маленькой Индии с тесными рядами, где продают всё от специй и чая до электроники и золота. Удобное место, чтобы купить сувениры и продукты домой.',
        ['shopping'],
        [1.3099, 103.8556],
      ),
      sg(
        'neighbourhoods',
        'hill-street-tai-hwa',
        'Hill Street Tai Hwa Pork Noodle',
        'Hill Street Tai Hwa Pork Noodle, 466 Crawford Lane, Singapore',
        'Прилавок с бак-чор-ми — лапшой со свиным фаршем, печенью и уксусной заправкой — в жилом квартале на Кроуфорд-лейн. В 2016 году получил звезду Michelin, очередь здесь бывает долгой.',
        ['food'],
        [1.3051, 103.8628],
      ),
      sg(
        'neighbourhoods',
        'atlas-bar',
        'Бар Atlas',
        'Atlas Bar, Parkview Square, Singapore',
        'Бар в лобби небоскрёба Parkview Square, оформленном в стиле ар-деко. Известен коллекцией джина, которую хранят в высокой башне за стойкой.',
        ['nightlife', 'cafe'],
        [1.3006, 103.8571],
      ),
      sg(
        'neighbourhoods',
        'tiong-bahru',
        'Тионг-Бару',
        'Tiong Bahru, Singapore',
        'Один из первых жилых районов Сингапура, застроенный в 1930-х годах невысокими домами в стиле ар-деко. Среди закруглённых балконов и винтовых лестниц прячутся кафе, пекарни и книжные магазины.',
        ['walk', 'cafe'],
        [1.2847, 103.832],
        [1, 3],
      ),
      sg(
        'neighbourhoods',
        'tiong-bahru-market',
        'Tiong Bahru Market',
        'Tiong Bahru Market, Singapore',
        'Рынок с хокер-центром на втором этаже, главная остановка в районе Тионг-Бару. Местные приходят сюда завтракать рисовыми пирожками чвэй-куэй, лапшой и кофе.',
        ['food', 'morning'],
        [1.285, 103.8326],
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
      sg(
        'islands-and-gardens',
        'southern-ridges',
        'Southern Ridges и Henderson Waves',
        'Henderson Waves, Singapore',
        'Тропа длиной около 10 километров по холмам на юге города, которая связывает парки Маунт-Фабер, Телок-Бланга и Кент-Ридж. Самый известный участок — волнообразный пешеходный мост Henderson Waves на высоте 36 метров.',
        ['walk', 'nature', 'view'],
        [1.2758, 103.8154],
        [2, 4],
      ),
    ],
  ),
  city(
    'north-and-nature',
    'Север и природа',
    'North & nature reserves',
    'Тропический лес, водохранилища, мангры и зоопарки в зелёной середине и на севере острова.',
    'atlas/singapore.jpg',
    [
      sg(
        'north-and-nature',
        'singapore-zoo',
        'Сингапурский зоопарк',
        'Singapore Zoo',
        'Зоопарк на берегу водохранилища Верхний Селетар, где животных отделяют от посетителей рвы и растительность, а не клетки. Рядом Night Safari и речной парк, их удобно совместить в один день.',
        ['wildlife', 'day-trip', 'tickets-ahead'],
        [1.4043, 103.793],
        [3, 5],
      ),
      sg(
        'north-and-nature',
        'night-safari',
        'Ночное сафари',
        'Night Safari, Singapore',
        'Первый в мире ночной зоопарк, открытый в 1994 году. Животных показывают в темноте при приглушённом свете: часть маршрута проезжают на трамвайчике, часть проходят пешком.',
        ['wildlife', 'nightlife', 'tickets-ahead'],
        [1.4022, 103.7881],
        [2, 4],
      ),
      sg(
        'north-and-nature',
        'macritchie-reservoir',
        'Водохранилище Макричи',
        'MacRitchie Reservoir Park, Singapore',
        'Старейшее водохранилище страны с тропами через тропический лес вокруг воды. Подвесной мост TreeTop Walk проходит над кронами, до него несколько километров пешком.',
        ['nature', 'walk', 'adventure'],
        [1.3416, 103.8339],
        [3, 5],
      ),
      sg(
        'north-and-nature',
        'bukit-timah',
        'Заповедник Букит-Тимах',
        'Bukit Timah Nature Reserve, Singapore',
        'Первичный тропический лес вокруг самой высокой точки Сингапура — холма высотой 163 метра. Тропы короткие, но крутые, на них встречаются макаки и шерстокрылы.',
        ['nature', 'adventure', 'morning'],
        [1.3505, 103.7764],
        [2, 3],
      ),
      sg(
        'north-and-nature',
        'sungei-buloh',
        'Заповедник Сунгей-Булох',
        'Sungei Buloh Wetland Reserve, Singapore',
        'Мангровый заповедник на северо-западе острова с дощатыми тропами и укрытиями для наблюдения за птицами. Здесь живут вараны и илистые прыгуны, а с сентября по март останавливаются перелётные кулики.',
        ['nature', 'wildlife', 'morning'],
        [1.4466, 103.7302],
        [2, 4],
      ),
    ],
  ),
  city(
    'east',
    'Восток',
    'East Coast',
    'Перанаканские улицы Катонга, парк вдоль моря, большие хокер-центры и аэропорт Чанги.',
    'atlas/singapore.jpg',
    [
      sg(
        'east',
        'katong-joo-chiat',
        'Катонг и Джу-Чиат',
        'Koon Seng Road, Joo Chiat, Singapore',
        'Район на востоке с перанаканскими домами пастельных цветов, самые известные стоят на Кун-Сенг-роуд. Здесь пробуют катонгскую лаксу и перанаканские сладости куэ.',
        ['walk', 'food', 'cafe'],
        [1.3133, 103.9023],
        [2, 3],
      ),
      sg(
        'east',
        'east-coast-park',
        'Ист-Кост-парк',
        'East Coast Park, Singapore',
        'Парк длиной около 15 километров вдоль моря на намытой земле: пляжи, велодорожки и площадки для барбекю. Велосипед или самокат можно взять напрокат прямо в парке.',
        ['beach', 'walk', 'relax'],
        [1.301, 103.912],
        [2, 4],
      ),
      sg(
        'east',
        'old-airport-road',
        'Old Airport Road Food Centre',
        'Old Airport Road Food Centre, Singapore',
        'Хокер-центр 1973 года на улице, названной в честь бывшего аэропорта Калланг. Один из самых больших в городе, многие прилавки держат одни и те же семьи десятилетиями.',
        ['food'],
        [1.308, 103.8854],
      ),
      sg(
        'east',
        'jewel-changi',
        'Jewel Changi',
        'Jewel Changi Airport, Singapore',
        'Комплекс под стеклянным куполом у терминала 1 аэропорта Чанги. Внутри водопад Rain Vortex высотой около 40 метров, крытый лесной сад и магазины, сюда удобно заехать перед вылетом.',
        ['sight', 'shopping', 'low-mobility'],
        [1.3602, 103.9898],
        [1, 3],
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
    'о. Ява',
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
    'о. Ломбок',
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
    'о. Гили',
    'Gili Islands',
    'Островной отдых и прогулки у воды.',
    'atlas/indonesia.jpg',
    [
      spot(
        'gili',
        'gili-trawangan',
        'о. Гили Траванган',
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
    'о. Флорес и о. Комодо',
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
    'о. Калимантан',
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
malaysiaCities.forEach((city) => {
  city.places.push(
    ...(malaysiaHighlights[city.id] ?? []),
    ...(malaysiaDining[city.id] ?? []),
  );
});
indonesiaCities.forEach((city) => {
  city.places.push(...(indonesiaAdditions[city.id] ?? []));
});
indonesiaCities.push(...indonesiaNewCities);
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

const baseSeed = catalogSchema.parse({
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
          body: 'Марина-Бэй → река и Орчард → старые кварталы → острова и сады → север и природа → восток. Здесь вместо городов — районы и отдельные выезды.',
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
        'Вулканы Явы, кафе Бали, пляжи Ломбока, морские маршруты Комодо и дальние острова. Выбирайте природу, культуру и местную еду по регионам архипелага.',
      cities: indonesiaCities,
      sections: [
        {
          id: 'route',
          title: 'Идея маршрута',
          body: 'Соберите одну связку островов: Ява → Бали → Ломбок и Гили либо Бали → Флорес и Комодо. Суматра, Калимантан, Сулавеси и дальние архипелаги подходят для отдельных поездок. Каталог охватывает основные туристические регионы, а переезды планируются отдельно.',
        },
        originalNotes('indonesia'),
      ],
    },
    japan,
    australia,
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

export const defaultSeed = withLicensedPhotos(baseSeed);
export const seed = withLicensedPhotos(
  published ? catalogSchema.parse(published) : defaultSeed,
);
