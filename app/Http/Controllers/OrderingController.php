<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $product = \App\Models\Product::query();

        $product->when($request->input('category_id'), function ($query, $categoryId) {
            $query->where('category_id', $categoryId);
        });

        return inertia('ordering/index', [
            'products' => $product->with('modifierGroups.modifiers')->paginate(10)->withQueryString(),
            'categories' => \App\Models\Category::with('parent', 'children')->get(),
        ]);
    }
}
