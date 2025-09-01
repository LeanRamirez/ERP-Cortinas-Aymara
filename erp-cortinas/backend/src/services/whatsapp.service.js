import axios from 'axios';
import { getConfigForInternalUse } from '../modules/configuracion/configuracion.service.js';

// Regex para validar formato E.164
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

/**
 * Envía el PDF del presupuesto al cliente por WhatsApp
 * @param {Object} presupuesto - Objeto presupuesto con datos del cliente
 * @param {string} publicUrl - URL pública del PDF generado
 * @returns {Promise<Object>} Resultado del envío
 * @throws {Error} Si faltan credenciales o hay errores en el envío
 */
export const sendBudgetPdfWhatsApp = async (presupuesto, publicUrl) => {
  try {
    // Obtener credenciales descifradas
    const config = await getConfigForInternalUse();
    
    if (!config.whatsappPhoneNumberId || !config.whatsappToken) {
      throw new Error('Credenciales de WhatsApp incompletas');
    }

    // Validar que el cliente tenga teléfono en formato E.164
    const clientePhone = presupuesto.cliente.telefono;
    if (!clientePhone || !E164_REGEX.test(clientePhone)) {
      throw new Error(`Número de teléfono del cliente inválido: ${clientePhone}. Debe estar en formato E.164`);
    }

    // Construir mensaje personalizado
    const nombreCliente = presupuesto.cliente.nombre;
    const numeroPresupuesto = presupuesto.id;
    const mensaje = `📄 ¡Hola ${nombreCliente}! Te compartimos el presupuesto #${numeroPresupuesto}. Podés verlo en el siguiente enlace:\n${publicUrl}`;

    // Construir request a Meta Graph API
    const whatsappUrl = `https://graph.facebook.com/v20.0/${config.whatsappPhoneNumberId}/messages`;
    const whatsappPayload = {
      messaging_product: "whatsapp",
      to: clientePhone,
      type: "text",
      text: {
        body: mensaje
      }
    };

    const whatsappHeaders = {
      'Authorization': `Bearer ${config.whatsappToken}`,
      'Content-Type': 'application/json'
    };

    // Realizar request a WhatsApp Cloud API con timeout
    const response = await axios.post(whatsappUrl, whatsappPayload, {
      headers: whatsappHeaders,
      timeout: 10000 // 10 segundos
    });

    // Log de éxito sin exponer token
    console.log(`[WHATSAPP] PDF enviado exitosamente - Presupuesto: ${numeroPresupuesto}, Cliente: ${nombreCliente}, Teléfono: ${clientePhone}`);

    return {
      success: true,
      messageId: response.data.messages[0].id,
      to: clientePhone,
      presupuestoId: numeroPresupuesto,
      sentAt: new Date().toISOString()
    };

  } catch (error) {
    // Log de error sin exponer credenciales
    const errorMessage = error.response?.data?.error?.message || error.message;
    const presupuestoId = presupuesto?.id || 'unknown';
    const clienteNombre = presupuesto?.cliente?.nombre || 'unknown';
    
    console.error(`[WHATSAPP] Error enviando PDF - Presupuesto: ${presupuestoId}, Cliente: ${clienteNombre}, Error: ${errorMessage}`);

    // Re-lanzar error para manejo en el llamador
    throw new Error(`Error enviando WhatsApp: ${errorMessage}`);
  }
};
