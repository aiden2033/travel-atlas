import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, CreditCard } from '@phosphor-icons/react';
import { useAuth } from '../lib/sync/AuthProvider';
import { useCatalog } from '../atlas/store';
import { fetchOrder, type Order, type OrderStatus } from '../atlas/billing/api';
import {
  entitlementsQueryKey,
  isActiveEntitlement,
  ordersQueryKey,
  useEntitlements,
  useMyOrders,
} from '../atlas/billing/hooks';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачен',
  refunded: 'Возвращён',
  chargeback: 'Оспорен',
  canceled: 'Отменён',
};

const statusClasses: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  refunded: 'bg-slate-100 text-slate-700',
  chargeback: 'bg-rose-100 text-rose-700',
  canceled: 'bg-slate-100 text-slate-700',
};

const formatMoney = (amount: number): string =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(value));

const readReturnOrderId = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('checkout') === 'return' ? params.get('order') : null;
};

const clearReturnQuery = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('checkout');
  url.searchParams.delete('order');
  window.history.replaceState(null, '', url.toString());
};

function CheckoutReturnBanner({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const orderQuery = useQuery({
    queryKey: ['billing', 'order', orderId],
    queryFn: () => fetchOrder(orderId),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 3_000 : false),
  });

  useEffect(() => {
    if (!orderQuery.data || orderQuery.data.status === 'pending') return;
    void queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    void queryClient.invalidateQueries({ queryKey: entitlementsQueryKey });
    clearReturnQuery();
  }, [orderQuery.data, queryClient]);

  if (!orderQuery.data) return null;
  const order = orderQuery.data;
  if (order.status === 'paid') {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
        <CheckCircle size={18} weight="fill" />
        Оплата получена, доступ открыт.
      </p>
    );
  }
  if (order.status !== 'pending') return null;
  return (
    <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
      Проверяем оплату…
    </p>
  );
}

function Entitlements() {
  const { catalog } = useCatalog();
  const entitlementsQuery = useEntitlements(true);
  const active = (entitlementsQuery.data ?? []).filter(isActiveEntitlement);
  if (active.length === 0) {
    return <p className="text-sm text-slate-500">Пока нет купленных путеводителей.</p>;
  }
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {active.map((entitlement) => {
        const country = catalog.countries.find((item) => item.id === entitlement.countrySlug);
        return (
          <li
            key={`${entitlement.scopeType}-${entitlement.scopeId}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <span className="font-bold text-slate-900">{country?.nameRu ?? entitlement.countrySlug}</span>
            <span className="text-xs font-semibold text-slate-500">
              {entitlement.expiresAt ? `до ${formatDate(entitlement.expiresAt)}` : 'бессрочно'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-slate-900">{order.product.title}</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span>{order.product.countries.map((country) => country.nameRu).join(', ')}</span>
        <span>{formatMoney(order.amount)}</span>
        <span>{formatDate(order.createdAt)}</span>
      </div>
      {order.status === 'pending' && order.confirmationUrl && (
        <button
          type="button"
          onClick={() => window.location.assign(order.confirmationUrl!)}
          className="inline-flex min-h-[44px] w-fit items-center justify-center rounded-full bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Продолжить оплату
        </button>
      )}
    </li>
  );
}

export default function Purchases() {
  const { user, loading } = useAuth();
  const ordersQuery = useMyOrders(Boolean(user));
  const [returnOrderId] = useState(readReturnOrderId);

  useEffect(() => {
    if (returnOrderId) clearReturnQuery();
  }, [returnOrderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-3 py-4">
        <p className="text-sm font-semibold text-slate-500">Загружаем…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 px-3 py-4">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Мои покупки</p>
          <h1 className="text-xl font-extrabold text-slate-900">Войдите в аккаунт</h1>
        </header>
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Покупки и доступы хранятся в аккаунте.
          <Link
            to="/account"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            Войти
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-3 py-4">
      <header>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Аккаунт</p>
        <h1 className="text-xl font-extrabold text-slate-900">Мои покупки</h1>
      </header>

      {returnOrderId && <CheckoutReturnBanner orderId={returnOrderId} />}

      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-500">
          <CreditCard size={18} />
          Доступы
        </h2>
        <Entitlements />
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Заказы</h2>
        {ordersQuery.isLoading ? (
          <p className="text-sm text-slate-500">Загружаем…</p>
        ) : ordersQuery.isError ? (
          <p className="text-sm font-semibold text-rose-600">Не удалось загрузить заказы.</p>
        ) : ordersQuery.data?.length ? (
          <ul className="flex flex-col gap-2">
            {ordersQuery.data.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Заказов пока нет.</p>
        )}
      </section>
    </div>
  );
}
