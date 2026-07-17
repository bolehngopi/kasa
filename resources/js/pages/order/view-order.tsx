import { Head, Link, useHttp } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { calculateTotal, checkout } from '@/routes/order';
import { useCart } from '@/store/cart-store';
import type { CartItem } from '@/store/cart-store';

interface BackendModifier {
    id: number;
    name: string;
    price: string | number;
}

interface BackendProduct {
    id: number;
    name: string;
    price: string | number;
    quantity: number;
    modifiers: BackendModifier[];
}

interface CalculateTotalResponse {
    products: BackendProduct[];
    subtotal: string;
}

interface CalculateTotalPayload {
    products: Array<{
        id: number;
        quantity: number;
        modifiers: number[];
    }>;
}

function mapCartItemsToPayload(items: CartItem[]): CalculateTotalPayload {
    return {
        products: items.map((item) => ({
            id: item.product_id,
            quantity: item.quantity,
            modifiers:
                item.modifiers?.map((modifier) => modifier.modifier_id) ?? [],
        })),
    };
}

export default function ViewOrder() {
    const { items } = useCart();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const calculation = useHttp(mapCartItemsToPayload(items));
    const [calc, setCalc] = useState<CalculateTotalResponse>();

    useEffect(() => {
        if (items.length === 0) {
            return;
        }

        const fetchTotal = async () => {
            setLoading(true);
            setError(null);

            calculation.setData(mapCartItemsToPayload(items));

            await calculation.post(calculateTotal.url(), {
                onSuccess: (data) => {
                    setCalc(data as CalculateTotalResponse);
                    console.log(data);
                },
                onHttpException: (response) => {
                    setError(response.data);
                },
            });
            setLoading(false);
        };

        fetchTotal();
    }, [items]);

    return (
        <>
            <Head title="View Order" />

            <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Your Order ({items?.length || 0})
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Items List */}
                <div className="space-y-4">
                    {calc?.products?.length === 0 ? (
                        <p className="py-6 text-center text-gray-500">
                            Your cart is currently empty.
                        </p>
                    ) : (
                        calc?.products?.map((item: BackendProduct) => {
                            const displayItem = item;

                            return (
                                <div
                                    key={displayItem.id}
                                    className="flex items-start justify-between rounded-xl border bg-gray-50 p-4"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {displayItem.name ||
                                                `Product #{displayItem.id}`}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Quantity: {displayItem.quantity}
                                        </p>

                                        {/* Render UI modifiers list if the user has chosen any */}
                                        {displayItem.modifiers &&
                                            displayItem.modifiers.length >
                                                0 && (
                                                <div className="mt-2 border-l-2 border-gray-300 pl-2">
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Customizations Added:
                                                    </p>
                                                    {displayItem.modifiers.map((mod: BackendModifier) => (
                                                            <p
                                                                key={mod.id}
                                                                className="text-xs text-gray-400"
                                                            >
                                                                {mod.name}
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {(
                                            Number(displayItem.price || 0) *
                                            displayItem.quantity
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Summary Totals Block */}
                {loading && (
                    <p className="mt-4 animate-pulse text-sm text-gray-400">
                        Recalculating items...
                    </p>
                )}

                {calc?.products?.length && calc && !loading && (
                    <div className="mt-8 space-y-3 border-t pt-4">
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                            <span>Subtotal</span>
                            <span>{calc.subtotal}</span>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Link
                                href={checkout.url()}
                                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
