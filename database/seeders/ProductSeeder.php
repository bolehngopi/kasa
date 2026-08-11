<?php

namespace Database\Seeders;

use App\Models\ModifierGroup;
use App\Models\Modifier;
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
                    ->has(Modifier::factory()->count(3))
            )
            ->create();
    }
}
