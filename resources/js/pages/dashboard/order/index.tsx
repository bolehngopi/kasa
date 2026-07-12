import { Head } from '@inertiajs/react';
import type { Order, PaginatedOrder } from '@/types';

export default function Order({ orders }: { orders: PaginatedOrder }) {
    console.log('Order data:', orders);

    return (
        <>
            <Head title={'All Order'} />

            {/* Make table of all order */}
            <div className="p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">All Order</h1>
                    <p>
                        Here you can manage your orders. View order details,
                        track order status, and manage customer information.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">
                                    Order Number
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                    Customer
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                    Staff
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                    Total Amount
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order: Order) => (
                                <tr key={order.id}>
                                    <td className="border border-gray-300 p-2">
                                        {order.order_number}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {order.customer.name}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {order.staff.name}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {order.total_amount}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {order.created_at}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
