<?php

namespace App\Actions;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class CreateOrder
{
    /**
     * @param  array  $data  Validated checkout payload.
     * @param  User|null  $user  Null = guest checkout.
     */
    public function handle(array $data, ?User $user): Order
    {
        return DB::transaction(function () use ($data, $user): Order {
            $productIds = collect($data['cart'])->pluck('product_id')->unique();

            /** @var Collection<int, Product> $products */
            $products = Product::with('modifierGroups.modifiers')
                ->whereIn('id', $productIds)
                ->get()
                ->keyBy('id');

            $isCashier = $user?->can('create_orders') ?? false;

            $staffId = $isCashier ? $user->id : null;
            $customerId = $isCashier ? ($data['customer_id'] ?? null) : $user?->id;

            $total = '0.00';
            $lines = [];

            foreach ($data['cart'] as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    throw (new ModelNotFoundException)->setModel(Product::class, $item['product_id']);
                }

                if (! $product->is_active) {
                    throw ValidationException::withMessages([
                        'cart' => "Product \"{$product->name}\" is not available.",
                    ]);
                }

                $unitPrice = (string) $product->price;
                $modifierRows = [];

                foreach ($item['modifiers'] ?? [] as $modifierData) {
                    $modifier = $product->modifierGroups
                        ->flatMap(fn ($group) => $group->modifiers)
                        ->firstWhere('id', $modifierData['modifier_id']);

                    if (! $modifier || ! $modifier->is_active) {
                        throw ValidationException::withMessages([
                            'cart' => "Invalid modifier selected for product \"{$product->name}\".",
                        ]);
                    }

                    $unitPrice = bcadd($unitPrice, (string) $modifier->price, 2);

                    $modifierRows[] = [
                        'modifier_id' => $modifier->id,
                        'name' => $modifier->name,
                        'price' => $modifier->price,
                        'sku' => $modifier->sku,
                    ];
                }

                $lines[] = [
                    'product' => $product,
                    'quantity' => (int) $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                    'modifiers' => $modifierRows,
                ];

                $total = bcadd($total, bcmul($unitPrice, (string) $item['quantity'], 2), 2);
            }

            $order = Order::create([
                'staff_id' => $staffId,
                'customer_id' => $customerId,
                'customer_name' => $data['customer_name'],
                'customer_last_name' => $data['customer_last_name'] ?? null,
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'status' => OrderStatus::PENDING,
                'total_amount' => $total,
                'tax_amount' => '0.00',
                'discount_amount' => '0.00',
                'final_amount' => $total,
            ]);

            foreach ($lines as $line) {
                $orderProduct = $order->products()->create([
                    'product_id' => $line['product']->id,
                    'name' => $line['product']->name,
                    'sku' => $line['product']->sku,
                    'image_url' => $line['product']->image_url,
                    'price' => $line['product']->price,
                    'quantity' => $line['quantity'],
                    'notes' => $line['notes'],
                ]);

                if ($line['modifiers'] !== []) {
                    $orderProduct->modifiers()->createMany($line['modifiers']);
                }
            }

            $order->payments()->create([
                'payment_method' => $data['payment_method'],
                'amount' => $total,
                'status' => $data['payment_method'] === 'cash'
                    ? PaymentStatus::ACTIVE
                    : PaymentStatus::ACTIVE, // TODO: introduce PENDING for QRIS once gateway is wired
            ]);

            return $order;
        });
    }
}
