import React, { useState, useEffect } from 'react';
import styles from '../styles/FormularioConfiguracion.module.css';

const FormularioWhatsApp = ({ configuracion, onGuardar, onProbar, saving }) => {
  // Estado del formulario - solo campos esenciales
  const [formData, setFormData] = useState({
    whatsappPhoneNumberId: '',
    whatsappToken: ''
  });

  const [errors, setErrors] = useState({});
  const [probando, setProbando] = useState(false);
  const [telefonoPrueba, setTelefonoPrueba] = useState('');
  const [mensaje, setMensaje] = useState(null);

  // Cargar datos de configuración cuando cambie
  useEffect(() => {
    if (configuracion) {
      setFormData({
        // Los campos sensibles se dejan vacíos si están enmascarados
        whatsappPhoneNumberId: configuracion.whatsappPhoneNumberId_enc === '***masked***' ? '' : configuracion.whatsappPhoneNumberId || '',
        whatsappToken: configuracion.whatsappToken_enc === '***masked***' ? '' : configuracion.whatsappToken || ''
      });
    }
  }, [configuracion]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulario antes de enviar
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar Phone Number ID (requerido, solo números)
    if (!formData.whatsappPhoneNumberId.trim()) {
      nuevosErrores.whatsappPhoneNumberId = 'El Phone Number ID es requerido';
    } else if (!/^\d+$/.test(formData.whatsappPhoneNumberId.trim())) {
      nuevosErrores.whatsappPhoneNumberId = 'El Phone Number ID debe contener solo números';
    }

    // Validar Token (requerido)
    if (!formData.whatsappToken.trim()) {
      nuevosErrores.whatsappToken = 'El token de acceso es requerido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Validar formato E.164 para números de teléfono
  const validarTelefono = (telefono) => {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(telefono);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    // Preparar datos para enviar (solo campos que no están vacíos)
    const datosParaEnviar = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        datosParaEnviar[key] = formData[key];
      }
    });

    const resultado = await onGuardar(datosParaEnviar);
    
    if (resultado.success) {
      setMensaje({ tipo: 'success', texto: resultado.message });
      setTimeout(() => setMensaje(null), 4000);
    } else {
      setMensaje({ tipo: 'error', texto: resultado.message });
      setTimeout(() => setMensaje(null), 6000);
    }
  };

  // Manejar prueba de WhatsApp
  const handleProbarWhatsApp = async () => {
    if (!telefonoPrueba.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa un número de teléfono para la prueba' });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    if (!validarTelefono(telefonoPrueba)) {
      setMensaje({ tipo: 'error', texto: 'El número debe estar en formato E.164 (ej: +5491123456789)' });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    setProbando(true);
    const resultado = await onProbar({
      to: telefonoPrueba
    });

    if (resultado.success) {
      setMensaje({ tipo: 'success', texto: resultado.message });
      setTelefonoPrueba('');
    } else {
      setMensaje({ tipo: 'error', texto: resultado.message });
    }
    
    setProbando(false);
    setTimeout(() => setMensaje(null), 6000);
  };

  // Formatear número de teléfono automáticamente
  const formatearTelefono = (valor) => {
    // Auto-agregar + si no está presente y el usuario empieza a escribir números
    if (valor && !valor.startsWith('+') && /^\d/.test(valor)) {
      return '+' + valor;
    }
    return valor;
  };

  // Manejar cambios en el campo de teléfono de prueba
  const handleTelefonoChange = (e) => {
    const valor = e.target.value;
    setTelefonoPrueba(formatearTelefono(valor));
  };

  return (
    <div className={styles.formularioContainer}>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        {/* Campos de configuración */}
        <div className={styles.seccionCampos}>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="whatsappPhoneNumberId">Phone Number ID: *</label>
              <input
                type="text"
                id="whatsappPhoneNumberId"
                name="whatsappPhoneNumberId"
                value={formData.whatsappPhoneNumberId}
                onChange={handleChange}
                className={`${styles.input} ${errors.whatsappPhoneNumberId ? styles.inputError : ''}`}
                placeholder="123456789012345"
                required
              />
              {errors.whatsappPhoneNumberId && <span className={styles.error}>{errors.whatsappPhoneNumberId}</span>}
              <small className={styles.ayuda}>ID del número de teléfono en Meta Business</small>
            </div>
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="whatsappToken">Token de Acceso: *</label>
              <input
                type="password"
                id="whatsappToken"
                name="whatsappToken"
                value={formData.whatsappToken}
                onChange={handleChange}
                className={`${styles.input} ${errors.whatsappToken ? styles.inputError : ''}`}
                placeholder="••••••••••••••••••••••••••••••••"
                required
              />
              {errors.whatsappToken && <span className={styles.error}>{errors.whatsappToken}</span>}
              <small className={styles.ayuda}>Token de acceso de la aplicación de Meta</small>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className={styles.seccionInfo}>
          <h4>📋 Información importante</h4>
          <ul className={styles.listaInfo}>
            <li>El número de teléfono debe estar verificado en Meta Business</li>
            <li>El token debe tener permisos para enviar mensajes</li>
            <li>Los números de prueba deben estar registrados como testers</li>
            <li>Formato de teléfono requerido: E.164 (ej: +541123456789)</li>
          </ul>
        </div>

        {/* Sección de prueba */}
        <div className={styles.seccionPrueba}>
          <h4>Probar configuración</h4>
          <div className={styles.filaPrueba}>
            <input
              type="tel"
              value={telefonoPrueba}
              onChange={handleTelefonoChange}
              placeholder="+5491123456789"
              className={styles.input}
            />
            <button
              type="button"
              onClick={handleProbarWhatsApp}
              disabled={probando}
              className={styles.botonProbar}
            >
              {probando ? 'Enviando...' : 'Probar WhatsApp'}
            </button>
          </div>
        </div>

        {/* Botones del formulario */}
        <div className={styles.botonesFormulario}>
          <button
            type="submit"
            disabled={saving}
            className={styles.botonGuardar}
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>

        {/* Mensajes de éxito/error */}
        {mensaje && (
          <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioWhatsApp;
