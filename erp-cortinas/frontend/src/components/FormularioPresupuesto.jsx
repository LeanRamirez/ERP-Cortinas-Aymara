import React, { useState, useEffect } from "react";
import styles from "../styles/FormularioPresupuesto.module.css";

export default function FormularioPresupuesto({ 
  presupuesto = null, 
  onSubmit, 
  onCancel, 
  isVisible = false 
}) {
  const [formData, setFormData] = useState({
    descripcion: "",
    cantidad: 1,
    precioUnitario: "",
    estado: "pendiente"
  });
  const [errores, setErrores] = useState({});

  // Calcular precio total automáticamente
  const precioTotal = (parseFloat(formData.cantidad) || 0) * (parseFloat(formData.precioUnitario) || 0);

  useEffect(() => {
    if (presupuesto) {
      // Si hay un presupuesto para editar, cargar sus datos
      setFormData({
        descripcion: presupuesto.descripcion || "",
        cantidad: presupuesto.cantidad || 1,
        precioUnitario: presupuesto.precioUnitario || "",
        estado: presupuesto.estado || "pendiente"
      });
    } else {
      // Si es un nuevo presupuesto, resetear el formulario
      resetFormulario();
    }
  }, [presupuesto]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida";
    }

    if (!formData.cantidad || isNaN(formData.cantidad) || parseInt(formData.cantidad) <= 0) {
      nuevosErrores.cantidad = "La cantidad debe ser un número mayor a 0";
    }

    if (!formData.precioUnitario || isNaN(formData.precioUnitario) || parseFloat(formData.precioUnitario) <= 0) {
      nuevosErrores.precioUnitario = "El precio unitario debe ser un número mayor a 0";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo si existe
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    // Preparar datos para enviar
    const dataToSubmit = {
      descripcion: formData.descripcion,
      cantidad: parseInt(formData.cantidad),
      precioUnitario: parseFloat(formData.precioUnitario),
      precioTotal: precioTotal,
      valor: precioTotal, // Para compatibilidad con el backend actual
      estado: formData.estado
    };

    onSubmit(dataToSubmit);
  };

  const resetFormulario = () => {
    setFormData({
      descripcion: "",
      cantidad: 1,
      precioUnitario: "",
      estado: "pendiente"
    });
    setErrores({});
  };

  const handleCancel = () => {
    resetFormulario();
    onCancel();
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(precio);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{presupuesto ? "Editar Presupuesto" : "Nuevo Presupuesto"}</h3>
          <button 
            className={styles.btnCerrar}
            onClick={handleCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.campo}>
            <label>Descripción del Trabajo *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="4"
              className={errores.descripcion ? styles.error : ""}
              placeholder="Describe el trabajo a realizar..."
              required
            />
            {errores.descripcion && (
              <span className={styles.mensajeError}>{errores.descripcion}</span>
            )}
          </div>

          <div className={styles.camposGrupo}>
            <div className={styles.campo}>
              <label>Cantidad *</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleInputChange}
                min="1"
                step="1"
                className={errores.cantidad ? styles.error : ""}
                placeholder="1"
                required
              />
              {errores.cantidad && (
                <span className={styles.mensajeError}>{errores.cantidad}</span>
              )}
            </div>

            <div className={styles.campo}>
              <label>Precio Unitario (USD) *</label>
              <input
                type="number"
                name="precioUnitario"
                value={formData.precioUnitario}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errores.precioUnitario ? styles.error : ""}
                placeholder="0.00"
                required
              />
              {errores.precioUnitario && (
                <span className={styles.mensajeError}>{errores.precioUnitario}</span>
              )}
            </div>
          </div>

          <div className={styles.camposGrupo}>
            <div className={styles.campo}>
              <label>Precio Total (USD)</label>
              <div className={styles.precioTotal}>
                {formatearPrecio(precioTotal)}
              </div>
              <small className={styles.ayuda}>
                Calculado automáticamente: {formData.cantidad || 0} × {formatearPrecio(parseFloat(formData.precioUnitario) || 0)}
              </small>
            </div>

            <div className={styles.campo}>
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_revision">En Revisión</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>

          <div className={styles.botonesFormulario}>
            <button 
              type="button" 
              onClick={handleCancel}
              className={styles.btnCancelar}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnGuardar}>
              {presupuesto ? "Actualizar" : "Crear"} Presupuesto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
