<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Permission::findOrCreate('manage store');
    Permission::findOrCreate('manage_products');
    Role::findOrCreate('staff');
    Role::findOrCreate('owner');
});

it('allows any authenticated user to view settings page with profile data', function () {
    $user = User::factory()->create([
        'name' => 'Regular Staff',
        'email' => 'staff@example.com',
    ]);

    $this->actingAs($user)
        ->get('/dashboard/settings')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/settings')
            ->where('user.name', 'Regular Staff')
            ->where('canManageStore', false)
        );
});

it('allows user with manage store permission to see canManageStore as true', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('manage store');

    $this->actingAs($user)
        ->get('/dashboard/settings')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('canManageStore', true)
        );
});

it('allows any user to update their own profile settings', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => Hash::make('old-password-123'),
    ]);

    $response = $this->actingAs($user)->put('/dashboard/settings/profile', [
        'name' => 'John Updated',
        'email' => 'john.updated@example.com',
        'phone_number' => '+6281299990000',
        'current_password' => 'old-password-123',
        'new_password' => 'new-secure-password',
        'new_password_confirmation' => 'new-secure-password',
    ]);

    $response->assertRedirect('/dashboard/settings');

    $user->refresh();
    expect($user->name)->toBe('John Updated');
    expect($user->email)->toBe('john.updated@example.com');
    expect($user->phone_number)->toBe('+6281299990000');
    expect(Hash::check('new-secure-password', $user->password))->toBeTrue();
});

it('allows user with manage store permission to update store settings', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('manage store');

    $response = $this->actingAs($user)->put('/dashboard/settings/store', [
        'store_name' => 'Kasa Roastery & Cafe',
        'store_phone' => '+62 899-1234-5678',
        'store_address' => 'Jl. Senopati No. 45, Jakarta',
        'currency_locale' => 'en-US',
        'currency_code' => 'USD',
        'currency_symbol' => '$',
        'decimal_places' => '2',
        'tax_percentage' => '11',
        'service_charge_percentage' => '5',
        'receipt_header' => 'Welcome to Kasa Roastery!',
        'receipt_footer' => 'Thank you for your order.',
    ]);

    $response->assertRedirect('/dashboard/settings');

    expect(Setting::getValue('store_name'))->toBe('Kasa Roastery & Cafe');
    expect(Setting::getValue('currency_locale'))->toBe('en-US');
    expect(Setting::getValue('currency_code'))->toBe('USD');
    expect(Setting::getValue('currency_symbol'))->toBe('$');
    expect(Setting::getValue('decimal_places'))->toBe('2');
});

it('blocks staff without manage store permission from updating store settings', function () {
    $user = User::factory()->create();
    $user->assignRole('staff');

    $response = $this->actingAs($user)->put('/dashboard/settings/store', [
        'store_name' => 'Unauthorized Name Change',
        'currency_symbol' => 'Rp',
        'decimal_places' => '0',
        'tax_percentage' => '11',
        'service_charge_percentage' => '5',
    ]);

    $response->assertForbidden();
});

it('validates settings input during store update', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('manage store');

    $response = $this->actingAs($user)->put('/dashboard/settings/store', [
        'store_name' => '', // required
        'currency_symbol' => 'Rp',
        'decimal_places' => 10, // max 4
        'tax_percentage' => 150, // max 100
        'service_charge_percentage' => -5, // min 0
    ]);

    $response->assertSessionHasErrors(['store_name', 'decimal_places', 'tax_percentage', 'service_charge_percentage']);
});

it('formats currency correctly using Setting::formatCurrency helper', function () {
    Setting::setValue('currency_locale', 'id-ID');
    Setting::setValue('currency_code', 'IDR');
    Setting::setValue('currency_symbol', 'Rp');
    Setting::setValue('decimal_places', '0');

    $formatted = Setting::formatCurrency(15000);
    expect($formatted)->toContain('15');

    Setting::setValue('currency_locale', 'en-US');
    Setting::setValue('currency_code', 'USD');
    Setting::setValue('currency_symbol', '$');
    Setting::setValue('decimal_places', '2');

    $formattedUsd = Setting::formatCurrency(15.5);
    expect($formattedUsd)->toContain('15.50');
});
