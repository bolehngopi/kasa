<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->query('search');
        $perPage = request()->query('per_page', 10);
        $page = request()->query('page', 1);

        $query = Product::query();

        $query->when($search, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('dashboard/products/index', [
            'products' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = \App\Models\Category::all();

        return Inertia::render('dashboard/products/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => ['nullable', 'image', 'max:2048'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'exists:product_variants,id'],
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->storeAs(
                'products',
                uniqid() . '.' . $request->file('image')->getClientOriginalExtension(),
                'public'
            );
            $validated['image_url'] = $path;
        }

        $validated['slug'] = Str::slug($validated['name']);

        $product = auth()->user()->products()->create($validated);

        // Create variants if provided
        if (isset($validated['variants'])) {
            foreach ($validated['variants'] as $variantData) {
                $product->variants()->create($variantData);
            }
        }

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('dashboard/products/show', [
            'product' => $product->load('category', 'variants'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'image' => ['image', 'max:2048'],
            'name' => ['string', 'max:255'],
            'sku' => ['string', 'max:255', 'unique:products,sku,' . $product->id],
            'description' => ['string'],
            'is_active' => ['boolean'],
            'price' => ['numeric', 'min:0'],
            'stock' => ['integer', 'min:0'],
            'category_id' => ['exists:categories,id'],
            'variants' => ['array'],
            'variants.*.id' => ['nullable', 'exists:product_variants,id'],
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->storeAs(
                'products',
                uniqid() . '.' . $request->file('image')->getClientOriginalExtension(),
                'public'
            );
            $validated['image_url'] = $path;
        }

        $validated['slug'] = Str::slug($validated['name']);

        $product->update($validated);

        // Update variants if provided
        if (isset($validated['variants'])) {
            foreach ($validated['variants'] as $variantData) {
                if (isset($variantData['id'])) {
                    // Update existing variant
                    $variant = $product->variants()->find($variantData['id']);
                    if ($variant) {
                        $variant->update($variantData);
                    }
                } else {
                    // Create new variant
                    $product->variants()->create($variantData);
                }
            }
        }

        return redirect()->route('products.show', $product)->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete image if exists
        if ($product->image_url) {
            Storage::disk('public')->delete($product->image_url);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
