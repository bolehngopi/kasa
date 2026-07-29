<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::group([
    'prefix' => 'auth',
], function () {
    Route::group([
        'middleware' => ['guest'],
    ], function () {
        Route::get('/login', [AuthController::class, 'login'])->name('login');
        Route::post('/login', [AuthController::class, 'authenticate'])->name('authenticate');
        Route::get('/register', [AuthController::class, 'signup'])->name('signup');
        Route::post('/register', [AuthController::class, 'register'])->name('register');
    });

    Route::group([
        'middleware' => ['auth'],
    ], function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});

Route::group([
    'prefix' => 'dashboard',
    'middleware' => ['auth'],
], function () {
    Route::inertia('/', 'dashboard/index')->name('dashboard');
    Route::resource('/products', ProductController::class);
    Route::resource('/orders', OrderController::class);
});

Route::name('order.')->prefix('order')->group(function () {
    Route::get('/', [OrderController::class, 'ordering'])->name('index');
    Route::post('/calculate-total', [CheckoutController::class, 'calculateTotal'])->name('calculateTotal');
    Route::get('/view-order', [CheckoutController::class, 'viewOrder'])->name('viewOrder');
});

Route::name('invoice.')->prefix('invoice')->group(function () {
    Route::get('/', [InvoiceController::class, 'index'])->name('index');
    Route::get('/{order:order_number}', [InvoiceController::class, 'show'])->name('show');
    Route::post('/api/guest-orders', [InvoiceController::class, 'getGuestOrders'])->name('getGuestOrders');
});

Route::group([
    'prefix' => 'checkout',
], function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/', [CheckoutController::class, 'checkout'])->name('storeCheckout');
});
