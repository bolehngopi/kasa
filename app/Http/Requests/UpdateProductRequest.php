<?php

namespace App\Http\Requests;

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
     * @return array<string, mixed>
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

            'modifier_groups' => ['nullable', 'array'],
            'modifier_groups.*.id' => ['nullable', 'exists:modifier_groups,id'],
            'modifier_groups.*.name' => ['nullable', 'string', 'max:255'],
            'modifier_groups.*.description' => ['nullable', 'string'],
            'modifier_groups.*.is_required' => ['nullable', 'boolean'],
            'modifier_groups.*.is_active' => ['nullable', 'boolean'],
            'modifier_groups.*.min_selection' => ['nullable', 'integer', 'min:0'],
            'modifier_groups.*.max_selection' => ['nullable', 'integer', 'min:0'],
            'modifier_groups.*.selection_type' => ['nullable', 'in:single,multiple'],
            'modifier_groups.*.sort_order' => ['nullable', 'integer', 'min:0'],

            'modifier_groups.*.modifiers' => ['nullable', 'array'],
            'modifier_groups.*.modifiers.*.id' => ['nullable', 'exists:modifiers,id'],
            'modifier_groups.*.modifiers.*.name' => ['nullable', 'string', 'max:255'],
            'modifier_groups.*.modifiers.*.price' => ['nullable', 'numeric', 'min:0'],
            'modifier_groups.*.modifiers.*.is_active' => ['nullable', 'boolean'],
            'modifier_groups.*.modifiers.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'modifier_groups.*.modifiers.*.sku' => ['nullable', 'string', 'max:255', 'unique:modifiers,sku,'.($this->input('modifier_groups.*.modifiers.*.id') ?? 'NULL')],
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
