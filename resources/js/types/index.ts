export type * from './auth';

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
}

export interface PaginatedCategory extends Paginated {
    data: Category[];
}

export interface PaginatedProduct extends Paginated {
    data: Product[];
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    category_id?: number;
    category?: Category;
    variants?: ProductVariant[];
    modifier_groups?: ModifierGroup[];
    created_at?: string;
    updated_at?: string;
}

export interface ProductVariant {
    id: number;
    product_id?: number;
    product?: Product;
    name: string;
    sku: string;
    price: number;
    stock: number;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
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
