<?php

namespace App\Models;

use Database\Factories\ModifierFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['modifier_group_id', 'name', 'price', 'sort_order', 'is_default'])]
class Modifier extends Model
{
    /** @use HasFactory<ModifierFactory> */
    use HasFactory;

    public function group()
    {
        return $this->belongsTo(ModifierGroup::class);
    }
}
