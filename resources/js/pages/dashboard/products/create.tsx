import { Head, Link, useForm } from '@inertiajs/react';
import { store } from '@/routes/products';
import type { Category } from '@/types';

interface ModifierInput {
    name: string;
    price: number;
}

interface ModifierGroupInput {
    name: string;
    modifiers: ModifierInput[];
}

export default function CreateProduct({
    categories,
}: {
    categories: Category[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: '',
        image: null as File | null,
        sku: '',
        is_active: true,
        modifier_groups: [] as ModifierGroupInput[],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store.url());
    };

    const addModifierGroup = () => {
        setData('modifier_groups', [
            ...data.modifier_groups,
            { name: '', modifiers: [{ name: '', price: 0 }] },
        ]);
    };

    const updateGroupName = (index: number, newName: string) => {
        const updatedGroups = [...data.modifier_groups];
        updatedGroups[index].name = newName;
        setData('modifier_groups', updatedGroups);
    };

    const removeModifierGroup = (index: number) => {
        const updatedGroups = data.modifier_groups.filter(
            (_, i) => i !== index,
        );
        setData('modifier_groups', updatedGroups);
    };

    const addModifier = (groupIndex: number) => {
        const updatedGroups = [...data.modifier_groups];
        updatedGroups[groupIndex].modifiers.push({ name: '', price: 0 });
        setData('modifier_groups', updatedGroups);
    };

    const updateModifier = (
        groupIndex: number,
        modIndex: number,
        field: keyof ModifierInput,
        value: string | number,
    ) => {
        const updatedGroups = [...data.modifier_groups];
        // Use type assertion here since we know the mapping is correct
        (updatedGroups[groupIndex].modifiers[modIndex] as any)[field] = value;
        setData('modifier_groups', updatedGroups);
    };

    const removeModifier = (groupIndex: number, modIndex: number) => {
        const updatedGroups = [...data.modifier_groups];
        updatedGroups[groupIndex].modifiers = updatedGroups[
            groupIndex
        ].modifiers.filter((_, i) => i !== modIndex);
        setData('modifier_groups', updatedGroups);
    };

    return (
        <>
            <Head title="Create New Product" />

            <div className="mb-6">
                <Link
                    href="/dashboard/products"
                    className="mb-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    &larr; Back to Products
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    Create Product
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Add a new product to your catalog. Fill in the details
                    below.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <form onSubmit={submit}>
                    <div className="space-y-6 p-6 sm:p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Product Name{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    placeholder="e.g. Iced Caramel Macchiato"
                                    onChange={(e) => {
                                        setData('name', e.target.value);
                                        setData(
                                            'slug',
                                            data.slug ||
                                                e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, '-')
                                                    .replace(/(^-|-$)+/g, ''),
                                        );
                                    }}
                                    className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="slug"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    URL Slug{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="slug"
                                    type="text"
                                    name="slug"
                                    value={data.slug}
                                    placeholder="iced-caramel-macchiato"
                                    onChange={(e) =>
                                        setData(
                                            'slug',
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9\-]+/g, ''),
                                        )
                                    }
                                    className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none ${errors.slug ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.slug && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="sku"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    SKU
                                </label>
                                <input
                                    id="sku"
                                    type="text"
                                    name="sku"
                                    value={data.sku}
                                    placeholder="e.g. SKU-1234"
                                    onChange={(e) =>
                                        setData('sku', e.target.value)
                                    }
                                    className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none ${errors.sku ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.sku && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Base Price{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                            $
                                        </span>
                                    </div>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData(
                                                'price',
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                        className={`block w-full rounded-lg border py-2.5 pr-4 pl-7 text-sm focus:ring-1 focus:outline-none ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="stock"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Stock Quantity{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData(
                                            'stock',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none ${errors.stock ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="category_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className={`mt-1 block w-full rounded-lg border bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none ${errors.category_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Product Image
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setData(
                                            'image',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.image && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={data.description}
                                placeholder="Briefly describe the product..."
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm focus:ring-1 focus:outline-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_active"
                                type="checkbox"
                                name="is_active"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="is_active"
                                className="ml-3 block text-sm font-medium text-gray-900"
                            >
                                Active (Visible on POS and Store)
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Customizations & Modifiers
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Allow customers to modify this product
                                    (e.g., Size, Milk Type, Extras).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addModifierGroup}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                + Add Group
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.modifier_groups.map((group, groupIndex) => (
                                <div
                                    key={groupIndex}
                                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="mb-4 flex items-end justify-between gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Group Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Select Milk Type"
                                                value={group.name}
                                                onChange={(e) =>
                                                    updateGroupName(
                                                        groupIndex,
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeModifierGroup(groupIndex)
                                            }
                                            className="mb-2 shrink-0 text-sm font-medium text-red-600 hover:text-red-800"
                                        >
                                            Remove Group
                                        </button>
                                    </div>

                                    <div className="space-y-3 border-l-2 border-gray-100 pl-4">
                                        {group.modifiers.map(
                                            (modifier, modIndex) => (
                                                <div
                                                    key={modIndex}
                                                    className="flex items-center gap-4"
                                                >
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Option name (e.g. Oat Milk)"
                                                            value={
                                                                modifier.name
                                                            }
                                                            onChange={(e) =>
                                                                updateModifier(
                                                                    groupIndex,
                                                                    modIndex,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="relative w-32">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">
                                                                +$
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={
                                                                modifier.price
                                                            }
                                                            onChange={(e) =>
                                                                updateModifier(
                                                                    groupIndex,
                                                                    modIndex,
                                                                    'price',
                                                                    parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                )
                                                            }
                                                            className="block w-full rounded-lg border border-gray-300 py-2 pr-3 pl-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeModifier(
                                                                groupIndex,
                                                                modIndex,
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-600"
                                                        title="Remove option"
                                                    >
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ),
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                addModifier(groupIndex)
                                            }
                                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            + Add Option
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {data.modifier_groups.length === 0 && (
                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                    <p className="text-sm text-gray-500">
                                        No customizations added yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 border-t border-gray-200 p-6 sm:p-8">
                        <Link
                            href="/dashboard/products"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
