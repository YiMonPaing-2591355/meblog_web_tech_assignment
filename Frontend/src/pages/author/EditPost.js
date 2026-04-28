import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AuthorPages.module.css';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category_id, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    client
      .get(`/posts/${id}`)
      .then((res) => {
        const p = res.data;
        setTitle(p.title);
        setCategoryId(String(p.category_id));
        setContent(p.content);
        setCurrentImage(p.image);
        setStatus(p.status);
      })
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { title, category_id: Number(category_id), content };
    if (image) {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', title);
      formData.append('category_id', category_id);
      formData.append('content', content);
      formData.append('image', image);
      client
        .post(`/posts/${id}`, formData)
        .then(() => navigate('/author/posts'))
        .catch((err) => {
          const d = err.response?.data;
          const message =
            (d?.errors && Object.values(d.errors).flat().join(' ')) ||
            d?.message ||
            'Failed to update.';
          setError(message);
        })
        .finally(() => setSaving(false));
    } else {
      client
        .put(`/posts/${id}`, payload)
        .then(() => navigate('/author/posts'))
        .catch((err) => setError(err.response?.data?.message || 'Failed to update.'))
        .finally(() => setSaving(false));
    }
  };

  const handleSubmitForReview = () => {
    setSaving(true);
    setError('');
    const payload = { title, category_id: Number(category_id), content };
    client
      .put(`/posts/${id}`, payload)
      .then(() => client.post(`/posts/${id}/submit`))
      .then(() => navigate('/author/posts'))
      .catch((err) => setError(err.response?.data?.message || 'Failed.'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className={styles.wrapper}><Sidebar variant="author" /><div className={styles.main}>Loading...</div></div>;
  if (error && !title) return <div className={styles.wrapper}><Sidebar variant="author" /><div className={styles.main}>{error}</div></div>;

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="author" />
      <div className={styles.main}>
        <h1>Edit Post {status && `(${status})`}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label>
            Title
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Category
            <select value={category_id} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Cover image
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0] || null)} />
            {currentImage && !image && (
              <p className={styles.hint}>Current: {currentImage}</p>
            )}
          </label>
          <label>
            Content
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={12} />
          </label>
          <div className={styles.buttons}>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update'}</button>
            {(status === 'draft' || status === 'rejected') && (
              <button type="button" onClick={handleSubmitForReview} disabled={saving}>
                Resubmit for review
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
