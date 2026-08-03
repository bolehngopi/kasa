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
const MAX_QTY = 99;

function sameLine(a: CartItem, b: CartItem): boolean {
    if (a.product_id !== b.product_id) {
        return false;
    }

    if ((a.notes ?? "") !== (b.notes ?? "")) {
        return false;
    }

    const am = (a.modifiers ?? []).map((m) => m.modifier_id).sort().join(",");
    const bm = (b.modifiers ?? []).map((m) => m.modifier_id).sort().join(",");

    return am === bm;
}

export const useCart = create(
    persist<CartState>(
        (set, get) => ({
            items: [],
            add: (item) => {
                const items = [...get().items];
                const existingIndex = items.findIndex((line) => sameLine(line, item));

                if (existingIndex >= 0) {
                    const existing = items[existingIndex];
                    items[existingIndex] = {
                        ...existing,
                        quantity: Math.min(existing.quantity + item.quantity, MAX_QTY),
                    };
                } else {
                    items.push({ ...item, quantity: Math.min(item.quantity, MAX_QTY) });
                }

                set({ items });
            },
            remove: (index) => {
                set({ items: get().items.filter((_, i) => i !== index) });
            },

            set: (items) => set({ items }),

            clear: () => set({ items: [] }),
        }),
        {
            name: CART_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);
