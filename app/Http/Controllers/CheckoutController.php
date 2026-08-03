<?php

namespace App\Http\Controllers;

use App\Actions\CreateOrder;
use App\Http\Requests\CalculateTotalRequest;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(protected CreateOrder $createOrder) {}

    public function viewOrder(Request $request)
    {
        return inertia('order/view-order');
    }

    public function index(Request $request)
    {
        return inertia('checkout');
    }

    public function checkout(CheckoutRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        $idempotencySessionKey = null;

        if (! empty($data['idempotency_key'])) {
            $idempotencySessionKey = 'checkout.idempotency.'.sha1($data['idempotency_key']);

            if ($existingNumber = $request->session()->get($idempotencySessionKey)) {
                $existing = Order::where('order_number', $existingNumber)->first();

                if ($existing) {
                    return redirect()->route('invoice.show', $existing->order_number)
                        ->with('new_order_number', $existing->order_number);
                }
            }
        }

        $order = $this->createOrder->handle($data, $user);

        if ($idempotencySessionKey) {
            $request->session()->put($idempotencySessionKey, $order->order_number);
        }

        return redirect()->route('invoice.show', $order->order_number)
            ->with('new_order_number', $order->order_number);
    }

    public function calculateTotal(CalculateTotalRequest $request)
    {
        $items = $request->validated()['products'];

        $productIds = collect($items)->pluck('id')->unique();

        $products = Product::with('modifierGroups.modifiers')
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        $total = '0.00';
        $calculatedProducts = [];

        foreach ($items as $item) {
            $product = $products->get($item['id']);

            $unitPrice = (string) $product->price;
            $appliedModifiers = [];

            foreach ($item['modifiers'] ?? [] as $modifierId) {
                $modifier = $product->modifierGroups
                    ->flatMap(fn ($group) => $group->modifiers)
                    ->firstWhere('id', $modifierId);

                abort_unless((bool) $modifier, 422, 'Modifier is not valid for this product.');

                $unitPrice = bcadd($unitPrice, (string) $modifier->price, 2);

                $appliedModifiers[] = [
                    'id' => $modifier->id,
                    'name' => $modifier->name,
                    'price' => $modifier->price,
                    'sku' => $modifier->sku,
                ];
            }

            $total = bcadd($total, bcmul($unitPrice, (string) $item['quantity'], 2), 2);

            $calculatedProducts[] = [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'image_url' => $product->image_url,
                'price' => $product->price,
                'quantity' => (int) $item['quantity'],
                'modifiers' => $appliedModifiers,
            ];
        }

        return response()->json([
            'products' => $calculatedProducts,
            'subtotal' => (float) $total,
        ], 200, [], JSON_PRESERVE_ZERO_FRACTION);
    }
}
