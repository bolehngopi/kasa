<?php

namespace Database\Factories;

use App\Models\ModifierGroup;
use App\Models\Modifier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Modifier>
 */
class ModifierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $hasDefault = false;

        return [
            'modifier_group_id' => ModifierGroup::factory(),
            'name' => $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 0, 100),
            'sort_order' => $this->faker->randomDigit(),
            'is_default' => $hasDefault ? false : ($hasDefault = true),
        ];
    }
}
