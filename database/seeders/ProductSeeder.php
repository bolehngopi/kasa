<?php

namespace Database\Seeders;

use App\Models\ModifierGroup;
use App\Models\Modifiers;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory()
            ->count(20)
            ->has(
                ModifierGroup::factory()
                    ->count(2)
                    ->has(Modifiers::factory()->count(3))
            )
            ->create();
    }
}
