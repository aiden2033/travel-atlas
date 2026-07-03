import { useMemo, useState, type FormEvent } from 'react';
import {
  tripDays,
  tripDayEvents,
  tripDayCount,
  tripStartDate,
  tripEndDate,
  tripRoute,
  daysBetween,
  type TripDayEvent,
  type TripDayEventCategory,
} from '../data/calendar';
import { usePersonalTripEvents, type PersonalTripEventInput } from '../lib/sync/localState';

const categoryMeta: Record<
  TripDayEventCategory,
  { icon: string; chip: string; accentCard: boolean }
> = {
  flight: { icon: '✈️', chip: 'border-emerald-200 bg-emerald-50 text-emerald-800', accentCard: true },
  transport: { icon: '🚄', chip: 'border-sky-200 bg-sky-50 text-sky-800', accentCard: false },
  hotel: { icon: '🏨', chip: 'border-violet-200 bg-violet-50 text-violet-800', accentCard: false },
  activity: { icon: '📍', chip: 'border-amber-200 bg-amber-50 text-amber-900', accentCard: false },
  food: { icon: '🍜', chip: 'border-rose-200 bg-rose-50 text-rose-800', accentCard: false },
  event: { icon: '🎉', chip: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800', accentCard: false },
  note: { icon: '📝', chip: 'border-slate-200 bg-slate-50 text-slate-700', accentCard: false },
};

const categoryLabels: Record<TripDayEventCategory, string> = {
  flight: 'Перелёт',
  transport: 'Транспорт',
  hotel: 'Жильё',
  activity: 'Активность',
  food: 'Еда',
  event: 'Событие',
  note: 'Заметка',
};

// Logical order of events within a single day: arrival/transfer first,
// then hotel check-in, then activities/food, then loose notes.
const categoryRank: Record<TripDayEventCategory, number> = {
  flight: 0,
  transport: 1,
  hotel: 2,
  activity: 3,
  food: 3,
  event: 3,
  note: 4,
};

const atNoon = (date: string) => new Date(`${date}T12:00:00+09:00`);

const weekdayShort = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(atNoon(date)).toUpperCase();

const monthShort = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(atNoon(date)).replace('.', '');

const dayNumber = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric' }).format(atNoon(date));

const monthLong = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' })
    .format(atNoon(date))
    .replace(/\s*г\.?$/, '');

const todayIso = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

interface MonthGroup {
  key: string;
  label: string;
  days: string[];
}

type CalendarEvent = Omit<TripDayEvent, 'time' | 'detail' | 'city' | 'links'> & {
  time?: string | null;
  detail?: string | null;
  city?: string | null;
  links?: { label: string; url: string }[];
  personal?: boolean;
  position?: number;
  updatedAt?: string;
  deletedAt?: string | null;
};

interface EventFormState {
  id?: string;
  date: string;
  title: string;
  time: string;
  detail: string;
  city: string;
  category: TripDayEventCategory;
}

const blankForm = (date: string): EventFormState => ({
  date,
  title: '',
  time: '',
  detail: '',
  city: '',
  category: 'note',
});

export default function Calendar() {
  const today = todayIso();
  const personalEvents = usePersonalTripEvents();
  const [form, setForm] = useState<EventFormState | null>(null);

  const months = useMemo<MonthGroup[]>(() => {
    const map = new Map<string, MonthGroup>();
    tripDays().forEach((date) => {
      const key = date.slice(0, 7);
      const group = map.get(key) ?? { key, label: monthLong(date), days: [] };
      group.days.push(date);
      map.set(key, group);
    });
    return [...map.values()];
  }, []);

  const allEvents = useMemo<CalendarEvent[]>(
    () => [
      ...tripDayEvents,
      ...personalEvents.activeEvents.map((event) => ({
        ...event,
        personal: true,
      })),
    ],
    [personalEvents.activeEvents],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    allEvents.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    // Stable sort keeps the authoring order from `tripDayEvents` as the final
    // tie-breaker, so same-category events stay in the order they were written.
    map.forEach((list) =>
      list.sort((a, b) => {
        const byCategory = categoryRank[a.category] - categoryRank[b.category];
        if (byCategory !== 0) return byCategory;
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if ((a.position ?? 0) !== (b.position ?? 0)) return (a.position ?? 0) - (b.position ?? 0);
        return 0;
      }),
    );
    return map;
  }, [allEvents]);

  const countdown = useMemo(() => {
    if (today < tripStartDate) return `до старта ${daysBetween(today, tripStartDate)} дн.`;
    if (today > tripEndDate) return 'поездка завершена';
    return `идёт · день ${daysBetween(tripStartDate, today) + 1} из ${tripDayCount}`;
  }, [today]);

  const plannedCount = allEvents.length;

  const startCreate = () => setForm(blankForm(today < tripStartDate || today > tripEndDate ? tripStartDate : today));

  const startEdit = (event: CalendarEvent) => {
    setForm({
      id: event.id,
      date: event.date,
      title: event.title,
      time: event.time ?? '',
      detail: event.detail ?? '',
      city: event.city ?? '',
      category: event.category,
    });
  };

  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    if (!form?.title.trim()) return;
    const input: PersonalTripEventInput & { id?: string } = {
      id: form.id,
      date: form.date,
      title: form.title.trim(),
      time: form.time.trim() || null,
      detail: form.detail.trim() || null,
      city: form.city.trim() || null,
      category: form.category,
      links: [],
    };
    personalEvents.upsert(input);
    setForm(null);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-3 py-4">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{tripRoute}</p>
            <h1 className="text-xl font-extrabold leading-tight text-slate-900">Календарь поездки</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex min-h-[44px] items-center rounded-full bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Добавить
            </button>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              {countdown}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatBox label="дней" value={tripDayCount} />
          <StatBox label="событий" value={plannedCount} />
          <StatBox label="города" value={3} />
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          {`${dayNumber(tripStartDate)} ${monthShort(tripStartDate)} — ${dayNumber(tripEndDate)} ${monthShort(tripEndDate)} 2026`}.
          Осака и Киото расписаны по дням, а токийская неделя оставлена гибкой для
          маршрутов по интересам.
        </p>
      </header>

      {form && (
        <EventForm
          form={form}
          onChange={setForm}
          onCancel={() => setForm(null)}
          onSubmit={submitForm}
        />
      )}

      <div className="flex flex-col gap-5">
        {months.map((month) => (
          <section key={month.key} className="flex flex-col gap-1">
            <h2 className="sticky top-[61px] z-10 -mx-3 bg-slate-50/95 px-3 py-1.5 text-sm font-extrabold capitalize text-slate-900 backdrop-blur">
              {month.label}
            </h2>

            <ol className="flex flex-col">
              {month.days.map((date, indexInMonth) => {
                const isLastOverall =
                  month.key === months[months.length - 1].key &&
                  indexInMonth === month.days.length - 1;
                return (
                  <DayRow
                    key={date}
                    date={date}
                    events={eventsByDay.get(date) ?? []}
                    isToday={date === today}
                    tripDayIndex={daysBetween(tripStartDate, date) + 1}
                    showRail={!isLastOverall}
                    onEdit={startEdit}
                    onDelete={(id) => personalEvents.remove(id)}
                  />
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

interface DayRowProps {
  date: string;
  events: CalendarEvent[];
  isToday: boolean;
  tripDayIndex: number;
  showRail: boolean;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

function DayRow({ date, events, isToday, tripDayIndex, showRail, onEdit, onDelete }: DayRowProps) {
  const hasEvents = events.length > 0;
  const accent = events.some((event) => categoryMeta[event.category].accentCard);

  return (
    <li className="flex gap-3">
      <div className="flex w-12 shrink-0 flex-col items-center">
        <div
          className={`flex w-full flex-col items-center rounded-xl border py-1.5 ${
            accent
              ? 'border-emerald-300 bg-emerald-50'
              : isToday
                ? 'border-slate-900 bg-slate-900'
                : 'border-slate-200 bg-white'
          }`}
        >
          <span
            className={`text-[10px] font-bold leading-none ${
              isToday && !accent ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            {weekdayShort(date)}
          </span>
          <span
            className={`text-lg font-extrabold leading-tight ${
              isToday && !accent ? 'text-white' : 'text-slate-900'
            }`}
          >
            {dayNumber(date)}
          </span>
          <span
            className={`text-[9px] font-semibold leading-none ${
              isToday && !accent ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            {monthShort(date)}
          </span>
        </div>
        {showRail && <div className="my-1 w-px flex-1 bg-slate-200" />}
      </div>

      <div className={`min-w-0 flex-1 ${showRail ? 'pb-3' : ''}`}>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs font-semibold text-slate-400">
            День {tripDayIndex} из {tripDayCount}
          </span>
          {isToday && (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
              сегодня
            </span>
          )}
        </div>

        {hasEvents ? (
          <div className="mt-1.5 flex flex-col gap-2">
            {events.map((event) => (
              <EventRow
                key={`${event.personal ? 'personal' : 'static'}-${event.id}`}
                event={event}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <p className="mt-1.5 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs font-medium text-slate-400">
            Свободный день
          </p>
        )}
      </div>
    </li>
  );
}

interface EventRowProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

function EventRow({ event, onEdit, onDelete }: EventRowProps) {
  const meta = categoryMeta[event.category];
  return (
    <article
      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 shadow-sm ${
        meta.accentCard ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'
      }`}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {event.time && (
              <span className="text-sm font-extrabold tabular-nums text-slate-900">{event.time}</span>
            )}
            <span className="text-sm font-bold text-slate-900">{event.title}</span>
          </div>
          {event.personal && (
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onEdit(event)}
                aria-label="Редактировать событие"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                aria-label="Удалить событие"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-600 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {event.detail && (
          <p className="mt-0.5 text-xs leading-snug text-slate-500">{event.detail}</p>
        )}
        {event.links && event.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {event.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 underline-offset-2 hover:border-slate-300 hover:bg-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        {event.city && (
          <span
            className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.chip}`}
          >
            {event.city}
          </span>
        )}
      </div>
    </article>
  );
}

interface EventFormProps {
  form: EventFormState;
  onChange: (form: EventFormState) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent) => void;
}

function EventForm({ form, onChange, onCancel, onSubmit }: EventFormProps) {
  const update = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    onChange({ ...form, [key]: value });

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Дата
          <input
            type="date"
            value={form.date}
            min={tripStartDate}
            max={tripEndDate}
            onChange={(event) => update('date', event.target.value)}
            required
            className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Тип
          <select
            value={form.category}
            onChange={(event) => update('category', event.target.value as TripDayEventCategory)}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {(Object.keys(categoryLabels) as TripDayEventCategory[]).map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Время
          <input
            value={form.time}
            onChange={(event) => update('time', event.target.value)}
            placeholder="18:30"
            className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Город
          <input
            value={form.city}
            onChange={(event) => update('city', event.target.value)}
            className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          />
        </label>
      </div>

      <label className="mt-3 flex flex-col gap-1 text-sm font-semibold text-slate-700">
        Название
        <input
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          required
          className="h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1 text-sm font-semibold text-slate-700">
        Детали
        <textarea
          value={form.detail}
          onChange={(event) => update('detail', event.target.value)}
          rows={3}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        />
      </label>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-[44px] items-center rounded-full bg-slate-100 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="inline-flex min-h-[44px] items-center rounded-full bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-lg font-extrabold leading-none text-slate-900 tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}
