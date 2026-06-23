import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/products';
import type { Category, ProductVariant } from '@/types';

const buildVariant = (sortOrder: number): ProductVariant => ({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    is_active: false,
    is_default: false,
    sort_order: sortOrder,
});

const normalizeVariants = (variants: ProductVariant[]): ProductVariant[] =>
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
        variants: [buildVariant(0)],
    });

    const updateVariant = <K extends keyof ProductVariant>(
        index: number,
        field: K,
        value: ProductVariant[K],
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
                data.variants.filter(
                    (_, variantIndex) => variantIndex !== index,
                ),
            ),
        );
    };

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create Product
                </h1>
                <p className="text-sm text-muted-foreground">
                    Create the product, then add one or more variants below.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Product details</CardTitle>
                        <CardDescription>
                            Core information shown across the catalog.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => {
                                    const nextName = e.target.value;

                                    setData('name', nextName);
                                    setData(
                                        'slug',
                                        data.slug ||
                                            nextName
                                                .toLowerCase()
                                                .replace(/\s+/g, '-'),
                                    );
                                }}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                type="text"
                                name="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData(
                                        'slug',
                                        e.target.value ||
                                            data.name
                                                .toLowerCase()
                                                .replace(/\s+/g, '-'),
                                    )
                                }
                            />
                            {errors.slug && (
                                <p className="text-sm text-destructive">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                id="sku"
                                type="text"
                                name="sku"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                            />
                            {errors.sku && (
                                <p className="text-sm text-destructive">
                                    {errors.sku}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id">Category</Label>
                            <select
                                id="category_id"
                                name="category_id"
                                aria-label="Category"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base shadow-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
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
                                <p className="text-sm text-destructive">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => setData('description', e.target.value)}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                value={data.price}
                                onChange={(e) =>
                                    setData(
                                        'price',
                                        parseFloat(e.target.value) || 0,
                                    )
                                }
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                name="stock"
                                min="0"
                                value={data.stock}
                                onChange={(e) =>
                                    setData(
                                        'stock',
                                        parseInt(e.target.value, 10) || 0,
                                    )
                                }
                            />
                            {errors.stock && (
                                <p className="text-sm text-destructive">
                                    {errors.stock}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                type="file"
                                name="image"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            {errors.image && (
                                <p className="text-sm text-destructive">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2 md:self-end">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onClick={() =>
                                    setData('is_active', !data.is_active)
                                }
                            />
                            <div className="space-y-1 leading-none">
                                <Label htmlFor="is_active">Active</Label>
                                <p className="text-sm text-muted-foreground">
                                    Make this product visible in the catalog.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>Variants</CardTitle>
                                <CardDescription>
                                    Sort order follows the order of the rows in
                                    this list.
                                </CardDescription>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addVariant}
                            >
                                Add variant
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.variants.length > 0 ? (
                            data.variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="space-y-4 rounded-lg border border-input p-4"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-medium">
                                                Variant {index + 1}
                                            </h3>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeVariant(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`variant-${index}-name`}
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id={`variant-${index}-name`}
                                                type="text"
                                                value={variant.name}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors[
                                                `variants.${index}.name`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `variants.${index}.name`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`variant-${index}-sku`}
                                            >
                                                SKU
                                            </Label>
                                            <Input
                                                id={`variant-${index}-sku`}
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        'sku',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors[
                                                `variants.${index}.sku`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `variants.${index}.sku`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`variant-${index}-price`}
                                            >
                                                Price
                                            </Label>
                                            <Input
                                                id={`variant-${index}-price`}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={variant.price}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        'price',
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                            />
                                            {errors[
                                                `variants.${index}.price`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `variants.${index}.price`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`variant-${index}-stock`}
                                            >
                                                Stock
                                            </Label>
                                            <Input
                                                id={`variant-${index}-stock`}
                                                type="number"
                                                min="0"
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        'stock',
                                                        parseInt(
                                                            e.target.value,
                                                            10,
                                                        ) || 0,
                                                    )
                                                }
                                            />
                                            {errors[
                                                `variants.${index}.stock`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `variants.${index}.stock`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
                                            <Checkbox
                                                id={`variant-${index}-is_active`}
                                                checked={variant.is_active}
                                                onClick={() =>
                                                    updateVariant(
                                                        index,
                                                        'is_active',
                                                        !variant.is_active,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`variant-${index}-is_active`}
                                            >
                                                Active
                                            </Label>
                                            {errors[
                                                `variants.${index}.is_active`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `variants.${index}.is_active`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2">
                                            <Checkbox
                                                id={`variant-${index}-is_default`}
                                                checked={variant.is_default}
                                                onClick={() =>
                                                    updateVariant(
                                                        index,
                                                        'is_default',
                                                        !variant.is_default,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`variant-${index}-is_default`}
                                            >
                                                Default variant
                                            </Label>
                                            {errors[
                                                `variants.${index}.is_default`
                                            ] && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `variants.${index}.is_default`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No variants added yet.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button type="submit" disabled={processing}>
                        Create product
                    </Button>
                </div>
            </form>
        </div>
    );
}
