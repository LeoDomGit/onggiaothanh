<?php

namespace App\Http\Requests;

use App\Models\Blogs;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class BlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        $id = $this->route('id');
        if ($this->isMethod('post')) {
            return [
                'title'=>'required',
                'date'    => 'required|date',
                'content' => 'required|string',
                'images'=>'array',
                'images.*'=>'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ];
        } else if ($this->isMethod('put') || $this->isMethod('patch')) {
            $blog=Blogs::where('id',$id)->first();
            if (!$blog) {
                throw new HttpResponseException(response()->json([
                    'check' => false,
                    'msg'   => 'Blog post not found',
                ], 200)); 
            }
        }else if($this->isMethod('delete')){
            $blog=Blogs::where('id',$id)->first();
            if (!$blog) {
                throw new HttpResponseException(response()->json([
                    'check' => false,
                    'msg'   => 'Blog post not found',
                ], 200)); 
            }
        }

        return []; 
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'check' => false,
            'msg'   => $validator->errors()->first(),  
            'errors'=> $validator->errors(),  
        ], 200));
    }
}
