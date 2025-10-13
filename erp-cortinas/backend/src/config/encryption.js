import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';

// Obtener la clave de cifrado desde variables de entorno
const ENCRYPTION_KEY = process.env.CONFIG_SECRETS_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('CONFIG_SECRETS_KEY no está definida en las variables de entorno');
}

// Verificar que la clave tenga la longitud correcta (32 bytes para AES-256)
if (ENCRYPTION_KEY.length !== 64) { // 32 bytes = 64 caracteres hex
  throw new Error('CONFIG_SECRETS_KEY debe tener exactamente 64 caracteres hexadecimales (32 bytes)');
}

const algorithm = 'aes-256-gcm';

/**
 * Cifra un texto usando AES-256-GCM
 * @param {string} text - Texto a cifrar
 * @returns {string} - Texto cifrado en formato: iv:authTag:encrypted (hex)
 */
export function encrypt(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('El texto a cifrar debe ser una cadena no vacía');
  }

  try {
    // Generar IV aleatorio de 12 bytes (recomendado para GCM)
    const iv = crypto.randomBytes(12);
    
    // Crear cipher con createCipheriv
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    // Cifrar
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Obtener tag de autenticación
    const authTag = cipher.getAuthTag();
    
    // Retornar en formato: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    
  } catch (error) {
    console.error('Error al cifrar:', error.message);
    throw new Error('Error al procesar credenciales seguras');
  }
}

/**
 * Descifra un texto cifrado con AES-256-GCM
 * @param {string} encryptedData - Datos cifrados en formato: iv:authTag:encrypted (hex)
 * @returns {string} - Texto descifrado
 */
export function decrypt(encryptedData) {
  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('Los datos cifrados deben ser una cadena no vacía');
  }

  try {
    // Separar componentes
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Formato de datos cifrados inválido');
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    
    // Convertir de hex a Buffer
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    // Crear decipher con createDecipheriv
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(authTag);
    
    // Descifrar
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
    
  } catch (error) {
    console.error('Error al descifrar:', error.message);
    throw new Error('Error al procesar credenciales seguras');
  }
}

/**
 * Genera una nueva clave de cifrado de 32 bytes (64 caracteres hex)
 * Útil para generar CONFIG_SECRETS_KEY
 * @returns {string} - Clave de 64 caracteres hexadecimales
 */
export function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verifica si una cadena está cifrada (tiene el formato correcto)
 * @param {string} data - Datos a verificar
 * @returns {boolean} - true si parece estar cifrada
 */
export function isEncrypted(data) {
  if (!data || typeof data !== 'string') {
    return false;
  }
  
  // Verificar formato: iv:authTag:encrypted (3 partes separadas por :)
  const parts = data.split(':');
  return parts.length === 3 && 
         parts[0].length === 24 && // IV de 12 bytes = 24 hex chars
         parts[1].length === 32 && // AuthTag de 16 bytes = 32 hex chars
         parts[2].length > 0;      // Datos cifrados
}
