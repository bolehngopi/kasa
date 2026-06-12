<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => $this->faker->word(),
            'slug' => $this->faker->unique()->slug(),
            'sku' => $this->faker->unique()->bothify('SKU-####'),
            'description' => $this->faker->sentence(),
            'image_url' => $this->faker->imageUrl(),
            'is_active' => $this->faker->boolean(80),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'created_by' => \App\Models\User::factory(),
            'stock' => $this->faker->numberBetween(0, 100),
        ];
    }
}
