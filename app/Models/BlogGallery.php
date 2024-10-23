<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogGallery extends Model
{
    use HasFactory;
    protected $table='blog_images';
    protected $fillable=[
        'id',
        'blog_id',
        'image',
        'created_at',
        'updated_at'
    ];
    public function blog()
    {
        return $this->belongsTo(Blogs::class, 'blog_id');
    }
}
