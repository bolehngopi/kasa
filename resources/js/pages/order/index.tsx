import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Drawer from '@/components/drawer';
import order from '@/routes/order';
import { useCart } from '@/store/cart-store';
import type { CartItem } from '@/store/cart-store';
import type { Category, PaginatedProduct, Product } from '@/types';

interface OrderingProps {
    products: PaginatedProduct;
    categories: Category[];
}

export default function Order({ products, categories }: OrderingProps) {
    const { add: addToCart } = useCart();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [selectedModifiers, setSelectedModifiers] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState<string>('');

    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentCategoryId = currentUrlParams.get('category_id');

    const handleCategoryClick = (categoryId?: number) => {
        router.get(
            order.index.url(),
            categoryId ? { category_id: categoryId } : {},
            { preserveState: true, preserveScroll: true, only: ['products'] },
        );
    };

    const openDrawer = (product: Product) => {
        setSelectedProduct(product);
        setSelectedModifiers([]);
        setQuantity(1);
        setNotes('');
    };

    const closeDrawer = () => {
        setSelectedProduct(null);
    };

    const toggleModifier = (modifierId: number) => {
        setSelectedModifiers((prev) =>
            prev.includes(modifierId)
                ? prev.filter((id) => id !== modifierId)
                : [...prev, modifierId],
        );
    };

    const currentItemTotal = useMemo(() => {
        if (!selectedProduct) {
            return 0;
        }

        let base = Number(selectedProduct.price) || 0;

        selectedProduct.modifier_groups?.forEach((group) => {
            group.modifiers?.forEach((mod) => {
                if (selectedModifiers.includes(mod.id!)) {
                    base += Number(mod.price) || 0;
                }
            });
        });

        return base * quantity;
    }, [selectedProduct, selectedModifiers, quantity]);

    const handleConfirmAddToCart = () => {
        if (!selectedProduct) {
            return;
        }

        const cartItem: CartItem = {
            product_id: selectedProduct.id,
            quantity: quantity,
            notes: notes.trim() !== '' ? notes : undefined,
            modifiers: selectedModifiers.map((id) => ({
                modifier_id: id,
                quantity: 1,
            })),
        };

        addToCart(cartItem);
        closeDrawer();
    };

    return (
        <>
            <Head title="Point of Sale" />

            <div className="flex h-screen flex-col bg-gray-100">
                <div className="sticky top-0 z-10 border-b border-gray-300 bg-white shadow-sm">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto p-3">
                        <button
                            onClick={() => handleCategoryClick()}
                            className={`shrink-0 rounded-md border px-6 py-3 text-sm font-bold whitespace-nowrap ${
                                !currentCategoryId
                                    ? 'border-blue-700 bg-blue-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 active:bg-gray-100'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`shrink-0 rounded-md border px-6 py-3 text-sm font-bold whitespace-nowrap ${
                                    Number(currentCategoryId) === category.id
                                        ? 'border-blue-700 bg-blue-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 active:bg-gray-100'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {products.data.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => openDrawer(product)}
                                className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-300 bg-white text-left active:border-blue-500 active:bg-blue-50"
                            >
                                <div className="relative aspect-square w-full bg-gray-100">
                                    <img
                                        src={
                                            product.image_url ||
                                            `https://dummyimage.com/400x400/e5e7eb/9ca3af?text=${encodeURIComponent(product.name)}`
                                        }
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                    {product.stock <= 5 && (
                                        <div className="absolute top-0 right-0 bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                            {product.stock === 0
                                                ? 'OUT OF STOCK'
                                                : `LEFT: ${product.stock}`}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-3">
                                    <h3 className="line-clamp-2 text-sm leading-tight font-bold text-gray-900">
                                        {product.name}
                                    </h3>
                                    <p className="mt-2 text-base font-black text-blue-700">
                                        ${Number(product.price).toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={!!selectedProduct}
                onClose={closeDrawer}
                footer={
                    selectedProduct && (
                        <div className="flex gap-4">
                            <div className="flex h-14 w-36 items-center justify-between rounded-lg border border-gray-300 bg-white px-2">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xl font-bold text-gray-700 active:bg-gray-200"
                                >
                                    &minus;
                                </button>
                                <span className="text-lg font-black text-gray-900">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xl font-bold text-gray-700 active:bg-gray-200"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleConfirmAddToCart}
                                disabled={selectedProduct.stock === 0}
                                className="flex h-14 flex-1 items-center justify-between gap-2 rounded-lg bg-blue-600 px-6 font-bold text-white active:bg-blue-800 disabled:bg-gray-400"
                            >
                                <span className="text-lg">
                                    {selectedProduct.stock === 0
                                        ? 'Out of Stock'
                                        : 'Add'}
                                </span>
                                <span className="text-xl">
                                    {currentItemTotal.toFixed(2)}
                                </span>
                            </button>
                        </div>
                    )
                }
            >
                {selectedProduct && (
                    <>
                        <div className="relative h-56 w-full bg-gray-200">
                            <img
                                src={
                                    selectedProduct.image_url ||
                                    `https://dummyimage.com/600x400/e5e7eb/9ca3af?text=${encodeURIComponent(selectedProduct.name)}`
                                }
                                alt={selectedProduct.name}
                                className="h-full w-full object-cover"
                            />
                            <button
                                onClick={closeDrawer}
                                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-black text-gray-900">
                                {selectedProduct.name}
                            </h2>
                            {selectedProduct.description && (
                                <p className="mt-2 text-sm font-medium text-gray-600">
                                    {selectedProduct.description}
                                </p>
                            )}

                            {selectedProduct.modifier_groups &&
                                selectedProduct.modifier_groups.length > 0 && (
                                    <div className="mt-8 space-y-8">
                                        {selectedProduct.modifier_groups.map(
                                            (group) => (
                                                <div key={group.id}>
                                                    <h3 className="text-lg font-bold tracking-tight text-gray-900 uppercase">
                                                        {group.name}
                                                    </h3>

                                                    <div className="mt-3 flex flex-col gap-3">
                                                        {group.modifiers?.map(
                                                            (modifier) => {
                                                                const isSelected =
                                                                    selectedModifiers.includes(
                                                                        modifier.id!,
                                                                    );

                                                                return (
                                                                    <button
                                                                        key={
                                                                            modifier.id
                                                                        }
                                                                        onClick={() =>
                                                                            toggleModifier(
                                                                                modifier.id!,
                                                                            )
                                                                        }
                                                                        className={`flex w-full items-center justify-between rounded-lg border-2 p-4 text-left ${
                                                                            isSelected
                                                                                ? 'border-blue-600 bg-blue-50'
                                                                                : 'border-gray-200 bg-white active:bg-gray-50'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className={`flex h-6 w-6 items-center justify-center rounded border-2 ${
                                                                                    isSelected
                                                                                        ? 'border-blue-600 bg-blue-600'
                                                                                        : 'border-gray-400 bg-white'
                                                                                }`}
                                                                            >
                                                                                {isSelected && (
                                                                                    <svg
                                                                                        className="h-4 w-4 text-white"
                                                                                        viewBox="0 0 20 20"
                                                                                        fill="currentColor"
                                                                                    >
                                                                                        <path
                                                                                            fillRule="evenodd"
                                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                            clipRule="evenodd"
                                                                                        />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-base font-bold text-gray-900">
                                                                                {
                                                                                    modifier.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-base font-bold text-gray-600">
                                                                            {Number(
                                                                                modifier.price,
                                                                            ) >
                                                                            0
                                                                                ? `+ ${Number(modifier.price).toFixed(2)}`
                                                                                : 'Free'}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                            <div className="mt-8">
                                <h3 className="mb-3 text-lg font-bold tracking-tight text-gray-900 uppercase">
                                    Notes
                                </h3>
                                <textarea
                                    rows={3}
                                    placeholder="e.g., Less ice, extra spicy..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full rounded-lg border-2 border-gray-300 p-4 text-base font-medium focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>
                    </>
                )}
            </Drawer>
        </>
    );
}
