import { Head, router } from '@inertiajs/react';
import { ordering } from '@/routes';
import { useCart } from '@/store/cart-store';
import type { Category, PaginatedProduct } from '@/types';

interface OrderingProps {
    products: PaginatedProduct;
    categories: Category[];
}

export default function Ordering({ products, categories }: OrderingProps) {
    const { items: cartItems, add: addToCart } = useCart();

    const handleCategoryClick = (categoryId: number) => {
        router.get(
            ordering.url(),
            { category_id: categoryId },
            { preserveState: true, preserveScroll: true, only: ['products'] },
        );
    };

    const handleResetCategoryClick = () => {
        router.get(
            ordering.url(),
            {},
            { preserveState: true, preserveScroll: true, only: ['products'] },
        );
    };

    const handleAddToCart = (product: PaginatedProduct['data'][number]) => {
        const cartItem = {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            modifiers: [],
        };
        addToCart(cartItem);
    };

    return (
        <>
            <Head title="Ordering" />
            <div className="flex flex-col gap-4 p-2">
                {/* <h1 className="text-2xl font-bold">Ordering</h1> */}
                <div className="flex flex-col gap-4">
                    <div className="flex scrollbar-thin gap-2 overflow-x-auto">
                        <button
                            onClick={() => handleResetCategoryClick()}
                            className="flex min-w-37.5 cursor-pointer flex-col items-center gap-2 rounded-lg bg-gray-50 p-2 shadow-md hover:bg-gray-100"
                        >
                            <h3 className="text-lg font-semibold">
                                All Categories
                            </h3>
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="flex min-w-37.5 cursor-pointer flex-col items-center gap-2 rounded-lg bg-gray-50 p-2 shadow-md hover:bg-gray-100"
                            >
                                <h3 className="text-lg font-semibold">
                                    {category.name}
                                </h3>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col gap-2 rounded-lg bg-gray-50 shadow-md"
                            >
                                <img
                                    src={`https://dummyimage.com/640x480.png/000/ffffff?text=${product.name}`}
                                    alt={product.name}
                                    className="h-40 w-full rounded-t-lg object-cover"
                                />
                                <div className="flex grow flex-col gap-1 p-2">
                                    <h3 className="text-lg font-semibold">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {product.description}
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {product.price}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="m-2 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                >
                                    Add to Order
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
