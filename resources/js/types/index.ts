export type * from './auth';
import type * from './ui';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    parent?: Category;
    children?: Category[];
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

export interface Paginated {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface PaginatedCategory extends Paginated {
    data: Category[];
}

export interface PaginatedProduct extends Paginated {
    data: Product[];
}

export interface PaginatedOrder extends Paginated {
    data: Order[];
}

export interface Product {
    id: number;
    image_url?: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    category_id?: number;
    category?: Category;
    modifier_groups?: ModifierGroup[];
    created_at?: string;
    updated_at?: string;
}

export interface ModifierGroup {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    products?: Product[];
    modifiers?: Modifier[];
    created_at: string;
    updated_at: string;
}

export interface Modifier {
    id?: number;
    modifier_group_id?: number;
    modifierGroup?: ModifierGroup;
    name: string;
    price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductOrder extends Product {
    quantity: number;
    modifiers?: Modifier[];
    notes?: string;
}

export interface Order {
    id: number;
    staff: User;
    customer: User;
    order_number: string;
    products: ProductOrder[];
    notes?: string;
    total_amount: number;
    tax_amount: number;
    discount_amount: number;
    final_amount: number;
    status: string;
    payments?: Payment[];
    created_at: string;
    updated_at: string;
}

export interface StoreOrderRequest {
    staff_id?: number;
    customer_id?: number;
    notes?: string;
    order_products: {
        product_id: number;
        quantity: number;
        notes?: string;
        modifiers?: {
            modifier_id: number;
            quantity: number;
        }[];
    }[];
}

export interface Payment {
    order: Order;
    payment_method: string;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}
