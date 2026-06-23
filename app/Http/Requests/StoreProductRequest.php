<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],

            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['required_with:variants', 'string', 'max:255'],
            'variants.*.sku' => ['required_with:variants', 'string', 'max:255', 'unique:product_variants,sku'],
            'variants.*.price' => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.is_active' => ['required_with:variants', 'boolean'],
            'variants.*.sort_order' => ['required_with:variants', 'integer', 'min:0'],

            'modifier_groups' => ['nullable', 'array'],
            'modifier_groups.*.name' => ['required_with:modifier_groups', 'string', 'max:255'],
            'modifier_groups.*.description' => ['nullable', 'string'],
            'modifier_groups.*.is_required' => ['required_with:modifier_groups', 'boolean'],
            'modifier_groups.*.is_active' => ['required_with:modifier_groups', 'boolean'],
            'modifier_groups.*.min_selection' => ['required_with:modifier_groups', 'integer', 'min:0'],
            'modifier_groups.*.max_selection' => ['required_with:modifier_groups', 'integer', 'min:0'],
            'modifier_groups.*.selection_type' => ['required_with:modifier_groups', 'in:single,multiple'],
            'modifier_groups.*.sort_order' => ['required_with:modifier_groups', 'integer', 'min:0'],

            'modifier_groups.*.modifiers' => ['nullable', 'array'],
            'modifier_groups.*.modifiers.*.name' => ['required_with:modifier_groups.*.modifiers', 'string', 'max:255'],
            'modifier_groups.*.modifiers.*.price' => ['required_with:modifier_groups.*.modifiers', 'numeric', 'min:0'],
            'modifier_groups.*.modifiers.*.is_active' => ['required_with:modifier_groups.*.modifiers', 'boolean'],
            'modifier_groups.*.modifiers.*.sort_order' => ['required_with:modifier_groups.*.modifiers', 'integer', 'min:0'],
        ];
    }

    /**
     * Handle a passed validation attempt.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['slug' => \Illuminate\Support\Str::slug($this->slug)]);
    }
}
