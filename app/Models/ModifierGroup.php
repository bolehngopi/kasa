<?php

namespace App\Models;

use Database\Factories\ModifierGroupFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'sort_order', 'is_active', 'is_required', 'min_selection', 'max_selection', 'selection_type'])]
class ModifierGroup extends Model
{
    /** @use HasFactory<ModifierGroupFactory> */
    use HasFactory;

    public function modifiers()
    {
        return $this->hasMany(Modifier::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_modifier_groups', 'modifier_group_id', 'product_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_required' => 'boolean',
            'min_selection' => 'integer',
            'max_selection' => 'integer',
        ];
    }
}
