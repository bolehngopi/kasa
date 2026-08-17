import { Head, Link } from '@inertiajs/react';
import { show as showOrder } from '@/routes/orders';
import { useFormatCurrency } from '@/lib/format';
import type { Order, PaginatedOrder } from '@/types';

const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';

    switch (normalizedStatus) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export default function OrderDashboard({ orders }: { orders: PaginatedOrder }) {
    const formatCurrency = useFormatCurrency();
    return (
        <>
            <Head title="Orders Management" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your store's orders, track statuses, and view
                        customer details.
                    </p>
                </div>
            </div>

            {/* Modern Data Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Order Number
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Customer
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Staff
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Status
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Total Amount
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-right font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order: Order) => (
                                    <tr
                                        key={order.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {order?.customer?.name || (
                                                <span className="text-gray-400 italic">
                                                    Guest
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {order.staff?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(order.status)}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <Link
                                                href={showOrder.url(order)}
                                                className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {orders.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing{' '}
                        <span className="font-medium">
                            {orders.data.length}
                        </span>{' '}
                        of <span className="font-medium">{orders.total}</span>{' '}
                        results
                    </p>
                    <div className="flex gap-1">
                        {/* Note: Inertia paginators include 'links' in the payload. Adjust mapping based on your exact PaginatedOrder interface */}
                        {orders.links?.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                // Prevent clicking on null links (like 'Previous' on page 1)
                                onClick={(e) => !link.url && e.preventDefault()}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
