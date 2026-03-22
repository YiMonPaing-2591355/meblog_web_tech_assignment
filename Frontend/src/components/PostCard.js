import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PostCard({ post }) {
  const imageUrl = post.image
    ? `${API_BASE.replace('/api', '')}/storage/${post.image}`
    : null;
  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + (post.content.length > 120 ? '...' : '')
    : '';

  return (
    <article className={styles.card}>
      <Link to={`/post/${post.id}`} className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </Link>
      <div className={styles.body}>
        <Link to={`/post/${post.id}`} className={styles.title}>
          {post.title}
        </Link>
        {post.category && (
          <span className={styles.category}>{post.category.name}</span>
        )}
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.meta}>
          {post.user?.name && <span>{post.user.name}</span>}
          {post.published_at && (
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </article>
  );
}
