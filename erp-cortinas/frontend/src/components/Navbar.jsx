import React from "react";
import styles from "../styles/Navbar.module.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h2>ERP Cortinas</h2>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/presupuestos">Presupuestos</Link></li>
        <li><Link to="/ventas">Ventas</Link></li>
      </ul>
    </nav>
  );
}
