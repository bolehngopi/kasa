import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StoreOrderRequest } from "@/types";

export type CartItem = StoreOrderRequest["order_products"][number];

export interface BackendModifier {
    id: number;
    name: string;
    price: string | number;
}

export interface BackendProduct {
    id: number;
    name: string;
    price: string | number;
    quantity: number;
    notes?: string;
    modifiers: BackendModifier[];
}

export interface CalculateTotalResponse {
    products: BackendProduct[];
    subtotal: string;
}

interface CartState {
    items: CartItem[];
    add: (item: CartItem) => void;
    remove: (index: number) => void;
    set: (items: CartItem[]) => void;
    clear: () => void;
}

const CART_KEY = "cart";

export const useCart = create(
    persist<CartState>(
        (set, get) => ({
            items: [],
            add: (item) => {
                const items = [...get().items, item];
                set({ items});
            },
            remove: (index) => {
                const items = get().items.filter((_, currentIndex) => currentIndex !== index);
                set({ items});
            },
            set: (items) => {
                set({ items});
            },
            clear: () => {
                set({ items: []});
            },
        }),
        {
            name: CART_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);
