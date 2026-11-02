import { apiFetch, SyncApiError } from '../../lib/sync/api';

export interface GuideProduct {
  id: string;
  sku: string;
  title: string;
  priceRub: number;
  priceStars?: number;
  durationDays?: number;
}

interface PublicCatalog {
  countries: Array<{ id: string; products: GuideProduct[] }>;
}

export interface GuideEntitlement {
  scopeType: 'country';
  scopeId: string;
  countrySlug?: string;
  expiresAt?: string;
  source: string;
}

interface MeProfile {
  entitlements: GuideEntitlement[];
}

export interface OrderCountry {
  id: string;
  slug: string;
  nameRu: string;
}

export interface OrderProduct {
  id: string;
  sku: string;
  title: string;
  countries: OrderCountry[];
}

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'chargeback' | 'canceled';

export interface Order {
  id: string;
  status: OrderStatus;
  provider: string;
  amount: number;
  currency: string;
  refundedAmount: number;
  cancelReason?: string;
  confirmationUrl?: string;
  createdAt: string;
  paidAt?: string;
  product: OrderProduct;
}

export interface CheckoutResponse {
  orderId: string;
  status: OrderStatus;
  confirmationUrl?: string;
}

const OFFER_VERSION = '2026-10-01';

export const fetchCountryProducts = async (): Promise<Record<string, GuideProduct[]>> => {
  const catalog = await apiFetch<PublicCatalog>('/v1/public/catalog');
  return Object.fromEntries(catalog.countries.map((country) => [country.id, country.products]));
};

export const fetchEntitlements = async (): Promise<GuideEntitlement[]> =>
  (await apiFetch<MeProfile>('/v1/me')).entitlements;

export const fetchMyOrders = () => apiFetch<Order[]>('/v1/me/orders');

export const fetchOrder = (id: string) => apiFetch<Order>(`/v1/orders/${id}`);

export const createCheckout = (productId: string) =>
  apiFetch<CheckoutResponse>('/v1/orders', {
    method: 'POST',
    body: {
      productId,
      provider: 'yookassa',
      offerAccepted: true,
      offerVersion: OFFER_VERSION,
    },
  });

interface ProblemPayload {
  code?: string;
  title?: string;
}

export const billingErrorText = (error: unknown): string => {
  if (!(error instanceof SyncApiError)) return 'Не удалось выполнить запрос';
  const payload = error.payload as ProblemPayload | string;
  const problem = typeof payload === 'object' && payload !== null ? payload : {};
  if (problem.code === 'provider_unavailable')
    return 'Платёжный сервис не ответил. Попробуйте ещё раз через минуту.';
  if (problem.code === 'already_owned') return 'Доступ к этому путеводителю уже открыт.';
  return problem.title ?? 'Не удалось оформить заказ';
};
