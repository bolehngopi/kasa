<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Modifier;
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $validatedData = $request->validated();

        $order = Order::create([
            'user_id' => $validatedData['user_id'],
            'status' => OrderStatus::PENDING,
            'total_amount' => 0,
            'notes' => $validatedData['notes'] ?? null,
        ]);

        $totalAmount = 0;

        foreach ($validatedData['products'] as $items) {
            $product = Product::findOrFail($items['product_id']);
            $productTotal = $product->price;

            $orderProduct = $order->products()->create([
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

        return response()->json(['message' => 'Order created successfully', 'order' => $order->load('products.orderModifiers')], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
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
