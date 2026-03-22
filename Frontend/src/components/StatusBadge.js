import React from 'react';
import styles from './StatusBadge.module.css';

const statusClass = {
  pending: styles.pending,
  published: styles.published,
  rejected: styles.rejected,
  draft: styles.draft,
  visible: styles.visible,
  hidden: styles.hidden,
};

export default function StatusBadge({ status }) {
  const className = statusClass[status] || styles.draft;
  const label = status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : '—';

  return <span className={`${styles.badge} ${className}`}>{label}</span>;
}
