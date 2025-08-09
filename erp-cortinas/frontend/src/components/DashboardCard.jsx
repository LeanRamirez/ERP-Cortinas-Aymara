import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/DashboardCard.module.css";

export default function DashboardCard({ icon, title, description, path, color }) {
  return (
    <Link to={path} className={styles.cardLink}>
      <div className={`${styles.card} ${styles[color]}`}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{icon}</span>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.arrow}>
          <span>→</span>
        </div>
      </div>
    </Link>
  );
}
