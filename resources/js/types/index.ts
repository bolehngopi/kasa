export type * from './auth';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    parent: Category | null;
    children: Category[];
    products?: Product[];
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    category_id: number;
    category?: Category;
    created_at: string;
    updated_at: string;
}
