import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AuthorPages.module.css';

export default function AuthorDashboard() {
  return (
    <div className={styles.wrapper}>
      <Sidebar variant="author" />
      <div className={styles.main}>
        <h1>Author Dashboard</h1>
        <p>Manage your posts and create new content.</p>
        <div className={styles.actions}>
          <Link to="/author/post/create" className={styles.primaryBtn}>
            Create new post
          </Link>
          <Link to="/author/posts" className={styles.secondaryBtn}>
            My posts
          </Link>
        </div>
      </div>
    </div>
  );
}
