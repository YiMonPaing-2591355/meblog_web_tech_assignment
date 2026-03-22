import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Sidebar from '../../components/layout/Sidebar';
import styles from './AdminPages.module.css';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    client.get('/categories').then((res) => setCategories(res.data)).catch(() => []).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    client.post('/categories', { name: name.trim() }).then(() => { setName(''); fetchCategories(); }).catch(() => {});
  };

  const handleUpdate = (id) => {
    if (!editName.trim()) return;
    client.put(`/admin/categories/${id}`, { name: editName.trim() }).then(() => { setEditingId(null); fetchCategories(); }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category?')) return;
    client.delete(`/admin/categories/${id}`).then(() => fetchCategories()).catch(() => {});
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar variant="admin" />
      <div className={styles.main}>
        <h1>Manage Categories</h1>
        <form onSubmit={handleCreate} className={styles.inlineForm}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
          <button type="submit">Add</button>
        </form>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    {editingId === cat.id ? (
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className={styles.inlineInput} />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td>{cat.slug}</td>
                  <td>
                    {editingId === cat.id ? (
                      <>
                        <button type="button" onClick={() => handleUpdate(cat.id)}>Save</button>
                        <button type="button" onClick={() => { setEditingId(null); setEditName(''); }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>Edit</button>
                        <button type="button" onClick={() => handleDelete(cat.id)} className={styles.btnDanger}>Delete</button>
                      </>
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
