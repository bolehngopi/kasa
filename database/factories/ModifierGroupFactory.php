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
            'is_active' => true,
            'is_required' => false,
            'min_selection' => 0,
            'max_selection' => 0,
            'selection_type' => 'multiple',
        ];
    }
}
