<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token(): void
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertCreated()
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'role'],
                'token',
                'token_type',
            ])
            ->assertJsonPath('user.email', 'test@example.com')
            ->assertJsonPath('user.role', 'user');

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'user',
        ]);
    }

    public function test_author_registration_starts_as_pending_author(): void
    {
        $payload = [
            'name' => 'Pending Author',
            'email' => 'author@example.com',
            'role' => 'author',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertCreated()
            ->assertJsonPath('user.email', 'author@example.com')
            ->assertJsonPath('user.role', 'author_pending');

        $this->assertDatabaseHas('users', [
            'email' => 'author@example.com',
            'role' => 'author_pending',
        ]);
    }

    public function test_admin_can_approve_pending_author(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $pendingAuthor = User::factory()->create(['role' => 'author_pending']);

        $response = $this
            ->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/users/'.$pendingAuthor->id.'/approve-author');

        $response->assertOk()
            ->assertJsonPath('message', 'Author account approved.')
            ->assertJsonPath('user.id', $pendingAuthor->id)
            ->assertJsonPath('user.role', 'author');

        $this->assertDatabaseHas('users', [
            'id' => $pendingAuthor->id,
            'role' => 'author',
        ]);
    }

    public function test_public_posts_endpoint_returns_only_published_posts(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'Tech',
            'slug' => 'tech',
        ]);

        $published = Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Published Post',
            'slug' => 'published-post',
            'content' => 'Visible content',
            'status' => 'published',
            'published_at' => now(),
        ]);

        Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Draft Post',
            'slug' => 'draft-post',
            'content' => 'Hidden content',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/posts');

        $response->assertOk()
            ->assertJsonFragment(['id' => $published->id, 'title' => 'Published Post'])
            ->assertJsonMissing(['title' => 'Draft Post']);
    }

    public function test_non_author_user_cannot_create_post(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $category = Category::create([
            'name' => 'General',
            'slug' => 'general',
        ]);

        $payload = [
            'title' => 'Unauthorized Create',
            'category_id' => $category->id,
            'content' => 'No permission to create posts.',
        ];

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/posts', $payload);

        $response->assertForbidden();
    }

    public function test_author_can_create_post_and_it_starts_as_draft(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $category = Category::create([
            'name' => 'News',
            'slug' => 'news',
        ]);

        $payload = [
            'title' => 'New Article',
            'category_id' => $category->id,
            'content' => 'Article body',
        ];

        $response = $this
            ->actingAs($author, 'sanctum')
            ->postJson('/api/posts', $payload);

        $response->assertCreated()
            ->assertJsonPath('title', 'New Article')
            ->assertJsonPath('status', 'draft');

        $this->assertDatabaseHas('posts', [
            'title' => 'New Article',
            'status' => 'draft',
            'user_id' => $author->id,
        ]);
    }

    public function test_authenticated_user_can_create_comment(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $commenter = User::factory()->create(['role' => 'user']);
        $category = Category::create([
            'name' => 'Lifestyle',
            'slug' => 'lifestyle',
        ]);
        $post = Post::create([
            'user_id' => $author->id,
            'category_id' => $category->id,
            'title' => 'Commentable Post',
            'slug' => 'commentable-post',
            'content' => 'Post for comment tests',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $payload = [
            'post_id' => $post->id,
            'comment' => 'Great post!',
        ];

        $response = $this
            ->actingAs($commenter, 'sanctum')
            ->postJson('/api/comments', $payload);

        $response->assertCreated()
            ->assertJsonPath('comment', 'Great post!')
            ->assertJsonPath('user.id', $commenter->id);

        $this->assertDatabaseHas('comments', [
            'post_id' => $post->id,
            'user_id' => $commenter->id,
            'comment' => 'Great post!',
        ]);
    }
}
