<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user:id,name', 'category:id,name,slug'])
            ->where('status', 'published')
            ->orderByDesc('published_at');

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = min((int) $request->get('per_page', 15), 50);
        $posts = $query->paginate($perPage);

        return response()->json($posts);
    }

    public function show(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();
        $isOwnerOrAdmin = $user && ($user->id === $post->user_id || $user->isAdmin());

        if ($post->status !== 'published' && ! $isOwnerOrAdmin) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $post->load(['user:id,name', 'category:id,name,slug']);

        return response()->json($post);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        $data['status'] = 'draft';

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create($data);
        $post->load(['user:id,name', 'category:id,name,slug']);

        return response()->json($post, 201);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        if (! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . $post->id;
        }

        $post->update($data);
        $post->load(['user:id,name', 'category:id,name,slug']);

        return response()->json($post);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        if (! $request->user()->isAdmin() && $post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    public function myPosts(Request $request): JsonResponse
    {
        $posts = Post::with(['category:id,name,slug'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->paginate(15);

        return response()->json($posts);
    }

    public function submit(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (! in_array($post->status, ['draft', 'rejected'], true)) {
            return response()->json(['message' => 'Post cannot be submitted.'], 422);
        }

        $post->update([
            'status' => 'pending',
            'submitted_at' => now(),
        ]);
        $post->load(['user:id,name', 'category:id,name,slug']);

        return response()->json($post);
    }
}
