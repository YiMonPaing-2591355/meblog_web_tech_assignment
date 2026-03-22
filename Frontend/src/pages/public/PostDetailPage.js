import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import CommentBox from '../../components/CommentBox';
import styles from './PostDetailPage.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(err.response?.status === 404 ? 'Not found' : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!post || post.status !== 'published') return;
    client.get(`/posts/${id}/comments`).then((res) => setComments(res.data)).catch(() => {});
  }, [id, post]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmitting(true);
    client
      .post('/comments', { post_id: parseInt(id, 10), comment: commentText.trim() })
      .then((res) => setComments((prev) => [...prev, res.data]))
      .then(() => setCommentText(''))
      .catch(() => {})
      .finally(() => setSubmitting(false));
  };

  if (loading) return <div className={styles.wrap}>Loading...</div>;
  if (error || !post) return <div className={styles.wrap}>{error || 'Post not found.'}</div>;
  if (post.status !== 'published') return <div className={styles.wrap}>This post is not available.</div>;

  const imageUrl = post.image ? `${API_BASE.replace('/api', '')}/storage/${post.image}` : null;

  return (
    <div className={styles.wrap}>
      <article className={styles.article}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          {post.user?.name && <span>By {post.user.name}</span>}
          {post.published_at && (
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
          )}
          {post.category?.name && <span>{post.category.name}</span>}
        </div>
        {imageUrl && (
          <div className={styles.imageWrap}>
            <img src={imageUrl} alt="" className={styles.image} />
          </div>
        )}
        <div className={styles.content}>{post.content}</div>

        <section className={styles.commentsSection}>
          <h2>Comments ({comments.length})</h2>
          {comments.map((c) => (
            <CommentBox key={c.id} comment={c} />
          ))}
          {user ? (
            <form onSubmit={handleSubmitComment} className={styles.commentForm}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className={styles.textarea}
              />
              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? 'Sending...' : 'Post comment'}
              </button>
            </form>
          ) : (
            <p className={styles.loginHint}>Log in to leave a comment.</p>
          )}
        </section>
      </article>
    </div>
  );
}
