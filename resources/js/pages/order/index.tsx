import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Drawer from '@/components/drawer';
import { useCart } from '@/store/cart-store';
import type { CartItem } from '@/store/cart-store';
import type {
    Category,
    ModifierGroup,
    Product,
} from '@/types';

interface CategoryWithProducts extends Category {
    id: number | string;
    products: Product[];
}

interface OrderingProps {
    categories: CategoryWithProducts[];
}

export default function Order({ categories }: OrderingProps) {
    const { items, add: addToCart } = useCart();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [selectedModifiers, setSelectedModifiers] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [notes, setNotes] = useState<string>('');
    const [activeCategoryId, setActiveCategoryId] = useState<string | number | null>(
        categories && categories.length > 0 ? categories[0].id : null,
    );

    useEffect(() => {
        if (!categories || categories.length === 0) return;

        const handleObserver = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const catId = entry.target.getAttribute('data-category-id');
                    if (catId) {
                        setActiveCategoryId(catId);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '-140px 0px -50% 0px',
            threshold: 0.1,
        });

        categories.forEach((cat) => {
            const el = document.getElementById(`category-${cat.id}`);
            if (el) {
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, [categories]);

    useEffect(() => {
        if (!activeCategoryId) return;
        const activeTab = document.getElementById(`tab-${activeCategoryId}`);
        if (activeTab) {
            activeTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [activeCategoryId]);

    const scrollToCategory = (catId: string | number) => {
        setActiveCategoryId(catId);
        const element = document.getElementById(`category-${catId}`);
        if (element) {
            const yOffset = -135;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const openDrawer = (product: Product) => {
        setSelectedProduct(product);

        const defaultModifierIds: number[] = [];
        product.modifier_groups?.forEach((group) => {
            if (group.is_active === false) {
                return;
            }

            let singleAdded = false;
            group.modifiers?.forEach((modifier) => {
                if (modifier.is_active === false) {
                    return;
                }

                if (modifier.is_default && modifier.id !== undefined) {
                    if (group.selection_type === 'single') {
                        if (!singleAdded) {
                            defaultModifierIds.push(modifier.id);
                            singleAdded = true;
                        }
                    } else {
                        defaultModifierIds.push(modifier.id);
                    }
                }
            });
        });

        setSelectedModifiers(defaultModifierIds);
        setQuantity(1);
        setNotes('');
    };

    const closeDrawer = () => {
        setSelectedProduct(null);
    };

    const toggleModifier = (group: ModifierGroup, modifierId: number) => {
        setSelectedModifiers((prev) => {
            const groupModifierIds = (group.modifiers || [])
                .map((m) => m.id!)
                .filter(Boolean);
            const isSelected = prev.includes(modifierId);

            if (group.selection_type === 'single') {
                if (isSelected) {
                    const isRequired =
                        group.is_required || (group.min_selection ?? 0) > 0;

                    if (isRequired) {
                        return prev;
                    }

                    return prev.filter((id) => !groupModifierIds.includes(id));
                }

                const withoutGroup = prev.filter(
                    (id) => !groupModifierIds.includes(id),
                );

                return [...withoutGroup, modifierId];
            }

            if (isSelected) {
                return prev.filter((id) => id !== modifierId);
            }

            const currentGroupCount = prev.filter((id) =>
                groupModifierIds.includes(id),
            ).length;
            const max =
                (group.max_selection ?? 0) > 0 ? group.max_selection : Infinity;

            if (currentGroupCount >= max) {
                return prev;
            }

            return [...prev, modifierId];
        });
    };

    const groupValidation = useMemo(() => {
        if (!selectedProduct?.modifier_groups) {
            return { isValid: true, groupErrors: {} as Record<number, string> };
        }

        let isValid = true;
        const groupErrors: Record<number, string> = {};

        selectedProduct.modifier_groups.forEach((group) => {
            if (group.is_active === false) {
                return;
            }

            const groupModifierIds = (group.modifiers || [])
                .map((m) => m.id!)
                .filter(Boolean);
            const selectedCount = selectedModifiers.filter((id) =>
                groupModifierIds.includes(id),
            ).length;

            const min =
                (group.min_selection ?? 0) > 0
                    ? group.min_selection
                    : group.is_required
                        ? 1
                        : 0;

            const max =
                group.selection_type === 'single'
                    ? 1
                    : (group.max_selection ?? 0) > 0
                        ? group.max_selection
                        : Infinity;

            if (selectedCount < min) {
                isValid = false;
                groupErrors[group.id] =
                    min === 1 ? 'Required' : `Select at least ${min}`;
            } else if (selectedCount > max) {
                isValid = false;
                groupErrors[group.id] = `Select at most ${max}`;
            }
        });

        return { isValid, groupErrors };
    }, [selectedProduct, selectedModifiers]);

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
        if (!selectedProduct || !groupValidation.isValid) {
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

            <div className="sticky top-16 z-20 border-b border-gray-300 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="scrollbar-hide flex gap-2 overflow-x-auto p-3">
                    {categories.map((category) => {
                        const isActive = String(activeCategoryId) === String(category.id);
                        return (
                            <button
                                key={category.id}
                                id={`tab-${category.id}`}
                                onClick={() => scrollToCategory(category.id)}
                                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                                    isActive
                                        ? 'border-blue-700 bg-blue-600 text-white shadow-md scale-[1.02]'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-95'
                                }`}
                            >
                                <span>{category.name}</span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                                        isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {category.products?.length || 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-10">
                {categories.map((category) => (
                    <section
                        key={category.id}
                        id={`category-${category.id}`}
                        data-category-id={category.id}
                        className="scroll-mt-24"
                    >
                        <div className="flex items-center justify-between border-b border-gray-300 pb-3 mb-6">
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                                    {category.name}
                                </h2>
                                {category.description && (
                                    <p className="mt-1 text-sm font-medium text-gray-500">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                {category.products?.length || 0} {category.products?.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {category.products?.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => openDrawer(product)}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-300 bg-white text-left shadow-sm transition hover:border-blue-500 hover:shadow-md active:scale-[0.98]"
                                >
                                    <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                                        <img
                                            src={
                                                product.image_url ||
                                                `https://dummyimage.com/400x400/e5e7eb/9ca3af?text=${encodeURIComponent(product.name)}`
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {product.stock <= 5 && (
                                            <div className="absolute top-2 right-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
                                                {product.stock === 0
                                                    ? 'OUT OF STOCK'
                                                    : `LEFT: ${product.stock}`}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-3.5">
                                        <h3 className="line-clamp-2 text-sm leading-snug font-bold text-gray-900 group-hover:text-blue-600">
                                            {product.name}
                                        </h3>
                                        <p className="mt-2 text-base font-black text-blue-700">
                                            ${Number(product.price).toFixed(2)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
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
                                disabled={
                                    selectedProduct.stock === 0 ||
                                    !groupValidation.isValid
                                }
                                className="flex h-14 flex-1 items-center justify-between gap-2 rounded-lg bg-blue-600 px-6 font-bold text-white transition active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                <span className="text-lg">
                                    {selectedProduct.stock === 0
                                        ? 'Out of Stock'
                                        : !groupValidation.isValid
                                            ? 'Select Required Options'
                                            : 'Add'}
                                </span>
                                <span className="text-xl">
                                    ${currentItemTotal.toFixed(2)}
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
                                        {[...selectedProduct.modifier_groups]
                                            .sort(
                                                (a, b) =>
                                                    (a.sort_order ?? 0) -
                                                    (b.sort_order ?? 0),
                                            )
                                            .map((group) => {
                                                const isRequiredGroup =
                                                    group.is_required ||
                                                    (group.min_selection ?? 0) >
                                                    0;
                                                const groupError =
                                                    groupValidation.groupErrors[
                                                    group.id
                                                    ];

                                                const groupModifierIds = (
                                                    group.modifiers || []
                                                )
                                                    .map((m) => m.id!)
                                                    .filter(Boolean);
                                                const selectedInGroupCount =
                                                    selectedModifiers.filter(
                                                        (id) =>
                                                            groupModifierIds.includes(
                                                                id,
                                                            ),
                                                    ).length;
                                                const maxSelection =
                                                    (group.max_selection ?? 0) >
                                                        0
                                                        ? group.max_selection
                                                        : Infinity;
                                                const isMaxReached =
                                                    group.selection_type ===
                                                    'multiple' &&
                                                    selectedInGroupCount >=
                                                    maxSelection;

                                                let ruleDescription = '';

                                                if (
                                                    group.selection_type ===
                                                    'single'
                                                ) {
                                                    ruleDescription =
                                                        'Select 1 option';
                                                } else if (
                                                    (group.min_selection ?? 0) >
                                                    0 &&
                                                    (group.max_selection ?? 0) >
                                                    0
                                                ) {
                                                    ruleDescription = `Select ${group.min_selection} to ${group.max_selection} options`;
                                                } else if (
                                                    (group.min_selection ?? 0) >
                                                    0
                                                ) {
                                                    ruleDescription = `Select at least ${group.min_selection} option${group.min_selection > 1 ? 's' : ''}`;
                                                } else if (
                                                    (group.max_selection ?? 0) >
                                                    0
                                                ) {
                                                    ruleDescription = `Select up to ${group.max_selection} option${group.max_selection > 1 ? 's' : ''}`;
                                                } else {
                                                    ruleDescription =
                                                        'Select any options';
                                                }

                                                return (
                                                    <div key={group.id}>
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-lg font-bold tracking-tight text-gray-900 uppercase">
                                                                    {group.name}
                                                                </h3>
                                                                {isRequiredGroup ? (
                                                                    <span className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                                                                        Required
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                                                        Optional
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {groupError && (
                                                                <span className="text-xs font-bold text-red-600">
                                                                    {groupError}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-1 text-xs font-medium text-gray-500">
                                                            {ruleDescription}
                                                        </p>

                                                        <div className="mt-3 flex flex-col gap-3">
                                                            {[
                                                                ...(group.modifiers ||
                                                                    []),
                                                            ]
                                                                .sort(
                                                                    (a, b) =>
                                                                        (a.sort_order ??
                                                                            0) -
                                                                        (b.sort_order ??
                                                                            0),
                                                                )
                                                                .map(
                                                                    (
                                                                        modifier,
                                                                    ) => {
                                                                        const isSelected =
                                                                            selectedModifiers.includes(
                                                                                modifier.id!,
                                                                            );
                                                                        const isDisabled =
                                                                            !isSelected &&
                                                                            isMaxReached;

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    modifier.id
                                                                                }
                                                                                type="button"
                                                                                disabled={
                                                                                    isDisabled
                                                                                }
                                                                                onClick={() =>
                                                                                    toggleModifier(
                                                                                        group,
                                                                                        modifier.id!,
                                                                                    )
                                                                                }
                                                                                className={`flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${isSelected
                                                                                        ? 'border-blue-600 bg-blue-50'
                                                                                        : isDisabled
                                                                                            ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50'
                                                                                            : 'border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50'
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    {group.selection_type ===
                                                                                        'single' ? (
                                                                                        <div
                                                                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${isSelected
                                                                                                    ? 'border-blue-600 bg-blue-600'
                                                                                                    : 'border-gray-400 bg-white'
                                                                                                }`}
                                                                                        >
                                                                                            {isSelected && (
                                                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div
                                                                                            className={`flex h-6 w-6 items-center justify-center rounded border-2 ${isSelected
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
                                                                                    )}
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
                                                                                        ? `+ $${Number(modifier.price).toFixed(2)}`
                                                                                        : 'Free'}
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    },
                                                                )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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

            {/* Cart Banner remains unchanged */}
            {items.length > 0 && (
                <div className="fixed bottom-6 left-1/2 z-30 w-11/12 max-w-lg -translate-x-1/2">
                    <Link
                        href="/order/view-order"
                        className="flex w-full items-center justify-between rounded-2xl bg-blue-600 px-6 py-4 text-white shadow-xl transition hover:bg-blue-700 active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-blue-600">
                                {items.reduce(
                                    (acc, item) => acc + item.quantity,
                                    0,
                                )}
                            </span>
                            <span className="font-bold">Review Order</span>
                        </div>
                        <span className="font-bold">View Cart &rarr;</span>
                    </Link>
                </div>
            )}
        </>
    );
}
