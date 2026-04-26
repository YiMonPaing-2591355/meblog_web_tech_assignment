import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../../api/client';
import PostCard from '../../components/PostCard';
import SearchBar from '../../components/SearchBar';
import Sidebar from '../../components/layout/Sidebar';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState({ data: [], meta: {} });
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page };
    if (search) params.search = search;
    if (categoryId) params.category_id = categoryId;
    client.get('/posts', { params })
      .then((res) => setPosts(res.data))
      .catch(() => setPosts({ data: [], meta: {} }))
      .finally(() => setLoading(false));
  }, [page, search, categoryId]);

  useEffect(() => {
    client.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    client.get('/posts', { params: { per_page: 5 } })
      .then((res) => setRecentPosts(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const list = posts.data || [];
  const lastPage = posts.meta?.last_page || 1;

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <img src="/me_logo.png" alt="Me Blog logo" className={styles.heroLogo} />
        <h1 className={styles.heroTitle}>MeBlog</h1>
        <p className={styles.heroSub}>Discover stories and ideas.</p>
        <SearchBar onSearch={handleSearch} />
      </section>

      <div className={styles.content}>
        <div className={styles.main}>
          <h2 className={styles.sectionTitle}>
            {search ? 'Search results' : categoryId ? 'Posts in category' : 'Latest Posts'}
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            <>
              <div className={styles.grid}>
                {list.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {lastPage > 1 && (
                <div className={styles.pagination}>
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {lastPage}
                  </span>
                  <button
                    type="button"
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <Sidebar categories={categories} recentPosts={recentPosts} />
      </div>
    </div>
  );
}
