import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import styles from './AuthorPages.module.css';

export default function MyPosts() {
  const [posts, setPosts] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/author/posts').then((res) => setPosts(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const list = posts.data || [];

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="author" />
      <div className={styles.main}>
        <h1>My Posts</h1>
        <p><Link to="/author/post/create">Create new post</Link></p>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </td>
                  <td><StatusBadge status={post.status} /></td>
                  <td>
                    <Link to={`/author/post/${post.id}/edit`} className={styles.link}>Edit</Link>
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
