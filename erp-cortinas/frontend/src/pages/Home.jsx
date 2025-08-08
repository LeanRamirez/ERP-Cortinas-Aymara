import React from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Bienvenido al ERP de Cortinas</h1>
      <p>Versión mínima: clientes y ventas.</p>
    </div>
  );
}
