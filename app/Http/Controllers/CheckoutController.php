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
            'customer_id' => 'nullable|exists:users,id',
            'customer_name' => 'nullable|string|max:100',
            'customer_last_name' => 'nullable|string|max:100',
            'customer_email' => 'nullable|email|max:150',
            'customer_phone' => 'nullable|string|max:50',
            'payment_method' => 'required|in:cash,qris',
            'cart' => 'required|array',
            'cart.*.product_id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.notes' => 'nullable|string|max:500',
            'cart.*.modifiers' => 'nullable|array',
            'cart.*.modifiers.*.modifier_id' => 'required|exists:modifiers,id',
        ]);

        $order = DB::transaction(function () use ($validate) {
            $productIds = collect($validate['cart'])->pluck('product_id')->unique();

            $products = Product::with('modifierGroups.modifiers')
                ->whereIn('id', $productIds)
                ->get()
                ->keyBy('id');

            $fullName = trim(($validate['customer_name'] ?? '') . ' ' . ($validate['customer_last_name'] ?? ''));

            $order = Order::create([
                'customer_id' => $validate['customer_id'] ?? null,
                'customer_name' => $fullName ?: null,
                'customer_email' => $validate['customer_email'] ?? null,
                'customer_phone' => $validate['customer_phone'] ?? null,
                'status' => OrderStatus::PENDING,
                'total_amount' => 0,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'final_amount' => 0,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
            ]);

            $totalAmount = 0;

            foreach ($validate['cart'] as $item) {
                $product = $products->get($item['product_id']);

                if (!$product) {
                    throw (new ModelNotFoundException)->setModel(Product::class, $item['product_id']);
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
                        $modifier = $availableModifiers->firstWhere('id', $modifierData['modifier_id']);

                        if (!$modifier) {
                            throw new \Exception("Modifier ID {$modifierData['modifier_id']} not found or not assigned to product {$product->id}");
                        }

                        $productTotal += (float) $modifier->price;

                        $modifiersToInsert[] = [
                            'modifier_id' => $modifier->id,
                            'name' => $modifier->name,
                            'price' => $modifier->price,
                            'sku' => $modifier->sku ?? null,
                        ];
                    }

                    if (!empty($modifiersToInsert)) {
                        $orderProduct->modifiers()->createMany($modifiersToInsert);
                    }
                }

                $totalAmount += $productTotal * $item['quantity'];
            }

            $order->update([
                'total_amount' => $totalAmount,
                'final_amount' => $totalAmount,
            ]);

            $order->payments()->create([
                'payment_method' => $validate['payment_method'],
                'amount' => $totalAmount,
                'status' => 'PENDING'
            ]);

            return $order;
        });

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Order placed successfully!');
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
