<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::group([
    'prefix' => 'auth',
], function () {
    Route::group([
        'middleware' => ['guest'],
    ], function () {
        Route::get('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
        Route::post('/login', [\App\Http\Controllers\AuthController::class, 'authenticate'])->name('authenticate');
        Route::get('/register', [\App\Http\Controllers\AuthController::class, 'signup'])->name('signup');
        Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register'])->name('register');
    });

    Route::group([
        'middleware' => ['auth'],
    ], function () {
        Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');
    });
});

Route::group([
    'prefix' => 'dashboard',
    'middleware' => ['auth'],
], function () {
    Route::inertia('/', 'dashboard/index')->name('dashboard');
    Route::resource('/products', \App\Http\Controllers\ProductController::class);
    Route::resource('/orders', \App\Http\Controllers\OrderController::class);
});

Route::name('order.')->prefix('order')->group(function () {
    Route::get('/', \App\Http\Controllers\OrderingController::class)->name('index');
    Route::post('/calculate-total', [\App\Http\Controllers\CheckoutController::class, 'calculateTotal'])->name('calculateTotal');
    Route::get('/view-order', [\App\Http\Controllers\CheckoutController::class, 'viewOrder'])->name('viewOrder');
    Route::get('/checkout', [\App\Http\Controllers\CheckoutController::class, 'checkout'])->name('checkout');
});
