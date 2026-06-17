import { Link } from '@inertiajs/react';
import { show } from '@/routes/products';
import type { PaginatedProduct } from '@/types';

export default function Products({ products }: { products: PaginatedProduct }) {
    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Products</h1>
            <p>
                Here you can manage your products. Add new products, edit
                existing ones, and keep track of your inventory.
            </p>

            <div className="flex items-start justify-start gap-4">
                {products.data.length > 0 ? (
                    <ul className="space-y-4">
                        {products.data.map((product) => (
                            <li
                                key={product.id}
                                className="rounded border p-4 shadow-sm"
                            >
                                <h2 className="text-lg font-semibold">
                                    <Link href={show(product.id)}>
                                        {product.name}
                                    </Link>
                                </h2>
                                <p className="text-gray-600">
                                    {product.description}
                                </p>
                                <p className="mt-2 font-bold">
                                    {product.price.toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}
