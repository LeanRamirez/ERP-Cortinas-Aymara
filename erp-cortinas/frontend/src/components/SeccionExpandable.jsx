import React from 'react';
import styles from '../styles/SeccionExpandible.module.css';

const SeccionExpandable = ({ children, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.seccionExpandable}>
      <div className={styles.contenido}>
        {children}
      </div>
    </div>
  );
};

export default SeccionExpandable;
