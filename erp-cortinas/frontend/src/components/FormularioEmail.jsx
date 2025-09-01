import React, { useState, useEffect } from 'react';
import styles from '../styles/FormularioConfiguracion.module.css';

const FormularioEmail = ({ configuracion, onGuardar, onProbar, saving }) => {
  const [formData, setFormData] = useState({
    fromName: '',
    fromEmail: '',
    host: '',
    port: 587,
    secureTLS: true,
    replyTo: '',
    smtpUsername: '',
    smtpPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [probando, setProbando] = useState(false);
  const [emailPrueba, setEmailPrueba] = useState('');
  const [mensaje, setMensaje] = useState(null);

  // Cargar datos de configuración cuando cambie
  useEffect(() => {
    if (configuracion) {
      setFormData({
        fromName: configuracion.fromName || '',
        fromEmail: configuracion.fromEmail || '',
        host: configuracion.host || '',
        port: configuracion.port || 587,
        secureTLS: configuracion.secureTLS !== undefined ? configuracion.secureTLS : true,
        replyTo: configuracion.replyTo || '',
        // Los campos sensibles se dejan vacíos si están enmascarados
        smtpUsername: configuracion.smtpUsername_enc === '***masked***' ? '' : configuracion.smtpUsername || '',
        smtpPassword: configuracion.smtpPassword_enc === '***masked***' ? '' : configuracion.smtpPassword || ''
      });
    }
  }, [configuracion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.fromEmail.trim()) {
      nuevosErrores.fromEmail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.fromEmail)) {
      nuevosErrores.fromEmail = 'Email inválido';
    }

    if (!formData.host.trim()) {
      nuevosErrores.host = 'El host SMTP es requerido';
    }

    if (!formData.port || formData.port < 1 || formData.port > 65535) {
      nuevosErrores.port = 'Puerto inválido (1-65535)';
    }

    if (!formData.smtpUsername.trim()) {
      nuevosErrores.smtpUsername = 'El usuario SMTP es requerido';
    }

    if (!formData.smtpPassword.trim()) {
      nuevosErrores.smtpPassword = 'La contraseña SMTP es requerida';
    }

    if (formData.replyTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.replyTo)) {
      nuevosErrores.replyTo = 'Email de respuesta inválido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

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

  const handleProbarEmail = async () => {
    if (!emailPrueba.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa un email para la prueba' });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPrueba)) {
      setMensaje({ tipo: 'error', texto: 'Email de prueba inválido' });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    setProbando(true);
    const resultado = await onProbar({
      to: emailPrueba,
      subject: 'Prueba de configuración SMTP',
      message: 'Este es un mensaje de prueba desde el ERP Cortinas Aymara.'
    });

    if (resultado.success) {
      setMensaje({ tipo: 'success', texto: resultado.message });
      setEmailPrueba('');
    } else {
      setMensaje({ tipo: 'error', texto: resultado.message });
    }
    
    setProbando(false);
    setTimeout(() => setMensaje(null), 6000);
  };

  return (
    <div className={styles.formularioContainer}>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.seccionCampos}>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="fromName">Nombre del remitente:</label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ej: Cortinas Aymara"
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="fromEmail">Email del remitente: *</label>
              <input
                type="email"
                id="fromEmail"
                name="fromEmail"
                value={formData.fromEmail}
                onChange={handleChange}
                className={`${styles.input} ${errors.fromEmail ? styles.inputError : ''}`}
                placeholder="info@cortinasaymara.com"
                required
              />
              {errors.fromEmail && <span className={styles.error}>{errors.fromEmail}</span>}
            </div>
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="host">Servidor SMTP: *</label>
              <input
                type="text"
                id="host"
                name="host"
                value={formData.host}
                onChange={handleChange}
                className={`${styles.input} ${errors.host ? styles.inputError : ''}`}
                placeholder="smtp.gmail.com"
                required
              />
              {errors.host && <span className={styles.error}>{errors.host}</span>}
            </div>
            <div className={styles.campo}>
              <label htmlFor="port">Puerto: *</label>
              <input
                type="number"
                id="port"
                name="port"
                value={formData.port}
                onChange={handleChange}
                className={`${styles.input} ${errors.port ? styles.inputError : ''}`}
                min="1"
                max="65535"
                required
              />
              {errors.port && <span className={styles.error}>{errors.port}</span>}
            </div>
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="smtpUsername">Usuario SMTP: *</label>
              <input
                type="text"
                id="smtpUsername"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleChange}
                className={`${styles.input} ${errors.smtpUsername ? styles.inputError : ''}`}
                placeholder="usuario@gmail.com"
                required
              />
              {errors.smtpUsername && <span className={styles.error}>{errors.smtpUsername}</span>}
            </div>
            <div className={styles.campo}>
              <label htmlFor="smtpPassword">Contraseña SMTP: *</label>
              <input
                type="password"
                id="smtpPassword"
                name="smtpPassword"
                value={formData.smtpPassword}
                onChange={handleChange}
                className={`${styles.input} ${errors.smtpPassword ? styles.inputError : ''}`}
                placeholder="••••••••••••"
                required
              />
              {errors.smtpPassword && <span className={styles.error}>{errors.smtpPassword}</span>}
            </div>
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="replyTo">Email de respuesta:</label>
              <input
                type="email"
                id="replyTo"
                name="replyTo"
                value={formData.replyTo}
                onChange={handleChange}
                className={`${styles.input} ${errors.replyTo ? styles.inputError : ''}`}
                placeholder="ventas@cortinasaymara.com"
              />
              {errors.replyTo && <span className={styles.error}>{errors.replyTo}</span>}
            </div>
            <div className={styles.campo}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="secureTLS"
                  name="secureTLS"
                  checked={formData.secureTLS}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <label htmlFor="secureTLS">Usar TLS seguro</label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.seccionPrueba}>
          <h4>Probar configuración</h4>
          <div className={styles.filaPrueba}>
            <input
              type="email"
              value={emailPrueba}
              onChange={(e) => setEmailPrueba(e.target.value)}
              placeholder="email@ejemplo.com"
              className={styles.input}
            />
            <button
              type="button"
              onClick={handleProbarEmail}
              disabled={probando}
              className={styles.botonProbar}
            >
              {probando ? 'Enviando...' : 'Probar Email'}
            </button>
          </div>
        </div>

        <div className={styles.botonesFormulario}>
          <button
            type="submit"
            disabled={saving}
            className={styles.botonGuardar}
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>

        {mensaje && (
          <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
            {mensaje.texto}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioEmail;
