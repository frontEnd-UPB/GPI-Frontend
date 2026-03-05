import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/GoBack.module.css';

function VectorInline() {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.61538 10L0 5M0 5L4.61538 0M0 5H10.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function GoBack() {
  const navigate = useNavigate();

  return (
    <div className={styles.GoBack_845_3869}>
      <button
        type="button"
        className={styles.ButtonWithIcon_845_3870}
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <span className={styles.Vector_198_3551}>
          <VectorInline />
        </span>
        <span className={styles.ReadMore_198_1860}>Go Back</span>
      </button>
    </div>
  );
}
