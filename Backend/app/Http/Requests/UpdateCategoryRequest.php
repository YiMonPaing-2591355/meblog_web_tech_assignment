<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $id = $this->route('category')->id;
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', 'unique:categories,name,' . $id],
        ];
    }
}
