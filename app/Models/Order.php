<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Override;

#[Fillable(['staff_id', 'customer_id', 'order_number', 'customer_name', 'customer_email', 'customer_phone', 'status', 'notes', 'total_amount', 'tax_amount', 'discount_amount', 'final_amount'])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    #[Override]
    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = static::generateOrderNumber();
            }
        });
    }

    /**
     * Generate a unique order number based on the template stored in the Settings table.
     *
     * @return string
     */
    public static function generateOrderNumber(): string
    {
        $template = Cache::rememberForever('order_number_template', function () {
            $setting = Setting::where('key', 'order_number_template')->first();

            return $setting ? $setting->value : 'ORD-{UNIQID}';
        });

        do {
            $orderNumber = $template;

            $orderNumber = str_replace(
                ['{Y}', '{m}', '{d}', '{UNIQID}'],
                [date('Y'), date('m'), date('d'), strtoupper(uniqid())],
                $orderNumber
            );

            $orderNumber = preg_replace_callback('/\{RANDOM:(\d+)\}/', function ($matches) {
                $length = (int) $matches[1];
                return strtoupper(Str::random($length));
            }, $orderNumber);

        } while (static::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

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
     * Get the order products associated with the order.
     */
    public function products()
    {
        return $this->hasMany(OrderProduct::class);
    }

    /**
     * Get the payment associated with the order.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'total_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
        ];
    }
}
