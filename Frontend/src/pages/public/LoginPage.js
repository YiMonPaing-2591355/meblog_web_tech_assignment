import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    client
      .post('/login', { email, password })
      .then((res) => {
        login(res.data.user, res.data.token);
        navigate(from, { replace: true });
      })
      .catch((err) => {
        const d = err.response?.data;
        let msg = 'Login failed.';
        if (d) {
          if (typeof d.message === 'string') msg = d.message;
          else if (d.errors?.email?.[0]) msg = d.errors.email[0];
          else if (typeof d === 'string' && d.length < 200) msg = d;
        } else if (err.message === 'Network Error') msg = 'Cannot reach server. Is the API running at ' + (process.env.REACT_APP_API_URL || 'http://localhost:8000/api') + '?';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.wrap}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className={styles.footer}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
