import { Head } from '@inertiajs/react';
import type { Product } from '@/types';

export default function ProductDetail({ product }: { product: Product }) {
    return (
        <>
            <Head title={product.name} />
            <div>
                <h1 className="mb-4 text-2xl font-bold">{product.name}</h1>
                <p className="mb-2 text-gray-600">{product.description}</p>
                <p className="mb-2 font-bold">${product.price.toFixed(2)}</p>
                <p className="mb-2 text-gray-600">
                    Stock: {product.stock > 0 ? product.stock : 'Out of stock'}
                </p>
                {product.category && (
                    <p className="mb-2 text-gray-600">
                        Category: {product.category.name}
                    </p>
                )}
                {product.variants && product.variants.length > 0 && (
                    <div className="mt-4">
                        <h2 className="mb-2 text-lg font-semibold">Variants</h2>
                        <ul className="space-y-2">
                            {product.variants.map((variant) => (
                                <li
                                    key={variant.id}
                                    className="rounded border p-4 shadow-sm"
                                >
                                    <h3 className="text-md font-semibold">
                                        {variant.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        SKU: {variant.sku}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {product.modifier_groups &&
                    product.modifier_groups.length > 0 && (
                        <div className="mt-4">
                            <h2 className="mb-2 text-lg font-semibold">
                                Modifier Groups
                            </h2>
                            <ul className="space-y-2">
                                {product.modifier_groups.map((group) => (
                                    <li
                                        key={group.id}
                                        className="rounded border p-4 shadow-sm"
                                    >
                                        <h3 className="text-md font-semibold">
                                            {group.name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {group.description}
                                        </p>
                                        {group.modifiers &&
                                            group.modifiers.length > 0 && (
                                                <ul className="mt-2 space-y-1">
                                                    {group.modifiers.map(
                                                        (modifier) => (
                                                            <li
                                                                key={
                                                                    modifier.id
                                                                }
                                                                className="text-gray-600"
                                                            >
                                                                {modifier.name}{' '}
                                                                - $
                                                                {modifier.price.toFixed(
                                                                    2,
                                                                )}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </div>
        </>
    );
}
