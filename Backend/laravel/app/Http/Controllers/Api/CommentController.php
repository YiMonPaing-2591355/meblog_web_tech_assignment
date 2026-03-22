<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Post $post): JsonResponse
    {
        if ($post->status !== 'published') {
            return response()->json(['message' => 'Not found.'], 404);
        }

        $comments = Comment::with('user:id,name')
            ->where('post_id', $post->id)
            ->where('status', 'visible')
            ->orderBy('created_at')
            ->get();

        return response()->json($comments);
    }

    public function store(StoreCommentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $comment = Comment::create($data);
        $comment->load('user:id,name');

        return response()->json($comment, 201);
    }

    public function update(Request $request, Comment $comment): JsonResponse
    {
        // Author can update own; admin can update any (e.g. status for moderation)
        if ($request->user()->id !== $comment->user_id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate(['status' => ['sometimes', 'in:visible,hidden,pending']]);

        if ($request->has('status')) {
            $comment->update(['status' => $request->status]);
        }

        $comment->load('user:id,name');

        return response()->json($comment);
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        if ($request->user()->id !== $comment->user_id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}
