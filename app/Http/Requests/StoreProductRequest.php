<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

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
     * @return array<string, mixed>
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
            'modifier_groups.*.modifiers.*.sku' => ['required_with:modifier_groups.*.modifiers', 'string', 'max:255', 'unique:modifiers,sku'],
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
