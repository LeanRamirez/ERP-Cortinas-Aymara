import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt, isEncrypted } from '../../config/encryption.js';

const prisma = new PrismaClient();

// Campos que deben ser cifrados
const SENSITIVE_FIELDS = [
  'smtpUsername',
  'smtpPassword', 
  'whatsappPhoneNumberId',
  'whatsappToken'
];

// Mapeo de campos de entrada a campos de base de datos
const FIELD_MAPPING = {
  'smtpUsername': 'smtpUsername_enc',
  'smtpPassword': 'smtpPassword_enc',
  'whatsappPhoneNumberId': 'whatsappPhoneNumberId_enc',
  'whatsappToken': 'whatsappToken_enc'
};

/**
 * Obtiene la configuración con campos sensibles enmascarados
 * @returns {Object} Configuración con campos sensibles como "***masked***"
 */
export async function getConfig() {
  try {
    let config = await prisma.configuracionEmpresa.findUnique({
      where: { id: 'default' }
    });

    // Si no existe configuración, crear una vacía
    if (!config) {
      config = await prisma.configuracionEmpresa.create({
        data: { id: 'default' }
      });
    }

    // Enmascarar campos sensibles para respuesta pública
    const maskedConfig = { ...config };
    
    // Enmascarar campos cifrados si tienen valor
    if (config.smtpUsername_enc) maskedConfig.smtpUsername_enc = '***masked***';
    if (config.smtpPassword_enc) maskedConfig.smtpPassword_enc = '***masked***';
    if (config.whatsappPhoneNumberId_enc) maskedConfig.whatsappPhoneNumberId_enc = '***masked***';
    if (config.whatsappToken_enc) maskedConfig.whatsappToken_enc = '***masked***';

    return maskedConfig;

  } catch (error) {
    console.error('Error al obtener configuración:', error.message);
    throw new Error('Error al obtener la configuración');
  }
}

/**
 * Obtiene la configuración con campos sensibles descifrados
 * SOLO para uso interno del servidor (no exponer en APIs públicas)
 * @returns {Object} Configuración con campos sensibles descifrados
 */
export async function getConfigForInternalUse() {
  try {
    const config = await prisma.configuracionEmpresa.findUnique({
      where: { id: 'default' }
    });

    if (!config) {
      return null;
    }

    // Descifrar campos sensibles
    const decryptedConfig = { ...config };
    
    try {
      if (config.smtpUsername_enc) {
        decryptedConfig.smtpUsername = decrypt(config.smtpUsername_enc);
      }
      if (config.smtpPassword_enc) {
        decryptedConfig.smtpPassword = decrypt(config.smtpPassword_enc);
      }
      if (config.whatsappPhoneNumberId_enc) {
        decryptedConfig.whatsappPhoneNumberId = decrypt(config.whatsappPhoneNumberId_enc);
      }
      if (config.whatsappToken_enc) {
        decryptedConfig.whatsappToken = decrypt(config.whatsappToken_enc);
      }
    } catch (decryptError) {
      console.error('Error al descifrar credenciales:', decryptError.message);
      throw new Error('Error al procesar credenciales seguras');
    }

    return decryptedConfig;

  } catch (error) {
    console.error('Error al obtener configuración interna:', error.message);
    throw error;
  }
}

/**
 * Actualiza la configuración cifrando campos sensibles
 * @param {Object} updates - Campos a actualizar
 * @returns {Object} Configuración actualizada con campos sensibles enmascarados
 */
export async function updateConfig(updates) {
  try {
    // Validar entrada
    if (!updates || typeof updates !== 'object') {
      throw new Error('Errores de validación: Se requieren datos válidos para actualizar');
    }

    // Preparar datos para actualización
    const updateData = {};

    // Procesar campos no sensibles
    const nonSensitiveFields = ['fromName', 'fromEmail', 'host', 'port', 'secureTLS', 'replyTo', 'wabaId'];
    for (const field of nonSensitiveFields) {
      if (updates.hasOwnProperty(field)) {
        updateData[field] = updates[field];
      }
    }

    // Procesar campos sensibles (cifrar)
    for (const field of SENSITIVE_FIELDS) {
      if (updates.hasOwnProperty(field)) {
        const value = updates[field];
        if (value && typeof value === 'string' && value.trim() !== '') {
          try {
            // Cifrar el valor
            const encryptedValue = encrypt(value.trim());
            const dbField = FIELD_MAPPING[field];
            updateData[dbField] = encryptedValue;
          } catch (encryptError) {
            console.error(`Error al cifrar campo ${field}:`, encryptError.message);
            throw new Error('Error al procesar credenciales seguras');
          }
        }
      }
    }

    // Validar que hay algo que actualizar
    if (Object.keys(updateData).length === 0) {
      throw new Error('Errores de validación: No se proporcionaron campos válidos para actualizar');
    }

    // Realizar actualización con upsert
    const updatedConfig = await prisma.configuracionEmpresa.upsert({
      where: { id: 'default' },
      update: updateData,
      create: { id: 'default', ...updateData }
    });

    // Retornar configuración con campos sensibles enmascarados
    return await getConfig();

  } catch (error) {
    console.error('Error al actualizar configuración:', error.message);
    throw error;
  }
}

/**
 * Valida los campos de configuración
 * @param {Object} data - Datos a validar
 * @returns {Array} Array de errores de validación
 */
export function validateConfigData(data) {
  const errors = [];

  // Validar email si está presente
  if (data.fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.fromEmail)) {
    errors.push('fromEmail debe ser un email válido');
  }

  if (data.replyTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyTo)) {
    errors.push('replyTo debe ser un email válido');
  }

  // Validar puerto si está presente
  if (data.port !== undefined) {
    const port = parseInt(data.port);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push('port debe ser un número entre 1 y 65535');
    }
  }

  // Validar campos de texto no vacíos
  const textFields = ['fromName', 'host', 'smtpUsername', 'smtpPassword'];
  for (const field of textFields) {
    if (data[field] !== undefined && (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '')) {
      errors.push(`${field} no puede estar vacío`);
    }
  }

  return errors;
}

/**
 * Verifica si la configuración SMTP está completa
 * @returns {boolean} true si la configuración SMTP está completa
 */
export async function isSmtpConfigComplete() {
  try {
    const config = await getConfigForInternalUse();
    
    return !!(config && 
             config.host && 
             config.fromEmail && 
             config.smtpUsername && 
             config.smtpPassword);
             
  } catch (error) {
    console.error('Error al verificar configuración SMTP:', error.message);
    return false;
  }
}

/**
 * Verifica si la configuración de WhatsApp está completa
 * @returns {boolean} true si la configuración de WhatsApp está completa
 */
export async function isWhatsAppConfigComplete() {
  try {
    const config = await getConfigForInternalUse();
    
    return !!(config && 
             config.whatsappPhoneNumberId && 
             config.whatsappToken);
             
  } catch (error) {
    console.error('Error al verificar configuración WhatsApp:', error.message);
    return false;
  }
}

/**
 * Limpia las credenciales cifradas que pueden estar corruptas
 * Establece como null los campos cifrados de la configuración default
 * @returns {Object} Objeto con información sobre si se encontró y limpió la configuración
 */
export async function limpiarCredencialesCorruptas() {
  try {
    // Verificar si existe la configuración con ID "default"
    const configuracionExistente = await prisma.configuracionEmpresa.findUnique({
      where: { id: 'default' }
    });

    if (!configuracionExistente) {
      return { encontrada: false };
    }

    // Limpiar los campos cifrados estableciéndolos como null
    await prisma.configuracionEmpresa.update({
      where: { id: 'default' },
      data: {
        smtpUsername_enc: null,
        smtpPassword_enc: null,
        whatsappPhoneNumberId_enc: null,
        whatsappToken_enc: null
      }
    });

    return { encontrada: true };
  } catch (error) {
    console.error('Error en limpiarCredencialesCorruptas:', error.message);
    throw error;
  }
}
