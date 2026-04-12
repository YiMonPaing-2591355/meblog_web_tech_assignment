<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// CORS preflight (must run before other routes so OPTIONS requests get 200)
Route::options('{any}', fn () => response('', 200))->where('any', '.*');

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);

// Auth required
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'profile']);

    // Comments (any logged-in user)
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Author: posts CRUD + my posts + submit (POST allowed for update with file upload via _method=PUT)
    Route::middleware('author')->group(function () {
        Route::get('/author/posts', [PostController::class, 'myPosts']);
        Route::post('/posts', [PostController::class, 'store']);
        Route::match(['put', 'post'], '/posts/{post}', [PostController::class, 'update']);
        Route::delete('/posts/{post}', [PostController::class, 'destroy']);
        Route::post('/posts/{post}/submit', [PostController::class, 'submit']);
    });

    // Admin
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/pending-posts', [AdminController::class, 'pendingPosts']);
        Route::post('/posts/{post}/approve', [AdminController::class, 'approvePost']);
        Route::post('/posts/{post}/reject', [AdminController::class, 'rejectPost']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/comments', [AdminController::class, 'comments']);
        Route::put('/comments/{comment}', [AdminController::class, 'updateComment']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});
