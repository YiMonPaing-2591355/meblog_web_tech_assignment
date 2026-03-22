import React from 'react';
import styles from './CommentBox.module.css';

export default function CommentBox({ comment }) {
  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <strong>{comment.user?.name || 'Anonymous'}</strong>
        <span className={styles.date}>
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>
      <p className={styles.body}>{comment.comment}</p>
    </div>
  );
}
