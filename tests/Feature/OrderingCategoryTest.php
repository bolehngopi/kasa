<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('ordering page returns active categories with active products', function () {
    $activeCategory = Category::factory()->create(['name' => 'Active Drinks', 'is_active' => true]);
    $inactiveCategory = Category::factory()->create(['name' => 'Inactive Pastries', 'is_active' => false]);

    $activeProduct = Product::factory()->create([
        'name' => 'Espresso',
        'category_id' => $activeCategory->id,
        'is_active' => true,
    ]);
    $inactiveProduct = Product::factory()->create([
        'name' => 'Discontinued',
        'category_id' => $activeCategory->id,
        'is_active' => false,
    ]);

    $response = $this->get(route('order.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('order/index')
        ->has('categories', 1)
        ->where('categories.0.id', $activeCategory->id)
        ->has('categories.0.products', 1)
        ->where('categories.0.products.0.id', $activeProduct->id)
    );
});

test('ordering page groups products under their respective categories', function () {
    $catA = Category::factory()->create(['name' => 'Category A', 'is_active' => true]);
    $catB = Category::factory()->create(['name' => 'Category B', 'is_active' => true]);

    $prodA = Product::factory()->create(['category_id' => $catA->id, 'is_active' => true]);
    $prodB = Product::factory()->create(['category_id' => $catB->id, 'is_active' => true]);

    $response = $this->get(route('order.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('order/index')
        ->has('categories', 2)
        ->where('categories.0.id', $catA->id)
        ->has('categories.0.products', 1)
        ->where('categories.1.id', $catB->id)
        ->has('categories.1.products', 1)
    );
});

test('ordering page includes uncategorized items section when products without category exist', function () {
    $uncategorizedProd = Product::factory()->create(['category_id' => null, 'is_active' => true]);

    $response = $this->get(route('order.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('order/index')
        ->has('categories', 1)
        ->where('categories.0.id', 'uncategorized')
        ->has('categories.0.products', 1)
    );
});
