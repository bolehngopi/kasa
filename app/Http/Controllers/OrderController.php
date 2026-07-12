<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Modifier;
use App\Models\OrderProduct;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('dashboard/order/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $validatedData = $request->validated();

        $order = Order::create([
            'staff_id' => $validatedData['staff_id'],
            'customer_id' => $validatedData['customer_id'],
            'status' => OrderStatus::PENDING,
            'total_amount' => 0,
            'notes' => $validatedData['notes'] ?? null,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
        ]);

        $totalAmount = 0;

        foreach ($validatedData['order_products'] as $items) {
            $product = Product::findOrFail($items['product_id']);
            $productTotal = $product->price;

            $orderProduct = new OrderProduct([
                'order_id' => $order->id, // Ensure your OrderProduct model has order_id
                'product_id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'image_url' => $product->image_url,
                'price' => $product->price,
                'quantity' => $items['quantity'],
                'notes' => $items['note'] ?? null,
            ]);

            if (!empty($items['modifiers'])) {
                foreach ($items['modifiers'] as $modifierData) {
                    $modifiers = Modifier::findOrFail($modifierData['modifier_id']);

                    $productTotal += $modifiers->price;

                    $orderProduct->orderModifiers()->create([
                        'order_product_id' => $order->id,
                        'modifier_id' => $modifiers->id,
                        'name' => $modifiers->name,
                        'price' => $modifiers->price,
                        'sku' => $modifiers->sku,
                    ]);
                }
            }

            $totalAmount += ($productTotal * $items['quantity']);
        }

        // Update the total amount of the order
        $order->update(['total_amount' => $totalAmount]);

        return inertia('dashboard/order/show', ['order' => $order->load('products.orderModifiers')]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return inertia('dashboard/order/show', ['order' => $order->load('products.orderModifiers')]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
