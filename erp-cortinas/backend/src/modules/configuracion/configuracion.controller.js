import nodemailer from "nodemailer";
import axios from "axios";
import { getConfig, updateConfig, getConfigForInternalUse, limpiarCredencialesCorruptas as limpiarCredencialesService } from "./configuracion.service.js";
import emailService from "../../services/email.service.js";

// Regex para validar formato E.164
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

/**
 * Obtiene la configuración de envíos
 * Los campos sensibles se devuelven enmascarados
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const obtenerConfiguracionEnvios = async (req, res) => {
  try {
    const config = await getConfig();
    
    res.status(200).json({
      success: true,
      data: config,
      message: 'Configuración obtenida correctamente'
    });
    
  } catch (error) {
    console.error('Error al obtener configuración de envíos:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la configuración de envíos'
    });
  }
};

/**
 * Actualiza la configuración de envíos
 * Cifra los campos sensibles antes de guardar
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const actualizarConfiguracionEnvios = async (req, res) => {
  try {
    const payload = req.body;
    
    // Validar que el payload no esté vacío
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'Se requiere al menos un campo para actualizar'
      });
    }
    
    // Actualizar configuración
    const updatedConfig = await updateConfig(payload);
    
    res.status(200).json({
      success: true,
      data: updatedConfig,
      message: 'Configuración actualizada correctamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar configuración de envíos:', error.message);
    
    // Manejar errores de validación
    if (error.message.includes('Errores de validación')) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: error.message
      });
    }
    
    // Manejar errores de cifrado
    if (error.message.includes('Error al procesar credenciales seguras')) {
      return res.status(500).json({
        success: false,
        error: 'Error de seguridad',
        message: 'No se pudieron procesar las credenciales de forma segura'
      });
    }
    
    // Error genérico
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la configuración de envíos'
    });
  }
};

/**
 * Prueba el envío de email con la configuración SMTP actual
 * Usa el servicio de email que obtiene datos exclusivamente de la BD
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const probarEnvioEmail = async (req, res) => {
  try {
    const { to, subject = 'Prueba de envío', message = 'Este es un email de prueba del sistema ERP Cortinas Aymara.' } = req.body;

    // Validaciones de entrada
    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El campo "to" es requerido'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El campo "to" debe ser un email válido'
      });
    }

    // Validar longitud de subject
    if (subject && subject.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El campo "subject" no puede exceder 200 caracteres'
      });
    }

    // Validar longitud de message
    if (message && message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El campo "message" no puede exceder 1000 caracteres'
      });
    }

    // Usar el servicio de email que obtiene datos de la BD
    const result = await emailService.sendEmail({
      to,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`
    });

    // Registrar en auditoría (sin datos sensibles)
    const userId = req.user?.id || 'unknown';
    const timestamp = new Date().toISOString();
    console.log(`[AUDIT] ${timestamp} - Usuario: ${userId} - Acción: TEST_EMAIL - Destinatario: ${to}`);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: {
        messageId: result.messageId,
        to: to,
        subject: subject,
        sentAt: timestamp,
        provider: 'smtp'
      },
      message: 'Email de prueba enviado correctamente'
    });

  } catch (error) {
    console.error('Error al enviar email de prueba:', error.message);

    // El servicio de email ya maneja los errores y los convierte en mensajes legibles
    res.status(502).json({
      success: false,
      error: 'Error de envío de email',
      message: error.message
    });
  }
};

/**
 * Verifica la conexión SMTP sin enviar emails
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const verificarConexionSMTP = async (req, res) => {
  try {
    await emailService.verifyConnection();
    res.json({ 
      success: true, 
      message: 'Conexión SMTP verificada exitosamente' 
    });
  } catch (error) {
    console.error('Error verificando conexión SMTP:', error.message);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * Limpia datos cifrados corruptos en la base de datos
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const limpiarDatosCorruptos = async (req, res) => {
  try {
    const result = await emailService.cleanupCorruptedData();
    res.json({ 
      success: true, 
      message: result.needsReconfiguration 
        ? 'Se detectaron datos corruptos. Es necesario reconfigurar SMTP.' 
        : 'No se encontraron datos corruptos.',
      needsReconfiguration: result.needsReconfiguration
    });
  } catch (error) {
    console.error('Error limpiando datos corruptos:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * Prueba el envío de WhatsApp con la configuración de WhatsApp Cloud API actual
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const probarEnvioWhatsApp = async (req, res) => {
  try {
    const { to } = req.body;

    // Validar formato E.164
    if (!to || !E164_REGEX.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El número de teléfono debe estar en formato E.164 (ej: +5491123456789)'
      });
    }

    // Obtener credenciales descifradas
    const config = await getConfigForInternalUse();
    
    if (!config.whatsappPhoneNumberId || !config.whatsappToken) {
      return res.status(424).json({
        success: false,
        error: 'Configuración incompleta',
        message: 'Configuración incompleta: faltan credenciales de WhatsApp'
      });
    }

    // Construir request a Meta Graph API
    const whatsappUrl = `https://graph.facebook.com/v20.0/${config.whatsappPhoneNumberId}/messages`;
    const whatsappPayload = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: "Mensaje de prueba desde ERP Cortinas"
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

    // Registrar en auditoría (sin token)
    const userId = req.user?.id || 'unknown';
    const timestamp = new Date().toISOString();
    console.log(`[AUDIT] ${timestamp} - Usuario: ${userId} - Acción: TEST_WHATSAPP - Destinatario: ${to}`);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: {
        messageId: response.data.messages[0].id,
        to: to,
        sentAt: timestamp,
        provider: "whatsapp_cloud",
        status: "sent"
      },
      message: 'Mensaje de WhatsApp enviado correctamente'
    });

  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error.message);

    // Manejar errores específicos de WhatsApp Cloud API
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      // Token inválido o expirado
      if (status === 401) {
        return res.status(502).json({
          success: false,
          error: 'Error de autenticación WhatsApp',
          message: 'Token de WhatsApp inválido o expirado. Verifique las credenciales.'
        });
      }

      // Número no autorizado como tester
      if (status === 400 && errorData.error?.message?.includes('is not a WhatsApp user')) {
        return res.status(502).json({
          success: false,
          error: 'Error de destinatario WhatsApp',
          message: 'El número no está registrado en WhatsApp o no está autorizado como tester.'
        });
      }

      // Phone Number ID inválido
      if (status === 400 && errorData.error?.message?.includes('Invalid phone number id')) {
        return res.status(502).json({
          success: false,
          error: 'Error de configuración WhatsApp',
          message: 'Phone Number ID inválido. Verifique la configuración de WhatsApp.'
        });
      }

      // Rate limiting
      if (status === 429) {
        return res.status(502).json({
          success: false,
          error: 'Error de límite de WhatsApp',
          message: 'Se ha excedido el límite de mensajes. Intente más tarde.'
        });
      }

      // Error genérico de la API
      return res.status(502).json({
        success: false,
        error: 'Error de WhatsApp Cloud API',
        message: 'La API de WhatsApp rechazó el mensaje. Verifique la configuración.'
      });
    }

    // Error de conexión/timeout
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(502).json({
        success: false,
        error: 'Error de conexión WhatsApp',
        message: 'Timeout al conectar con WhatsApp Cloud API. Intente más tarde.'
      });
    }

    // Error genérico
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo enviar el mensaje de WhatsApp'
    });
  }
};

/**
 * Limpia las credenciales cifradas corruptas
 * Elimina los valores de campos cifrados que pueden estar causando errores
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const limpiarCredencialesCorruptas = async (req, res) => {
  try {
    const userId = req.user?.id || 'unknown';
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${timestamp}] Iniciando limpieza de credenciales corruptas - Admin: ${userId} - IP: ${ip}`);
    
    // Buscar y limpiar configuración con ID "default"
    const resultado = await limpiarCredencialesService();
    
    if (resultado.encontrada) {
      // Log de auditoría detallado
      console.log(`[${timestamp}] AUDITORIA - Credenciales cifradas limpiadas exitosamente`);
      console.log(`[${timestamp}] AUDITORIA - Campos limpiados: smtpUsername_enc, smtpPassword_enc, whatsappPhoneNumberId_enc, whatsappToken_enc`);
      console.log(`[${timestamp}] AUDITORIA - Configuración ID: default - Admin: ${userId} - IP: ${ip}`);
      
      res.status(200).json({
        success: true,
        message: 'Credenciales cifradas corruptas limpiadas correctamente',
        detalles: {
          configuracionId: 'default',
          camposLimpiados: [
            'smtpUsername_enc',
            'smtpPassword_enc', 
            'whatsappPhoneNumberId_enc',
            'whatsappToken_enc'
          ],
          timestamp: timestamp
        }
      });
    } else {
      console.log(`[${timestamp}] AUDITORIA - No se encontró configuración con ID 'default' para limpiar - Admin: ${userId}`);
      
      res.status(404).json({
        success: false,
        message: 'No se encontró configuración con ID "default" para limpiar',
        detalles: {
          configuracionId: 'default',
          encontrada: false,
          timestamp: timestamp
        }
      });
    }
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR - Limpieza de credenciales falló:`, error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al limpiar credenciales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: timestamp
    });
  }
};
