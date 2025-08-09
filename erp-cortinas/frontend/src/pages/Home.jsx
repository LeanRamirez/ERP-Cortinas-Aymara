import React from "react";
import DashboardCard from "../components/DashboardCard";
import styles from "../styles/Home.module.css";

export default function Home() {
  const dashboardItems = [
    {
      icon: "👥",
      title: "Clientes",
      description: "Gestión completa de clientes y contactos",
      path: "/clientes",
      color: "blue"
    },
    {
      icon: "🏢",
      title: "Proveedores",
      description: "Administración de proveedores y contactos",
      path: "/proveedores",
      color: "green"
    },
    {
      icon: "📦",
      title: "Inventario",
      description: "Control de stock y productos",
      path: "/inventario",
      color: "orange"
    },
    {
      icon: "💰",
      title: "Ventas",
      description: "Registro y seguimiento de ventas",
      path: "/ventas",
      color: "purple"
    },
    {
      icon: "📋",
      title: "Presupuestos",
      description: "Creación y gestión de presupuestos",
      path: "/presupuestos",
      color: "teal"
    },
    {
      icon: "🛒",
      title: "Compras",
      description: "Gestión de órdenes de compra",
      path: "/compras",
      color: "indigo"
    },
    {
      icon: "💳",
      title: "Finanzas",
      description: "Control financiero y contabilidad",
      path: "/finanzas",
      color: "red"
    },
    {
      icon: "📊",
      title: "Reportes",
      description: "Análisis y reportes del negocio",
      path: "/reportes",
      color: "pink"
    },
    {
      icon: "⚙️",
      title: "Configuración",
      description: "Ajustes del sistema y preferencias",
      path: "/configuracion",
      color: "yellow"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>ERP Cortinas Aymara</h1>
        <p className={styles.subtitle}>
          Sistema integral de gestión empresarial para cortinas metálicas
        </p>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>2</div>
          <div className={styles.statLabel}>Módulos Activos</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>100%</div>
          <div className={styles.statLabel}>Disponibilidad</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>24/7</div>
          <div className={styles.statLabel}>Soporte</div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            path={item.path}
            color={item.color}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <h3>¿Necesitas ayuda?</h3>
          <p>Consulta nuestra documentación o contacta al equipo de soporte</p>
          <div className={styles.footerButtons}>
            <button className={styles.btnSecondary}>
              📚 Documentación
            </button>
            <button className={styles.btnPrimary}>
              💬 Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
