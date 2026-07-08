<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['order_id', 'product_id', 'name', 'sku', 'image_url', 'quantity', 'price'])]
class OrderProduct extends Model
{
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
    public function modifiers()
    {
        return $this->hasMany(OrderProductModifier::class);
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
