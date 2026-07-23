<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Modifier;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function viewOrder(Request $request)
    {
        return inertia('order/view-order');
    }

    public function index(Request $request)
    {
        return inertia('checkout');
    }

    public function checkout(Request $request)
    {
        $validate = $request->validate([
            'customer_name' => 'required|string|max:50',
            'customer_last_name' => 'nullable|string|max:50',
            'customer_email' => 'nullable|email|max:50',
            'customer_phone' => 'nullable|string|max:50',
            'cart' => 'required|array',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.notes' => 'nullable|string|max:50',
            'cart.*.modifiers' => 'nullable|array',
            'cart.*.modifiers.*' => 'exists:modifiers,id',
        ]);

        $order = DB::transaction(function () use ($validate, $request) {
            $productIds = collect($validate['cart'])->pluck('id')->unique();

            $products = Product::with('modifierGroups.modifiers')
                ->whereIn('id', $productIds)
                ->get()
                ->keyBy('id');

            $order = Order::create([
                'customer_id' => null,
                'status' => OrderStatus::PENDING,
                'total_amount' => 0,
                'notes' => $validate['notes'] ?? null,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
            ]);

            $totalAmount = 0;

            foreach ($validate['cart'] as $item) {
                $product = $products->get($item['id']);

                if (!$product) {
                    throw (new ModelNotFoundException)->setModel(Product::class, $item['id']);
                }

                $productTotal = (float) $product->price;

                $orderProduct = $order->products()->create([
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'image_url' => $product->image_url,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                ]);

                if (!empty($item['modifiers'])) {
                    $modifiersToInsert = [];

                    $availableModifiers = $product->modifierGroups->flatMap->modifiers;

                    foreach ($item['modifiers'] as $modifierData) {
                        $modifier = $availableModifiers->firstWhere('id', $modifierData['id']);

                        if (!$modifier) {
                            throw new \Exception("Modifier ID {$modifierData['id']} not found or not assigned to product {$product->id}");
                        }

                        $productTotal += (float) $modifier->price;

                        $modifiersToInsert[] = [
                            'modifier_id' => $modifier->id,
                            'name' => $modifier->name,
                            'price' => $modifier->price,
                            'sku' => $modifier->sku,
                        ];
                    }

                    if (!empty($modifiersToInsert)) {
                        $orderProduct->modifiers()->createMany($modifiersToInsert);
                    }
                }

                $totalAmount += $productTotal * $item['quantity'];
            }

            $order->update(['total_amount' => $totalAmount]);

            return $order->load('products.modifiers');
        });
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
