import { Head, Link, useHttp } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { checkout } from '@/routes';
import { calculateTotal } from '@/routes/order';
import { useCart } from '@/store/cart-store';
import type {
    CartItem,
    BackendModifier,
    CalculateTotalResponse,
} from '@/store/cart-store';

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
            modifiers: item.modifiers?.map((modifier) => modifier.modifier_id) ?? [],
        })),
    };
}

export default function ViewOrder() {
    // Destructure set and remove to handle our editing actions
    const { items, set, remove } = useCart();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const calculation = useHttp(mapCartItemsToPayload(items));
    const [calc, setCalc] = useState<CalculateTotalResponse | null>();

    // State for handling inline note editing
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [noteText, setNoteText] = useState<string>('');

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
                },
                onHttpException: (response) => {
                    setError(response.data);
                },
            });
            setLoading(false);
        };

        fetchTotal();
    }, [items]);

    // Action to save the updated note to the Zustand store
    const handleSaveNote = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], notes: noteText };
        set(updatedItems);
        setEditingIndex(null);
    };

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
                    {items.length === 0 ? (
                        <p className="py-6 text-center text-gray-500">
                            Your cart is currently empty.
                        </p>
                    ) : (
                        // Map over local ITEMS instead of calc so notes persist and items don't disappear during load
                        items.map((cartItem: CartItem, index: number) => {
                            // Safely grab the calculated API details for this specific item if they exist yet
                            const calculatedItem = calc?.products?.[index];

                            return (
                                <div
                                    key={`${cartItem.product_id}-${index}`}
                                    className={`flex flex-col rounded-xl border bg-gray-50 p-4 transition-opacity duration-200 ${loading ? 'opacity-60' : 'opacity-100'}`}
                                >
                                    {/* Top Half: Product Details & Price */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {calculatedItem?.name || `Product #${cartItem.product_id}`}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Quantity: {cartItem.quantity}
                                            </p>

                                            {calculatedItem?.modifiers && calculatedItem.modifiers.length > 0 && (
                                                <div className="mt-2 border-l-2 border-gray-300 pl-2">
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Customizations Added:
                                                    </p>
                                                    {calculatedItem.modifiers.map((mod: BackendModifier) => (
                                                        <p key={mod.id} className="text-xs text-gray-400">
                                                            {mod.name}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {calculatedItem
                                                ? (Number(calculatedItem.price || 0) * cartItem.quantity).toFixed(2)
                                                : '...'
                                            }
                                        </span>
                                    </div>

                                    {/* Bottom Half: Notes & Actions Area */}
                                    <div className="mt-4 border-t border-gray-200 pt-3">
                                        {editingIndex === index ? (
                                            <div className="flex flex-col gap-3">
                                                <textarea
                                                    value={noteText}
                                                    onChange={(e) => setNoteText(e.target.value)}
                                                    placeholder="Add special instructions (e.g., less sugar, extra spicy)..."
                                                    className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    rows={2}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingIndex(null)}
                                                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveNote(index)}
                                                        className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
                                                    >
                                                        Save Note
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="text-sm text-gray-600 flex-1">
                                                    {cartItem.notes ? (
                                                        <p><span className="font-semibold text-gray-700">Note:</span> {cartItem.notes}</p>
                                                    ) : (
                                                        <p className="italic text-gray-400">No notes added.</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setEditingIndex(index);
                                                            setNoteText(cartItem.notes || '');
                                                        }}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        {cartItem.notes ? 'Edit Note' : 'Add Note'}
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        onClick={() => remove(index)}
                                                        className="text-sm font-medium text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Summary Totals Block */}
                {loading && (
                    <p className="mt-4 animate-pulse text-sm text-gray-400 text-right">
                        Recalculating items...
                    </p>
                )}

                {items.length > 0 && calc && !loading && (
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
