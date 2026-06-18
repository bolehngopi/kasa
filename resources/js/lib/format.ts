const locale = import.meta.env.APP_LOCALE || import.meta.env.APP_FALLBACK_LOCALE || 'en';

/** * Format a number as a price string in the current locale.
 *
 * @param price - The price to format.
 * @returns The formatted price string.
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

/** * Format a date string in the current locale.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}
