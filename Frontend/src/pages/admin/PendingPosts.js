import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import { buildStorageImageUrl } from '../../utils/imageUrl';
import styles from './AdminPages.module.css';

export default function PendingPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = () => {
    client
      .get('/admin/pending-posts')
      .then((res) => setPosts(res.data))
      .catch(() => {
        setError('Failed to load pending posts.');
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = (id) => {
    setError('');
    client
      .post(`/admin/posts/${id}/approve`)
      .then(() => fetchPending())
      .catch((err) => setError(err.response?.data?.message || 'Failed to approve post.'));
  };

  const handleReject = (id) => {
    setError('');
    client
      .post(`/admin/posts/${id}/reject`)
      .then(() => fetchPending())
      .catch((err) => setError(err.response?.data?.message || 'Failed to reject post.'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    setError('');
    client
      .delete(`/posts/${id}`)
      .then(() => setPosts((prev) => prev.filter((p) => p.id !== id)))
      .catch((err) => setError(err.response?.data?.message || 'Failed to delete post.'));
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Pending Posts</h1>
        {error && <p>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No pending posts.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Image</th>
                <th>Content</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><Link to={`/post/${post.id}`}>{post.title}</Link></td>
                  <td>{post.user?.name}</td>
                  <td>{post.category?.name}</td>
                  <td>
                    {post.image ? (
                      <img
                        src={buildStorageImageUrl(post.image_url || post.image)}
                        alt={post.title}
                        className={styles.postThumb}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className={styles.contentCell}>
                    {post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 160) : '—'}
                    {post.content && post.content.length > 160 ? '...' : ''}
                  </td>
                  <td>{post.submitted_at ? new Date(post.submitted_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <Link to={`/admin/pending/${post.id}`} className={styles.link}>Preview</Link>
                    {' '}
                    <button type="button" onClick={() => handleApprove(post.id)} className={styles.btnApprove}>Approve</button>
                    {' '}
                    <button type="button" onClick={() => handleReject(post.id)} className={styles.btnReject}>Reject</button>
                    {' '}
                    <button type="button" onClick={() => handleDelete(post.id)} className={styles.btnDanger}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
