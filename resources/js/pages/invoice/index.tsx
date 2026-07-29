import { Head, Link, useHttp, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getGuestOrders } from '@/routes/invoice';
import { useOrderStore } from '@/store/order-store';
import type { Order } from '@/types';

export default function InvoiceList({
    authOrders = [],
}: {
    authOrders?: Order[];
}) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const isGuest = !auth?.user;

    const { orderNumbers, removeOrder } = useOrderStore();
    const [guestOrders, setGuestOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const guestOrdersHttp = useHttp({ order_numbers: [] as string[] });

    const fetchGuestOrders = (numbers: string[]) => {
        if (numbers.length === 0) {
            setGuestOrders([]);
            setIsLoading(false);

            return;
        }

        setIsLoading(true);
        guestOrdersHttp.setData({ order_numbers: numbers });

        guestOrdersHttp.post(getGuestOrders.url(), {
            onSuccess: (data) => {
                setGuestOrders(data as Order[]);
                setIsLoading(false);
            },
            onHttpException: () => {
                setIsLoading(false);
            },
        });
    };

    useEffect(() => {
        if (isGuest) {
            fetchGuestOrders(orderNumbers);
        }
    }, [isGuest, orderNumbers]);

    const handleRemoveOrder = (e: React.MouseEvent, orderNumber: string) => {
        e.preventDefault();
        e.stopPropagation();
        removeOrder(orderNumber);
        setGuestOrders((prev) =>
            prev.filter((o) => o.order_number !== orderNumber),
        );
    };

    const displayOrders = isGuest ? guestOrders : authOrders;

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-800 border-amber-200',
        completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        processing: 'bg-blue-100 text-blue-800 border-blue-200',
        cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    return (
        <>
            <Head title="Order History" />
            <div className="pt-8 pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    {/* Navigation / Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900">
                                Order History
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {isGuest
                                    ? 'View receipts for orders placed on this device.'
                                    : 'Your complete purchase history.'}
                            </p>
                        </div>
                    </div>

                    {/* Order List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                                <p className="mt-3 text-sm font-medium text-gray-500">
                                    Fetching your order history...
                                </p>
                            </div>
                        ) : displayOrders.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                                    🧾
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    No orders found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isGuest
                                        ? 'You haven’t placed any orders on this browser yet, or saved any order numbers.'
                                        : 'You haven’t placed any orders yet.'}
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/order"
                                        className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                                    >
                                        Start Shopping &rarr;
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {displayOrders.map((order) => {
                                    const itemCount =
                                        order.products?.reduce(
                                            (sum, p) => sum + (p.quantity || 1),
                                            0,
                                        ) || 0;
                                    const statusClass =
                                        statusColors[
                                            order.status?.toLowerCase()
                                        ] ||
                                        'bg-gray-100 text-gray-800 border-gray-200';

                                    return (
                                        <div
                                            key={order.id}
                                            className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Link
                                                            href={`/invoice/${order.order_number}`}
                                                            className="font-mono text-base font-black text-gray-900 group-hover:text-blue-600"
                                                        >
                                                            {order.order_number}
                                                        </Link>
                                                        {order.queue_number && (
                                                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                                                                Queue #
                                                                {String(
                                                                    order.queue_number,
                                                                ).padStart(
                                                                    3,
                                                                    '0',
                                                                )}
                                                            </span>
                                                        )}
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase ${statusClass}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-gray-500">
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleString([], {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                        {' · '}
                                                        <span className="font-semibold text-gray-700">
                                                            {itemCount}{' '}
                                                            {itemCount === 1
                                                                ? 'item'
                                                                : 'items'}
                                                        </span>
                                                    </p>

                                                    {order.products &&
                                                        order.products.length >
                                                            0 && (
                                                            <p className="line-clamp-1 text-xs text-gray-600 italic">
                                                                {order.products
                                                                    .map(
                                                                        (p) =>
                                                                            p.name,
                                                                    )
                                                                    .join(', ')}
                                                            </p>
                                                        )}
                                                </div>

                                                <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:border-t-0 sm:pt-0">
                                                    <div className="text-left sm:text-right">
                                                        <span className="block text-2xl font-black text-blue-600">
                                                            $
                                                            {Number(
                                                                order.final_amount,
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/invoice/${order.order_number}`}
                                                            className="rounded-lg bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                                                        >
                                                            View Receipt &rarr;
                                                        </Link>

                                                        {isGuest && (
                                                            <button
                                                                onClick={(e) =>
                                                                    handleRemoveOrder(
                                                                        e,
                                                                        order.order_number,
                                                                    )
                                                                }
                                                                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                                                title="Remove from local history"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
