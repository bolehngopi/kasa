<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $orders = [];

        if ($request->user()) {
            $orders = Order::with(['staff', 'customer', 'products.modifiers', 'payments'])
                ->where('customer_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return inertia('invoice/index', [
            'authOrders' => $orders,
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        return inertia('invoice/show', [
            'order' => $order->load(['staff', 'customer', 'products.modifiers', 'payments']),
        ]);
    }

    public function getGuestOrders(Request $request)
    {
        $validated = $request->validate([
            'order_numbers' => 'required|array',
            'order_numbers.*' => 'string',
        ]);

        if (empty($validated['order_numbers'])) {
            return response()->json([]);
        }

        $orders = Order::whereIn('order_number', $validated['order_numbers'])
            ->orderBy('created_at', 'desc')
            ->with(['staff', 'customer', 'products.modifiers', 'payments'])
            ->get();

        return response()->json($orders);
    }
}
