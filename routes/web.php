<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('auth')->group(function () {
    Route::middleware(['guest'])->group(function () {
        Route::get('/login', [AuthController::class, 'login'])->name('login');
        Route::post('/login', [AuthController::class, 'authenticate'])
            ->middleware('throttle:10,1')->name('authenticate');
        Route::get('/register', [AuthController::class, 'signup'])->name('signup');
        Route::post('/register', [AuthController::class, 'register'])
            ->middleware('throttle:5,1')->name('register');
    });

    Route::middleware(['auth'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});

Route::group([
    'prefix' => 'dashboard',
    'middleware' => ['auth'],
], function () {
    Route::inertia('/', 'dashboard/index')->name('dashboard');
    Route::inertia('/settings', 'dashboard/settings')->name('dashboard.settings');
    Route::resource('/products', ProductController::class);
    Route::resource('/orders', OrderController::class);
});

Route::name('order.')->prefix('order')->group(function () {
    Route::get('/', [OrderController::class, 'ordering'])->name('index');
    Route::post('/calculate-total', [CheckoutController::class, 'calculateTotal'])
        ->middleware('throttle:60,1')->name('calculateTotal');
    Route::get('/view-order', [CheckoutController::class, 'viewOrder'])->name('viewOrder');
});

Route::name('invoice.')->prefix('invoice')->group(function () {
    Route::get('/', [InvoiceController::class, 'index'])->name('index');
    Route::get('/{order:order_number}', [InvoiceController::class, 'show'])->name('show');
    Route::post('/api/guest-orders', [InvoiceController::class, 'getGuestOrders'])
        ->middleware('throttle:30,1')->name('getGuestOrders');
});

Route::prefix('checkout')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/', [CheckoutController::class, 'checkout'])
        ->middleware('throttle:20,1')->name('storeCheckout');
});
