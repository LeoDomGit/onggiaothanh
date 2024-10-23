<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blogs extends Model
{
    use HasFactory;
    protected $table='blogs';
    protected $fillable=[
    'id',
    'title',
    'date',	
    'content',
    'created_at',
    'updated_at'
    ];
    public function images(){
        return $this->hasMany(BlogGallery::class,'blog_id');
    }
}
