import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SyncApiError } from '../lib/sync/api';
import { useAuth } from '../lib/sync/AuthProvider';
import { useSyncStatus } from '../lib/sync/SyncProvider';

const loginBanner: Record<string, string> = {
  ok: 'Вы вошли. Добро пожаловать!',
  consent: 'Нужно согласие на обработку персональных данных — отметьте его и запросите ссылку ещё раз.',
  error: 'Ссылка для входа недействительна или устарела. Запросите новую.',
};

const sendErrorText = (error: unknown): string => {
  if (error instanceof SyncApiError) {
    const type =
      typeof error.payload === 'object' && error.payload !== null
        ? (error.payload as { type?: unknown }).type
        : undefined;
    if (type === 'rate_limited') return 'Слишком много попыток. Подождите немного и попробуйте снова.';
    if (type === 'captcha_failed') return 'Проверка капчи не пройдена. Попробуйте ещё раз.';
    if (type === 'pd_consent_required') return 'Нужно согласие на обработку персональных данных.';
  }
  return 'Не удалось отправить письмо. Проверьте соединение и попробуйте позже.';
};

export default function Account() {
  const auth = useAuth();
  const sync = useSyncStatus();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [pdConsent, setPdConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginStatus = searchParams.get('login');

  const syncLabel = sync.syncing
    ? 'идёт'
    : sync.backendUnavailable
      ? 'offline'
      : sync.lastSyncedAt
        ? new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
            new Date(sync.lastSyncedAt),
          )
        : 'готов';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await auth.requestMagicLink(email, pdConsent);
      setSent(true);
      if (loginStatus) setSearchParams({}, { replace: true });
    } catch (caught) {
      setError(sendErrorText(caught));
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
            {auth.user.displayName || auth.user.email || 'Атлас'}
          </h1>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-500">Email</dt>
              <dd className="mt-0.5 break-words font-bold text-slate-900">
                {auth.user.email ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Очередь синхронизации</dt>
              <dd className="mt-0.5 font-bold text-slate-900">{sync.pendingCount}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Синхронизация</dt>
              <dd className="mt-0.5 font-bold text-slate-900">{syncLabel}</dd>
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
        <h1 className="text-xl font-extrabold text-slate-900">Вход по ссылке</h1>
      </header>

      {loginStatus && loginBanner[loginStatus] && (
        <p
          role="status"
          className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
            loginStatus === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}
        >
          {loginBanner[loginStatus]}
        </p>
      )}

      {sent ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">
            Письмо отправлено. Откройте ссылку из него, чтобы войти — она одноразовая и действует
            ограниченное время.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setError(null);
            }}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-slate-100 px-4 text-sm font-bold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Отправить ещё раз
          </button>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <form onSubmit={submit} className="flex flex-col gap-3">
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

            <label className="flex items-start gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={pdConsent}
                onChange={(event) => setPdConsent(event.target.checked)}
                required
                className="mt-0.5 size-5 rounded border-slate-300 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              />
              Согласен(-на) на обработку персональных данных
            </label>

            {auth.unavailable && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                Сервис входа сейчас недоступен.
              </p>
            )}

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
              {busy ? 'Подождите…' : 'Получить ссылку для входа'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
