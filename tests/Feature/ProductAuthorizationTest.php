<?php

use App\Models\Product;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Permission::findOrCreate('manage_products');
    Role::findOrCreate('cashier');
});

it('allows a user with manage_products to view products', function () {
    $admin = User::factory()->create();
    $admin->givePermissionTo('manage_products');

    $this->actingAs($admin)->get('/dashboard/products')->assertOk();
});

it('blocks a user without manage_products', function () {
    $cashier = User::factory()->create();
    $cashier->assignRole('cashier');

    $this->actingAs($cashier)->get('/dashboard/products')->assertForbidden();
    $this->actingAs($cashier)->delete('/dashboard/products/'.Product::factory()->create()->id)->assertForbidden();
});
