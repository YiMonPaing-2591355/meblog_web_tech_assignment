import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AdminPages.module.css';

export default function PendingPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    client.get('/admin/pending-posts').then((res) => setPosts(res.data)).catch(() => setPosts([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = (id) => {
    client.post(`/admin/posts/${id}/approve`).then(() => fetchPending()).catch(() => {});
  };

  const handleReject = (id) => {
    client.post(`/admin/posts/${id}/reject`).then(() => fetchPending()).catch(() => {});
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Pending Posts</h1>
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
                  <td>{post.submitted_at ? new Date(post.submitted_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <Link to={`/post/${post.id}`} className={styles.link}>View</Link>
                    {' '}
                    <button type="button" onClick={() => handleApprove(post.id)} className={styles.btnApprove}>Approve</button>
                    {' '}
                    <button type="button" onClick={() => handleReject(post.id)} className={styles.btnReject}>Reject</button>
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
