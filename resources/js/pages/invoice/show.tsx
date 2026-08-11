import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getStatusBadge } from '@/lib/utils';
import { useOrderStore } from '@/store/order-store';
import type { Order } from '@/types';

export default function InvoiceShow({ order }: { order: Order }) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const { addOrder } = useOrderStore();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (order?.order_number && !auth?.user) {
            addOrder(order.order_number);
        }
    }, [order?.order_number, auth?.user, addOrder]);

    const handleCopyOrderNumber = () => {
        if (order?.order_number) {
            navigator.clipboard.writeText(order.order_number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const paymentMethod = order.payments?.[0]?.payment_method?.toUpperCase() || 'CASH';
    const totalItems = order.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0;

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            <div className="pb-20 pt-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <div className="mb-4">
                        <Link
                            href="/invoice"
                            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                        >
                            &larr; Back to Order History
                        </Link>
                    </div>

                    {/* Order Details Top Header Banner */}
                    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-black text-gray-900">
                                        Order {order.order_number}
                                    </h1>
                                    <button
                                        onClick={handleCopyOrderNumber}
                                        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                                        title="Copy order number"
                                    >
                                        {copied ? '✓ Copied' : 'Copy'}
                                    </button>
                                    {order.queue_number && (
                                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                            Queue #{String(order.queue_number).padStart(3, '0')}
                                        </span>
                                    )}
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Placed on{' '}
                                    {new Date(order.created_at).toLocaleString([], {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                >
                                    🖨️ Print
                                </button>
                                <Link
                                    href="/order"
                                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800"
                                >
                                    + New Order
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* LEFT COLUMN: Order Items */}
                        <div className="space-y-6 lg:col-span-8">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Order Items ({totalItems})
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {order.products?.map((product, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-black text-blue-800">
                                                        {product.quantity}x
                                                    </span>
                                                    <h3 className="text-base font-bold text-gray-900">
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                {/* Modifiers List */}
                                                {product.modifiers && product.modifiers.length > 0 && (
                                                    <div className="mt-2 space-y-1 border-l-2 border-gray-200 pl-3">
                                                        {product.modifiers.map((modifier, modIndex) => (
                                                            <div
                                                                key={modIndex}
                                                                className="flex max-w-sm justify-between text-xs text-gray-600"
                                                            >
                                                                <span>+ {modifier.name}</span>
                                                                <span>
                                                                    {Number(modifier.price) > 0
                                                                        ? `$${Number(modifier.price).toFixed(2)}`
                                                                        : 'Free'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Item Notes */}
                                                {product.notes && (
                                                    <div className="mt-2 inline-block rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                                                        <strong>Note:</strong> {product.notes}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-xs text-gray-500">
                                                    Price: ${Number(product.price).toFixed(2)}
                                                </p>
                                                <p className="mt-0.5 text-base font-black text-gray-900">
                                                    ${(Number(product.price) * product.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Customer & Payment Details */}
                        <div className="space-y-6 lg:col-span-4">
                            {/* Order Details Card */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Order Details
                                    </h2>
                                </div>
                                <div className="space-y-4 p-6 text-sm">
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Customer
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {order.customer_name
                                                ? `${order.customer_name} ${order.customer_last_name || ''}`
                                                : order.customer?.name || 'Guest Checkout'}
                                        </p>
                                        {(order.customer_email || order.customer?.email) && (
                                            <p className="text-xs text-gray-500">
                                                {order.customer_email || order.customer?.email}
                                            </p>
                                        )}
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Payment Method
                                        </p>
                                        <p className="font-bold uppercase text-gray-900">
                                            {paymentMethod}
                                        </p>
                                    </div>

                                    {order.staff && (
                                        <>
                                            <hr className="border-gray-100" />
                                            <div>
                                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                    Served By
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    {order.staff.name}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Financial Summary Card */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                                <h3 className="mb-4 text-base font-bold text-gray-900">
                                    Payment Summary
                                </h3>
                                <div className="space-y-2.5 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ${Number(order.total_amount).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span className="font-medium text-gray-900">
                                            ${Number(order.tax_amount || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    {Number(order.discount_amount || 0) > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Discount</span>
                                            <span>
                                                -${Number(order.discount_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-black text-gray-900">
                                                Total Amount
                                            </span>
                                            <span className="text-2xl font-black text-blue-600">
                                                ${Number(order.final_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
