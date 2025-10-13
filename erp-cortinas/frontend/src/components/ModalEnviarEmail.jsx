import React, { useState, useEffect } from "react";
import styles from "../styles/ModalEnviarEmail.module.css";
import axios from "axios";

export default function ModalEnviarEmail({ presupuesto, isVisible, onClose, onEnvioExitoso }) {
  const [emailDestino, setEmailDestino] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isVisible && presupuesto) {
      // Prellenar datos si están disponibles
      setEmailDestino(presupuesto.clienteEmail || "");
      setAsunto(`Presupuesto #${presupuesto.id} - ${presupuesto.descripcion}`);
      setMensaje(`Estimado/a ${presupuesto.clienteNombre || "Cliente"},

Adjuntamos el presupuesto solicitado para su revisión.

Datos del presupuesto:
- Número: ${presupuesto.id}
- Descripción: ${presupuesto.descripcion}
- Valor: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(presupuesto.valor)}

Quedamos a su disposición para cualquier consulta.

Saludos cordiales,
Cortinas Aymara`);
      setError("");
    }
  }, [isVisible, presupuesto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailDestino.trim()) {
      setError("El email de destino es requerido");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDestino)) {
      setError("Ingresa un email válido");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:4000/api/presupuestos/${presupuesto.id}/enviar-email`,
        {
          email: emailDestino.trim(),
          asunto: asunto.trim() || `Presupuesto #${presupuesto.id}`,
          mensaje: mensaje.trim()
        }
      );

      if (response.data.success) {
        onEnvioExitoso && onEnvioExitoso("Email enviado exitosamente");
        onClose();
      } else {
        setError(response.data.message || "Error al enviar el email");
      }
    } catch (error) {
      console.error("Error al enviar email:", error);
      setError(error.response?.data?.message || "Error al enviar el email");
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
    setEmailDestino("");
    setAsunto("");
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
          <h3>📧 Enviar Presupuesto por Email</h3>
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
              <label htmlFor="emailDestino">Email de destino: *</label>
              <input
                type="email"
                id="emailDestino"
                value={emailDestino}
                onChange={(e) => setEmailDestino(e.target.value)}
                className={styles.input}
                placeholder="cliente@ejemplo.com"
                required
                disabled={enviando}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="asunto">Asunto:</label>
              <input
                type="text"
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className={styles.input}
                placeholder="Asunto del email"
                disabled={enviando}
                maxLength="200"
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="mensaje">Mensaje:</label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className={styles.textarea}
                rows="8"
                placeholder="Escriba su mensaje aquí..."
                disabled={enviando}
                maxLength="2000"
              />
              <small className={styles.contador}>
                {mensaje.length}/2000 caracteres
              </small>
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
                {enviando ? "Enviando..." : "📧 Enviar Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
