import nodemailer from 'nodemailer';
import { getConfigForInternalUse } from '../modules/configuracion/configuracion.service.js';
import { decrypt } from '../config/encryption.js';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  /**
   * Obtiene y valida la configuración SMTP desde la base de datos
   */
  async getSmtpConfig() {
    try {
      const config = await getConfigForInternalUse();
      
      if (!config) {
        throw new Error('No se encontró configuración en la base de datos');
      }

      // Validar campos obligatorios (getConfigForInternalUse ya descifra las credenciales)
      const requiredFields = ['host', 'port', 'smtpUsername', 'smtpPassword', 'fromEmail', 'fromName'];
      const missingFields = requiredFields.filter(field => !config[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Faltan campos obligatorios en la configuración SMTP: ${missingFields.join(', ')}`);
      }

      // Las credenciales ya están descifradas por getConfigForInternalUse()
      const smtpUsername = config.smtpUsername;
      const smtpPassword = config.smtpPassword;

      // Validar que las credenciales no estén vacías
      if (!smtpUsername || !smtpPassword) {
        throw new Error('Las credenciales SMTP están vacías');
      }

      return {
        host: config.host,
        port: parseInt(config.port, 10),
        secure: config.secureTLS || false,
        auth: {
          user: smtpUsername,
          pass: smtpPassword
        },
        fromEmail: config.fromEmail,
        fromName: config.fromName,
        replyTo: config.replyTo
      };
    } catch (error) {
      console.error('Error obteniendo configuración SMTP:', error.message);
      throw error;
    }
  }

  /**
   * Crea el transporter de nodemailer con la configuración de la BD
   */
  async createTransporter() {
    const smtpConfig = await this.getSmtpConfig();
    
    this.transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
      // Configuraciones adicionales para mejor compatibilidad
      tls: {
        rejectUnauthorized: false // Para servidores con certificados auto-firmados
      }
    });

    return { transporter: this.transporter, config: smtpConfig };
  }

  /**
   * Verifica la conexión SMTP
   */
  async verifyConnection() {
    try {
      const { transporter } = await this.createTransporter();
      await transporter.verify();
      console.log('Conexión SMTP verificada exitosamente');
      return true;
    } catch (error) {
      console.error('Error verificando conexión SMTP:', error.message);
      throw new Error(`Error de conexión SMTP: ${this.getReadableError(error)}`);
    }
  }

  /**
   * Envía un email
   */
  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      const { transporter, config } = await this.createTransporter();

      const mailOptions = {
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to,
        subject,
        text,
        html,
        attachments
      };

      // Agregar replyTo si está configurado
      if (config.replyTo) {
        mailOptions.replyTo = config.replyTo;
      }

      console.log(`Enviando email a: ${to}, asunto: ${subject}`);
      
      const result = await transporter.sendMail(mailOptions);
      
      console.log('Email enviado exitosamente:', result.messageId);
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('Error enviando email:', error.message);
      throw new Error(`Error enviando email: ${this.getReadableError(error)}`);
    }
  }

  /**
   * Convierte errores técnicos en mensajes más legibles
   */
  getReadableError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login') || message.includes('authentication failed')) {
      return 'Credenciales SMTP incorrectas. Verifique usuario y contraseña.';
    }
    
    if (message.includes('connection timeout') || message.includes('connect econnrefused')) {
      return 'No se pudo conectar al servidor SMTP. Verifique host y puerto.';
    }
    
    if (message.includes('self signed certificate')) {
      return 'Problema con el certificado SSL del servidor SMTP.';
    }
    
    if (message.includes('recipient rejected')) {
      return 'El destinatario fue rechazado por el servidor.';
    }
    
    // Si no es un error conocido, devolver el mensaje original
    return error.message;
  }

  /**
   * Limpia datos cifrados incorrectamente en la base de datos
   */
  async cleanupCorruptedData() {
    try {
      const config = await getConfigForInternalUse();
      
      if (!config) {
        console.log('No hay configuración para limpiar');
        return { needsReconfiguration: false };
      }

      let needsCleanup = false;
      const fieldsToCheck = ['smtpUsername_enc', 'smtpPassword_enc'];
      
      for (const field of fieldsToCheck) {
        if (config[field]) {
          try {
            decrypt(config[field]);
          } catch (error) {
            console.log(`Campo ${field} tiene datos corruptos, marcando para limpieza`);
            needsCleanup = true;
          }
        }
      }

      if (needsCleanup) {
        console.log('Se detectaron datos cifrados corruptos. Será necesario reconfigurar SMTP.');
        return { needsReconfiguration: true };
      }

      return { needsReconfiguration: false };
    } catch (error) {
      console.error('Error limpiando datos corruptos:', error.message);
      throw error;
    }
  }
}

export default new EmailService();
