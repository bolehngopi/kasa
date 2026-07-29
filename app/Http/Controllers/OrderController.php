<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Category;
use App\Models\Modifier;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('dashboard/order/index', [
            'orders' => Order::with(['staff', 'customer', 'products.modifiers'])
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString(),
        ]);
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
    // public function store(StoreOrderRequest $request)
    // {
    //     $validatedData = $request->validated();

    //     $order = DB::transaction(function () use ($validatedData) {
    //         $order = Order::create([
    //             'staff_id' => $validatedData['staff_id'],
    //             'customer_id' => $validatedData['customer_id'],
    //             'status' => OrderStatus::PENDING,
    //             'total_amount' => 0,
    //             'notes' => $validatedData['notes'] ?? null,
    //         ]);

    //         $totalAmount = 0;

    //         foreach ($validatedData['order_products'] as $item) {
    //             $product = Product::findOrFail($item['product_id']);
    //             $productTotal = (float) $product->price;

    //             $orderProduct = $order->products()->create([
    //                 'product_id' => $product->id,
    //                 'name' => $product->name,
    //                 'sku' => $product->sku,
    //                 'image_url' => $product->image_url,
    //                 'price' => $product->price,
    //                 'quantity' => $item['quantity'],
    //                 'notes' => $item['note'] ?? null,
    //             ]);

    //             if (!empty($item['modifiers'])) {
    //                 foreach ($item['modifiers'] as $modifierData) {
    //                     $modifier = Modifier::findOrFail($modifierData['modifier_id']);

    //                     $productTotal += (float) $modifier->price;

    //                     $orderProduct->modifiers()->create([
    //                         'modifier_id' => $modifier->id,
    //                         'name' => $modifier->name,
    //                         'price' => $modifier->price,
    //                         'sku' => $modifier->sku,
    //                     ]);
    //                 }
    //             }

    //             $totalAmount += $productTotal * $item['quantity'];
    //         }

    //         $order->update(['total_amount' => $totalAmount]);

    //         return $order->load('products.modifiers');
    //     });

    //     return redirect()->route('orders.show', $order)->with('success', 'Order created successfully.');
    // }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return inertia('dashboard/order/show', ['order' => $order->load('products.modifiers', 'staff', 'customer')]);
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

    public function ordering(Request $request)
    {
        $selectedCat = (array) $request->input('category_id', []);

        $product = Product::query();

        $product->when(!empty($selectedCat), function ($query) use ($selectedCat) {
            $query->whereIn('category_id', $selectedCat);
        });

        return inertia('order/index', [
            'products' => $product->with('modifierGroups.modifiers')->paginate(10)->withQueryString(),
            'categories' => Category::with('parent', 'children')->get(),
        ]);
    }
}
