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

/**
 * Envía presupuesto por WhatsApp con PDF como documento o link de fallback
 * @param {Object} params - Parámetros del envío
 * @param {string} params.to - Número de teléfono en formato E.164
 * @param {string} params.publicUrl - URL pública del PDF
 * @param {string} params.fileName - Nombre del archivo PDF
 * @param {string} params.message - Mensaje personalizado (opcional)
 * @param {string} params.phoneNumberId - Phone Number ID de WhatsApp
 * @param {string} params.token - Token de acceso de WhatsApp
 * @returns {Promise<Object>} Resultado del envío
 */
export const sendBudgetPdfWhatsAppAdvanced = async ({ to, publicUrl, fileName, message, phoneNumberId, token }) => {
  try {
    console.log(`[WAPP-SEND] Iniciando envío a ${to}`);

    // Validar formato E.164
    if (!E164_REGEX.test(to)) {
      throw new Error(`Número de teléfono inválido: ${to}. Debe estar en formato E.164`);
    }

    // Construir URL base para verificar si es local
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    const isLocal = /localhost|127\.0\.0\.1/i.test(baseUrl);

    const whatsappUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    const whatsappHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    let whatsappPayload;
    let messageType;

    if (isLocal) {
      // Fallback para desarrollo local: enviar como texto con link
      console.log(`[WAPP-SEND] Usando fallback de texto (entorno local)`);
      messageType = 'text';
      
      const mensajeCompleto = message 
        ? `${message}\n\n📄 PDF disponible en: ${publicUrl}`
        : `📄 Tu presupuesto está listo. Podés verlo en: ${publicUrl}`;

      whatsappPayload = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: mensajeCompleto
        }
      };
    } else {
      // Entorno público: intentar enviar como documento
      console.log(`[WAPP-SEND] Enviando como documento (entorno público)`);
      messageType = 'document';

      whatsappPayload = {
        messaging_product: "whatsapp",
        to: to,
        type: "document",
        document: {
          link: publicUrl,
          filename: fileName
        }
      };

      // Si hay mensaje personalizado, agregarlo como caption
      if (message) {
        whatsappPayload.document.caption = message;
      }
    }

    // Realizar request a WhatsApp Cloud API
    const response = await axios.post(whatsappUrl, whatsappPayload, {
      headers: whatsappHeaders,
      timeout: 10000 // 10 segundos
    });

    console.log(`[WAPP-SEND] Mensaje enviado exitosamente - Tipo: ${messageType}, ID: ${response.data.messages[0].id}`);

    return {
      success: true,
      messageId: response.data.messages[0].id,
      to: to,
      messageType: messageType,
      sentAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`[WAPP-ERROR] Error enviando WhatsApp:`, error.response?.data || error.message);

    // Manejar errores específicos de WhatsApp Cloud API
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 401) {
        throw new Error('Token de WhatsApp inválido o expirado');
      } else if (status === 400) {
        if (errorData.error?.message?.includes('is not a WhatsApp user')) {
          throw new Error('El número no está registrado en WhatsApp o no está autorizado como tester');
        } else if (errorData.error?.message?.includes('Invalid phone number id')) {
          throw new Error('Phone Number ID inválido');
        } else {
          throw new Error('Datos de WhatsApp inválidos');
        }
      } else if (status === 429) {
        throw new Error('Límite de mensajes excedido. Intente más tarde');
      } else {
        throw new Error('Error de WhatsApp Cloud API');
      }
    }

    // Error de conexión/timeout
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Timeout al conectar con WhatsApp Cloud API');
    }

    // Error genérico
    throw new Error(`Error enviando WhatsApp: ${error.message}`);
  }
};
