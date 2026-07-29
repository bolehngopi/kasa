import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    orderNumbers: state.orderNumbers.filter((no) => no !== orderNumber),
                })),

            clearOrders: () => set({ orderNumbers: [] }),
        }),
        {
            name: 'kasa_guest_orders',
        }
    )
);
