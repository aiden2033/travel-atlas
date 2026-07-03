import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface MoreMenuProps {
  onSearch: () => void;
  variant?: 'header' | 'bottom';
}

interface MoreLink {
  to: string;
  icon: string;
  title: string;
  description: string;
}

const MORE_LINKS: MoreLink[] = [
  {
    to: '/calendar',
    icon: '📅',
    title: 'Календарь поездки',
    description: 'По дням: прилёт, вылет и планы поездки.',
  },
  {
    to: '/account',
    icon: '👤',
    title: 'Аккаунт',
    description: 'Вход и состояние синхронизации.',
  },
  {
    to: '/events',
    icon: '🎤',
    title: 'События',
    description: 'Концерты, выставки, matsuri и спорт по датам.',
  },
  {
    to: '/bookings',
    icon: '🎫',
    title: 'Брони и билеты',
    description: 'Что купить заранее и где проверять слоты.',
  },
  {
    to: '/preflight',
    icon: '✅',
    title: 'До вылета',
    description: 'Документы, связь, деньги, лекарства, офлайн.',
  },
  {
    to: '/trust',
    icon: '🧭',
    title: 'Проверено',
    description: 'Источники, даты проверки и что может устареть.',
  },
  {
    to: '/ic-cards',
    icon: '💳',
    title: 'IC-карта',
    description: 'Suica, PASMO, ICOCA и mobile-варианты.',
  },
  {
    to: '/shopping-deals',
    icon: '🛍️',
    title: 'Выгодно купить',
    description: 'Косметика, техника, хобби и сервисы в Японии.',
  },
  {
    to: '/emergency',
    icon: '🚨',
    title: 'SOS',
    description: 'Номера, фразы и сценарии на случай проблем.',
  },
];

export default function MoreMenu({ onSearch, variant = 'header' }: MoreMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Открыть дополнительные разделы"
        aria-expanded={open}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
          variant === 'bottom' ? 'h-full w-full flex-col gap-0.5 rounded-none border-0 shadow-none' : ''
        }`}
      >
        <span aria-hidden="true">☰</span>
        {variant === 'bottom' && (
          <span className="text-[11px] font-medium leading-none text-slate-500">Ещё</span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Дополнительные разделы"
          className="fixed inset-0 z-50 bg-slate-950/15"
          onClick={close}
        >
          <div
            className={`absolute max-h-[82vh] w-[min(28rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ${
              variant === 'bottom'
                ? 'bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3'
                : 'right-3 top-20 md:right-[max(0.75rem,calc((100vw-64rem)/2+0.75rem))]'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <p className="text-sm font-extrabold text-slate-900">Дополнительно</p>
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть дополнительные разделы"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                close();
                onSearch();
              }}
              className="mb-2 flex min-h-[44px] w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <span aria-hidden="true" className="text-xl">🔎</span>
              <span>
                <span className="block text-sm font-bold text-slate-900">Поиск</span>
                <span className="block text-xs text-slate-500">Найти место, тег или город.</span>
              </span>
            </button>

            <nav aria-label="Дополнительные разделы" className="flex flex-col gap-2">
              {MORE_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={close}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  {({ isActive }) => (
                    <span
                      className={`flex min-h-[44px] items-center gap-3 rounded-xl border px-3 py-2 transition ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span aria-hidden="true" className="text-xl">{item.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{item.title}</span>
                        <span className={`block text-xs ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                          {item.description}
                        </span>
                      </span>
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
