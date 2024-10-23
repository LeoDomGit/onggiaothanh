<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BlogRequest;
use App\Models\Blogs;
use Illuminate\Http\Request;
use App\Models\BlogGallery;
use Illuminate\Support\Facades\Storage;
class BlogsController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blogs::with('images')->orderBy('date', 'asc')->get();
        foreach ($blogs as $blog) {
            foreach ($blog->images as $image) {
                $image->image = 'https://blogs.onggiaothanh.com/storage/blogs/' . $image->image;
            }
        }
        return response()->json($blogs);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogRequest $request)
    {
        $data = $request->all();
        $data['created_at']= now();
        unset($data['images']);
        $id=Blogs::insertGetId($data);
        foreach ($request->file('images') as $file) {

            $imageName = $file->getClientOriginalName();

            $extractTo = storage_path('app/public/blogs/');

            $file->move($extractTo, $imageName);

            BlogGallery::create([
                'blog_id' => $id,
                'image' => $imageName
            ]);

            $result[] = Storage::url('blogs/' . $imageName);
        }
       
        $blogs = Blogs::with('images')->orderBy('date', 'asc')->get();
        foreach ($blogs as $blog) {
            foreach ($blog->images as $image) {
                $image->image = 'https://blogs.onggiaothanh.com/storage/blogs/' . $image->image;
            }
        }
        return response()->json([
            'check' => true,
            'msg' => 'Đã lưu thành công !',
            'data' => $blogs
        ], 200);  
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogRequest $request, $id)
    {
        $data= $request->all();
        $data['updated_at']= now();
        Blogs::where('id',$id)->update($data);

        if($request->has('images')){
            foreach ($request->file('images') as $file) {
                $imageName = $file->getClientOriginalName();
                $extractTo = storage_path('app/public/blogs/');
                $file->move($extractTo, $imageName);
                BlogGallery::create([
                    'blog_id' => $id,
                    'image' => $imageName
                ]);
                $result[] = Storage::url('blogs/' . $imageName);
            }
        }
        $blogs = Blogs::with('images')->orderBy('date', 'asc')->get();
        foreach ($blogs as $blog) {
            foreach ($blog->images as $image) {
                $image->image = 'https://blogs.onggiaothanh.com/storage/blogs/' . $image->image;
            }
        }
        return response()->json([
            'check' => true,
            'msg' => 'Đã sửa thành công !',
            'data' => $blogs
        ], 200);  
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogRequest $request, $id)
    {
        $images = BlogGallery::where('blog_id', $id)->select('image')->get();
        foreach ($images as $image) {
            $filePath = "public/blogs/{$image->image}";
            Storage::delete($filePath);
        }
        BlogGallery::where('blog_id', $id)->delete();
        Blogs::where('id',$id)->delete();
        $blogs = Blogs::with('images')->orderBy('date', 'asc')->get();
        foreach ($blogs as $blog) {
            foreach ($blog->images as $image) {
                $image->image = 'https://blogs.onggiaothanh.com/storage/blogs/' . $image->image;
            }
        }
        return response()->json([
            'check' => true,
            'msg' => 'Đã xoá thành công !',
            'data' => $blogs
        ], 200);  
    }
}
