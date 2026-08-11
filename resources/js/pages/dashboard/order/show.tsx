import { Head, Link } from '@inertiajs/react';
import { getStatusBadge } from '@/lib/utils';
import type { Order } from '@/types';

export default function OrderShow({ order }: { order: Order }) {
    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/dashboard/orders"
                        className="mb-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        &larr; Back to Orders
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order {order.order_number}
                        </h1>
                        <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(order.status)}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed on{' '}
                        {new Date(order.created_at).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* LEFT COLUMN: Products List */}
                <div className="space-y-6 lg:col-span-8">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Order Items
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {order.products?.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 p-6 sm:flex-row sm:justify-between"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>

                                        {/* Modifiers List */}
                                        {product.modifiers &&
                                            product.modifiers.length > 0 && (
                                                <div className="mt-2 space-y-1 border-l-2 border-gray-200 pl-3">
                                                    {product.modifiers.map(
                                                        (
                                                            modifier,
                                                            modIndex,
                                                        ) => (
                                                            <div
                                                                key={modIndex}
                                                                className="flex max-w-sm justify-between text-sm text-gray-600"
                                                            >
                                                                <span>
                                                                    +{' '}
                                                                    {
                                                                        modifier.name
                                                                    }
                                                                </span>
                                                                <span>
                                                                    {Number(
                                                                        modifier.price,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                        {/* Item Notes */}
                                        {product.notes && (
                                            <div className="mt-3 inline-block rounded-md border border-yellow-100 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                                                <strong>Note:</strong>{' '}
                                                {product.notes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pricing & Quantity */}
                                    <div className="shrink-0 text-right">
                                        <p className="mb-1 text-sm text-gray-500">
                                            Qty: {product.quantity}
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {/* Note: This assumes product.price is the base price before modifiers. Adjust math if needed. */}
                                            {Number(product.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Order Details & Summary */}
                <div className="space-y-6 lg:col-span-4">
                    {/* Customer & Staff Info Card */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Details
                            </h2>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Customer
                                </p>
                                <p className="font-medium text-gray-900">
                                    {order.customer?.name || 'Guest Checkout'}
                                </p>
                                {order.customer?.email && (
                                    <p className="text-sm text-gray-600">
                                        {order.customer.email}
                                    </p>
                                )}
                                {order.customer?.phone && (
                                    <p className="text-sm text-gray-600">
                                        {order.customer.phone}
                                    </p>
                                )}
                            </div>
                            <hr className="border-gray-100" />
                            <div>
                                <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Served By
                                </p>
                                <p className="font-medium text-gray-900">
                                    {order.staff?.name || 'System / Kiosk'}
                                </p>
                            </div>
                            {/* If you added the payments relationship, you can display it here */}
                            {order.payments && order.payments.length > 0 && (
                                <>
                                    <hr className="border-gray-100" />
                                    <div>
                                        <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Payment Method
                                        </p>
                                        <p className="font-medium text-gray-900 uppercase">
                                            {order.payments[0].payment_method}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Financial Summary Card */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                        <div className="space-y-3 p-6">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>
                                    {Number(order.total_amount).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Discount</span>
                                <span className="text-red-600">
                                    -
                                    {' ' +
                                        Number(order.discount_amount).toFixed(
                                            2,
                                        )}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax</span>
                                <span>
                                    {Number(order.tax_amount).toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {Number(order.final_amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
