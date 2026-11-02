import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCheckout,
  fetchCountryProducts,
  fetchEntitlements,
  fetchMyOrders,
  type GuideEntitlement,
  type GuideProduct,
} from './api';

export const productsQueryKey = ['billing', 'products'] as const;
export const entitlementsQueryKey = ['billing', 'entitlements'] as const;
export const ordersQueryKey = ['billing', 'orders'] as const;

export const useCountryProduct = (countryId: string) =>
  useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchCountryProducts,
    staleTime: 5 * 60_000,
    select: (products: Record<string, GuideProduct[]>) => products[countryId]?.[0] ?? null,
  });

export const useEntitlements = (enabled: boolean) =>
  useQuery({
    queryKey: entitlementsQueryKey,
    queryFn: fetchEntitlements,
    enabled,
    staleTime: 60_000,
  });

export const useMyOrders = (enabled: boolean) =>
  useQuery({
    queryKey: ordersQueryKey,
    queryFn: fetchMyOrders,
    enabled,
    staleTime: 30_000,
  });

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheckout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  });
};

export const isActiveEntitlement = (
  entitlement: GuideEntitlement,
  now = Date.now(),
): boolean => !entitlement.expiresAt || new Date(entitlement.expiresAt).getTime() > now;
