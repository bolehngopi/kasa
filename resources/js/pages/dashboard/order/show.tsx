import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { getStatusBadge } from '@/lib/utils';
import { index as indexOrders, update as updateOrder } from '@/routes/orders';
import { useFormatCurrency } from '@/lib/format';
import type { Order } from '@/types';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'payment_pending', label: 'Payment Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
];

export default function OrderShow({ order }: { order: Order }) {
    const formatCurrency = useFormatCurrency();
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const handleStatusUpdate = (newStatus: string) => {
        if (updatingStatus || newStatus === order.status) {
return;
}

        setUpdatingStatus(true);
        router.patch(
            updateOrder.url(order.id),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedStatus(newStatus);
                },
                onFinish: () => {
                    setUpdatingStatus(false);
                },
            },
        );
    };

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href={indexOrders.url()}
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
                            {order.status.replace('_', ' ')}
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

                {/* Status Quick Actions & Switcher */}
                <div className="flex flex-wrap items-center gap-2">
                    {order.status !== 'completed' &&
                        order.status !== 'cancelled' && (
                            <>
                                {(order.status === 'pending' ||
                                    order.status === 'payment_pending') && (
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusUpdate('paid')
                                        }
                                        className="inline-flex items-center rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {updatingStatus
                                            ? 'Updating...'
                                            : 'Mark as Paid'}
                                    </button>
                                )}

                                {order.status === 'paid' && (
                                    <button
                                        type="button"
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusUpdate('completed')
                                        }
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {updatingStatus
                                            ? 'Updating...'
                                            : 'Mark as Completed'}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    disabled={updatingStatus}
                                    onClick={() =>
                                        handleStatusUpdate('cancelled')
                                    }
                                    className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
                                >
                                    Cancel Order
                                </button>
                            </>
                        )}

                    <div className="relative">
                        <select
                            value={selectedStatus}
                            disabled={updatingStatus}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    Status: {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
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
                                                                    {formatCurrency(modifier.price)}
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
                                            {formatCurrency(product.price)}
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
                                {typeof order.customer?.phone === 'string' && (
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
                                    {formatCurrency(order.total_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Discount</span>
                                <span className="text-red-600">
                                    -{formatCurrency(order.discount_amount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax</span>
                                <span>
                                    {formatCurrency(order.tax_amount)}
                                </span>
                            </div>

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {formatCurrency(order.final_amount)}
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
