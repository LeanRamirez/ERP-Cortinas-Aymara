import React from 'react';
import styles from '../styles/TarjetaConfiguracion.module.css';

const TarjetaConfiguracion = ({ 
  titulo, 
  icono, 
  descripcion, 
  onClick, 
  isExpanded = false
}) => {
  return (
    <div className={`${styles.tarjeta} ${isExpanded ? styles.expandida : ''}`}>
      {/* Header de la tarjeta - clickeable */}
      <div className={styles.header} onClick={onClick}>
        <div className={styles.contenido}>
          <div className={styles.cabecera}>
            <span className={styles.icono}>{icono}</span>
            <h3 className={styles.titulo}>{titulo}</h3>
          </div>
          {descripcion && (
            <p className={styles.descripcion}>{descripcion}</p>
          )}
        </div>
        <div className={styles.accion}>
          <button className={styles.botonEditar} type="button">
            {isExpanded ? 'Cerrar' : 'Ver / Editar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaConfiguracion;
