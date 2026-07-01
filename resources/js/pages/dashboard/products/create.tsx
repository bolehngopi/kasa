import { useForm } from '@inertiajs/react';
import { store } from '@/routes/products';
import type { Category } from '@/types';

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
    });

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
