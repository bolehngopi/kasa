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
            modifiers:
                item.modifiers?.map((modifier) => modifier.modifier_id) ?? [],
        })),
    };
}

export default function ViewOrder() {
    const { items, set, remove } = useCart();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const calculation = useHttp(mapCartItemsToPayload(items));
    const [calc, setCalc] = useState<CalculateTotalResponse | null>();

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [noteText, setNoteText] = useState<string>('');

    useEffect(() => {
        if (items.length === 0) {
            setCalc(null);

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
                    setError(response.data as string);
                },
            });
            setLoading(false);
        };

        fetchTotal();
    }, [items]);

    const handleSaveNote = (index: number) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], notes: noteText };
        set(updatedItems);
        setEditingIndex(null);
    };

    const handleUpdateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }

        const updatedItems = [...items];
        updatedItems[index].quantity = newQuantity;
        set(updatedItems);
    };

    return (
        <>
            <Head title="Review Order" />

            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/order"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100"
                            >
                                &larr;
                            </Link>
                            <h2 className="text-2xl font-black text-gray-900">
                                Review Order
                            </h2>
                        </div>
                        <div className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-800">
                            {items.length}{' '}
                            {items.length === 1 ? 'Item' : 'Items'}
                        </div>
                    </div>

                    {error && (
                        <div className="m-6 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                            Error: {error}
                        </div>
                    )}

                    {/* Cart Items List */}
                    <div className="p-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Cart is empty
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Go back and add some items to the order.
                                </p>
                            </div>
                        ) : (
                            <div
                                className={`space-y-4 transition-opacity duration-200 ${loading ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
                            >
                                {items.map(
                                    (cartItem: CartItem, index: number) => {
                                        const calculatedItem =
                                            calc?.products?.[index];

                                        return (
                                            <div
                                                key={`${cartItem.product_id}-${index}`}
                                                className="flex flex-col rounded-xl border-2 border-gray-100 bg-white p-4 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    {/* Left: Item Info */}
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {calculatedItem?.name ||
                                                                `Loading Item...`}
                                                        </h3>

                                                        {calculatedItem?.modifiers &&
                                                            calculatedItem
                                                                .modifiers
                                                                .length > 0 && (
                                                                <div className="mt-1 flex flex-wrap gap-2">
                                                                    {calculatedItem.modifiers.map(
                                                                        (
                                                                            mod: BackendModifier,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    mod.id
                                                                                }
                                                                                className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"
                                                                            >
                                                                                +{' '}
                                                                                {
                                                                                    mod.name
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}

                                                        {cartItem.notes &&
                                                            editingIndex !==
                                                                index && (
                                                                <div className="mt-2 inline-block rounded border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-sm font-medium text-yellow-800">
                                                                    Note:{' '}
                                                                    {
                                                                        cartItem.notes
                                                                    }
                                                                </div>
                                                            )}
                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end gap-3">
                                                        <span className="text-xl font-black text-blue-700">
                                                            {calculatedItem
                                                                ? `$${(Number(calculatedItem.price || 0) * cartItem.quantity).toFixed(2)}`
                                                                : '...'}
                                                        </span>

                                                        <div className="flex h-10 w-28 items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        index,
                                                                        cartItem.quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                                            >
                                                                &minus;
                                                            </button>
                                                            <span className="font-bold text-gray-900">
                                                                {
                                                                    cartItem.quantity
                                                                }
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        index,
                                                                        cartItem.quantity +
                                                                            1,
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {editingIndex === index && (
                                                    <div className="mt-4 border-t border-gray-100 pt-3">
                                                        <textarea
                                                            value={noteText}
                                                            onChange={(e) =>
                                                                setNoteText(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Add special instructions..."
                                                            className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-3 text-sm font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
                                                            rows={2}
                                                        />
                                                        <div className="mt-2 flex justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    setEditingIndex(
                                                                        null,
                                                                    )
                                                                }
                                                                className="rounded-lg px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleSaveNote(
                                                                        index,
                                                                    )
                                                                }
                                                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
                                                            >
                                                                Save Note
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {editingIndex !== index && (
                                                    <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
                                                        <button
                                                            onClick={() => {
                                                                setEditingIndex(
                                                                    index,
                                                                );
                                                                setNoteText(
                                                                    cartItem.notes ||
                                                                        '',
                                                                );
                                                            }}
                                                            className="text-sm font-bold text-blue-600 hover:text-blue-800"
                                                        >
                                                            {cartItem.notes
                                                                ? 'Edit Note'
                                                                : '+ Add Note'}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                remove(index)
                                                            }
                                                            className="text-sm font-bold text-red-600 hover:text-red-800"
                                                        >
                                                            Remove Item
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                            <div className="mb-4 flex items-center justify-between text-xl">
                                <span className="font-bold text-gray-700">
                                    Total Amount
                                </span>
                                <span className="text-3xl font-black text-gray-900">
                                    {calc
                                        ? `$${Number(calc.subtotal).toFixed(2)}`
                                        : '...'}
                                </span>
                            </div>

                            <Link
                                href={checkout.url()}
                                className={`flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 text-lg font-black text-white transition hover:bg-blue-700 active:bg-blue-800 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Proceed to Payment &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
