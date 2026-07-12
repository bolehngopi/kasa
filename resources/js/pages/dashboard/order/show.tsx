import type { Order } from "@/types";

export default function OrderShow({ order }: { order: Order }) {
    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Order Details</h1>
            <p>
                <strong>Order Number:</strong> {order.order_number}
            </p>
            <p>
                <strong>Customer:</strong> {order.customer.name}
            </p>
            <p>
                <strong>Staff:</strong> {order.staff.name}
            </p>
            <p>
                <strong>Status:</strong> {order.status}
            </p>
            <p>
                <strong>Total Amount:</strong> {order.total_amount.toFixed(2)}
            </p>
            <p>
                <strong>Tax Amount:</strong> {order.tax_amount.toFixed(2)}
            </p>
            <p>
                <strong>Discount Amount:</strong>
                {order.discount_amount.toFixed(2)}
            </p>
            <p>
                <strong>Final Amount:</strong> {order.final_amount.toFixed(2)}
            </p>
            <p>
                <strong>Created At:</strong>{' '}
                {new Date(order.created_at).toLocaleString()}
            </p>
            <p>
                <strong>Updated At:</strong>{' '}
                {new Date(order.updated_at).toLocaleString()}
            </p>

            <h2 className="mt-6 mb-2 text-xl font-semibold">Products</h2>
            <ul className="list-disc pl-5">
                {order.products.map((product, index) => (
                    <li key={index}>
                        {product.name} - Quantity: {product.quantity}
                        {product.notes && (
                            <div>
                                <strong>Notes:</strong> {product.notes}
                            </div>
                        )}
                        {product.modifiers && product.modifiers.length > 0 && (
                            <ul className="list-disc pl-5">
                                {product.modifiers.map((modifier, modIndex) => (
                                    <li key={modIndex}>
                                        {modifier.name} - Price: 
                                        {modifier.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
