<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'idempotency_key' => ['nullable', 'string', 'max:64'],
            'customer_id' => ['nullable', 'exists:users,id'],
            'customer_name' => ['required', 'string', 'max:100'],
            'customer_last_name' => ['nullable', 'string', 'max:100'],
            'customer_email' => ['nullable', 'email', 'max:150'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'payment_method' => ['required', 'in:cash,qris'],
            'cart' => ['required', 'array', 'min:1'],
            'cart.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'cart.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'cart.*.notes' => ['nullable', 'string', 'max:500'],
            'cart.*.modifiers' => ['nullable', 'array'],
            'cart.*.modifiers.*.modifier_id' => ['required', 'integer', 'exists:modifiers,id'],
        ];
    }
}
