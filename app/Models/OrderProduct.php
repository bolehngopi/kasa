<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Fillable(['order_id', 'product_id', 'name', 'sku', 'image_url', 'quantity', 'price', 'notes'])]
class OrderProduct extends Pivot
{
    public $incrementing = true;

    /**
     * Get the order that this product belongs to.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product that this order product refers to and can be null if the product has been deleted.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the modifiers associated with this order product.
     */
    public function orderModifiers()
    {
        return $this->hasMany(OrderProductModifier::class, 'order_product_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'price' => 'decimal:2',
        ];
    }
}
