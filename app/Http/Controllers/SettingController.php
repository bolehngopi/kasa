<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public const DEFAULT_SETTINGS = [
        'store_name' => 'Kasa Coffee & Eatery',
        'store_phone' => '+62 812-3456-7890',
        'store_address' => 'Jl. Sudirman No. 123, Jakarta',
        'currency_locale' => 'id-ID',
        'currency_code' => 'IDR',
        'currency_symbol' => 'Rp',
        'decimal_places' => '0',
        'tax_percentage' => '11',
        'service_charge_percentage' => '5',
        'receipt_header' => 'Thank you for visiting Kasa!',
        'receipt_footer' => 'Free Wi-Fi: KasaGuest | Pass: kopi123',
    ];

    /**
     * Check if the logged in user can manage store & receipt settings.
     */
    protected function canManageStore(): bool
    {
        $user = Auth::user();

        if (! $user) {
            return false;
        }

        return $user->can('manage store')
            || $user->can('manage_store')
            || $user->can('manage_products')
            || $user->hasRole('admin')
            || $user->hasRole('owner');
    }

    /**
     * Authorize user for store management actions.
     */
    protected function authorizeManageStore(): void
    {
        if (! $this->canManageStore()) {
            throw new AuthorizationException('You do not have permission to manage store settings.');
        }
    }

    /**
     * Show the settings page (User details & Store settings).
     */
    public function edit(): Response
    {
        $user = Auth::user();

        $settings = [];
        foreach (self::DEFAULT_SETTINGS as $key => $default) {
            $settings[$key] = Setting::getValue($key, $default);
        }

        return Inertia::render('dashboard/settings', [
            'user' => [
                'id' => $user?->id,
                'name' => $user?->name,
                'email' => $user?->email,
                'phone_number' => $user?->phone_number,
            ],
            'canManageStore' => $this->canManageStore(),
            'settings' => $settings,
        ]);
    }

    /**
     * Update user profile settings (Staff, Owner, Admin).
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = Auth::user();

        if (! $user) {
            throw new AuthorizationException;
        }

        $validated = $request->validated();

        if (! empty($validated['new_password'])) {
            if (empty($validated['current_password']) || ! Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The provided current password does not match our records.'],
                ]);
            }

            $user->password = Hash::make($validated['new_password']);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone_number = $validated['phone_number'] ?? null;
        $user->save();

        return redirect()->route('dashboard.settings')->with('success', 'Profile updated successfully.');
    }

    /**
     * Update store and receipt settings (Manage Store role/permission only).
     */
    public function updateStore(UpdateSettingsRequest $request)
    {
        $this->authorizeManageStore();

        $validated = $request->validated();

        foreach ($validated as $key => $value) {
            Setting::setValue($key, (string) ($value ?? ''));
        }

        return redirect()->route('dashboard.settings')->with('success', 'Store settings updated successfully.');
    }
}
