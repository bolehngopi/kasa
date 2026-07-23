import { Head, useHttp } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { calculateTotal } from '@/routes/order';
import type { CartItem, CalculateTotalResponse } from '@/store/cart-store';
import { useCart } from '@/store/cart-store';

interface CheckoutData {
    customer_name: string;
    customer_last_name: string;
    customer_email: string;
    cart: CartItem[];
    payment_type: 'cash' | 'qris' | '';
}

function mapCartItemsToPayload(items: CartItem[]) {
    return {
        products: items.map((item) => ({
            id: item.product_id,
            quantity: item.quantity,
            modifiers:
                item.modifiers?.map((modifier) => modifier.modifier_id) ?? [],
        })),
    };
}

export default function Checkout() {
    const { items } = useCart();
    const [calc, setCalc] = useState<CalculateTotalResponse | null>();

    const [data, setData] = useState<CheckoutData>({
        customer_name: '',
        customer_last_name: '',
        customer_email: '',
        cart: items,
        payment_type: 'cash',
    });

    const calculation = useHttp(mapCartItemsToPayload(items));
    const [isCalculating, setIsCalculating] = useState<boolean>(
        !calc && items.length > 0,
    );

    useEffect(() => {
        if (items.length === 0 || calc) {
            return;
        }

        const fetchTotal = async () => {
            setIsCalculating(true);
            calculation.setData(mapCartItemsToPayload(items));

            await calculation.post(calculateTotal.url(), {
                onSuccess: (responseData) => {
                    setCalc(responseData as CalculateTotalResponse);
                },
                onFinish: () => {
                    setIsCalculating(false);
                },
            });
        };

        fetchTotal();
    }, [items, calc, setCalc]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting order payload:', data);
        // TODO: Replace with Inertia post request
    };

    return (
        <>
            <Head title="Checkout" />

            <div className="mx-auto mt-10 max-w-6xl px-4 pb-24">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT COLUMN: Checkout Form */}
                    <div className="lg:col-span-7">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                        >
                            {/* Customer Information */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                    Customer Information
                                </h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="customer_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            First Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="customer_name"
                                            name="customer_name"
                                            value={data.customer_name}
                                            placeholder="First Name"
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="customer_last_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="customer_last_name"
                                            name="customer_last_name"
                                            placeholder="Last Name"
                                            value={data.customer_last_name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="customer_email"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email Address{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            id="customer_email"
                                            name="customer_email"
                                            placeholder="blabla@email.com"
                                            value={data.customer_email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Payment Method */}
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                                    Payment Method{' '}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <div className="flex space-x-4">
                                    <label
                                        className={`flex w-1/2 cursor-pointer items-center justify-center rounded-xl border-2 p-4 transition-all ${data.payment_type === 'cash' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            value="cash"
                                            checked={
                                                data.payment_type === 'cash'
                                            }
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <span className="font-semibold">
                                            Cash
                                        </span>
                                    </label>

                                    <label
                                        className={`flex w-1/2 cursor-pointer items-center justify-center rounded-xl border-2 p-4 transition-all ${data.payment_type === 'qris' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            value="qris"
                                            checked={
                                                data.payment_type === 'qris'
                                            }
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <span className="font-semibold">
                                            QRIS
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-8 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={items.length === 0 || isCalculating}
                            >
                                {isCalculating
                                    ? 'Calculating...'
                                    : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-6 rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Order Summary ({items.length})
                                </h2>
                                {isCalculating && (
                                    <span className="animate-pulse text-sm text-blue-600">
                                        Loading items...
                                    </span>
                                )}
                            </div>

                            <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
                                {calc?.products ? (
                                    calc.products.map((item, index) => (
                                        // Using index as fallback key in case IDs repeat (like the two 'omnis' items in your JSON)
                                        <div
                                            key={`${item.id}-${index}`}
                                            className="flex justify-between border-b border-gray-200 py-3 last:border-0"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.name}
                                                </p>
                                                <p className="mt-0.5 text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="mt-0.5 text-sm text-gray-500">
                                                    {item.notes}
                                                </p>

                                                {/* Render Modifiers if present */}
                                                {item.modifiers &&
                                                    item.modifiers.length >
                                                        0 && (
                                                        <div className="mt-2 border-l-2 border-gray-300 pl-3">
                                                            {item.modifiers.map(
                                                                (mod) => (
                                                                    <p
                                                                        key={
                                                                            mod.id
                                                                        }
                                                                        className="text-xs text-gray-500"
                                                                    >
                                                                        +{' '}
                                                                        {
                                                                            mod.name
                                                                        }
                                                                    </p>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                {(
                                                    Number(item.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    ))
                                ) : items.length > 0 ? (
                                    /* Fallback while calculating */
                                    items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between border-b border-gray-200 py-3"
                                        >
                                            <div>
                                                <p className="text-opacity-50 font-medium text-gray-900">
                                                    Product #{item.product_id}
                                                </p>
                                                <p className="text-opacity-50 text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-gray-500 italic">
                                        Your cart is empty.
                                    </p>
                                )}
                            </div>

                            {/* Subtotal from store */}
                            <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total to Pay</span>
                                    <span>
                                        {calc?.subtotal
                                            ? Number(calc.subtotal).toFixed(2)
                                            : '0.00'}
                                    </span>
                                </div>
                                <p className="text-right text-sm text-gray-500">
                                    Paying via {data.payment_type.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
