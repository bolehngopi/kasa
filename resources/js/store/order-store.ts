import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encrypted-storage';

interface OrderState {
    orderNumbers: string[];
    addOrder: (orderNumber: string) => void;
    removeOrder: (orderNumber: string) => void;
    clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            orderNumbers: [],

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
                    orderNumbers: state.orderNumbers.filter(
                        (no) => no !== orderNumber,
                    ),
                })),

            clearOrders: () => set({ orderNumbers: [] }),
        }),
        {
            name: 'orders',
            storage: createJSONStorage(() => encryptedStorage),
        },
    ),
);
