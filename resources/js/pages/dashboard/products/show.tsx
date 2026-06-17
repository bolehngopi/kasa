import type { Product } from '@/types';

export default function ProductDetail({ product }: { product: Product }) {
    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
        </div>
    );
}
