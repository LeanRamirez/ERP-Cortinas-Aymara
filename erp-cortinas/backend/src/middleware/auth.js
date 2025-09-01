/**
 * Middleware básico de autenticación y autorización
 * 
 * NOTA: Este es un middleware básico para demostración.
 * En producción se debería implementar:
 * - JWT tokens
 * - Base de datos de usuarios
 * - Hash de contraseñas
 * - Sesiones seguras
 */

/**
 * Middleware básico que requiere rol "admin"
 * Por ahora usa un header simple: X-Admin-Key
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 */
export function requireAdmin(req, res, next) {
  try {
    // Por ahora usamos un header simple para demostración
    const adminKey = req.headers['x-admin-key'];
    
    // Clave de admin desde variable de entorno
    const validAdminKey = process.env.ADMIN_KEY || 'admin-key-default';
    
    if (!adminKey) {
      return res.status(401).json({
        error: 'Acceso no autorizado',
        message: 'Se requiere autenticación de administrador'
      });
    }
    
    if (adminKey !== validAdminKey) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'Credenciales de administrador inválidas'
      });
    }
    
    // Simular userId para auditoría
    req.user = {
      id: 'admin',
      role: 'admin'
    };
    
    next();
    
  } catch (error) {
    console.error('Error en middleware de autenticación:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error en el proceso de autenticación'
    });
  }
}

/**
 * Middleware de auditoría para registrar acciones
 * 
 * @param {string} action - Acción realizada
 * @returns {Function} Middleware de Express
 */
export function auditLog(action) {
  return (req, res, next) => {
    // Registrar la acción antes de procesarla
    const userId = req.user?.id || 'anonymous';
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`[AUDIT] ${timestamp} - Usuario: ${userId} - Acción: ${action} - IP: ${ip} - Endpoint: ${req.method} ${req.originalUrl}`);
    
    // Continuar con el siguiente middleware
    next();
  };
}

/**
 * DOCUMENTACIÓN DEL MIDDLEWARE DE AUTENTICACIÓN
 * 
 * Este middleware básico está diseñado para demostración y desarrollo.
 * 
 * USO ACTUAL:
 * - Header requerido: X-Admin-Key
 * - Valor: definido en ADMIN_KEY (env) o 'admin-key-default'
 * 
 * EJEMPLO DE USO:
 * curl -H "X-Admin-Key: admin-key-default" http://localhost:4000/api/config/envios
 * 
 * PARA PRODUCCIÓN SE DEBE IMPLEMENTAR:
 * 1. Sistema de usuarios con base de datos
 * 2. JWT tokens con expiración
 * 3. Hash de contraseñas (bcrypt)
 * 4. Refresh tokens
 * 5. Rate limiting
 * 6. HTTPS obligatorio
 * 7. Roles granulares
 * 8. Auditoría completa en base de datos
 * 
 * VARIABLES DE ENTORNO REQUERIDAS:
 * - ADMIN_KEY: Clave de administrador (temporal)
 */
