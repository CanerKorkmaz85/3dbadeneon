export const DISCOUNT_RATE = 0.2;

export function originalPriceForDiscount(discountedPrice: number) {
  if (!Number.isFinite(discountedPrice) || discountedPrice <= 0) return 0;
  return Math.round(discountedPrice / (1 - DISCOUNT_RATE));
}
