import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          MeBlog
        </Link>
        <div className={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/categories">Categories</Link>
          {user ? (
            <>
              {user.role === 'author' || user.role === 'admin' ? (
                <Link to="/author">Dashboard</Link>
              ) : null}
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button type="button" onClick={handleLogout} className={styles.btnLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
