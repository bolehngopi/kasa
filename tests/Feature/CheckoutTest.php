<?php

use App\Models\Modifier;
use App\Models\ModifierGroup;
use App\Models\Order;
use App\Models\Product;

it('creates a guest order with server-side computed totals', function () {
    $product = Product::factory()->create(['price' => 15000, 'is_active' => true]);

    $response = $this->post('/checkout', [
        'customer_name' => 'Budi',
        'payment_method' => 'cash',
        'cart' => [
            ['product_id' => $product->id, 'quantity' => 2],
        ],
    ]);

    $response->assertSessionHas('new_order_number');

    $this->assertDatabaseHas('orders', [
        'customer_name' => 'Budi',
        'total_amount' => '30000.00',
        'final_amount' => '30000.00',
    ]);

    $this->assertDatabaseHas('payments', ['amount' => '30000.00']);
});

it('rejects inactive products at checkout', function () {
    $product = Product::factory()->create(['is_active' => false]);

    $response = $this->post('/checkout', [
        'customer_name' => 'Budi',
        'payment_method' => 'cash',
        'cart' => [['product_id' => $product->id, 'quantity' => 1]],
    ]);

    $response->assertSessionHasErrors('cart');
    $this->assertDatabaseCount('orders', 0);
});

it('does not create duplicate orders for the same idempotency key', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $payload = [
        'idempotency_key' => 'test-key-123',
        'customer_name' => 'Budi',
        'payment_method' => 'cash',
        'cart' => [['product_id' => $product->id, 'quantity' => 1]],
    ];

    $this->post('/checkout', $payload);
    $this->post('/checkout', $payload);

    $this->assertDatabaseCount('orders', 1);
});

it('returns a correct subtotal from calculate-total without thousands-separator bugs', function () {
    $product = Product::factory()->create(['price' => 500000, 'is_active' => true]);

    $response = $this->postJson('/order/calculate-total', [
        'products' => [
            ['id' => $product->id, 'quantity' => 3],
        ],
    ]);

    $response->assertOk()->assertJsonPath('subtotal', 1500000.0);
});

it('increments the daily queue number per order', function () {
    $product = Product::factory()->create(['is_active' => true]);

    foreach ([1, 2] as $expected) {
        $this->post('/checkout', [
            'customer_name' => 'Budi',
            'payment_method' => 'cash',
            'cart' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);
    }

    expect(Order::orderBy('id')->pluck('queue_number')->all())->toBe([1, 2]);
});

it('returns unit_price, line_total, and notes from calculate-total including modifiers', function () {
    $product = Product::factory()->create(['price' => 10000, 'is_active' => true]);
    $group = ModifierGroup::factory()->create();
    $product->modifierGroups()->attach($group->id);

    $modifier = Modifier::factory()->create([
        'modifier_group_id' => $group->id,
        'price' => 2500,
        'is_active' => true,
    ]);

    $response = $this->postJson('/order/calculate-total', [
        'products' => [
            [
                'id' => $product->id,
                'quantity' => 2,
                'notes' => 'Less sugar',
                'modifiers' => [$modifier->id],
            ],
        ],
    ]);

    $response->assertOk()
        ->assertJsonPath('subtotal', 25000.0)
        ->assertJsonPath('products.0.unit_price', 12500.0)
        ->assertJsonPath('products.0.line_total', 25000.0)
        ->assertJsonPath('products.0.notes', 'Less sugar');
});
