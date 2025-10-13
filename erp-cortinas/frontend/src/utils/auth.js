/**
 * Utilidades de autenticación para el frontend
 */

/**
 * Obtiene la clave de administrador desde las variables de entorno
 * @returns {string} La clave de administrador
 * @throws {Error} Si la clave no está configurada
 */
export const getAdminKey = () => {
  const adminKey = import.meta.env.VITE_ADMIN_KEY;
  
  if (!adminKey) {
    throw new Error('VITE_ADMIN_KEY no está configurada en las variables de entorno');
  }
  
  return adminKey;
};

/**
 * Obtiene los headers de autenticación para requests que requieren X-Admin-Key
 * @returns {Object} Headers con la clave de administrador
 */
export const getAdminHeaders = () => {
  return {
    'X-Admin-Key': getAdminKey()
  };
};

/**
 * Obtiene los headers de autenticación para requests que requieren Bearer token
 * @returns {Object} Headers con el token de autorización
 */
export const getBearerHeaders = () => {
  const adminKey = getAdminKey();
  return {
    'Authorization': `Bearer ${adminKey}`
  };
};

/**
 * Crea headers completos para requests con autenticación
 * @param {Object} additionalHeaders - Headers adicionales a incluir
 * @param {boolean} useBearer - Si usar Bearer token en lugar de X-Admin-Key
 * @returns {Object} Headers completos para el request
 */
export const createAuthHeaders = (additionalHeaders = {}, useBearer = false) => {
  const authHeaders = useBearer ? getBearerHeaders() : getAdminHeaders();
  
  return {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...additionalHeaders
  };
};
