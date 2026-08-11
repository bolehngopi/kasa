import { Head, Link } from '@inertiajs/react';
import { getStockBadge } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductDetail({ product }: { product: Product }) {
    return (
        <>
            <Head title={product.name} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/dashboard/products"
                        className="mb-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        &larr; Back to Products
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {product.name}
                        </h1>
                        <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                product.is_active
                                    ? 'border-green-200 bg-green-100 text-green-800'
                                    : 'border-gray-200 bg-gray-100 text-gray-800'
                            }`}
                        >
                            {product.is_active ? 'Active' : 'Draft'}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                    Edit Product
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:flex-row">
                        <div className="shrink-0 border-r border-gray-100 bg-gray-50 sm:w-1/3">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="aspect-square h-full w-full object-cover sm:aspect-auto"
                                />
                            ) : (
                                <div className="flex h-full min-h-50 w-full items-center justify-center text-gray-400">
                                    <svg
                                        className="h-12 w-12"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-6">
                            <p className="mb-1 text-xs font-semibold tracking-wider text-blue-600 uppercase">
                                {product.category?.name || 'Uncategorized'}
                            </p>
                            <h2 className="mb-2 text-xl font-bold text-gray-900">
                                {product.name}
                            </h2>
                            <p className="mb-4 text-sm leading-relaxed text-gray-600">
                                {product.description ||
                                    'No description provided for this product.'}
                            </p>
                            <p className="font-mono text-xs text-gray-400">
                                Slug: {product.slug}
                            </p>
                        </div>
                    </div>

                    {product.modifier_groups &&
                        product.modifier_groups.length > 0 && (
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Customizations & Modifiers
                                    </h2>
                                </div>
                                <div className="space-y-6 p-6">
                                    {product.modifier_groups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                                        >
                                            <h3 className="font-semibold text-gray-900">
                                                {group.name}
                                            </h3>
                                            {group.description && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {group.description}
                                                </p>
                                            )}

                                            {group.modifiers &&
                                            group.modifiers.length > 0 ? (
                                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {group.modifiers.map(
                                                        (modifier) => (
                                                            <div
                                                                key={
                                                                    modifier.id
                                                                }
                                                                className="flex items-center justify-between rounded border border-gray-200 bg-white p-3 text-sm shadow-sm"
                                                            >
                                                                <span className="font-medium text-gray-700">
                                                                    {
                                                                        modifier.name
                                                                    }
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    {Number(
                                                                        modifier.price,
                                                                    ) > 0
                                                                        ? `+$${Number(modifier.price).toFixed(2)}`
                                                                        : 'Free'}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-sm text-gray-400 italic">
                                                    No options added to this
                                                    group.
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>

                <div className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Inventory & Pricing
                            </h2>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Base Price
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${Number(product.price).toFixed(2)}
                                </p>
                            </div>
                            <hr className="border-gray-100" />
                            <div>
                                <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    SKU
                                </p>
                                <p className="font-mono text-gray-900">
                                    {product.sku || 'N/A'}
                                </p>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Current Stock
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {product.stock} units
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getStockBadge(product.stock)}`}
                                >
                                    {product.stock > 0
                                        ? 'In Stock'
                                        : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
