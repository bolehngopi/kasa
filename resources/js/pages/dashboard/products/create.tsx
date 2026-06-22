import { useForm } from '@inertiajs/react';
import { store } from '@/routes/products';
import type { Category } from '@/types';

type ProductVariantForm = {
    name: string;
    sku: string;
    price: number;
    stock: number;
    is_active: boolean;
    is_default: boolean;
    sort_order: number;
};

const buildVariant = (sortOrder: number): ProductVariantForm => ({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    is_active: false,
    is_default: false,
    sort_order: sortOrder,
});

const normalizeVariants = (
    variants: ProductVariantForm[],
): ProductVariantForm[] =>
    variants.map((variant, index) => ({
        ...variant,
        sort_order: index,
    }));

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
        is_active: false,
        variants: [
            buildVariant(0),
        ],
    });

    const updateVariant = <K extends keyof ProductVariantForm>(
        index: number,
        field: K,
        value: ProductVariantForm[K],
    ) => {
        const nextVariants = data.variants.map((variant, variantIndex) =>
            variantIndex === index ? { ...variant, [field]: value } : variant,
        );

        setData('variants', normalizeVariants(nextVariants));
    };

    const addVariant = () => {
        setData('variants', [
            ...data.variants,
            buildVariant(data.variants.length),
        ]);
    };

    const removeVariant = (index: number) => {
        setData(
            'variants',
            normalizeVariants(
                data.variants.filter((_, variantIndex) => variantIndex !== index),
            ),
        );
    };

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <div>
            <h1>Create Product</h1>
            <p>This is the product creation page.</p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        title="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => {
                            setData('name', e.target.value);
                            setData(
                                'slug',
                                data.slug ||
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '-'),
                            );
                        }}
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Slug
                    </label>
                    <input
                        title="slug"
                        type="text"
                        name="slug"
                        value={data.slug}
                        onChange={(e) =>
                            setData(
                                'slug',
                                e.target.value ??
                                    data.name
                                        .toLowerCase()
                                        .replace(/\s+/g, '-'),
                            )
                        }
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.slug && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.slug}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Sku
                    </label>
                    <input
                        title="sku"
                        type="text"
                        name="sku"
                        value={data.sku}
                        onChange={(e) => setData('sku', e.target.value)}
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.sku && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.sku}
                        </p>
                    )}
                </div>

                {/* Additional form fields for description, price, stock, category, and image upload would go here */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        title="description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        title="price"
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={(e) =>
                            setData('price', parseFloat(e.target.value) || 0)
                        }
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.price}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Stock
                    </label>
                    <input
                        title="stock"
                        type="number"
                        name="stock"
                        value={data.stock}
                        onChange={(e) =>
                            setData('stock', parseInt(e.target.value) || 0)
                        }
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.stock}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        title="category_id"
                        name="category_id"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.category_id}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        title="image"
                        type="file"
                        name="image"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setData('image', e.target.files?.[0] || null)
                        }
                        className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.image && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.image}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Is Active
                    </label>
                    <input
                        title="is_active"
                        type="checkbox"
                        name="is_active"
                        checked={data.is_active || false}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="focus:ring-opacity-50 mt-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    {errors.is_active && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.is_active}
                        </p>
                    )}
                </div>

                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Variants
                            </h2>
                            <p className="text-sm text-gray-600">
                                Variant sort order follows the row order in this
                                list.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addVariant}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Add Variant
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.variants.map((variant, index) => (
                            <div
                                key={index}
                                className="space-y-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Variant {index + 1}
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="text-sm font-medium text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            title={`variant-${index}-name`}
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) =>
                                                updateVariant(
                                                    index,
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        {errors[`variants.${index}.name`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[`variants.${index}.name`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            SKU
                                        </label>
                                        <input
                                            title={`variant-${index}-sku`}
                                            type="text"
                                            value={variant.sku}
                                            onChange={(e) =>
                                                updateVariant(
                                                    index,
                                                    'sku',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        {errors[`variants.${index}.sku`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[`variants.${index}.sku`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <input
                                            title={`variant-${index}-price`}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) =>
                                                updateVariant(
                                                    index,
                                                    'price',
                                                    parseFloat(e.target.value) || 0,
                                                )
                                            }
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        {errors[`variants.${index}.price`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[`variants.${index}.price`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stock
                                        </label>
                                        <input
                                            title={`variant-${index}-stock`}
                                            type="number"
                                            min="0"
                                            value={variant.stock}
                                            onChange={(e) =>
                                                updateVariant(
                                                    index,
                                                    'stock',
                                                    parseInt(e.target.value, 10) || 0,
                                                )
                                            }
                                            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        />
                                        {errors[`variants.${index}.stock`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[`variants.${index}.stock`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sort Order
                                        </label>
                                        <input
                                            title={`variant-${index}-sort_order`}
                                            type="number"
                                            value={variant.sort_order}
                                            readOnly
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            This is derived from the row order.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <input
                                                title={`variant-${index}-is_active`}
                                                type="checkbox"
                                                checked={variant.is_active}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        'is_active',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            />
                                            Is Active
                                        </label>
                                        {errors[`variants.${index}.is_active`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[
                                                    `variants.${index}.is_active`
                                                ]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <input
                                                title={`variant-${index}-is_default`}
                                                type="checkbox"
                                                checked={variant.is_default}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        'is_default',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            />
                                            Default Variant
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data.variants.length === 0 && (
                        <p className="text-sm text-gray-600">
                            No variants added yet.
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={addVariant}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Add Another Variant
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                    Create Product
                </button>
            </form>
        </div>
    );
}
