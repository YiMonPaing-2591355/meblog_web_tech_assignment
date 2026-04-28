<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');
        return $this->user() && ($this->user()->isAdmin() || $post->user_id === $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'content' => ['sometimes', 'required', 'string'],
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
