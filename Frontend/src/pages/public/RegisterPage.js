import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    client
      .post('/register', { name, email, password, password_confirmation })
      .then((res) => {
        login(res.data.user, res.data.token);
        navigate('/', { replace: true });
      })
      .catch((err) => {
        const d = err.response?.data;
        let msg = 'Registration failed.';
        if (d) {
          if (typeof d.message === 'string') msg = d.message;
          else if (d.errors) msg = Object.values(d.errors).flat().join(' ');
          else if (typeof d === 'string' && d.length < 200) msg = d;
        } else if (err.message === 'Network Error') msg = 'Cannot reach server. Is the API running?';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.wrap}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.error}>{error}</p>}
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
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
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className={styles.footer}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
