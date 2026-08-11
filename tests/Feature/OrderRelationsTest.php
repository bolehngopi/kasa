<?php

use App\Models\Modifier;
use App\Models\ModifierGroup;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

test('an order stores its products and modifiers through the correct relations', function () {
    $staff = User::factory()->create();
    $customer = User::factory()->create();
    $product = Product::factory()->create();
    $modifierGroup = ModifierGroup::factory()->create();
    $modifier = Modifier::factory()->create([
        'modifier_group_id' => $modifierGroup->id,
    ]);

    $this->actingAs($staff)
        ->post(route('orders.store'), [
            'staff_id' => $staff->id,
            'customer_id' => $customer->id,
            'notes' => 'Test order',
            'order_products' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'note' => 'No onions',
                    'modifiers' => [
                        [
                            'modifier_id' => $modifier->id,
                        ],
                    ],
                ],
            ],
        ])
        ->assertRedirect();

    $order = Order::with('products.modifiers')->sole();

    expect($order->products)->toHaveCount(1)
        ->and($order->products->first()->modifiers)->toHaveCount(1)
        ->and($order->products->first()->modifiers->first()->modifier_id)->toBe($modifier->id);
});
