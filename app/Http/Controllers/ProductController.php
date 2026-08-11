<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\ModifierGroup;
use App\Models\Product;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected function authorizeManageProducts(): void
    {
        if (! Auth::user()?->can('manage_products')) {
            throw new AuthorizationException;
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorizeManageProducts();

        $search = request()->query('search');
        $perPage = min(max((int) request()->query('per_page', 10), 1), 100);
        $page = max((int) request()->query('page', 1), 1);
        $cat = request()->query('category');

        $query = Product::query();

        $query->when($search, function ($q) use ($search) {
            $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $query->when($cat, fn ($q) => $q->where('category_id', $cat));

        return Inertia::render('dashboard/products/index', [
            'products' => $query->paginate($perPage, ['*'], 'page', $page),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorizeManageProducts();

        return Inertia::render('dashboard/products/create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $this->authorizeManageProducts();

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image_url'] = $request->file('image')->storeAs(
                'products',
                uniqid().'.'.$request->file('image')->getClientOriginalExtension(),
                'public'
            );
        }

        $product = Auth::user()->products()->create(
            collect($validated)->except('modifier_groups')->all()
        );

        $this->syncModifierGroups($product, $validated['modifier_groups'] ?? []);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $this->authorizeManageProducts();

        return Inertia::render('dashboard/products/show', [
            'product' => $product->load('category', 'creator', 'modifierGroups.modifiers'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorizeManageProducts();

        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image_url) {
                Storage::disk('public')->delete($product->image_url);
            }

            $validated['image_url'] = $request->file('image')->storeAs(
                'products',
                uniqid().'.'.$request->file('image')->getClientOriginalExtension(),
                'public'
            );
        }

        $product->update(
            collect($validated)->except('modifier_groups')->all()
        );

        $this->syncModifierGroups($product, $validated['modifier_groups'] ?? []);

        return redirect()->route('products.show', $product)->with('success', 'Product '.$product->name.' updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorizeManageProducts();

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    /**
     * Create/update/detach modifier groups from VALIDATED input.
     */
    protected function syncModifierGroups(Product $product, array $groups): void
    {
        $keepGroupIds = [];

        foreach ($groups as $groupData) {
            $modifiers = $groupData['modifiers'] ?? [];
            unset($groupData['modifiers']);

            $group = $product->modifierGroups()->updateOrCreate(
                ['id' => $groupData['id'] ?? null],
                $groupData
            );

            $keepGroupIds[] = $group->id;

            $keepModifierIds = [];

            foreach ($modifiers as $modifierData) {
                $modifier = $group->modifiers()->updateOrCreate(
                    ['id' => $modifierData['id'] ?? null],
                    $modifierData
                );

                $keepModifierIds[] = $modifier->id;
            }

            $group->modifiers()->whereNotIn('id', $keepModifierIds)->delete();
        }

        $detached = $product->modifierGroups()
            ->whereNotIn('modifier_groups.id', $keepGroupIds)
            ->pluck('modifier_groups.id');

        $product->modifierGroups()->detach($detached);

        foreach ($detached as $groupId) {
            $stillUsed = DB::table('product_modifier_groups')
                ->where('modifier_group_id', $groupId)
                ->exists();

            if (! $stillUsed) {
                $group = ModifierGroup::find($groupId);
                $group?->modifiers()->delete();
                $group?->delete();
            }
        }
    }
}
