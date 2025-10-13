import React, { useState, useEffect } from "react";
import styles from "../styles/ModalEnviarWhatsApp.module.css";
import axios from "axios";
import { getAdminHeaders } from "../utils/auth";

export default function ModalEnviarWhatsApp({ presupuesto, isVisible, onClose, onEnvioExitoso }) {
  const [telefonoDestino, setTelefonoDestino] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isVisible && presupuesto) {
      // Prellenar datos si están disponibles
      const telefonoCliente = presupuesto.clienteTelefono || "";
      setTelefonoDestino(formatearTelefono(telefonoCliente));
      
      setMensaje(`¡Hola ${presupuesto.clienteNombre || ""}! 👋

Te compartimos el presupuesto #${presupuesto.id} que solicitaste.

📋 *Detalles del presupuesto:*
• Descripción: ${presupuesto.descripcion}
• Valor: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(presupuesto.valor)}

El PDF completo estará disponible en el enlace que te enviaremos.

¿Tienes alguna consulta? ¡Estamos aquí para ayudarte! 😊

*Cortinas Aymara*`);
      setError("");
    }
  }, [isVisible, presupuesto]);

  // Formatear número de teléfono automáticamente
  const formatearTelefono = (valor) => {
    // Auto-agregar + si no está presente y el usuario empieza a escribir números
    if (valor && !valor.startsWith('+') && /^\d/.test(valor)) {
      return '+' + valor;
    }
    return valor;
  };

  // Validar formato E.164 para números de teléfono
  const validarTelefono = (telefono) => {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(telefono);
  };

  const handleTelefonoChange = (e) => {
    const valor = e.target.value;
    setTelefonoDestino(formatearTelefono(valor));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!telefonoDestino.trim()) {
      setError("El número de teléfono es requerido");
      return;
    }

    if (!validarTelefono(telefonoDestino)) {
      setError("El número debe estar en formato E.164 (ej: +5491123456789)");
      return;
    }

    if (!mensaje.trim()) {
      setError("El mensaje es requerido");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:4000/api/presupuestos/${presupuesto.id}/enviar-whatsapp`,
        {
          to: telefonoDestino.trim(),
          message: mensaje.trim()
        },
        {
          headers: getAdminHeaders()
        }
      );

      if (response.data.success) {
        onEnvioExitoso && onEnvioExitoso("WhatsApp enviado exitosamente");
        onClose();
      } else {
        setError(response.data.message || "Error al enviar el WhatsApp");
      }
    } catch (error) {
      console.error("Error al enviar WhatsApp:", error);
      
      // Manejar errores específicos
      if (error.response?.status === 401) {
        setError("Error de autenticación. Verifique las credenciales de administrador.");
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Datos inválidos");
      } else if (error.response?.status === 404) {
        setError("Presupuesto no encontrado");
      } else if (error.response?.status === 502) {
        setError(error.response.data.message || "Error de WhatsApp Cloud API");
      } else {
        setError(error.response?.data?.message || "Error al enviar el WhatsApp");
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const limpiarFormulario = () => {
    setTelefonoDestino("");
    setMensaje("");
    setError("");
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  if (!isVisible || !presupuesto) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleModalClick}>
        <div className={styles.header}>
          <h3>📱 Enviar Presupuesto por WhatsApp</h3>
          <button className={styles.btnCerrar} onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.presupuestoInfo}>
            <h4>Presupuesto #{presupuesto.id}</h4>
            <p><strong>Cliente:</strong> {presupuesto.clienteNombre}</p>
            <p><strong>Descripción:</strong> {presupuesto.descripcion}</p>
            <p><strong>Valor:</strong> {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(presupuesto.valor)}</p>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.campo}>
              <label htmlFor="telefonoDestino">Número de WhatsApp: *</label>
              <input
                type="tel"
                id="telefonoDestino"
                value={telefonoDestino}
                onChange={handleTelefonoChange}
                className={styles.input}
                placeholder="+5491123456789"
                required
                disabled={enviando}
              />
              <small className={styles.ayuda}>
                Formato E.164 requerido (incluye código de país con +)
              </small>
            </div>

            <div className={styles.campo}>
              <label htmlFor="mensaje">Mensaje: *</label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className={styles.textarea}
                rows="10"
                placeholder="Escriba su mensaje aquí..."
                required
                disabled={enviando}
                maxLength="2000"
              />
              <div className={styles.contadorContainer}>
                <small className={styles.contador}>
                  {mensaje.length}/2000 caracteres
                </small>
                <small className={styles.ayuda}>
                  Usa *texto* para negrita, _texto_ para cursiva
                </small>
              </div>
            </div>

            <div className={styles.infoFormato}>
              <h5>💡 Tips para WhatsApp:</h5>
              <ul>
                <li>El número debe estar registrado en WhatsApp</li>
                <li>Puedes usar emojis para hacer el mensaje más amigable 😊</li>
                <li>Usa *asteriscos* para texto en negrita</li>
                <li>Usa _guiones bajos_ para texto en cursiva</li>
              </ul>
            </div>

            <div className={styles.botones}>
              <button
                type="button"
                onClick={handleClose}
                className={styles.btnCancelar}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnEnviar}
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "📱 Enviar WhatsApp"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
