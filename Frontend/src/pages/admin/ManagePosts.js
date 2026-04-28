import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import { buildStorageImageUrl } from '../../utils/imageUrl';
import styles from './AdminPages.module.css';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = (selectedStatus = status) => {
    setLoading(true);
    setError('');
    const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
    client
      .get('/admin/posts', { params })
      .then((res) => setPosts(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load posts.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    setError('');
    client
      .delete(`/posts/${id}`)
      .then(() => setPosts((prev) => prev.filter((p) => p.id !== id)))
      .catch((err) => setError(err.response?.data?.message || 'Failed to delete post.'));
  };

  const handleStatusChange = (e) => {
    const next = e.target.value;
    setStatus(next);
    fetchPosts(next);
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>All Posts</h1>
        <div className={styles.inlineForm}>
          <label>
            Status{' '}
            <select value={status} onChange={handleStatusChange} className={styles.inlineInput}>
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>
        {error && <p>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Image</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.status}</td>
                  <td>{post.user?.name || '—'}</td>
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
                  <td>{post.category?.name || '—'}</td>
                  <td>
                    {post.status === 'pending' ? (
                      <Link to={`/admin/pending/${post.id}`} className={styles.link}>Preview</Link>
                    ) : (
                      <Link to={`/post/${post.id}`} className={styles.link}>View</Link>
                    )}
                    <button type="button" onClick={() => handleDelete(post.id)} className={styles.btnDanger}>
                      Delete
                    </button>
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
