import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { index, show } from '@/routes/products';
import type { PaginatedProduct, Product } from '@/types';

export default function Products({ products }: { products: PaginatedProduct }) {
    const [search, setSearch] = useState(
        () => new URLSearchParams(window.location.search).get('search') || '',
    );

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            index(),
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head
                title={
                    search ? `Search for "${search}" | Products` : 'Products'
                }
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your inventory, add new products, and update
                        pricing.
                    </p>
                </div>

                <Link
                    href="/dashboard/products/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    + Add New Product
                </Link>
            </div>

            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
                <form
                    onSubmit={onSubmit}
                    className="relative flex w-full sm:max-w-md"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search products by name or SKU..."
                        className="block w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Product Details
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    SKU
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Price
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Stock
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No products found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product: Product) => (
                                    <tr
                                        key={product.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {/* Product Image Placeholder */}
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                    {product.image_url ? (
                                                        <img
                                                            src={
                                                                product.image_url
                                                            }
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                            <svg
                                                                className="h-6 w-6"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Link
                                                        href={show(product.id)}
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                                                        {product.description ||
                                                            'No description available.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-gray-600">
                                            {product.sku}
                                        </td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`font-semibold ${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}
                                            >
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                    product.is_active
                                                        ? 'border-green-200 bg-green-100 text-green-800'
                                                        : 'border-gray-200 bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {product.is_active
                                                    ? 'Active'
                                                    : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link
                                                href={show(product.id)}
                                                className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {products.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing{' '}
                        <span className="font-medium">
                            {products.data.length}
                        </span>{' '}
                        of <span className="font-medium">{products.total}</span>{' '}
                        products
                    </p>
                    <div className="flex gap-1">
                        {/* Inertia links automatically append current query strings like ?search=keyword */}
                        {products.links?.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                onClick={(e) => !link.url && e.preventDefault()}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
