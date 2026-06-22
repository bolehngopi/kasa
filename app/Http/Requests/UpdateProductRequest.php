<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateProductRequest extends FormRequest
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
            'image' => ['nullable', 'image', 'max:2048'],
            'name' => ['string', 'max:255'],
            'slug' => ['string', 'max:255', 'unique:products,slug,'.$this->id],
            'sku' => ['string', 'max:255', 'unique:products,sku,'.$this->id],
            'description' => ['string'],
            'is_active' => ['boolean'],
            'price' => ['numeric', 'min:0'],
            'stock' => ['integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'variants' => ['array', 'nullable'],
            'variants.*.id' => ['nullable', 'exists:product_variants,id'],
            'variants.*.name' => ['required_with:variants', 'string', 'max:255'],
            'variants.*.sku' => ['required_with:variants', 'string', 'max:255', 'unique:product_variants,sku,'.($this->input('variants.*.id') ?? 'NULL')],
            'variants.*.price' => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.is_active' => ['required_with:variants', 'boolean'],
            'variants.*.sort_order' => ['required_with:variants', 'integer', 'min:0'],
        ];
    }

    /**
     * Handle a passed validation attempt.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['slug' => Str::slug($this->slug)]);
    }
}
