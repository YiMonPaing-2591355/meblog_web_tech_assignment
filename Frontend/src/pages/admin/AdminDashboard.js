import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AdminPages.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Admin Dashboard</h1>
        <p>Manage all posts, pending reviews, categories, comments, and users.</p>
        <div className={styles.cards}>
          <Link to="/admin/posts" className={styles.card}>
            <h3>All Posts</h3>
            <p>Manage published, draft, pending, rejected</p>
          </Link>
          <Link to="/admin/pending" className={styles.card}>
            <h3>Pending Posts</h3>
            <p>Review and approve or reject</p>
          </Link>
          <Link to="/admin/categories" className={styles.card}>
            <h3>Categories</h3>
            <p>CRUD categories</p>
          </Link>
          <Link to="/admin/comments" className={styles.card}>
            <h3>Comments</h3>
            <p>Moderate comments</p>
          </Link>
          <Link to="/admin/users" className={styles.card}>
            <h3>Users</h3>
            <p>View and manage users</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
