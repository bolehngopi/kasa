<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = $product instanceof Product ? $product->id : $product;

        return [
            'image' => ['nullable', 'image', 'max:2048'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($productId)],
            'sku' => ['required', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($productId)],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],

            'modifier_groups' => ['nullable', 'array'],
            'modifier_groups.*.id' => ['nullable', 'exists:modifier_groups,id'],
            'modifier_groups.*.name' => ['required_with:modifier_groups', 'string', 'max:255'],
            'modifier_groups.*.description' => ['nullable', 'string'],
            'modifier_groups.*.is_required' => ['nullable', 'boolean'],
            'modifier_groups.*.is_active' => ['nullable', 'boolean'],
            'modifier_groups.*.min_selection' => ['nullable', 'integer', 'min:0'],
            'modifier_groups.*.max_selection' => ['nullable', 'integer', 'min:0'],
            'modifier_groups.*.selection_type' => ['nullable', 'in:single,multiple'],
            'modifier_groups.*.sort_order' => ['nullable', 'integer', 'min:0'],

            'modifier_groups.*.modifiers' => ['nullable', 'array'],
            'modifier_groups.*.modifiers.*.id' => ['nullable', 'exists:modifiers,id'],
            'modifier_groups.*.modifiers.*.name' => ['required_with:modifier_groups.*.modifiers', 'string', 'max:255'],
            'modifier_groups.*.modifiers.*.price' => ['required_with:modifier_groups.*.modifiers', 'numeric', 'min:0'],
            'modifier_groups.*.modifiers.*.is_active' => ['nullable', 'boolean'],
            'modifier_groups.*.modifiers.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'modifier_groups.*.modifiers.*.sku' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Handle a passed validation attempt.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('slug')) {
            $this->merge(['slug' => Str::slug($this->slug)]);
        }
    }
}
