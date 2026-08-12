<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    Permission::findOrCreate('manage orders');
});

test('authenticated user with permission can update order status', function () {
    $staff = User::factory()->create();
    $staff->givePermissionTo('manage orders');

    $order = Order::factory()->create([
        'status' => OrderStatus::PENDING,
    ]);

    $this->actingAs($staff)
        ->patch(route('orders.update', $order), [
            'status' => 'paid',
        ])
        ->assertRedirect(route('orders.show', $order));

    expect($order->fresh()->status->value ?? $order->fresh()->status)->toBe('paid');
});

test('unauthorized user cannot update order status', function () {
    $user = User::factory()->create();

    $order = Order::factory()->create([
        'status' => OrderStatus::PENDING,
    ]);

    $this->actingAs($user)
        ->patch(route('orders.update', $order), [
            'status' => 'paid',
        ])
        ->assertForbidden();

    expect($order->fresh()->status->value ?? $order->fresh()->status)->toBe('pending');
});

test('fails validation when given an invalid status', function () {
    $staff = User::factory()->create();
    $staff->givePermissionTo('manage orders');

    $order = Order::factory()->create([
        'status' => OrderStatus::PENDING,
    ]);

    $this->actingAs($staff)
        ->patch(route('orders.update', $order), [
            'status' => 'invalid_status_xyz',
        ])
        ->assertSessionHasErrors('status');
});
