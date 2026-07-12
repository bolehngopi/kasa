<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['order_product_id', 'modifier_id', 'name', 'price', 'sku'])]
class OrderProductModifier extends Model
{
    /**
     * Get the order product that this modifier belongs to.
     */
    public function orderProduct()
    {
        return $this->belongsTo(OrderProduct::class, 'order_product_id');
    }

    /**
     * Get the modifier that this order product modifier refers to and can be null if the modifier has been deleted.
     */
    public function modifier()
    {
        return $this->belongsTo(Modifier::class, 'modifier_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sku' => 'string',
        ];
    }
}
