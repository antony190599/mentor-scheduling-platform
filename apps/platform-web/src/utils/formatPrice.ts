/**
 * Formats a number as a price string with currency symbol
 * @param price - The price to format
 * @param locale - The locale to use for formatting (default: 'es-PE')
 * @param currency - The currency code (default: 'PEN')
 * @returns Formatted price string
 */
export function formatPrice(
  price: number, 
  locale: string = 'es-PE', 
  currency: string = 'PEN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Calculate discount percentage between original and discounted price
 * @param originalPrice - Original price
 * @param discountPrice - Discounted price
 * @returns Discount percentage as a string with % sign
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountPrice: number
): string {
  if (originalPrice <= 0 || discountPrice >= originalPrice) {
    return '0%';
  }
  
  const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
  return `${Math.round(discount)}%`;
}
