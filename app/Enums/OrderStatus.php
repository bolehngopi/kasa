<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PAYMENT_PENDING = 'payment_pending';
    case PAYMENT_FAILED = 'payment_failed';
    case PAID = 'paid';
    case PENDING = 'pending';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';
}
