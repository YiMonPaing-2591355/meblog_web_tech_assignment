import React, { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, placeholder = 'Search posts...' }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}
