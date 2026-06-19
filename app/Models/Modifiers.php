<?php

namespace App\Models;

use Database\Factories\ModifiersFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['modifier_group_id', 'name', 'price', 'sort_order', 'is_default'])]
class Modifiers extends Model
{
    /** @use HasFactory<ModifiersFactory> */
    use HasFactory;

    public function group()
    {
        return $this->belongsTo(ModifierGroup::class);
    }
}
