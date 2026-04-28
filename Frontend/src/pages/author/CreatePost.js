import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AuthorPages.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function CreatePost() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category_id, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', category_id);
    formData.append('content', content);
    if (image) formData.append('image', image);

    client
      .post('/posts', formData)
      .then((res) => navigate('/author/posts'))
      .catch((err) => {
        const d = err.response?.data;
        const message =
          (d?.errors && Object.values(d.errors).flat().join(' ')) ||
          d?.message ||
          'Failed to create post.';
        setError(message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="author" />
      <div className={styles.main}>
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Category
            <select
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cover image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0] || null)}
            />
          </label>
          <label>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
            />
          </label>
          <div className={styles.buttons}>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save as draft'}
            </button>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                const formData = new FormData();
                formData.append('title', title);
                formData.append('category_id', category_id);
                formData.append('content', content);
                if (image) formData.append('image', image);
                client
                  .post('/posts', formData)
                  .then((res) => client.post(`/posts/${res.data.id}/submit`))
                  .then(() => navigate('/author/posts'))
                  .catch((err) => {
                    const d = err.response?.data;
                    const message =
                      (d?.errors && Object.values(d.errors).flat().join(' ')) ||
                      d?.message ||
                      'Failed.';
                    setError(message);
                  })
                  .finally(() => setLoading(false));
              }}
              disabled={loading}
            >
              Submit for review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
