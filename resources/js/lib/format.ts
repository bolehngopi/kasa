import { usePage } from '@inertiajs/react';

export interface CurrencySettings {
    currency_locale?: string;
    currency_code?: string;
    currency_symbol?: string;
    decimal_places?: number | string;
}

const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE;
const DEFAULT_CURRENCY = import.meta.env.VITE_DEFAULT_CURRENCY;
const DEFAULT_SYMBOL = import.meta.env.VITE_DEFAULT_SYMBOL;

/**
 * Format a number or numeric string as a localized currency string using Intl.NumberFormat.
 *
 * @param amount - The price amount to format.
 * @param customSettings - Optional currency settings override.
 * @returns Formatted currency string.
 */
export function formatCurrency(
    amount: number | string,
    customSettings?: CurrencySettings,
): string {
    const value =
        typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    const num = Number.isFinite(value) ? value : 0;

    const locale = customSettings?.currency_locale || DEFAULT_LOCALE;
    const currency = customSettings?.currency_code || DEFAULT_CURRENCY;
    const decimals =
        customSettings?.decimal_places !== undefined &&
        customSettings?.decimal_places !== ''
            ? Number(customSettings.decimal_places)
            : currency === 'IDR' || currency === 'JPY'
              ? 0
              : 2;

    try {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });

        return formatter.format(num);
    } catch {
        const symbol = customSettings?.currency_symbol || DEFAULT_SYMBOL;
        return `${symbol} ${num.toFixed(decimals)}`;
    }
}

/**
 * React hook to format currency using shared Inertia settings.
 */
export function useFormatCurrency() {
    const { settings } = usePage().props as { settings?: CurrencySettings };

    return (amount: number | string, overrideSettings?: CurrencySettings) => {
        return formatCurrency(amount, {
            ...settings,
            ...overrideSettings,
        });
    };
}

/**
 * Format a number as a price string (alias for formatCurrency).
 */
export function formatPrice(
    price: number | string,
    customSettings?: CurrencySettings,
): string {
    return formatCurrency(price, customSettings);
}

/**
 * Format a date string in the current locale.
 */
export function formatDate(
    date: string | Date,
    localeStr: string = DEFAULT_LOCALE,
): string {
    return new Intl.DateTimeFormat(localeStr, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}
