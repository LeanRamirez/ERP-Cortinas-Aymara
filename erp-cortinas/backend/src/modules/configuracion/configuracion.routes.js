import express from "express";
import { obtenerConfiguracionEnvios, actualizarConfiguracionEnvios, probarEnvioEmail, probarEnvioWhatsApp, verificarConexionSMTP, limpiarDatosCorruptos, limpiarCredencialesCorruptas } from "./configuracion.controller.js";
import { requireAdmin, auditLog } from "../../middleware/auth.js";

const router = express.Router();

/**
 * GET /config/envios
 * Obtiene la configuración de envíos con campos sensibles enmascarados
 * Requiere autenticación de administrador
 */
router.get(
  '/envios',
  requireAdmin,
  auditLog('GET_CONFIG_ENVIOS'),
  obtenerConfiguracionEnvios
);

/**
 * PUT /config/envios
 * Actualiza la configuración de envíos
 * Cifra automáticamente los campos sensibles
 * Requiere autenticación de administrador
 */
router.put(
  '/envios',
  requireAdmin,
  auditLog('UPDATE_CONFIG_ENVIOS'),
  actualizarConfiguracionEnvios
);

/**
 * POST /config/envios/test-email
 * Prueba el envío de email con la configuración SMTP actual
 * Requiere autenticación de administrador
 */
router.post(
  '/envios/test-email',
  requireAdmin,
  auditLog('TEST_EMAIL'),
  probarEnvioEmail
);

/**
 * POST /config/envios/test-whatsapp
 * Prueba el envío de WhatsApp con la configuración de WhatsApp Cloud API actual
 * Requiere autenticación de administrador
 */
router.post(
  '/envios/test-whatsapp',
  requireAdmin,
  auditLog('TEST_WHATSAPP'),
  probarEnvioWhatsApp
);

/**
 * POST /config/envios/verify-smtp
 * Verifica la conexión SMTP sin enviar emails
 * Requiere autenticación de administrador
 */
router.post(
  '/envios/verify-smtp',
  requireAdmin,
  auditLog('VERIFY_SMTP'),
  verificarConexionSMTP
);

/**
 * POST /config/envios/cleanup-corrupted
 * Limpia datos cifrados corruptos en la base de datos
 * Requiere autenticación de administrador
 */
router.post(
  '/envios/cleanup-corrupted',
  requireAdmin,
  auditLog('CLEANUP_CORRUPTED'),
  limpiarDatosCorruptos
);

/**
 * DELETE /config/envios/credenciales-corruptas
 * Endpoint seguro para limpiar credenciales cifradas corruptas
 * Elimina los campos: smtpUsername_enc, smtpPassword_enc, whatsappPhoneNumberId_enc, whatsappToken_enc
 * Requiere autenticación de administrador
 */
router.delete(
  '/envios/credenciales-corruptas',
  requireAdmin,
  auditLog('CLEAN_CORRUPTED_CREDENTIALS'),
  limpiarCredencialesCorruptas
);

export default router;
