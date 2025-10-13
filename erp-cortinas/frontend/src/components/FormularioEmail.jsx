import React, { useState, useEffect } from 'react';
import styles from '../styles/FormularioConfiguracion.module.css';

const FormularioEmail = ({ configuracion, onGuardar, onProbar, saving }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    fromName: '',
    fromEmail: '',
    smtpUsername: '',
    smtpPassword: '',
    host: '',
    port: '',
    secureTLS: false,
    replyTo: ''
  });

  const [errors, setErrors] = useState({});
  const [probando, setProbando] = useState(false);
  const [emailPrueba, setEmailPrueba] = useState('');
  const [asuntoPrueba, setAsuntoPrueba] = useState('');
  const [mensajePrueba, setMensajePrueba] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [camposModificados, setCamposModificados] = useState(new Set());

  // Cargar configuración existente
  useEffect(() => {
    if (configuracion) {
      setFormData({
        fromName: configuracion.fromName || '',
        fromEmail: configuracion.fromEmail || '',
        smtpUsername: configuracion.smtpUsername_enc === '***masked***' ? '' : configuracion.smtpUsername || '',
        smtpPassword: configuracion.smtpPassword_enc === '***masked***' ? '' : configuracion.smtpPassword || '',
        host: configuracion.host || '',
        port: configuracion.port || '',
        secureTLS: configuracion.secureTLS || false,
        replyTo: configuracion.replyTo || ''
      });
    }
  }, [configuracion]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Marcar campo como modificado
    setCamposModificados(prev => new Set([...prev, name]));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validaciones de campos requeridos
    if (!formData.fromName || !formData.fromName.trim()) {
      nuevosErrores.fromName = 'El nombre del remitente es requerido';
    }

    if (!formData.fromEmail || !formData.fromEmail.trim()) {
      nuevosErrores.fromEmail = 'El email del remitente es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.fromEmail.trim())) {
      nuevosErrores.fromEmail = 'Ingresa un email válido';
    }

    if (!formData.smtpUsername || !formData.smtpUsername.trim()) {
      nuevosErrores.smtpUsername = 'El usuario SMTP es requerido';
    }

    if (!formData.smtpPassword || !formData.smtpPassword.trim()) {
      nuevosErrores.smtpPassword = 'La contraseña SMTP es requerida';
    }

    if (!formData.host || !formData.host.trim()) {
      nuevosErrores.host = 'El servidor SMTP es requerido';
    }

    // Validar puerto (campo numérico) - NO usar .trim() en números
    if (!formData.port || formData.port === '') {
      nuevosErrores.port = 'El puerto es requerido';
    } else {
      const puerto = parseInt(formData.port, 10);
      if (isNaN(puerto) || puerto < 1 || puerto > 65535) {
        nuevosErrores.port = 'El puerto debe estar entre 1 y 65535';
      }
    }

    // Validar replyTo si está presente
    if (formData.replyTo && formData.replyTo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.replyTo.trim())) {
      nuevosErrores.replyTo = 'Ingresa un email válido para respuesta';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    // Preparar datos para enviar (solo campos modificados o todos si es la primera vez)
    const datosParaEnviar = {};
    
    if (camposModificados.size === 0) {
      // Primera vez, enviar todos los campos no vacíos
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          // Convertir port a número para evitar error de Prisma
          if (key === 'port') {
            datosParaEnviar[key] = parseInt(formData[key], 10);
          } else {
            datosParaEnviar[key] = formData[key];
          }
        }
      });
    } else {
      // Solo campos modificados
      camposModificados.forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          // Convertir port a número para evitar error de Prisma
          if (key === 'port') {
            datosParaEnviar[key] = parseInt(formData[key], 10);
          } else {
            datosParaEnviar[key] = formData[key];
          }
        }
      });
    }

    const resultado = await onGuardar(datosParaEnviar);
    
    if (resultado.success) {
      setMensaje({ tipo: 'success', texto: resultado.message });
      setCamposModificados(new Set()); // Limpiar campos modificados
      setTimeout(() => setMensaje(null), 4000);
    } else {
      setMensaje({ tipo: 'error', texto: resultado.message });
      setTimeout(() => setMensaje(null), 6000);
    }
  };

  // Manejar prueba de email
  const handleProbarEmail = async () => {
    if (!emailPrueba.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresa un email para la prueba' });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPrueba)) {
      setMensaje({ tipo: 'error', texto: 'Ingresa un email válido' });
      setTimeout(() => setMensaje(null), 4000);
      return;
    }

    setProbando(true);
    const datosEmail = {
      to: emailPrueba,
      ...(asuntoPrueba.trim() && { subject: asuntoPrueba }),
      ...(mensajePrueba.trim() && { message: mensajePrueba })
    };

    const resultado = await onProbar(datosEmail);

    if (resultado.success) {
      setMensaje({ tipo: 'success', texto: resultado.message });
      setEmailPrueba('');
      setAsuntoPrueba('');
      setMensajePrueba('');
    } else {
      setMensaje({ tipo: 'error', texto: resultado.message });
    }
    
    setProbando(false);
    setTimeout(() => setMensaje(null), 6000);
  };

  return (
    <div className={styles.formularioContainer}>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        {/* Campos de configuración */}
        <div className={styles.seccionCampos}>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="fromName">Nombre del remitente: *</label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                className={`${styles.input} ${errors.fromName ? styles.inputError : ''}`}
                placeholder="Cortinas Aymara"
                required
              />
              {errors.fromName && <span className={styles.error}>{errors.fromName}</span>}
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
                placeholder="••••••••••••••••"
                required
              />
              {errors.smtpPassword && <span className={styles.error}>{errors.smtpPassword}</span>}
              <small className={styles.ayuda}>Para Gmail, usa una contraseña de aplicación</small>
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
                placeholder="587"
                min="1"
                max="65535"
                required
              />
              {errors.port && <span className={styles.error}>{errors.port}</span>}
              <small className={styles.ayuda}>587 para TLS, 465 para SSL, 25 para no seguro</small>
            </div>
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="replyTo">Email de respuesta (opcional):</label>
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
              <small className={styles.ayuda}>Recomendado para la mayoría de proveedores</small>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className={styles.seccionInfo}>
          <h4>📋 Información importante</h4>
          <ul className={styles.listaInfo}>
            <li>Para Gmail: Habilita la verificación en 2 pasos y usa una contraseña de aplicación</li>
            <li>Puerto 587 con TLS es la configuración más común y segura</li>
            <li>Verifica que tu proveedor de email permita SMTP</li>
            <li>Los datos sensibles se cifran automáticamente al guardar</li>
          </ul>
        </div>

        {/* Sección de prueba */}
        <div className={styles.seccionPrueba}>
          <h4>Probar configuración</h4>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label htmlFor="emailPrueba">Email de destino: *</label>
              <input
                type="email"
                id="emailPrueba"
                value={emailPrueba}
                onChange={(e) => setEmailPrueba(e.target.value)}
                placeholder="test@ejemplo.com"
                className={styles.input}
              />
            </div>
            <div className={styles.campo}>
              <label htmlFor="asuntoPrueba">Asunto (opcional):</label>
              <input
                type="text"
                id="asuntoPrueba"
                value={asuntoPrueba}
                onChange={(e) => setAsuntoPrueba(e.target.value)}
                placeholder="Prueba de configuración SMTP"
                className={styles.input}
                maxLength="200"
              />
            </div>
          </div>
          <div className={styles.campo}>
            <label htmlFor="mensajePrueba">Mensaje personalizado (opcional):</label>
            <textarea
              id="mensajePrueba"
              value={mensajePrueba}
              onChange={(e) => setMensajePrueba(e.target.value)}
              placeholder="Mensaje de prueba personalizado..."
              className={styles.input}
              rows="3"
              maxLength="1000"
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>
          <div className={styles.filaPrueba}>
            <button
              type="button"
              onClick={handleProbarEmail}
              disabled={probando}
              className={styles.botonProbar}
            >
              {probando ? 'Enviando...' : 'Probar envío de email'}
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
            {saving ? 'Guardando...' : 'Guardar configuración'}
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

export default FormularioEmail;
