import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getStockBadge = (stock: number) => {
    if (stock > 10) {
        return 'bg-green-100 text-green-800 border-green-200'
    }

    if (stock > 0) {
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }

    return 'bg-red-100 text-red-800 border-red-200';
};

export const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';

    switch (normalizedStatus) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
