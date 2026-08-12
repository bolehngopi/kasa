<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    Permission::findOrCreate('manage_products');
});

it('allows user with manage_products to view product edit page', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('manage_products');

    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get("/dashboard/products/{$product->id}/edit")
        ->assertOk();
});

it('blocks user without manage_products from viewing product edit page', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get("/dashboard/products/{$product->id}/edit")
        ->assertForbidden();
});

it('updates product basic details successfully', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('manage_products');

    $category = Category::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put("/dashboard/products/{$product->id}", [
        'name' => 'Updated Product Name',
        'slug' => 'updated-product-name',
        'sku' => 'UPD-SKU-001',
        'price' => 25.50,
        'stock' => 15,
        'category_id' => $category->id,
        'description' => 'Updated product description',
        'is_active' => true,
    ]);

    $response->assertRedirect("/dashboard/products/{$product->id}");

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Product Name',
        'slug' => 'updated-product-name',
        'sku' => 'UPD-SKU-001',
        'price' => 25.50,
        'stock' => 15,
        'category_id' => $category->id,
        'description' => 'Updated product description',
        'is_active' => true,
    ]);
});

it('updates product modifier groups successfully', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('manage_products');

    $category = Category::factory()->create();
    $product = Product::factory()->create();

    $response = $this->actingAs($user)->put("/dashboard/products/{$product->id}", [
        'name' => $product->name,
        'slug' => $product->slug,
        'sku' => $product->sku,
        'price' => $product->price,
        'stock' => $product->stock,
        'category_id' => $category->id,
        'description' => $product->description,
        'is_active' => true,
        'modifier_groups' => [
            [
                'name' => 'Temperature',
                'description' => 'Choose hot or iced',
                'is_required' => false,
                'is_active' => true,
                'min_selection' => 0,
                'max_selection' => 1,
                'selection_type' => 'single',
                'sort_order' => 0,
                'modifiers' => [
                    [
                        'name' => 'Hot',
                        'price' => 0,
                        'is_active' => true,
                        'sort_order' => 0,
                    ],
                    [
                        'name' => 'Extra Cold',
                        'price' => 0.50,
                        'is_active' => true,
                        'sort_order' => 1,
                    ],
                ],
            ],
        ],
    ]);

    $response->assertRedirect("/dashboard/products/{$product->id}");

    $this->assertDatabaseHas('modifier_groups', [
        'name' => 'Temperature',
    ]);

    $this->assertDatabaseHas('modifiers', [
        'name' => 'Extra Cold',
        'price' => 0.50,
    ]);
});
