import React from "react";
import styles from "../styles/ModalPDF.module.css";

export default function ModalPDF({ presupuesto, isVisible, onClose }) {
  if (!isVisible || !presupuesto) return null;

  const pdfUrl = `http://localhost:4000/api/presupuestos/${presupuesto.id}/pdf`;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <div className={styles.header}>
          <h3>Vista Previa - Presupuesto #{presupuesto.id}</h3>
          <button className={styles.btnCerrar} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.presupuestoInfo}>
            <p><strong>Cliente:</strong> {presupuesto.clienteNombre}</p>
            <p><strong>Descripción:</strong> {presupuesto.descripcion}</p>
            <p><strong>Valor:</strong> {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(presupuesto.valor)}</p>
          </div>
          <div className={styles.pdfContainer}>
            <iframe
              src={pdfUrl}
              title={`Presupuesto ${presupuesto.id}`}
              className={styles.pdfFrame}
              width="100%"
              height="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
