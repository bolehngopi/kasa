import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { index, show } from '@/routes/products';
import type { PaginatedProduct } from '@/types';

export default function Products({ products }: { products: PaginatedProduct }) {
    const [search, setSearch] = useState(
        () => new URLSearchParams(window.location.search).get('search') || '',
    );

    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.visit(index(), {
            method: 'get',
            data: { search },
            preserveState: true,
        });
    };

    return (
        <>
            <Head
                title={search ? `Search for ${search} Products` : 'Products'}
            />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Products</h1>
                <form className="mb-4 flex items-center" onSubmit={onSubmit}>
                    <label htmlFor="search" className="mr-2 font-semibold">
                        Search:
                    </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Search products..."
                        className="rounded border p-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
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
                {/* pagination */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    {products.current_page > 1 && (
                        <button
                            className="rounded border px-3 py-1"
                            onClick={() =>
                                router.visit(index(), {
                                    method: 'get',
                                    data: { page: products.current_page - 1 },
                                    preserveState: true,
                                })
                            }
                        >
                            Previous
                        </button>
                    )}
                    <span>
                        Page {products.current_page} of {products.last_page}
                    </span>
                    {products.current_page < products.last_page && (
                        <button
                            className="rounded border px-3 py-1"
                            onClick={() =>
                                router.visit(index(), {
                                    method: 'get',
                                    data: { page: products.current_page + 1 },
                                    preserveState: true,
                                })
                            }
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
