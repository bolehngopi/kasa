<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function viewOrder(Request $request)
    {
        return inertia('order/view-order');
    }

    public function checkout(Request $request)
    {
        return inertia('checkout');
    }

    public function index(Request $request)
    {
        //
    }

    public function calculateTotal(Request $request)
    {
        $orderProducts = $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.modifiers' => 'nullable|array',
            'products.*.modifiers.*' => 'exists:modifiers,id',
        ])['products'];

        $totalAmount = 0;
        $calculatedProducts = []; // FIX: Use this array to hold all cart items

        foreach ($orderProducts as $item) {
            $productModel = Product::findOrFail($item['id']);
            $productTotal = (float) $productModel->price;
            $appliedModifiers = [];

            if (isset($item['modifiers']) && \is_array($item['modifiers'])) {
                foreach ($item['modifiers'] as $modifierId) {
                    // Assuming your Product model has a modifiers relationship
                    $modifier = $productModel->modifiers()->findOrFail($modifierId);
                    $productTotal += (float) $modifier->price;

                    // FIX: Append each modifier to an array instead of overwriting it
                    $appliedModifiers[] = $modifier->toArray();
                }
            }

            $totalAmount += $productTotal * (int) $item['quantity'];

            // FIX: Transform data and push this item into the final list
            $productData = $productModel->toArray();
            $productData['modifiers'] = $appliedModifiers;
            $productData['quantity'] = (int) $item['quantity'];

            $calculatedProducts[] = $productData;
        }

        return response()->json([
            'products' => $calculatedProducts, // Returns ALL items correctly
            'subtotal' => (float) number_format($totalAmount, 2),
        ]);
    }
}
