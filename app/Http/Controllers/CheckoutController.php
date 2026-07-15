<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function viewOrder(Request $request)
    {
        return inertia('order/view-order');
    }
}
