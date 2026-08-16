<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('ordering page returns active categories and active products', function () {
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
        ->has('products.data', 1)
        ->where('products.data.0.id', $activeProduct->id)
    );
});

test('ordering page filters products by category_id', function () {
    $catA = Category::factory()->create(['is_active' => true]);
    $catB = Category::factory()->create(['is_active' => true]);

    $prodA = Product::factory()->create(['category_id' => $catA->id, 'is_active' => true]);
    $prodB = Product::factory()->create(['category_id' => $catB->id, 'is_active' => true]);

    $response = $this->get(route('order.index', ['category_id' => $catA->id]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('order/index')
        ->has('products.data', 1)
        ->where('products.data.0.id', $prodA->id)
    );
});

test('ordering page includes subcategory products when parent category is selected', function () {
    $parentCat = Category::factory()->create(['is_active' => true]);
    $childCat = Category::factory()->create(['parent_id' => $parentCat->id, 'is_active' => true]);

    $parentProd = Product::factory()->create(['category_id' => $parentCat->id, 'is_active' => true]);
    $childProd = Product::factory()->create(['category_id' => $childCat->id, 'is_active' => true]);

    $response = $this->get(route('order.index', ['category_id' => $parentCat->id]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('order/index')
        ->has('products.data', 2)
    );
});
