import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AdminPages.module.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/admin/users').then((res) => setUsers(res.data)).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
