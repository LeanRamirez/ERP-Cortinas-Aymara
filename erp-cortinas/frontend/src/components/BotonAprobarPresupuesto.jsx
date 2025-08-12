import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useVentasFromPresupuestos from '../hooks/useVentasFromPresupuestos';
import styles from '../styles/BotonAprobarPresupuesto.module.css';

const BotonAprobarPresupuesto = ({ 
  presupuesto, 
  onVentaCreada, 
  onPresupuestoActualizado,
  disabled = false 
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { aprobarPresupuesto, loading, error, clearError } = useVentasFromPresupuestos();

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!showConfirmation) {
      clearError();
    }
  }, [showConfirmation, clearError]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showConfirmation) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showConfirmation]);

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showConfirmation && !loading) {
        handleCancel();
      }
    };

    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showConfirmation, loading]);

  // Manejar clic fuera del modal
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleCancel();
    }
  };

  const handleAprobar = async () => {
    try {
      const ventaCreada = await aprobarPresupuesto(presupuesto.id);
      
      // Notificar que se creó la venta
      if (onVentaCreada) {
        onVentaCreada(ventaCreada);
      }
      
      // Notificar que se actualizó el presupuesto
      if (onPresupuestoActualizado) {
        onPresupuestoActualizado({
          ...presupuesto,
          estado: 'aprobado',
          ventaId: ventaCreada.id
        });
      }
      
      setShowConfirmation(false);
      
      // Mostrar mensaje de éxito
      alert(`¡Presupuesto aprobado! Se ha creado la venta #${ventaCreada.id}`);
      
    } catch (err) {
      console.error('Error al aprobar presupuesto:', err);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    clearError();
  };

  // No mostrar el botón si el presupuesto ya está aprobado
  if (presupuesto.estado === 'aprobado') {
    return (
      <span className={styles.estadoAprobado}>
        ✓ Aprobado
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        disabled={disabled || loading}
        className={styles.botonAprobar}
        title="Aprobar presupuesto y crear venta"
      >
        {loading ? 'Procesando...' : '✓ Aprobar'}
      </button>

      {showConfirmation && createPortal(
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Confirmar Aprobación</h3>
            </div>
            
            <div className={styles.modalBody}>
              <p>
                ¿Está seguro de que desea aprobar este presupuesto?
              </p>
              <div className={styles.detallesPresupuesto}>
                <p><strong>Cliente:</strong> {presupuesto.cliente}</p>
                <p><strong>Total:</strong> {new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: 'ARS'
                }).format(presupuesto.total)}</p>
              </div>
              <p className={styles.advertencia}>
                Esta acción creará automáticamente una venta y marcará el presupuesto como aprobado.
              </p>
              
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button
                onClick={handleCancel}
                className={styles.botonCancelar}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleAprobar}
                className={styles.botonConfirmar}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar Aprobación'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BotonAprobarPresupuesto;
