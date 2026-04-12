<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingPosts(): JsonResponse
    {
        $posts = Post::with(['user:id,name', 'category:id,name,slug'])
            ->where('status', 'pending')
            ->orderBy('submitted_at')
            ->get();

        return response()->json($posts);
    }

    public function approvePost(Request $request, Post $post): JsonResponse
    {
        if ($post->status !== 'pending') {
            return response()->json(['message' => 'Post is not pending.'], 422);
        }

        $post->update([
            'status' => 'published',
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
            'published_at' => now(),
        ]);
        $post->load(['user:id,name', 'category:id,name,slug']);

        return response()->json($post);
    }

    public function rejectPost(Request $request, Post $post): JsonResponse
    {
        if ($post->status !== 'pending') {
            return response()->json(['message' => 'Post is not pending.'], 422);
        }

        $post->update([
            'status' => 'rejected',
            'approved_at' => null,
            'approved_by' => null,
        ]);
        $post->load(['user:id,name', 'category:id,name,slug']);

        return response()->json($post);
    }

    public function users(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    public function comments(): JsonResponse
    {
        $comments = Comment::with(['user:id,name', 'post:id,title,slug'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($comments);
    }

    public function updateComment(Request $request, Comment $comment): JsonResponse
    {
        $request->validate(['status' => ['required', 'in:visible,hidden,pending']]);

        $comment->update(['status' => $request->status]);
        $comment->load(['user:id,name', 'post:id,title,slug']);

        return response()->json($comment);
    }
}
