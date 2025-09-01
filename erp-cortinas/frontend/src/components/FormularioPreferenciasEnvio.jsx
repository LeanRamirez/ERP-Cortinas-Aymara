import React, { useState, useEffect } from 'react';
import styles from '../styles/FormularioPreferenciasEnvio.module.css';

const FormularioPreferenciasEnvio = () => {
  // Estados para el formulario
  const [configuracion, setConfiguracion] = useState({
    asuntoEmail: '',
    cuerpoEmail: '',
    mensajeWhatsApp: '',
    adjuntarPdf: true,
    autoEnviarEmail: false,
    autoEnviarWhatsApp: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [errores, setErrores] = useState({});

  // Cargar configuración desde la API
  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config/envios');
      
      if (response.ok) {
        const data = await response.json();
        setConfiguracion({
          asuntoEmail: data.asuntoEmail || 'Presupuesto #{numero} de ERP Cortinas',
          cuerpoEmail: data.cuerpoEmail || `Hola {cliente},

Adjunto te enviamos el presupuesto #{numero}. Si tenés dudas, podés responder este correo.

Saludos cordiales,
ERP Cortinas`,
          mensajeWhatsApp: data.mensajeWhatsApp || 'Hola {cliente}! Te enviamos el presupuesto #{numero}. Cualquier consulta, no dudes en escribirnos.',
          adjuntarPdf: data.adjuntarPdf !== undefined ? data.adjuntarPdf : true,
          autoEnviarEmail: data.autoEnviarEmail || false,
          autoEnviarWhatsApp: data.autoEnviarWhatsApp || false
        });
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar la configuración' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los campos
  const handleChange = (campo, valor) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpiar errores del campo modificado
    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: ''
      }));
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!configuracion.asuntoEmail.trim()) {
      nuevosErrores.asuntoEmail = 'El asunto del email es obligatorio';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar configuración
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setSaving(true);
      setMensaje({ tipo: '', texto: '' });

      const response = await fetch('/api/config/envios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracion)
      });

      if (response.ok) {
        setMensaje({ tipo: 'exito', texto: 'Configuración guardada exitosamente' });
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      } else {
        throw new Error('Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setMensaje({ tipo: 'error', texto: 'Error al guardar la configuración' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.titulo}>Preferencias de Envío</h4>
        <p className={styles.descripcion}>
          Configura los mensajes y opciones de envío automático de presupuestos
        </p>
      </div>

      {mensaje.texto && (
        <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formulario}>
        {/* Asunto Email */}
        <div className={styles.campo}>
          <label className={styles.label}>
            Asunto por defecto del email *
          </label>
          <input
            type="text"
            value={configuracion.asuntoEmail}
            onChange={(e) => handleChange('asuntoEmail', e.target.value)}
            className={`${styles.input} ${errores.asuntoEmail ? styles.inputError : ''}`}
            placeholder="Ej: Presupuesto #{numero} de ERP Cortinas"
          />
          {errores.asuntoEmail && (
            <span className={styles.error}>{errores.asuntoEmail}</span>
          )}
          <small className={styles.ayuda}>
            Usa {'{numero}'} para el número de presupuesto y {'{cliente}'} para el nombre del cliente
          </small>
        </div>

        {/* Cuerpo Email */}
        <div className={styles.campo}>
          <label className={styles.label}>
            Cuerpo del mensaje del email
          </label>
          <textarea
            value={configuracion.cuerpoEmail}
            onChange={(e) => handleChange('cuerpoEmail', e.target.value)}
            className={styles.textarea}
            rows="4"
            placeholder="Mensaje del cuerpo del email"
          />
          <small className={styles.ayuda}>
            Usa {'{cliente}'} y {'{numero}'} como variables dinámicas
          </small>
        </div>

        {/* Mensaje WhatsApp */}
        <div className={styles.campo}>
          <label className={styles.label}>
            Mensaje por defecto de WhatsApp
          </label>
          <textarea
            value={configuracion.mensajeWhatsApp}
            onChange={(e) => handleChange('mensajeWhatsApp', e.target.value)}
            className={styles.textarea}
            rows="3"
            placeholder="Mensaje para WhatsApp"
          />
          <small className={styles.ayuda}>
            Usa {'{cliente}'} y {'{numero}'} como variables dinámicas
          </small>
        </div>

        {/* Checkboxes */}
        <div className={styles.checkboxGroup}>
          <div className={styles.checkboxItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={configuracion.adjuntarPdf}
                onChange={(e) => handleChange('adjuntarPdf', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxTexto}>
                Adjuntar PDF del presupuesto automáticamente
              </span>
            </label>
          </div>

          <div className={styles.checkboxItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={configuracion.autoEnviarEmail}
                onChange={(e) => handleChange('autoEnviarEmail', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxTexto}>
                Enviar automáticamente por email al aprobar un presupuesto
              </span>
            </label>
          </div>

          <div className={styles.checkboxItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={configuracion.autoEnviarWhatsApp}
                onChange={(e) => handleChange('autoEnviarWhatsApp', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxTexto}>
                Enviar automáticamente por WhatsApp al aprobar un presupuesto
              </span>
            </label>
          </div>
        </div>

        {/* Botón guardar */}
        <div className={styles.acciones}>
          <button
            type="submit"
            disabled={saving}
            className={`${styles.botonGuardar} ${saving ? styles.guardando : ''}`}
          >
            {saving ? (
              <>
                <span className={styles.spinnerBtn}></span>
                Guardando...
              </>
            ) : (
              'Guardar configuración'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPreferenciasEnvio;
