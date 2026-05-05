import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar({
  variant = 'public',
  categories = [],
  recentPosts = [],
  activeCategoryId = '',
  onCategorySelect,
}) {
  if (variant === 'author') {
    return (
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link to="/author">Dashboard</Link>
          <Link to="/author/posts">My Posts</Link>
          <Link to="/author/post/create">Create Post</Link>
        </nav>
      </aside>
    );
  }

  if (variant === 'admin') {
    return (
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/posts">All Posts</Link>
          <Link to="/admin/pending">Pending Posts</Link>
          <Link to="/admin/categories">Categories</Link>
          <Link to="/admin/comments">Comments</Link>
          <Link to="/admin/users">Users</Link>
        </nav>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <section className={styles.block}>
        <h3>Categories</h3>
        <ul>
          {categories.length ? (
            <>
              <li>
                <button
                  type="button"
                  className={`${styles.categoryButton} ${!activeCategoryId ? styles.activeCategoryButton : ''}`}
                  onClick={() => onCategorySelect?.('')}
                >
                  All Posts
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`${styles.categoryButton} ${String(activeCategoryId) === String(cat.id) ? styles.activeCategoryButton : ''}`}
                    onClick={() => onCategorySelect?.(cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </>
          ) : (
            <li>No categories</li>
          )}
        </ul>
      </section>
      <section className={styles.block}>
        <h3>Recent Posts</h3>
        <ul>
          {recentPosts.length ? (
            recentPosts.map((post) => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </li>
            ))
          ) : (
            <li>No posts yet</li>
          )}
        </ul>
      </section>
    </aside>
  );
}
