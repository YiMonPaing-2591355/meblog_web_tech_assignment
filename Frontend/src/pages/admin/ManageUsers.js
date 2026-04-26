import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AdminPages.module.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingUserId, setApprovingUserId] = useState(null);

  useEffect(() => {
    client.get('/admin/users').then((res) => setUsers(res.data)).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const handleApproveAuthor = (userId) => {
    setApprovingUserId(userId);
    client
      .post(`/admin/users/${userId}/approve-author`)
      .then((res) => {
        const approvedUser = res.data?.user;
        if (!approvedUser) return;
        setUsers((prev) => prev.map((u) => (u.id === approvedUser.id ? { ...u, role: approvedUser.role } : u)));
      })
      .catch(() => {})
      .finally(() => setApprovingUserId(null));
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Manage Users</h1>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                  <td>
                    {u.role === 'author_pending' ? (
                      <button
                        type="button"
                        className={styles.btnApprove}
                        disabled={approvingUserId === u.id}
                        onClick={() => handleApproveAuthor(u.id)}
                      >
                        {approvingUserId === u.id ? 'Approving...' : 'Approve Author'}
                      </button>
                    ) : (
                      '—'
                    )}
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
