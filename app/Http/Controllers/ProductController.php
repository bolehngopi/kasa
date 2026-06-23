<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
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
        $cat = request()->query('category');

        $query = Product::query();

        $query->when($search, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $query->when($cat, function ($query, $cat) {
            $query->where('category_id', $cat);
        });

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        $categories = Category::all();

        return Inertia::render('dashboard/products/index', [
            'products' => $data,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('dashboard/products/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->safe();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->storeAs(
                'products',
                uniqid() . '.' . $request->file('image')->getClientOriginalExtension(),
                'public'
            );
            $validated->merge(['image_url' => $path]);
        }

        $validated['slug'] = Str::slug($validated['name']);

        $product = Auth::user()->products()->create($validated->except('variants', 'modifier_groups'));

        // Create variants if provided
        if (isset($validated['variants'])) {
            foreach ($validated['variants'] as $variantData) {
                $product->variants()->create($variantData);
            }
        }

        // Create modifier groups and modifiers if provided
        if (isset($validated['modifier_groups'])) {
            foreach ($validated['modifier_groups'] as $groupData) {
                $modifiers = $groupData['modifiers'] ?? [];
                unset($groupData['modifiers']);
                $modifierGroup = $product->modifierGroups()->create($groupData);

                // Create modifiers for the group
                foreach ($modifiers as $modifierData) {
                    $modifierGroup->modifiers()->create($modifierData);
                }
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
            'product' => $product->load('category', 'variants', 'modifierGroups', 'creator', 'modifierGroups.modifiers'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->safe();

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
            $validated->merge(['image_url' => $path]);
        }

        $product->update($validated);

        // Update variants if provided
        if (isset($request['variants'])) {
            foreach ($request['variants'] as $variantData) {
                $product->variants()->updateOrCreate(['id' => $variantData['id'] ?? null], $variantData);
            }
        }

        // Update modifier groups and modifiers if provided
        if (isset($request['modifier_groups'])) {
            foreach ($request['modifier_groups'] as $groupData) {
                $modifiers = $groupData['modifiers'] ?? [];
                unset($groupData['modifiers']);
                $modifierGroup = $product->modifierGroups()->updateOrCreate(['id' => $groupData['id'] ?? null], $groupData);

                // Update modifiers for the group
                foreach ($modifiers as $modifierData) {
                    $modifierGroup->modifiers()->updateOrCreate(['id' => $modifierData['id'] ?? null], $modifierData);
                }
            }
        }

        return redirect()->route('products.show', $product)->with('success', 'Product ' . $product->name . ' updated successfully.');
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
