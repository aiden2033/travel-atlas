import { Link } from 'react-router-dom';
import { CheckCircle, CreditCard } from '@phosphor-icons/react';
import { useAuth } from '../../lib/sync/AuthProvider';
import type { Country } from '../model';
import { billingErrorText, type Order } from './api';
import { isActiveEntitlement, useCheckout, useCountryProduct, useEntitlements, useMyOrders } from './hooks';

const formatPrice = (priceRub: number): string =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(priceRub);

const pendingFor = (orders: Order[] | undefined, productId: string): Order | null =>
  orders?.find((order) => order.product.id === productId && order.status === 'pending') ?? null;

export default function BuyGuideSection({ country }: { country: Country }) {
  const { user } = useAuth();
  const productQuery = useCountryProduct(country.id);
  const entitlementsQuery = useEntitlements(Boolean(user));
  const ordersQuery = useMyOrders(Boolean(user));
  const checkout = useCheckout();
  const product = productQuery.data;
  if (!product) return null;

  const owned = (entitlementsQuery.data ?? []).some(
    (entitlement) =>
      entitlement.countrySlug === country.id && isActiveEntitlement(entitlement),
  );
  const pending = pendingFor(ordersQuery.data, product.id);

  const pay = async () => {
    const response = await checkout.mutateAsync(product.id);
    if (response.confirmationUrl) window.location.assign(response.confirmationUrl);
  };

  return (
    <section className="mt-5 inline-flex max-w-md flex-col gap-3 rounded-2xl border border-emerald-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
          Расширенный путеводитель
        </p>
        <p className="mt-1 text-sm font-extrabold text-slate-900">
          {product.title} · {formatPrice(product.priceRub)}
        </p>
      </div>

      {owned ? (
        <>
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <CheckCircle size={18} weight="fill" />
            Доступ открыт
          </p>
          <Link
            to="/purchases"
            className="text-xs font-semibold text-emerald-800 underline underline-offset-2"
          >
            Мои покупки
          </Link>
        </>
      ) : !user ? (
        <Link
          to="/account"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-emerald-800 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <CreditCard size={18} />
          Войти и купить
        </Link>
      ) : (
        <div className="flex flex-col gap-2">
          {pending?.confirmationUrl ? (
            <button
              type="button"
              onClick={() => window.location.assign(pending.confirmationUrl!)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              Продолжить оплату
            </button>
          ) : (
            <button
              type="button"
              disabled={checkout.isPending}
              onClick={() => void pay()}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-emerald-800 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkout.isPending ? 'Создаём заказ…' : `Купить за ${formatPrice(product.priceRub)}`}
            </button>
          )}
          {checkout.isError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
              {billingErrorText(checkout.error)}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
