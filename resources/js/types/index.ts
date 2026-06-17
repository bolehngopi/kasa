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
    created_at: string;
    updated_at: string;
}

export interface PaginatedProduct {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    category_id?: number;
    category?: Category;
    variants?: ProductVariant[];
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: number;
    product_id?: number;
    product?: Product;
    name: string;
    sku: string;
    price: number;
    stock: number;
    created_at: string;
    updated_at: string;
}
