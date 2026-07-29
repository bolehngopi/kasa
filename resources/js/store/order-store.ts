import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderState {
    orderNumbers: string[];
    addOrder: (orderNumber: string) => void;
    removeOrder: (orderNumber: string) => void;
    clearOrders: () => void;
}

// Migration helper to pull any old orders saved under 'orders' key
function getMigratedInitialOrders(): string[] {
    try {
        const oldOrdersRaw = localStorage.getItem('orders');
        if (oldOrdersRaw) {
            const parsed = JSON.parse(oldOrdersRaw);
            if (Array.isArray(parsed?.state?.orderNumbers)) {
                return parsed.state.orderNumbers;
            }
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch {
        // ignore parse error
    }
    return [];
}

const initialLegacyOrders = getMigratedInitialOrders();

export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            orderNumbers: initialLegacyOrders,

            addOrder: (orderNumber: string) =>
                set((state) => {
                    const cleaned = orderNumber?.trim();
                    if (!cleaned || state.orderNumbers.includes(cleaned)) {
                        return state;
                    }

                    return { orderNumbers: [cleaned, ...state.orderNumbers] };
                }),

            removeOrder: (orderNumber: string) =>
                set((state) => ({
                    orderNumbers: state.orderNumbers.filter((no) => no !== orderNumber),
                })),

            clearOrders: () => set({ orderNumbers: [] }),
        }),
        {
            name: 'kasa_guest_orders',
        }
    )
);

