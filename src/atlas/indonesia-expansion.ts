import type { GuideCity, GuidePlace } from './model';

export const indonesiaAdditions: Record<string, GuidePlace[]> = {
  java: [
    {
      city: 'java',
      slug: 'borobudur',
      nameRu: 'Боробудур',
      nameEn: 'Borobudur Temple, Magelang, Central Java, Indonesia',
      description:
        'Буддийская ступа среди холмов: идти ради каменных рельефов и панорамы долины. Посещение территории и подъём на сам памятник могут требовать разных билетов; нужный вариант и доступ проверяйте у официального оператора.',
      tags: ['temple-shrine', 'sight', 'tickets-ahead'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Borobudur Temple, Magelang, Central Java, Indonesia',
      source: 'InJourney Destination · 16.10.2026',
      links: [
        {
          label: 'InJourney Destination',
          url: 'https://ticket.injourneydestination.id/id/',
        },
      ],
      coords: {
        lat: -7.6079,
        lng: 110.2038,
      },
    },
    {
      city: 'java',
      slug: 'prambanan',
      nameRu: 'Прамбанан',
      nameEn: 'Prambanan Temple, Bokoharjo, Yogyakarta, Indonesia',
      description:
        'Высокие индуистские святилища и подробная каменная резьба — сильная культурная остановка рядом с Джокьякартой. Оставьте время пройти весь комплекс; вечерний балет «Рамаяна» бронируется отдельно от прогулки по храмам.',
      tags: ['temple-shrine', 'sight', 'tickets-ahead'],
      timeEstimateHours: [2, 3],
      mapsQuery: 'Prambanan Temple, Bokoharjo, Yogyakarta, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/en/destination/java/yogyakarta/yogyakarta---prambanan',
        },
      ],
      coords: {
        lat: -7.752,
        lng: 110.4914,
      },
    },
    {
      city: 'java',
      slug: 'bromo',
      nameRu: 'Вулкан Бромо',
      nameEn:
        'Mount Bromo, Bromo Tengger Semeru National Park, East Java, Indonesia',
      description:
        'Рассвет над вулканической кальдерой и прогулка по «морю песка» — одна из самых выразительных поездок по Яве. На высоте холодно; маршрут, разрешённые зоны и возможные закрытия вулкана уточняйте у парка перед выездом.',
      tags: ['nature', 'view', 'adventure', 'morning'],
      timeEstimateHours: [6, 10],
      mapsQuery:
        'Mount Bromo, Bromo Tengger Semeru National Park, East Java, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/destination/java/east-java/bromo-tengger-semeru-national-park---mount-bromo',
        },
      ],
      coords: {
        lat: -7.9425,
        lng: 112.953,
      },
    },
    {
      city: 'java',
      slug: 'tumpak-sewu',
      nameRu: 'Водопад Тумпак-Севу',
      nameEn: 'Tumpak Sewu Waterfall, Lumajang, East Java, Indonesia',
      description:
        'Амфитеатр из десятков водяных струй лучше сначала посмотреть с верхней площадки. Спуск в ущелье — отдельная физически сложная прогулка по мокрым ступеням и камням; после сильного дождя нижний маршрут может быть недоступен.',
      tags: ['nature', 'view', 'adventure'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Tumpak Sewu Waterfall, Lumajang, East Java, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/gb/en/destination/java/east-java/visit-tumpak-sewu',
        },
      ],
      coords: {
        lat: -8.2302,
        lng: 112.9179,
      },
    },
    {
      city: 'java',
      slug: 'mediterranea-yogyakarta',
      nameRu: 'Mediterranea by Kamil · Джокьякарта',
      nameEn:
        'Mediterranea Restaurant by Kamil, Jalan Tirtodipuran 24A, Yogyakarta, Indonesia',
      description:
        'Ужин во французско-средиземноморском ресторане среди жилых улиц южной Джокьякарты. Подходит для смены вкусов после яванских варунгов: выбирайте блюда из действующего сезонного меню и бронируйте стол на вечер.',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery:
        'Mediterranea Restaurant by Kamil, Jalan Tirtodipuran 24A, Yogyakarta, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://mrbykamil.com/',
        },
      ],
      foodSpot: true,
    },
    {
      city: 'java',
      slug: 'tempo-gelato-prawirotaman',
      nameRu: 'Tempo Gelato · Prawirotaman',
      nameEn:
        'Tempo Gelato Prawirotaman, Jalan Prawirotaman 38B, Yogyakarta, Indonesia',
      description:
        'Остановка за джелато после прогулок по жаркой Джокьякарте. Пробуйте доступные тропические фруктовые вкусы; в карточке указан действующий филиал на Prawirotaman 38B.',
      tags: ['food', 'cafe'],
      timeEstimateHours: [0.5, 1],
      mapsQuery:
        'Tempo Gelato Prawirotaman, Jalan Prawirotaman 38B, Yogyakarta, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://tempogelato.com/prawirotaman.html',
        },
      ],
      foodSpot: true,
    },
    {
      city: 'java',
      slug: 'toko-oen-malang',
      nameRu: 'Toko Oen · Маланг',
      nameEn: 'Toko Oen, Jalan Jenderal Basuki Rahmat 5, Malang, Indonesia',
      description:
        'Историческое кафе для паузы в Маланге перед переездом к Бромо. Идти ради атмосферы старого города и мороженого; остановка хорошо вписывается в прогулку вокруг центральной площади. ',
      tags: ['food', 'cafe'],
      timeEstimateHours: [0.5, 1],
      mapsQuery: 'Toko Oen, Jalan Jenderal Basuki Rahmat 5, Malang, Indonesia',
      source: 'Городская администрация Маланга · 16.10.2026',
      links: [
        {
          label: 'Городская администрация Маланга',
          url: 'https://malangkota.go.id/en/2024/03/27/menelusuri-jejak-kolonial-di-toko-oen-kota-malang/',
        },
      ],
      foodSpot: true,
    },
  ],
  lombok: [
    {
      city: 'lombok',
      slug: 'tanjung-aan',
      nameRu: 'Пляж Танджунг-Аан',
      nameEn: 'Tanjung Aan Beach, Lombok, Indonesia',
      description:
        'Широкая светлая бухта для пляжного дня недалеко от Куты. Можно соединить с прогулкой по мысу Мересе; для купания выбирайте участок по состоянию моря, а не по фотографиям.',
      tags: ['beach', 'relax'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Tanjung Aan Beach, Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/west-nusa-tenggara/lombok',
        },
      ],
      coords: {
        lat: -8.9117,
        lng: 116.3208,
      },
    },
    {
      city: 'lombok',
      slug: 'bukit-merese',
      nameRu: 'Холмы Мересе',
      nameEn: 'Bukit Merese, Lombok, Indonesia',
      description:
        'Травянистые холмы над южными бухтами Ломбока: короткий подъём ради панорамы моря и закатного света. Тени почти нет, после дождя тропы скользкие; удобно приехать из Куты вместе с Танджунг-Аан.',
      tags: ['nature', 'view', 'sunset', 'walk'],
      timeEstimateHours: [1, 2],
      mapsQuery: 'Bukit Merese, Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/west-nusa-tenggara/lombok',
        },
      ],
      coords: {
        lat: -8.9189,
        lng: 116.3194,
      },
    },
    {
      city: 'lombok',
      slug: 'selong-belanak',
      nameRu: 'Пляж Селонг-Беланак',
      nameEn: 'Selong Belanak Beach, Lombok, Indonesia',
      description:
        'Длинный песчаный пляж с серф-школами и широким видом на бухту. Подойдёт для первого занятия с инструктором или спокойного дня на песке; условия волн и зоны купания оценивайте на месте.',
      tags: ['beach', 'relax', 'adventure'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Selong Belanak Beach, Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/west-nusa-tenggara/lombok',
        },
      ],
      coords: {
        lat: -8.8731,
        lng: 116.1606,
      },
    },
    {
      city: 'lombok',
      slug: 'tiu-kelep',
      nameRu: 'Водопад Тиу-Келеп',
      nameEn: 'Tiu Kelep Waterfall, Senaru, Lombok, Indonesia',
      description:
        'Зелёная прогулка из Сенару к водопаду у подножия Ринджани. На маршруте бывают мокрые камни и переходы через воду: местный проводник поможет выбрать безопасный путь, особенно после дождей.',
      tags: ['nature', 'adventure', 'walk'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Tiu Kelep Waterfall, Senaru, Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/us/en/travel-ideas/adventure/lombok-top-10-things-to-do',
        },
      ],
      coords: {
        lat: -8.3133,
        lng: 116.4086,
      },
    },
    {
      city: 'lombok',
      slug: 'sukarara-weaving',
      nameRu: 'Ткацкая деревня Сукарара',
      nameEn: 'Sukarara Weaving Village, Jonggat, Central Lombok, Indonesia',
      description:
        'Место для знакомства с тканями сонгкет и работой ткачих сасак. Попросите показать процесс и объяснить орнаменты; покупки напрямую у мастериц делают эту остановку содержательнее обычного сувенирного магазина.',
      tags: ['sight', 'shopping'],
      timeEstimateHours: [1, 2],
      mapsQuery: 'Sukarara Weaving Village, Jonggat, Central Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/events/event-detail/festival-sukerare-begawe-jelo-nyesek-2026',
        },
      ],
    },
    {
      city: 'lombok',
      slug: 'el-bazar-kuta',
      nameRu: 'El Bazar · Кута, Ломбок',
      nameEn: 'El Bazar, Jalan Raya Kuta 5, Kuta, Lombok, Indonesia',
      description:
        'Атмосферный ужин с блюдами на компанию в центре Куты. В официальном меню выделены осьминог с ромеско и дикие креветки с Сумбавы; хороший вариант для вечера после южных пляжей.',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery: 'El Bazar, Jalan Raya Kuta 5, Kuta, Lombok, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://elbazarlombok.com/',
        },
      ],
      foodSpot: true,
    },
    {
      city: 'lombok',
      slug: 'ashtari',
      nameRu: 'Ashtari · вид на Куту',
      nameEn:
        'Ashtari Restaurant, Jalan Raya Mawun, Prabu, Kuta, Lombok, Indonesia',
      description:
        'Кафе-ресторан на холме с видом на побережье Куты. На завтрак — домашняя гранола и смузи-боулы, позже — блюда из местных продуктов и веганские варианты; удобно совместить с йогой по отдельной записи.',
      tags: ['food', 'cafe'],
      timeEstimateHours: [1, 2],
      mapsQuery:
        'Ashtari Restaurant, Jalan Raya Mawun, Prabu, Kuta, Lombok, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://www.ashtarilombok.com/restaurant',
        },
      ],
      foodSpot: true,
    },
  ],
  gili: [
    {
      city: 'gili',
      slug: 'gili-air',
      nameRu: 'Гили-Эйр',
      nameEn: 'Gili Air, North Lombok, Indonesia',
      description:
        'Остров для прогулок вдоль берега, снорклинга и неторопливых завтраков. Выбирайте базу здесь, если хочется небольших кафе и пляжного ритма; переправы между островами планируйте с учётом состояния моря.',
      tags: ['beach', 'walk', 'relax'],
      timeEstimateHours: [3, 6],
      mapsQuery: 'Gili Air, North Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/gb/en/destination/bali-nusa-tenggara/west-nusa-tenggara/lombok---gili-meno',
        },
      ],
      coords: {
        lat: -8.3579,
        lng: 116.0828,
      },
    },
    {
      city: 'gili',
      slug: 'gili-meno',
      nameRu: 'Гили-Мено',
      nameEn: 'Gili Meno, North Lombok, Indonesia',
      description:
        'Самый спокойный из трёх основных Гили: прогулки по песчаным тропам, пляжи и морские выезды. Хорош для отдельной тихой остановки; коралловые участки, отлив и течения учитывайте при выборе входа в воду.',
      tags: ['beach', 'nature', 'relax'],
      timeEstimateHours: [3, 6],
      mapsQuery: 'Gili Meno, North Lombok, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/gb/en/destination/bali-nusa-tenggara/west-nusa-tenggara/lombok---gili-meno',
        },
      ],
      coords: {
        lat: -8.35,
        lng: 116.057,
      },
    },
    {
      city: 'gili',
      slug: 'nest-underwater-sculpture',
      nameRu: 'Подводные скульптуры Nest',
      nameEn: 'Nest Underwater Statues, Gili Meno, Indonesia',
      description:
        'Круг человеческих фигур работы Джейсона деКейреса Тейлора под водой у Гили-Мено — необычная точка для снорклинга. Приходите с местным гидом, учитывайте лодочный трафик и течения; не трогайте скульптуры и кораллы.',
      tags: ['sight', 'adventure'],
      timeEstimateHours: [1, 2],
      mapsQuery: 'Nest Underwater Statues, Gili Meno, Indonesia',
      source: 'Bvlgari Resort Bali · местный гид · 16.10.2026',
      links: [
        {
          label: 'Bvlgari Resort Bali · местный гид',
          url: 'https://www.bulgarihotels.com/en_US/bali/whats-on/article?articleTopic=sport&id=a01b322f-da3d-4f90-9318-37b1eddfa23f',
        },
      ],
    },
    {
      city: 'gili',
      slug: 'pituq-gili-air',
      nameRu: 'Pituq · Гили-Эйр',
      nameEn: 'Pituq Restaurant, Gili Air, Lombok, Indonesia',
      description:
        'Растительное кафе именно на Гили-Эйр: все блюда готовят вручную, часть продуктов приходит из собственного сада на Ломбоке. Выбирайте сезонные блюда и овощные тарелки; подходит для полноценного обеда после моря.',
      tags: ['food', 'cafe'],
      timeEstimateHours: [1, 2],
      mapsQuery: 'Pituq Restaurant, Gili Air, Lombok, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://pituq.com/restaurant',
        },
      ],
      foodSpot: true,
    },
    {
      city: 'gili',
      slug: 'scallywags-trawangan',
      nameRu: 'Scallywags Seafood Bar & Grill',
      nameEn:
        'Scallywags Seafood Bar and Grill, Gili Trawangan, Lombok, Indonesia',
      description:
        'Ужин на берегу Гили-Траванган с грилем и морепродуктами. Выбирайте рыбу или креветки из доступного улова и сразу уточняйте способ расчёта заказа; вечерний стол у моря лучше запросить заранее.',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery:
        'Scallywags Seafood Bar and Grill, Gili Trawangan, Lombok, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://scallywagsresort.com/dine-gili-trawangan/',
        },
      ],
      foodSpot: true,
    },
  ],
  flores: [
    {
      city: 'flores',
      slug: 'padar-viewpoint',
      nameRu: 'Смотровая острова Падар',
      nameEn: 'Padar Island Viewpoint, Komodo National Park, Indonesia',
      description:
        'Подъём по ступеням ради панорамы нескольких изогнутых бухт — один из главных пейзажей Комодо. Это лодочный выезд из Лабуан-Баджо; погода, ограничения парка и состояние тропы определяют доступный маршрут.',
      tags: ['nature', 'view', 'adventure', 'day-trip'],
      timeEstimateHours: [2, 3],
      mapsQuery: 'Padar Island Viewpoint, Komodo National Park, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/gb/en/destination/bali-nusa-tenggara/east-nusa-tenggara/labuan-bajo---the-wonder-of-padar-island-an-undeniable-travel-wish-list',
        },
      ],
      coords: {
        lat: -8.6521,
        lng: 119.5737,
      },
    },
    {
      city: 'flores',
      slug: 'kelimutu-lakes',
      nameRu: 'Кратерные озёра Келимуту',
      nameEn: 'Kelimutu National Park, Moni, Flores, Indonesia',
      description:
        'Три вулканических озера, оттенки которых меняются из-за природных процессов. База для поездки — Мони в центральной части Флореса: это отдельный участок маршрута, а не короткий выезд из Лабуан-Баджо.',
      tags: ['nature', 'view', 'morning'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Kelimutu National Park, Moni, Flores, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/fr/en/destination/bali-nusa-tenggara/east-nusa-tenggara/flores---lake-kelimutu',
        },
      ],
      coords: {
        lat: -8.7662,
        lng: 121.8146,
      },
    },
    {
      city: 'flores',
      slug: 'wae-rebo',
      nameRu: 'Деревня Ваэ-Ребо',
      nameEn: 'Wae Rebo Village, Flores, Indonesia',
      description:
        'Горная деревня с высокими коническими домами манггарай. Посещение предполагает пеший подход и согласование с местными хозяевами; закладывайте отдельную ночёвку или длинный выезд, соблюдайте местный порядок приёма гостей.',
      tags: ['sight', 'nature', 'adventure'],
      timeEstimateHours: [12, 24],
      mapsQuery: 'Wae Rebo Village, Flores, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/au/en/travel-ideas/heritage/menikmati-pesona-desa-adat-wae-rebo-di-pulau-flores',
        },
      ],
      coords: {
        lat: -8.7698,
        lng: 120.284,
      },
    },
    {
      city: 'flores',
      slug: 'rangko-cave',
      nameRu: 'Пещера Рангко',
      nameEn: 'Gua Rangko, Rangko, Flores, Indonesia',
      description:
        'Пещерный бассейн с морской водой недалеко от Лабуан-Баджо. Свет внутри зависит от времени суток, подход включает лодку и скользкие ступени; поездку согласуйте с местным оператором и условиями моря.',
      tags: ['nature', 'adventure'],
      timeEstimateHours: [2, 4],
      mapsQuery: 'Gua Rangko, Rangko, Flores, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/east-nusa-tenggara/labuan-bajo',
        },
      ],
    },
    {
      city: 'flores',
      slug: 'la-cucina-labuan-bajo',
      nameRu: 'La Cucina · Лабуан-Баджо',
      nameEn: 'La Cucina, Jalan Soekarno Hatta, Labuan Bajo, Flores, Indonesia',
      description:
        'Итальянский ресторан в Лабуан-Баджо для ужина после лодочного дня: паста, пицца и блюда из морепродуктов. У заведения есть другая точка в Рутенге — здесь нужен именно филиал Labuan Bajo.',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery:
        'La Cucina, Jalan Soekarno Hatta, Labuan Bajo, Flores, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://lacucinakomodo.com/',
        },
      ],
      foodSpot: true,
    },
    {
      city: 'flores',
      slug: 'green-cherry',
      nameRu: 'Green Cherry · Лабуан-Баджо',
      nameEn:
        'Green Cherry Restaurant, Jalan Soekarno Hatta, Labuan Bajo, Flores, Indonesia',
      description:
        'Ресторан напротив гавани с местными продуктами и фирменной копчёной говядиной sei sapi. Хороший выбор для знакомства с вкусами восточной Индонезии перед или после маршрута по Комодо.',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery:
        'Green Cherry Restaurant, Jalan Soekarno Hatta, Labuan Bajo, Flores, Indonesia',
      source: 'Официальный сайт заведения · 16.10.2026',
      links: [
        {
          label: 'Официальный сайт заведения',
          url: 'https://greencherry.id/',
        },
      ],
      foodSpot: true,
    },
  ],
  kalimantan: [
    {
      city: 'kalimantan',
      slug: 'derawan-islands',
      nameRu: 'Острова Дераван',
      nameEn: 'Derawan Island, Berau, East Kalimantan, Indonesia',
      description:
        'Пляжи, черепахи и подводные маршруты у восточного берега Калимантана. Это отдельная островная поездка с базой в архипелаге; лодочные переходы и снорклинг планируйте по погоде и без контакта с животными.',
      tags: ['beach', 'nature', 'wildlife'],
      timeEstimateHours: [6, 10],
      mapsQuery: 'Derawan Island, Berau, East Kalimantan, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/destination/kalimantan/east-kalimantan/diving-derawan-island',
        },
      ],
      coords: {
        lat: 2.284,
        lng: 118.243,
      },
    },
    {
      city: 'kalimantan',
      slug: 'sebangau',
      nameRu: 'Национальный парк Себангау',
      nameEn:
        'Sebangau National Park, Kereng Bangkirai, Palangka Raya, Indonesia',
      description:
        'Торфяной лес и речные маршруты из Паланкараи — другая сторона Борнео помимо Танджунг-Путинга. Поездка требует заранее организованного сопровождения; встреча с орангутанами и другими животными не гарантирована.',
      tags: ['nature', 'wildlife', 'adventure'],
      timeEstimateHours: [4, 8],
      mapsQuery:
        'Sebangau National Park, Kereng Bangkirai, Palangka Raya, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/ph/en/destination/1/central-kalimantan/palangkaraya---sebangau-national-park',
        },
      ],
    },
    {
      city: 'kalimantan',
      slug: 'lok-baintan',
      nameRu: 'Плавучий рынок Лок-Байнтан',
      nameEn: 'Pasar Terapung Lok Baintan, Banjar, South Kalimantan, Indonesia',
      description:
        'Ранний речной выезд к лодкам торговок с фруктами и местными закусками. Наблюдайте живую торговлю, договоритесь о лодке заранее и согласуйте время накануне: активность рынка зависит от утра и условий на реке.',
      tags: ['sight', 'morning', 'day-trip'],
      timeEstimateHours: [2, 4],
      mapsQuery:
        'Pasar Terapung Lok Baintan, Banjar, South Kalimantan, Indonesia',
      source: 'Туристическая служба Южного Калимантана · 16.10.2026',
      links: [
        {
          label: 'Туристическая служба Южного Калимантана',
          url: 'https://dispar.kalselprov.go.id/tinjau-galeri-di-lok-baintan-langkah-kuatkan-wisata-pasar-terapung/',
        },
      ],
      coords: {
        lat: -3.285,
        lng: 114.667,
      },
    },
    {
      city: 'kalimantan',
      slug: 'soto-bang-amat',
      nameRu: 'Soto Bang Amat · Банджармасин',
      nameEn: 'Soto Bang Amat, Jalan Banua Anyar 6, Banjarmasin, Indonesia',
      description:
        'Конкретная остановка ради сото-банджар — пряного супа южного Калимантана. Удобно добавить после речной прогулки по Банджармасину; попросите объяснить местные гарниры и состав бульона.',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery: 'Soto Bang Amat, Jalan Banua Anyar 6, Banjarmasin, Indonesia',
      source: 'Туристическая служба Банджармасина · 16.10.2026',
      links: [
        {
          label: 'Туристическая служба Банджармасина',
          url: 'https://sikuntaw.banjarmasinkota.go.id/tempat-waiata-list/show/9cfcf4d5-fd34-4900-9ab8-984f3bfa1ff2',
        },
      ],
      foodSpot: true,
    },
    {
      city: 'kalimantan',
      slug: 'tjilik-riwut-house',
      nameRu: 'Rumah Tjilik Riwut · Паланкарая',
      nameEn:
        'Resto Rumah Tjilik Riwut, Palangka Raya, Central Kalimantan, Indonesia',
      description:
        'Ресторан с историческими фотографиями Калимантана и местной кухней. В туристическом справочнике отмечены nasi liwet, курица на гриле и десерт из красной фасоли; подходит для вечера в Паланкарае перед поездкой в лес. ',
      tags: ['food'],
      timeEstimateHours: [1, 2],
      mapsQuery:
        'Resto Rumah Tjilik Riwut, Palangka Raya, Central Kalimantan, Indonesia',
      source: 'Indonesia Travel · 16.10.2026',
      links: [
        {
          label: 'Indonesia Travel',
          url: 'https://www.indonesia.travel/id/id/travel-ideas/gastronomy/tjilik-riwut-house-restaurant',
        },
      ],
      foodSpot: true,
    },
  ],
};

export const indonesiaNewCities: GuideCity[] = [
  {
    id: 'bali',
    nameRu: 'о. Бали и Нуса-Пенида',
    nameEn: 'Bali & Nusa Penida',
    intro:
      'Рисовые террасы и храмы Убуда, кофейни Чангу и Семиньяка, утёсы Улувату и отдельная поездка на Нуса-Пениду.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'bali',
        slug: 'ubud-monkey-forest',
        nameRu: 'Лес обезьян в Убуде',
        nameEn: 'Sacred Monkey Forest Sanctuary, Ubud, Bali, Indonesia',
        description:
          'Тенистый храмовый лес среди огромных корней и каменной резьбы. Макаки живут здесь свободно: соблюдайте правила заповедника, держите вещи закрытыми и не предлагайте животным еду.',
        tags: ['nature', 'wildlife', 'walk'],
        timeEstimateHours: [1.5, 3],
        mapsQuery: 'Sacred Monkey Forest Sanctuary, Ubud, Bali, Indonesia',
        source: 'Monkey Forest Ubud · 16.10.2026',
        links: [
          {
            label: 'Monkey Forest Ubud',
            url: 'https://monkeyforestubud.com/',
          },
        ],
        coords: {
          lat: -8.5187,
          lng: 115.2588,
        },
      },
      {
        city: 'bali',
        slug: 'campuhan-ridge',
        nameRu: 'Тропа Кампухан',
        nameEn: 'Campuhan Ridge Walk, Ubud, Bali, Indonesia',
        description:
          'Прогулка по зелёному гребню между долинами на краю Убуда. Лучше идти рано утром, пока открытая тропа не раскалилась; возвращение можно совместить с завтраком в городе.',
        tags: ['walk', 'nature', 'morning'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Campuhan Ridge Walk, Ubud, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/globalassets/inspiration/6-destinasi-wisata-petualangan-indonesia.pdf',
          },
        ],
        coords: {
          lat: -8.4991,
          lng: 115.2526,
        },
      },
      {
        city: 'bali',
        slug: 'tegallalang-rice-terrace',
        nameRu: 'Рисовые террасы Тегаллаланг',
        nameEn: 'Tegallalang Rice Terrace, Tegallalang, Bali, Indonesia',
        description:
          'Слоистые рисовые террасы севернее Убуда — узнаваемый балийский пейзаж. Сосредоточьтесь на прогулке по полям; качели и фотоплощадки относятся к отдельным операторам, а вид посевов меняется по сельскохозяйственному циклу.',
        tags: ['nature', 'walk', 'view'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Tegallalang Rice Terrace, Tegallalang, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/uk/en/destination/bali-nusa-tenggara/bali/ubud---tegallalang-rice-terrace-a-charm-of-the-green-in-ubud',
          },
        ],
        coords: {
          lat: -8.434,
          lng: 115.2793,
        },
      },
      {
        city: 'bali',
        slug: 'tirta-empul',
        nameRu: 'Храм Тирта-Эмпул',
        nameEn: 'Pura Tirta Empul, Tampaksiring, Bali, Indonesia',
        description:
          'Действующий храм у священных источников, где можно увидеть балийскую традицию очищения. Для обычного посещения достаточно уважительной одежды и соблюдения правил; участие в ритуале согласуйте на месте, чтобы понимать его смысл и порядок.',
        tags: ['temple-shrine', 'sight'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Pura Tirta Empul, Tampaksiring, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/bali/bali---the-holy-springs-of-tirta-empul',
          },
        ],
        coords: {
          lat: -8.4157,
          lng: 115.3152,
        },
      },
      {
        city: 'bali',
        slug: 'uluwatu-temple',
        nameRu: 'Храм Улувату и кечак',
        nameEn: 'Uluwatu Temple, Pecatu, Bali, Indonesia',
        description:
          'Храм на краю высокого утёса с видом на Индийский океан. Приезжайте на прогулку перед закатом; отдельный билет на кечак и наличие мест уточняйте заранее, а у макак берегите очки и телефон.',
        tags: ['temple-shrine', 'view', 'sunset', 'tickets-ahead'],
        timeEstimateHours: [2, 3],
        mapsQuery: 'Uluwatu Temple, Pecatu, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/bali',
          },
        ],
        coords: {
          lat: -8.8291,
          lng: 115.0849,
        },
      },
      {
        city: 'bali',
        slug: 'padang-padang',
        nameRu: 'Пляж Паданг-Паданг',
        nameEn: 'Padang Padang Beach, Pecatu, Bali, Indonesia',
        description:
          'Небольшой пляж среди известняковых скал, куда спускаются через узкий проход. Хорошая остановка в районе Улувату; серф-спот и безопасное место для купания не всегда совпадают, ориентируйтесь по волнам и местным указаниям.',
        tags: ['beach', 'relax'],
        timeEstimateHours: [1, 3],
        mapsQuery: 'Padang Padang Beach, Pecatu, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/us/en/destination/bali-nusa-tenggara/bali/pantai-padang-padang',
          },
        ],
        coords: {
          lat: -8.811,
          lng: 115.1035,
        },
      },
      {
        city: 'bali',
        slug: 'tanah-lot',
        nameRu: 'Танах-Лот',
        nameEn: 'Tanah Lot Temple, Beraban, Bali, Indonesia',
        description:
          'Морской храм на скале и береговые дорожки для вечерней прогулки. Лучше воспринимать поездку как видовую остановку: доступ к самому основанию храма зависит от прилива, а священные зоны открыты не всем посетителям.',
        tags: ['temple-shrine', 'view', 'sunset'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Tanah Lot Temple, Beraban, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/bali',
          },
        ],
        coords: {
          lat: -8.6211,
          lng: 115.0868,
        },
      },
      {
        city: 'bali',
        slug: 'jatiluwih',
        nameRu: 'Рисовые террасы Джатилувих',
        nameEn: 'Jatiluwih Rice Terraces, Penebel, Tabanan, Bali, Indonesia',
        description:
          'Большие террасные ландшафты системы субак с прогулочными маршрутами среди действующих рисовых полей. Отведите больше времени, чем на одну фототочку: здесь ценны простор, сельская жизнь и спокойный пеший маршрут.',
        tags: ['nature', 'walk', 'view'],
        timeEstimateHours: [2, 4],
        mapsQuery: 'Jatiluwih Rice Terraces, Penebel, Tabanan, Bali, Indonesia',
        source: 'Jatiluwih · официальный сайт · 16.10.2026',
        links: [
          {
            label: 'Jatiluwih · официальный сайт',
            url: 'https://jatiluwih.id/',
          },
        ],
        coords: {
          lat: -8.3705,
          lng: 115.1309,
        },
      },
      {
        city: 'bali',
        slug: 'kelingking-viewpoint',
        nameRu: 'Келингкинг · смотровая Нуса-Пениды',
        nameEn: 'Kelingking Beach Viewpoint, Nusa Penida, Bali, Indonesia',
        description:
          'Знаменитый утёс в форме головы динозавра и бирюзовая бухта. Основная идея — вид сверху: спуск к пляжу очень крутой, океан опасен для купания. На Пениду лучше закладывать отдельную ночёвку и время на дороги.',
        tags: ['view', 'nature', 'day-trip'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Kelingking Beach Viewpoint, Nusa Penida, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/adventure/nusa-penida',
          },
        ],
        coords: {
          lat: -8.7511,
          lng: 115.4733,
        },
      },
      {
        city: 'bali',
        slug: 'diamond-beach-viewpoint',
        nameRu: 'Даймонд-Бич · восток Нуса-Пениды',
        nameEn: 'Diamond Beach Viewpoint, Nusa Penida, Bali, Indonesia',
        description:
          'Известняковые скалы и белый пляж на восточной стороне Пениды. Видовая прогулка хороша и без спуска: лестница крутая, обратный подъём жаркий, а прибой требует осторожности. Не пытайтесь вместить весь остров в короткий лодочный день.',
        tags: ['beach', 'view', 'nature'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Diamond Beach Viewpoint, Nusa Penida, Bali, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/adventure/nusa-penida',
          },
        ],
        coords: {
          lat: -8.7739,
          lng: 115.6214,
        },
      },
      {
        city: 'bali',
        slug: 'locavore-nxt',
        nameRu: 'Locavore NXT · Убуд',
        nameEn:
          'Locavore NXT, Jalan A A Gede Rai, Gang Pura Panti Bija, Lodtunduh, Ubud, Bali, Indonesia',
        description:
          'Гастрономический ужин, построенный вокруг индонезийских продуктов, ферментации и исследовательской кухни. Бронируйте именно новое пространство NXT в Лодтундухе; это длинный дегустационный опыт, предпочтения и ограничения по еде сообщайте заранее.',
        tags: ['food', 'tickets-ahead'],
        timeEstimateHours: [3, 4],
        mapsQuery:
          'Locavore NXT, Jalan A A Gede Rai, Gang Pura Panti Bija, Lodtunduh, Ubud, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://locavorenxt.com/family/locavorenxt',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'nusantara-ubud',
        nameRu: 'Nusantara by Locavore · Убуд',
        nameEn:
          'Nusantara by Locavore, Jalan Dewisita 9C, Ubud, Bali, Indonesia',
        description:
          'Современное знакомство с региональной домашней кухней архипелага. Заказывайте несколько блюд на компанию и попросите команду объяснить их происхождение: здесь интересны редкие сочетания и местные техники, а не привычный набор nasi goreng.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Nusantara by Locavore, Jalan Dewisita 9C, Ubud, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://locavorenxt.com/family/nusantara',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'hujan-locale',
        nameRu: 'Hujan Locale · Убуд',
        nameEn: 'Hujan Locale, Jalan Sri Wedari 5, Ubud, Bali, Indonesia',
        description:
          'Ресторан Уилла Мейрика с современным взглядом на индонезийскую уличную еду. Подходит для общего стола: начните с региональных закусок, затем выберите ренданг или морепродукты из текущего меню.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Hujan Locale, Jalan Sri Wedari 5, Ubud, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://hujanlocale.com/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'milk-madu-canggu',
        nameRu: 'Milk & Madu · Beach Road, Чангу',
        nameEn:
          'Milk and Madu Beach Road, Jalan Pantai Batu Bolong 92, Canggu, Bali, Indonesia',
        description:
          'Живое кафе для большого завтрака или ужина после пляжа Бату-Болонг. Фирменные направления — рикоттовые панкейки, тост с авокадо, пицца и specialty coffee; в этой карточке указан филиал Beach Road, а не Berawa.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Milk and Madu Beach Road, Jalan Pantai Batu Bolong 92, Canggu, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://milkandmadu.com/location/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'kynd-canggu',
        nameRu: 'KYND · Чангу',
        nameEn: 'KYND Community Canggu, Bali, Indonesia',
        description:
          'Яркое растительное кафе для завтрака и смузи-боулов в Чангу. Подходит ради сочетания фотогеничного интерьера и полноценного растительного завтрака; выбирайте точку Canggu на официальной странице сети.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'KYND Community Canggu, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://www.kyndcommunity.com/pages/kyndcafe',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'suka-uluwatu',
        nameRu: 'SUKA · Улувату',
        nameEn:
          'SUKA Collective Uluwatu, Jalan Labuansait 10, Pecatu, Bali, Indonesia',
        description:
          'Кофейная остановка и поздний завтрак между пляжами Букита. Заказывайте specialty coffee и блюдо из утреннего меню; это филиал Uluwatu на Labuansait, его удобно соединить с Паданг-Паданг.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'SUKA Collective Uluwatu, Jalan Labuansait 10, Pecatu, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://www.sukacollective.co/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'sisterfields-seminyak',
        nameRu: 'Sisterfields · Семиньяк',
        nameEn: 'Sisterfields, Jalan Kayu Cendana 7, Seminyak, Bali, Indonesia',
        description:
          'Одна из заметных остановок для австралийского brunch в Семиньяке. В текущем меню есть Turkish eggs, scrambled eggs с трюфелем и панкейки; берите кофе и завтрак перед прогулкой по району.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Sisterfields, Jalan Kayu Cendana 7, Seminyak, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://sisterfieldsbali.com/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'revolver-seminyak',
        nameRu: 'Revolver · Семиньяк',
        nameEn:
          'Revolver Seminyak, Jalan Kayu Aya Gang 51, Seminyak, Bali, Indonesia',
        description:
          'Кофейня в переулке Семиньяка для эспрессо и полноценного завтрака. Выберите классический кофейный напиток или текущий фирменный вариант; бронирование и меню проверяйте для Seminyak, поскольку у Revolver несколько площадок на Бали.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Revolver Seminyak, Jalan Kayu Aya Gang 51, Seminyak, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://revolverbali.com/pages/location',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'kaum-potato-head',
        nameRu: 'Kaum · Potato Head, Семиньяк',
        nameEn:
          'Kaum, Desa Potato Head, Jalan Petitenget 51B, Seminyak, Bali, Indonesia',
        description:
          'Ужин с региональными вкусами Индонезии над пляжем в Potato Head. Заказывайте блюда на компанию и просите рекомендации по островным специалитетам: интерес здесь в традиционных техниках и специях, а закат дополняет кухню.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Kaum, Desa Potato Head, Jalan Petitenget 51B, Seminyak, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://seminyak.potatohead.co/feast/kaum',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'bali',
        slug: 'penida-colada',
        nameRu: 'Penida Colada · Нуса-Пенида',
        nameEn:
          'Penida Colada, Jalan Raya Toya Pakeh Ped, Nusa Penida, Bali, Indonesia',
        description:
          'Пляжный ресторан в Педе для завтрака или вечерней паузы между поездками по Пениде. Заказывайте блюда текущего австралийско-индонезийского меню и свежий напиток; уточняйте время кухни, если возвращаетесь с востока острова поздно.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Penida Colada, Jalan Raya Toya Pakeh Ped, Nusa Penida, Bali, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://penidacolada.com/',
          },
        ],
        foodSpot: true,
      },
    ],
  },
  {
    id: 'sumatra',
    nameRu: 'о. Суматра',
    nameEn: 'Sumatra',
    intro:
      'Орангутаны Букит-Лаванга, озеро Тоба и долины Минангкабау. Север и запад острова лучше планировать отдельными частями маршрута.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'sumatra',
        slug: 'lake-toba-samosir',
        nameRu: 'Озеро Тоба и Самосир',
        nameEn: 'Lake Toba, Tuk Tuk, Samosir, North Sumatra, Indonesia',
        description:
          'Большое вулканическое озеро с островом Самосир и деревнями батаков. Выбирайте несколько дней для береговых поездок и знакомства с традиционными домами; паромные переезды и дальние дороги требуют отдельного запаса времени.',
        tags: ['nature', 'view', 'relax'],
        timeEstimateHours: [6, 10],
        mapsQuery: 'Lake Toba, Tuk Tuk, Samosir, North Sumatra, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/sumatra',
          },
        ],
        coords: {
          lat: 2.668,
          lng: 98.858,
        },
      },
      {
        city: 'sumatra',
        slug: 'bukit-lawang',
        nameRu: 'Букит-Лаванг · лес Гунунг-Лесер',
        nameEn:
          'Bukit Lawang, Gunung Leuser National Park, North Sumatra, Indonesia',
        description:
          'Пешие маршруты в тропическом лесу ради суматранских орангутанов и другой дикой жизни. Идите с лицензированным местным гидом, выбирайте маршрут по силам, не кормите животных и держите дистанцию; наблюдения не гарантированы.',
        tags: ['nature', 'wildlife', 'adventure'],
        timeEstimateHours: [4, 8],
        mapsQuery:
          'Bukit Lawang, Gunung Leuser National Park, North Sumatra, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/sumatra',
          },
        ],
        coords: {
          lat: 3.553,
          lng: 98.122,
        },
      },
      {
        city: 'sumatra',
        slug: 'harau-valley',
        nameRu: 'Долина Харау',
        nameEn: 'Harau Valley, Lima Puluh Kota, West Sumatra, Indonesia',
        description:
          'Рисовые поля между высокими отвесными скалами и небольшие водопады. Подходит для спокойной сельской остановки на западной Суматре; база здесь далеко от Медана и Тобы, поэтому планируйте отдельную часть маршрута.',
        tags: ['nature', 'walk', 'view'],
        timeEstimateHours: [3, 6],
        mapsQuery: 'Harau Valley, Lima Puluh Kota, West Sumatra, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/sumatra/west-sumatra/payakumbuh---the-harau-valley',
          },
        ],
        coords: {
          lat: -0.107,
          lng: 100.665,
        },
      },
      {
        city: 'sumatra',
        slug: 'tip-top-medan',
        nameRu: 'Tip Top · Медан',
        nameEn:
          'Tip Top Restaurant, Jalan Jenderal Ahmad Yani 92AB, Kesawan, Medan, Indonesia',
        description:
          'Историческое кафе в районе Кесаван с интерьерами старого Медана. Стоит зайти ради традиционного мороженого, выпечки и индонезийско-европейской кухни; удобно сделать остановкой во время прогулки по центру.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Tip Top Restaurant, Jalan Jenderal Ahmad Yani 92AB, Kesawan, Medan, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://www.tiptop-medan.com/restaurant.html',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'sumatra',
        slug: 'macehat-coffee',
        nameRu: 'Macehat Coffee · Медан',
        nameEn: 'Macehat Coffee, Jalan Karo 20, Medan, Indonesia',
        description:
          'Кофейная точка и обжарщик суматранского зерна. Начните с кофе из Mandheling и попросите объяснить доступные способы заваривания; здесь особенно уместно купить зерно Суматры домой.',
        tags: ['food', 'cafe'],
        timeEstimateHours: [0.5, 1],
        mapsQuery: 'Macehat Coffee, Jalan Karo 20, Medan, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://www.macehatcoffee.com/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'sumatra',
        slug: 'ucok-durian-medan',
        nameRu: 'Ucok Durian · Медан',
        nameEn: 'Ucok Durian, Jalan KH Wahid Hasyim 30-32, Medan, Indonesia',
        description:
          'Конкретное место для знакомства с дурианом, отмеченное туристической службой Медана. Попросите помочь выбрать плод под желаемую сладость и текстуру; цена и наличие зависят от сезона и выбранного плода.',
        tags: ['food'],
        timeEstimateHours: [0.5, 1],
        mapsQuery: 'Ucok Durian, Jalan KH Wahid Hasyim 30-32, Medan, Indonesia',
        source: 'Dinas Pariwisata Medan · 16.10.2026',
        links: [
          {
            label: 'Dinas Pariwisata Medan',
            url: 'https://medantourism.medan.go.id/kuliner/public',
          },
        ],
        foodSpot: true,
      },
    ],
  },
  {
    id: 'sulawesi',
    nameRu: 'о. Сулавеси',
    nameEn: 'Sulawesi',
    intro:
      'Культура тораджа и карсты юга, леса Тангкоко и рифы Бунакена на севере. Между этими регионами нужны отдельные переезды.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'sulawesi',
        slug: 'tana-toraja',
        nameRu: 'Высокогорье Тана-Тораджа',
        nameEn: 'Kete Kesu, Rantepao, Tana Toraja, South Sulawesi, Indonesia',
        description:
          'Дома тонгконан, резьба и погребальные ландшафты тораджа. Для знакомства начните с Кете-Кесу и местного гида; церемонии не являются представлением, посещать их можно только по приглашению и с соблюдением местных правил.',
        tags: ['sight', 'day-trip'],
        timeEstimateHours: [4, 8],
        mapsQuery:
          'Kete Kesu, Rantepao, Tana Toraja, South Sulawesi, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/gb/en/destination/sulawesi/south-sulawesi/tana-toraja',
          },
        ],
        coords: {
          lat: -2.9997,
          lng: 119.9086,
        },
      },
      {
        city: 'sulawesi',
        slug: 'bunaken',
        nameRu: 'Морской парк Бунакен',
        nameEn:
          'Bunaken Island, Bunaken National Park, North Sulawesi, Indonesia',
        description:
          'Коралловые стены и морские черепахи у северного Сулавеси. Выбирайте дайвинг или снорклинг с оператором по уровню подготовки; течение и видимость меняются, поэтому маршрут на воде решают на месте.',
        tags: ['nature', 'wildlife', 'adventure'],
        timeEstimateHours: [4, 8],
        mapsQuery:
          'Bunaken Island, Bunaken National Park, North Sulawesi, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/sulawesi',
          },
        ],
        coords: {
          lat: 1.617,
          lng: 124.76,
        },
      },
      {
        city: 'sulawesi',
        slug: 'rammang-rammang',
        nameRu: 'Карсты Рамманг-Рамманг',
        nameEn: 'Rammang Rammang, Salenrang, Maros, South Sulawesi, Indonesia',
        description:
          'Лодочная прогулка среди известняковых башен, пальм и рисовых полей недалеко от Макасара. Хороший контраст городскому дню; лодку, пешую часть и состояние троп согласуйте с местной общиной.',
        tags: ['nature', 'view', 'day-trip'],
        timeEstimateHours: [3, 5],
        mapsQuery:
          'Rammang Rammang, Salenrang, Maros, South Sulawesi, Indonesia',
        source: 'Sulawesi.travel · региональный оператор · 16.10.2026',
        links: [
          {
            label: 'Sulawesi.travel · региональный оператор',
            url: 'https://sulawesi.travel/id/destinations/rammang-rammang',
          },
        ],
        coords: {
          lat: -4.927,
          lng: 119.604,
        },
      },
      {
        city: 'sulawesi',
        slug: 'tangkoko',
        nameRu: 'Заповедник Тангкоко',
        nameEn:
          'Tangkoko Nature Reserve, Batu Putih, North Sulawesi, Indonesia',
        description:
          'Лесной выход с гидом ради долгопятов и чёрных хохлатых макак. База — район Бату-Путих: наблюдайте животных тихо, без вспышки и приманивания, а время прогулки подбирайте вместе с проводником.',
        tags: ['nature', 'wildlife', 'adventure'],
        timeEstimateHours: [3, 5],
        mapsQuery:
          'Tangkoko Nature Reserve, Batu Putih, North Sulawesi, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/gb/en/destination/sulawesi/north-sulawesi/bitung---the-tangkoko-nature-reserve',
          },
        ],
        coords: {
          lat: 1.555,
          lng: 125.168,
        },
      },
      {
        city: 'sulawesi',
        slug: 'coto-nusantara',
        nameRu: 'Coto Nusantara · Макасар',
        nameEn: 'Coto Nusantara, Jalan Nusantara 32, Makassar, Indonesia',
        description:
          'Местная классика ради coto Makassar (чото-макассар) — густого мясного супа с пряностями. Можно выбрать мясо без субпродуктов; к супу попросите бураса и sambal tauco, остроту добавляйте постепенно. ',
        tags: ['food'],
        timeEstimateHours: [0.5, 1],
        mapsQuery: 'Coto Nusantara, Jalan Nusantara 32, Makassar, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/gastronomy/coto-makassar',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'sulawesi',
        slug: 'raja-sate-manado',
        nameRu: 'Raja Sate · Манадо',
        nameEn:
          'Raja Sate Restaurant, Jalan Piere Tendean 39, Manado, North Sulawesi, Indonesia',
        description:
          'Ресторан из официальной гастрономической подборки Северного Сулавеси. Начните с сате и уточните местные рыбные блюда; манадская кухня бывает очень острой, поэтому попросите согласовать уровень перца при заказе. ',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Raja Sate Restaurant, Jalan Piere Tendean 39, Manado, North Sulawesi, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/us/en/travel-ideas/gastronomy/culinary-tour-at-5-restaurants-in-north-sulawesi',
          },
        ],
        foodSpot: true,
      },
    ],
  },
  {
    id: 'raja-ampat',
    nameRu: 'о-ва Раджа-Ампат',
    nameEn: 'Raja Ampat',
    intro:
      'Рифы, островные деревни и карстовые лагуны с базой в Вайсае. Соронг включён как материковые ворота архипелага.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'raja-ampat',
        slug: 'piaynemo',
        nameRu: 'Пиайнемо',
        nameEn: 'Piaynemo Viewpoint, Raja Ampat, Southwest Papua, Indonesia',
        description:
          'Смотровая над россыпью карстовых островков и прозрачных лагун. Это отдельный лодочный день с подъёмом по ступеням; выход зависит от ветра и маршрута, а природоохранные сборы и допуски уточняют у оператора.',
        tags: ['nature', 'view', 'day-trip'],
        timeEstimateHours: [4, 8],
        mapsQuery: 'Piaynemo Viewpoint, Raja Ampat, Southwest Papua, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/marine/ke-raja-ampat-inspirasi-perjalanan-untuk-liburan-ke-surga-di-timur-indonesia',
          },
        ],
        coords: {
          lat: -0.565,
          lng: 130.271,
        },
      },
      {
        city: 'raja-ampat',
        slug: 'arborek',
        nameRu: 'Деревня и риф Арборек',
        nameEn: 'Arborek Village, Raja Ampat, Southwest Papua, Indonesia',
        description:
          'Небольшой остров с деревней и насыщенной морской жизнью у причала. Пройдитесь по посёлку, поддержите местные ремёсла и выходите на риф с гидом, соблюдая правила общины и не касаясь кораллов.',
        tags: ['sight', 'nature', 'wildlife'],
        timeEstimateHours: [2, 4],
        mapsQuery: 'Arborek Village, Raja Ampat, Southwest Papua, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/marine/ke-raja-ampat-inspirasi-perjalanan-untuk-liburan-ke-surga-di-timur-indonesia',
          },
        ],
        coords: {
          lat: -0.563,
          lng: 130.514,
        },
      },
      {
        city: 'raja-ampat',
        slug: 'friwen-wall',
        nameRu: 'Риф Фривен',
        nameEn: 'Friwen Wall, Raja Ampat, Southwest Papua, Indonesia',
        description:
          'Снорклинг у рифовой стенки в районе Фривена — идея для тех, кто хочет увидеть подводный мир без полноценного дайвинг-курса. Нужны уверенное плавание, гид и подходящие условия течения; точку выбирайте по погоде.',
        tags: ['nature', 'adventure'],
        timeEstimateHours: [2, 4],
        mapsQuery: 'Friwen Wall, Raja Ampat, Southwest Papua, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/uk/en/destination/maluku-papua/southwest-papua/raja-ampat',
          },
        ],
      },
      {
        city: 'raja-ampat',
        slug: 'meridian-waisai',
        nameRu: 'Meridian Adventure · Вайсай',
        nameEn:
          'Meridian Adventure Dive Resort Restaurant, Pelabuhan Pariwisata, Jalan Yos Sudarso, Waisai, Raja Ampat, Indonesia',
        description:
          'Ресторан в Вайсае с местными продуктами и блюдами из дневного улова. Удобен в день парома и после дайвинга; перед визитом без проживания уточните доступ, наличие столов и условия дневного посещения клуба.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Meridian Adventure Dive Resort Restaurant, Pelabuhan Pariwisata, Jalan Yos Sudarso, Waisai, Raja Ampat, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://raja.meridianadventuredive.com/dive-resort-raja-ampat-indonesia/',
          },
        ],
        coords: {
          lat: -0.433067,
          lng: 130.806433,
        },
        foodSpot: true,
      },
      {
        city: 'raja-ampat',
        slug: 'swiss-cafe-sorong',
        nameRu: 'Swiss-Café · Соронг, перед островами',
        nameEn:
          'Swiss Cafe Restaurant, Swiss-Belhotel Sorong, Jalan Jenderal Sudirman, Sorong, Southwest Papua, Indonesia',
        description:
          'Практичная ресторанная остановка в Соронге перед переправой на Раджа-Ампат. Это материковая логистическая база: выбирайте индонезийские блюда текущего меню, а не планируйте специальный лодочный выезд ради ресторана.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Swiss Cafe Restaurant, Swiss-Belhotel Sorong, Jalan Jenderal Sudirman, Sorong, Southwest Papua, Indonesia',
        source: 'Swiss-Belhotel Sorong · 16.10.2026',
        links: [
          {
            label: 'Swiss-Belhotel Sorong',
            url: 'https://www.swiss-belhotel.com/dining/swiss-belhotel-sorong-swiss-cafe-restaurant',
          },
        ],
        foodSpot: true,
      },
    ],
  },
  {
    id: 'sumba',
    nameRu: 'о. Сумба',
    nameEn: 'Sumba',
    intro:
      'Деревни с высокими крышами, саванны и прозрачные лагуны. Запад и восток острова разделены длинными автомобильными переездами.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'sumba',
        slug: 'weekuri-lagoon',
        nameRu: 'Лагуна Веекури',
        nameEn: 'Weekuri Lagoon, Southwest Sumba, Indonesia',
        description:
          'Солоноватая лагуна среди прибрежных скал западной Сумбы. Приезжайте ради прозрачной воды и спокойной видовой прогулки; глубина и удобство входа меняются с приливом, на камнях нужна устойчивая обувь.',
        tags: ['nature', 'relax'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Weekuri Lagoon, Southwest Sumba, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/adventure/12-weekend-idea-s-to-experience-in-sumba',
          },
        ],
        coords: {
          lat: -9.4078,
          lng: 118.9488,
        },
      },
      {
        city: 'sumba',
        slug: 'ratenggaro',
        nameRu: 'Традиционная деревня Ратенггаро',
        nameEn: 'Ratenggaro Traditional Village, Southwest Sumba, Indonesia',
        description:
          'Высокие соломенные крыши и каменные погребальные сооружения рядом с океаном. Идите с местным проводником, уточняйте разрешение на фотографии людей и не заходите в частные дома без приглашения.',
        tags: ['sight', 'walk'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Ratenggaro Traditional Village, Southwest Sumba, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/adventure/12-weekend-idea-s-to-experience-in-sumba',
          },
        ],
        coords: {
          lat: -9.626,
          lng: 119.001,
        },
      },
      {
        city: 'sumba',
        slug: 'wairinding-hills',
        nameRu: 'Холмы Ваириндинг',
        nameEn: 'Wairinding Hills, East Sumba, Indonesia',
        description:
          'Мягкие волны саванны, которые зеленеют после дождей и становятся золотистыми в сухой сезон. Это восточная Сумба, далеко от Веекури: оставьте время на переезд и приходите за боковым светом утром или вечером.',
        tags: ['nature', 'view', 'sunset'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Wairinding Hills, East Sumba, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/travel-ideas/adventure/12-weekend-idea-s-to-experience-in-sumba',
          },
        ],
        coords: {
          lat: -9.645,
          lng: 120.264,
        },
      },
      {
        city: 'sumba',
        slug: 'julang-cap-karoso',
        nameRu: 'Julang · Cap Karoso',
        nameEn:
          'Julang Restaurant, Cap Karoso, Pantai Karoso, Ate Dalo, Southwest Sumba, Indonesia',
        description:
          'Ужин за общим шефским столом с приглашёнными поварами и продуктами органической фермы курорта. Меню зависит от действующей резиденции; бронируйте заранее и отдельно согласуйте возможность приехать без проживания.',
        tags: ['food', 'tickets-ahead'],
        timeEstimateHours: [2, 3],
        mapsQuery:
          'Julang Restaurant, Cap Karoso, Pantai Karoso, Ate Dalo, Southwest Sumba, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://capkaroso.com/en/residencies/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'sumba',
        slug: 'ombak-nihi',
        nameRu: 'Ombak · NIHI Sumba',
        nameEn:
          'Ombak Restaurant, NIHI Sumba, Hobawawi, Wanokaka, Sumba, Indonesia',
        description:
          'Открытый ресторан над берегом с местной рыбой, овощами из сада и островными вкусами. Подойдёт для особого ужина при проживании в NIHI; визит со стороны и транспорт обязательно согласуйте с курортом заранее.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Ombak Restaurant, NIHI Sumba, Hobawawi, Wanokaka, Sumba, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://nihi.com/sumba/dining/ombak-restaurant/',
          },
        ],
        foodSpot: true,
      },
    ],
  },
  {
    id: 'moluccas',
    nameRu: 'Молуккские острова',
    nameEn: 'Maluku Islands',
    intro:
      'Острова пряностей Банда, Амбон и лесистый Серам. Связность зависит от кораблей, авиации и состояния моря.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'moluccas',
        slug: 'banda-neira-town',
        nameRu: 'Банда-Нейра · остров пряностей',
        nameEn: 'Banda Neira Town, Banda Islands, Maluku, Indonesia',
        description:
          'Небольшой город среди вулканических островов: колониальные улицы, история торговли мускатным орехом и морские выезды. Добраться сложнее, чем на Бали: рейсы и корабли проверяйте под конкретные даты и оставляйте запас на погоду.',
        tags: ['sight', 'walk'],
        timeEstimateHours: [3, 6],
        mapsQuery: 'Banda Neira Town, Banda Islands, Maluku, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/destination/maluku-papua/maluku/banda-neira',
          },
        ],
        coords: {
          lat: -4.527,
          lng: 129.899,
        },
      },
      {
        city: 'moluccas',
        slug: 'fort-belgica',
        nameRu: 'Форт Бельгика',
        nameEn: 'Fort Belgica, Banda Neira, Maluku, Indonesia',
        description:
          'Пятиугольная крепость над Банда-Нейрой с видом на море и вулкан Банда-Апи. Идти ради панорамы и истории островов пряностей; на открытых стенах жарко, удобнее прогулка утром или ближе к вечеру.',
        tags: ['castle', 'sight', 'view'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'Fort Belgica, Banda Neira, Maluku, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/id/cruise/ports/port-of-banda-neira',
          },
        ],
        coords: {
          lat: -4.5265,
          lng: 129.9008,
        },
      },
      {
        city: 'moluccas',
        slug: 'ora-beach-seram',
        nameRu: 'Ора-Бич · остров Серам',
        nameEn: 'Ora Beach, Saleman, Seram Island, Maluku, Indonesia',
        description:
          'Прозрачная вода у подножия лесистых гор северного Серама. Планируйте несколько дней с базой в районе Салемана: переезд через Амбон, дорога и лодка делают это самостоятельной частью поездки.',
        tags: ['beach', 'nature', 'relax'],
        timeEstimateHours: [4, 8],
        mapsQuery: 'Ora Beach, Saleman, Seram Island, Maluku, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/gb/en/destination/maluku-papua/maluku',
          },
        ],
        coords: {
          lat: -2.963,
          lng: 129.18,
        },
      },
      {
        city: 'moluccas',
        slug: 'cilu-bintang-dining',
        nameRu: 'Cilu Bintang Estate · Банда-Нейра',
        nameEn:
          'Cilu Bintang Estate Restaurant, Banda Neira, Maluku, Indonesia',
        description:
          'Знакомство с банданской кухней на основе местных пряностей и индонезийско-голландских традиций. Договаривайтесь об ужине заранее и просите сезонные островные блюда; возможность визита без проживания нужно подтвердить у хозяев.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Cilu Bintang Estate Restaurant, Banda Neira, Maluku, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://cilubintang.com/all-project-list/culinary-delights/',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'moluccas',
        slug: 'sky-bar-ambon',
        nameRu: 'Sky-Bar · Амбон',
        nameEn:
          'Sky Bar, Swiss-Belhotel Ambon, Jalan Benteng Kapaha 88, Ambon, Maluku, Indonesia',
        description:
          'Видовая ресторанная остановка на верхнем этаже в центре Амбона. Подходит для вечера между островными переездами: в меню есть местные и международные блюда, а главное дополнение к ужину — панорама города и бухты.',
        tags: ['food', 'view'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Sky Bar, Swiss-Belhotel Ambon, Jalan Benteng Kapaha 88, Ambon, Maluku, Indonesia',
        source: 'Swiss-Belhotel Ambon · 16.10.2026',
        links: [
          {
            label: 'Swiss-Belhotel Ambon',
            url: 'https://www.swiss-belhotel.com/dining/swiss-belhotel-ambon-sky-bar',
          },
        ],
        foodSpot: true,
      },
    ],
  },
  {
    id: 'sumbawa',
    nameRu: 'о. Сумбава и Мойо',
    nameEn: 'Sumbawa & Moyo',
    intro:
      'Морские выезды на Кенаву и Мойо, лесные водопады и пляжи западной Сумбавы. Разные берега требуют отдельных баз.',
    cover: 'atlas/indonesia.jpg',
    nights: 0,
    stay: [],
    tips: [
      'Морские выходы, доступ к паркам и меню заведений проверяйте перед поездкой; время в карточках — ориентир на сам визит без дальних переездов.',
    ],
    sections: [],
    places: [
      {
        city: 'sumbawa',
        slug: 'kenawa-island',
        nameRu: 'Остров Кенава',
        nameEn: 'Kenawa Island, West Sumbawa, Indonesia',
        description:
          'Маленький остров с травянистым холмом и пляжами рядом с западной Сумбавой. Короткий подъём даёт круговой морской вид; лодку из района Пото-Тано и обратный переход договаривайте заранее с учётом ветра.',
        tags: ['beach', 'nature', 'view'],
        timeEstimateHours: [3, 5],
        mapsQuery: 'Kenawa Island, West Sumbawa, Indonesia',
        source: 'Kemenpar · Sisparnas · 16.10.2026',
        links: [
          {
            label: 'Kemenpar · Sisparnas',
            url: 'https://sisparnas.kemenpar.go.id/p/105095',
          },
        ],
        coords: {
          lat: -8.502,
          lng: 116.831,
        },
      },
      {
        city: 'sumbawa',
        slug: 'moyo-island',
        nameRu: 'Остров Мойо',
        nameEn: 'Labuan Aji, Moyo Island, Sumbawa, Indonesia',
        description:
          'Лесной остров у северного берега Сумбавы с рифами и деревнями. Для самостоятельной базы ориентируйтесь на Лабуан-Аджи, а не на закрытую территорию курорта; лодки, сопровождение и морские прогулки согласуйте заранее.',
        tags: ['nature', 'beach', 'adventure'],
        timeEstimateHours: [6, 10],
        mapsQuery: 'Labuan Aji, Moyo Island, Sumbawa, Indonesia',
        source: 'Indonesia Travel · 16.10.2026',
        links: [
          {
            label: 'Indonesia Travel',
            url: 'https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/west-nusa-tenggara/sumbawa',
          },
        ],
        coords: {
          lat: -8.226,
          lng: 117.58,
        },
      },
      {
        city: 'sumbawa',
        slug: 'mata-jitu',
        nameRu: 'Водопад Мата-Джиту · Мойо',
        nameEn: 'Mata Jitu Waterfall, Moyo Island, Sumbawa, Indonesia',
        description:
          'Каскады известняковых чаш в лесу Мойо. Поездка сочетает островной трансфер и наземный подход; состояние дороги и уровень воды меняются, поэтому берите местного проводника и не обещайте себе быстрый выезд на полчаса.',
        tags: ['nature', 'adventure'],
        timeEstimateHours: [3, 5],
        mapsQuery: 'Mata Jitu Waterfall, Moyo Island, Sumbawa, Indonesia',
        source: 'Amanwana · официальный путеводитель · 16.10.2026',
        links: [
          {
            label: 'Amanwana · официальный путеводитель',
            url: 'https://www.aman.com/sites/default/files/2023-09/Amanwana-Factsheet.pdf',
          },
        ],
      },
      {
        city: 'sumbawa',
        slug: 'amanwana-restaurant',
        nameRu: 'The Restaurant · Amanwana, Мойо',
        nameEn: 'The Restaurant, Amanwana, Moyo Island, Sumbawa, Indonesia',
        description:
          'Особый обед у моря с рыбой дневного улова и овощами из сада курорта. Официально принимают и гостей без проживания при наличии мест; заранее подтвердите стол и лодочный трансфер, потому что ресторан находится на Мойо.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery: 'The Restaurant, Amanwana, Moyo Island, Sumbawa, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://www.aman.com/resorts/amanwana/dining',
          },
        ],
        foodSpot: true,
      },
      {
        city: 'sumbawa',
        slug: 'tropical-beach-restaurant',
        nameRu: 'Tropical Beach Resort · западная Сумбава',
        nameEn:
          'Tropical Beach Resort Restaurant, Sekongkang, West Sumbawa, Indonesia',
        description:
          'Ресторан у пляжа в районе Секонгканга для ужина после серфинга и заката. Выбирайте блюда текущего меню и уточните доступ для внешних гостей; это юго-запад Сумбавы, далеко от базы поездок на Мойо.',
        tags: ['food'],
        timeEstimateHours: [1, 2],
        mapsQuery:
          'Tropical Beach Resort Restaurant, Sekongkang, West Sumbawa, Indonesia',
        source: 'Официальный сайт заведения · 16.10.2026',
        links: [
          {
            label: 'Официальный сайт заведения',
            url: 'https://www.tropicalbeachresort.id/',
          },
        ],
        foodSpot: true,
      },
    ],
  },
];
