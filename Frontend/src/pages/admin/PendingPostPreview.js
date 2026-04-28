import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import { buildStorageImageUrl } from '../../utils/imageUrl';
import styles from './AdminPages.module.css';

export default function PendingPostPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load post preview.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = (action) => {
    if (!post) return;
    setActionLoading(true);
    setError('');
    client
      .post(`/admin/posts/${post.id}/${action}`)
      .then(() => navigate('/admin/pending'))
      .catch((err) => setError(err.response?.data?.message || `Failed to ${action} post.`))
      .finally(() => setActionLoading(false));
  };

  const handleDelete = () => {
    if (!post || !window.confirm('Delete this post permanently?')) return;
    setActionLoading(true);
    setError('');
    client
      .delete(`/posts/${post.id}`)
      .then(() => navigate('/admin/pending'))
      .catch((err) => setError(err.response?.data?.message || 'Failed to delete post.'))
      .finally(() => setActionLoading(false));
  };

  const imageUrl = buildStorageImageUrl(post?.image_url || post?.image);

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Pending Post Preview</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error && !post ? (
          <p>{error}</p>
        ) : (
          <>
            {error && <p>{error}</p>}
            <p>
              <strong>Status:</strong> {post.status}
            </p>
            <p>
              <strong>Author:</strong> {post.user?.name || '—'} | <strong>Category:</strong>{' '}
              {post.category?.name || '—'}
            </p>
            <h2>{post.title}</h2>
            {imageUrl && (
              <div className={styles.previewImageWrap}>
                <img src={imageUrl} alt={post.title} className={styles.previewImage} />
              </div>
            )}
            <div className={styles.previewContent}>{post.content}</div>
            <div className={styles.previewActions}>
              <button
                type="button"
                onClick={() => handleAction('approve')}
                className={styles.btnApprove}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button
                type="button"
                onClick={() => handleAction('reject')}
                className={styles.btnReject}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={styles.btnDanger}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Delete'}
              </button>
              <Link to="/admin/pending" className={styles.link}>
                Back to pending list
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
