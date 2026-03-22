import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import styles from './AdminPages.module.css';

export default function ManageComments() {
  const [data, setData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    client.get('/admin/comments').then((res) => setData(res.data)).catch(() => setData({ data: [] })).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatus = (id, status) => {
    client.put(`/admin/comments/${id}`, { status }).then(() => fetchComments()).catch(() => {});
  };

  const list = data.data || [];

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Manage Comments</h1>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p>No comments.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Post</th>
                <th>User</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td><Link to={`/post/${c.post?.id}`}>{c.post?.title || '—'}</Link></td>
                  <td>{c.user?.name}</td>
                  <td className={styles.commentCell}>{c.comment?.slice(0, 80)}{c.comment?.length > 80 ? '...' : ''}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <button type="button" onClick={() => handleStatus(c.id, 'visible')}>Visible</button>
                    <button type="button" onClick={() => handleStatus(c.id, 'hidden')}>Hidden</button>
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
