import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuth } from '../lib/sync/AuthProvider';
import { useSyncStatus } from '../lib/sync/SyncProvider';

declare global {
  interface Window {
    __jtTelegramAuth?: (payload: unknown) => void;
  }
}

const telegramBotUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;

const errorText = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Не удалось выполнить запрос';
};

export default function Account() {
  const auth = useAuth();
  const sync = useSyncStatus();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === 'login') {
        await auth.login(email, password);
      } else {
        await auth.signup(email, password, displayName.trim() || undefined);
      }
      setPassword('');
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  if (auth.user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-3 py-4">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Аккаунт</p>
          <h1 className="text-xl font-extrabold text-slate-900">
            {auth.user.displayName || auth.user.email || auth.user.telegramUsername || 'Japan Trip'}
          </h1>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-500">Email</dt>
              <dd className="mt-0.5 break-words font-bold text-slate-900">{auth.user.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Telegram</dt>
              <dd className="mt-0.5 break-words font-bold text-slate-900">
                {auth.user.telegramUsername ? `@${auth.user.telegramUsername}` : '—'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Очередь</dt>
              <dd className="mt-0.5 font-bold text-slate-900">{sync.pendingCount}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Синк</dt>
              <dd className="mt-0.5 font-bold text-slate-900">
                {sync.syncing
                  ? 'идёт'
                  : sync.backendUnavailable
                    ? 'offline'
                    : sync.lastSyncedAt
                      ? new Intl.DateTimeFormat('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(sync.lastSyncedAt))
                      : 'готов'}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => void auth.logout()}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Выйти
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-3 py-4">
      <header>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Аккаунт</p>
        <h1 className="text-xl font-extrabold text-slate-900">Вход</h1>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1">
          {(['login', 'signup'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              aria-pressed={mode === item}
              className={`min-h-[44px] rounded-full text-sm font-bold transition ${
                mode === item ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item === 'login' ? 'Войти' : 'Создать'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              Имя
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              />
            </label>
          )}

          <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <TelegramLoginButton onError={setError} />
      </section>
    </div>
  );
}

function TelegramLoginButton({ onError }: { onError: (value: string | null) => void }) {
  const auth = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!telegramBotUsername || !containerRef.current) return undefined;
    const container = containerRef.current;
    container.innerHTML = '';

    window.__jtTelegramAuth = (payload: unknown) => {
      onError(null);
      auth.telegramLogin(payload).catch((caught) => onError(errorText(caught)));
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', telegramBotUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-onauth', 'window.__jtTelegramAuth(user)');
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
      if (window.__jtTelegramAuth) delete window.__jtTelegramAuth;
    };
  }, [auth, onError]);

  if (!telegramBotUsername) return null;

  return (
    <div className="mt-4 flex min-h-[44px] justify-center border-t border-slate-100 pt-4">
      <div ref={containerRef} />
    </div>
  );
}
