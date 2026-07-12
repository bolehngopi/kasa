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
        $selectedCat = (array) $request->input('category_id', []);

        $product = \App\Models\Product::query();

        $product->when(!empty($selectedCat), function ($query) use ($selectedCat) {
            $query->whereIn('category_id', $selectedCat);
        });

        return inertia('ordering/index', [
            'products' => $product->with('modifierGroups.modifiers')->paginate(10)->withQueryString(),
            'categories' => \App\Models\Category::with('parent', 'children')->get(),
        ]);
    }
}
