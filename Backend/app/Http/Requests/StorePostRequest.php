<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAuthor();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif,webp,bmp,svg,avif,heic,heif,tif,tiff', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.mimes' => 'Please upload a valid image file (jpg, png, webp, gif, bmp, svg, avif, heic, heif, tif, tiff).',
            'image.max' => 'Image size must be 5MB or less.',
        ];
    }
}
