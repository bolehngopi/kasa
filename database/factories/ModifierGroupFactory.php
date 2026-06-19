<?php

namespace Database\Factories;

use App\Models\ModifierGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ModifierGroup>
 */
class ModifierGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'sort_order' => $this->faker->randomDigit(),
            'is_active' => $this->faker->boolean(),
            'is_required' => $this->faker->boolean(),
            'min_selection' => $this->faker->randomDigit(),
            'max_selection' => $this->faker->randomDigit(),
            'selection_type' => $this->faker->randomElement(['single', 'multiple']),
        ];
    }
}
