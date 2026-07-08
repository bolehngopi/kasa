<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['staff_id', 'customer_id', 'order_number', 'status', 'total_amount', 'tax_amount', 'discount_amount', 'final_amount'])]
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    /**
     * Get the staff member associated with the order.
     */
    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    /**
     * Get the customer associated with the order.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the products associated with the order.
     */
    public function products()
    {
        return $this->belongsToMany(OrderProduct::class, 'order_product')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }

    /**
     * Get the products modifier associated with the order.
     */
    public function productModifiers()
    {
        return $this->belongsToMany(OrderProductModifier::class, 'order_product_modifier')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => \App\Enums\OrderStatus::class,
            'total_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
        ];
    }
}
