<?php

namespace App\Models;

use Database\Factories\ProductModifierGroupFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['product_id', 'modifier_group_id'])]
class ProductModifierGroup extends Model
{
    /** @use HasFactory<ProductModifierGroupFactory> */
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function modifierGroup()
    {
        return $this->belongsTo(ModifierGroup::class);
    }

    public function modifiers()
    {
        return $this->hasManyThrough(Modifiers::class, ModifierGroup::class, 'id', 'modifier_group_id', 'modifier_group_id', 'id');
    }
}
