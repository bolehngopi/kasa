<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'notes' => ['nullable', 'string', 'max:255'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:' . implode(',', \App\Enums\OrderStatus::cases())],
            'order_products' => ['required', 'array'],
            'order_products.*.product_id' => ['required', 'exists:products,id'],
            'order_products.*.quantity' => ['required', 'integer', 'min:1'],
            'order_products.*.price' => ['required', 'numeric', 'min:0'],
            'order_products.*.modifiers' => ['nullable', 'array'],
            'order_products.*.modifiers.*.modifier_id' => ['nullable', 'exists:modifiers,id'],
            'order_products.*.modifiers.*.name' => ['nullable', 'string', 'max:255'],
            'order_products.*.modifiers.*.price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
