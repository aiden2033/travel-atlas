// Trip calendar data. To add an event, append an entry to `tripDayEvents`
// with the `date` set to its day (YYYY-MM-DD). Empty days render automatically.

export type TripDayEventCategory =
  | 'flight'
  | 'transport'
  | 'hotel'
  | 'activity'
  | 'food'
  | 'event'
  | 'note';

export interface TripDayEvent {
  id: string;
  date: string;
  title: string;
  time?: string;
  detail?: string;
  city?: string;
  category: TripDayEventCategory;
  links?: { label: string; url: string }[];
}

export const tripStartDate = '2026-08-29';
export const tripEndDate = '2026-09-13';
export const tripRoute = 'Осака → Киото → Кавагутико → Готэмба → Токио';

export const tripDayEvents: TripDayEvent[] = [
  // ── Осака (4 ночи) ───────────────────────────────────────────────
  {
    id: 'arrival',
    date: '2026-08-29',
    time: '19:00',
    title: 'Прилёт в Осаку (KIX)',
    detail:
      'После прилёта собираемся в аэропорту и едем заселяться. До Осаки — Nankai Rapi:t или JR Haruka.',
    city: 'Осака',
    category: 'flight',
  },
  {
    id: 'osaka-checkin',
    date: '2026-08-29',
    time: '15:00',
    title: 'Заселение: Home in Chuo Ward, Osaka (4 ночи)',
    detail:
      'Airbnb по адресу 3-chōme-8-24 Kōzu, Chuo Ward, Osaka 542-0072. Заезд после 15:00; выезд 2 сентября до 11:00. Инструкции по заселению и правила дома — в Airbnb.',
    city: 'Осака',
    category: 'hotel',
    links: [
      {
        label: 'Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=3-chome-8-24+Kozu%2C+Chuo+Ward%2C+Osaka+542-0072%2C+Japan',
      },
    ],
  },
  {
    id: 'dotonbori-evening',
    date: '2026-08-29',
    title: 'Дотонбори, если останутся силы',
    detail: 'Прогулка и ужин после заселения — только если хватит времени и энергии.',
    city: 'Осака',
    category: 'activity',
  },
  {
    id: 'nara-daytrip',
    date: '2026-08-31',
    title: 'Выезд в Нару',
    detail: 'Спокойный день с оленями и прогулками по Наре.',
    city: 'Нара',
    category: 'activity',
  },
  {
    id: 'himeji-daytrip',
    date: '2026-09-01',
    title: 'Ранний выезд в замок Химэдзи',
    detail: 'Начинаем день рано: едем в Химэдзи и осматриваем замок.',
    city: 'Химэдзи',
    category: 'activity',
  },
  {
    id: 'osaka-finish-and-pack',
    date: '2026-09-01',
    title: 'Досмотреть Осаку и собрать чемоданы',
    detail: 'Вечером добираем всё, что не успели посмотреть, и готовимся к переезду в Киото.',
    city: 'Осака',
    category: 'note',
  },

  // ── Киото (4 ночи) ───────────────────────────────────────────────
  {
    id: 'osaka-kyoto-transfer',
    date: '2026-09-02',
    title: 'Переезд Осака → Киото',
    detail:
      'JR Special Rapid ~30 мин. Переезжаем утром, чтобы первый день в Киото не потерялся.',
    city: 'Киото',
    category: 'transport',
  },
  {
    id: 'kyoto-checkin',
    date: '2026-09-02',
    title: 'Заселение: Miyagawacho Samurai Machiya (4 ночи)',
    detail:
      'Airbnb по адресу 527 Higashikawarachō, Higashiyama-ku, Kyoto 605-0839. Выезд 6 сентября до 10:00. Время и инструкции по заселению сверить в Airbnb.',
    city: 'Киото',
    category: 'hotel',
    links: [
      {
        label: 'Google Maps',
        url: 'https://www.google.com/maps/search/?api=1&query=527+Higashikawaracho%2C+Higashiyama-ku%2C+Kyoto+605-0839%2C+Japan',
      },
    ],
  },
  {
    id: 'higashiyama',
    date: '2026-09-02',
    title: 'Хигасияма: Киёмидзу-дэра, пагода Ясака, Гион',
    detail: 'Первый день — старые исторические кварталы, храмы и прогулка по Гиону.',
    city: 'Киото',
    category: 'activity',
  },
  {
    id: 'kodai-ji',
    date: '2026-09-02',
    title: 'Кодай-дзи + Саннэндзака/Ниэннэндзака',
    detail: 'Продолжаем маршрут по храмам и мощёным историческим улицам Хигасиямы.',
    city: 'Киото',
    category: 'activity',
  },
  {
    id: 'uji-daytrip',
    date: '2026-09-03',
    title: 'Удзи: природа и чай',
    detail: 'Ранний выезд в Удзи, прогулка на природе и чайная часть дня.',
    city: 'Удзи',
    category: 'activity',
  },
  {
    id: 'ginkakuji-philosophers',
    date: '2026-09-03',
    title: 'Гинкаку-дзи + Философская тропа',
    detail: 'После Удзи возвращаемся в Киото на Серебряный павильон и прогулку по Философской тропе.',
    city: 'Киото',
    category: 'activity',
  },
  {
    id: 'fushimi-inari',
    date: '2026-09-04',
    title: 'Фусими Инари на рассвете',
    detail: 'Ранний подъём: идём к воротам тории до основных толп.',
    city: 'Киото',
    category: 'activity',
  },
  {
    id: 'imperial-palace-shopping-bars',
    date: '2026-09-04',
    title: 'Императорский дворец, шопинг и бары',
    detail: 'После Фусими Инари — дворец и свободная городская программа; вечером можно пройтись по барам.',
    city: 'Киото',
    category: 'activity',
  },
  {
    id: 'arashiyama',
    date: '2026-09-05',
    title: 'Очень ранний выезд в Арасияму',
    detail: 'Бамбуковая роща и парк обезьян. Приезжаем как можно раньше, пока меньше людей.',
    city: 'Арасияма',
    category: 'activity',
  },
  {
    id: 'pontocho-kamo-evening',
    date: '2026-09-05',
    title: 'Поесть и прогуляться по Понтотё и реке Камо',
    detail: 'После Арасиямы возвращаемся в центр на еду и спокойную вечернюю прогулку.',
    city: 'Киото',
    category: 'food',
  },
  {
    id: 'kyoto-pack',
    date: '2026-09-05',
    title: 'Собрать чемоданы для Токио',
    detail: 'Последний вечер в Киото оставляем на сборы перед переездом.',
    city: 'Киото',
    category: 'note',
  },

  // ── Кавагутико, Готэмба и Токио (6 ночей) ────────────────────────
  {
    id: 'kyoto-kawaguchiko-transfer',
    date: '2026-09-06',
    title: 'Переезд Киото → Кавагутико',
    detail:
      'После выезда из дома в Киото едем в Кавагутико и остаёмся там на ночь.',
    city: 'Кавагутико',
    category: 'transport',
  },
  {
    id: 'kawaguchiko-gotemba-tokyo-transfer',
    date: '2026-09-07',
    title: 'Переезд Кавагутико → Готэмба → Токио',
    detail: 'Из Кавагутико едем в Готэмбу, после неё продолжаем путь в Токио.',
    city: 'Готэмба',
    category: 'transport',
  },
  {
    id: 'tokyo-checkin',
    date: '2026-09-07',
    title: 'Заселение в Токио (6 ночей)',
    detail: 'Большого дома на всю компанию в черте города нет, поэтому селимся несколькими группами.',
    city: 'Токио',
    category: 'hotel',
  },
  {
    id: 'tokyo-flexible-week',
    date: '2026-09-07',
    title: '7–12 сентября: свободная программа по группам',
    detail:
      'Город, шопинг и выезды на природу выбираем по интересам. Конкретные дни можно собрать по сайту Димасика; всей толпой ходить по одному маршруту не нужно.',
    city: 'Токио',
    category: 'activity',
  },
  {
    id: 'tokyo-shared-events',
    date: '2026-09-07',
    title: 'На неделе: общие события и выезды',
    detail:
      'Встречаемся на событиях с заранее купленными билетами. Вместе хотим съездить в Хаконэ и Камакуру — даты выбрать по погоде и билетам.',
    city: 'Токио',
    category: 'event',
  },
  {
    id: 'tokyo-bar-crawl',
    date: '2026-09-07',
    title: 'Один вечер: общий бар-кроул',
    detail:
      'Выбрать один вечер, чтобы собраться всей компанией и пройтись по барам или клубам Токио.',
    city: 'Токио',
    category: 'event',
  },
  {
    id: 'pack-day',
    date: '2026-09-12',
    title: 'Последние покупки и упаковка',
    detail: 'Завершаем свободную программу, докупаем сувениры и собираем чемоданы перед утренним рейсом.',
    city: 'Токио',
    category: 'note',
  },
  {
    id: 'departure',
    date: '2026-09-13',
    time: '08:45',
    title: 'Вылет домой',
    detail: 'Рейс утром в 08:45 — выехать в аэропорт сильно заранее (группой закладывать запас на регистрацию).',
    city: 'Токио',
    category: 'flight',
  },
];

const dayInMs = 24 * 60 * 60 * 1000;

const toUtc = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

const toIso = (utc: number) => {
  const date = new Date(utc);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const tripDays = (): string[] => {
  const days: string[] = [];
  const last = toUtc(tripEndDate);
  for (let cur = toUtc(tripStartDate); cur <= last; cur += dayInMs) {
    days.push(toIso(cur));
  }
  return days;
};

export const tripDayCount = Math.round((toUtc(tripEndDate) - toUtc(tripStartDate)) / dayInMs) + 1;

export const daysBetween = (fromIso: string, toIsoDate: string) =>
  Math.round((toUtc(toIsoDate) - toUtc(fromIso)) / dayInMs);
