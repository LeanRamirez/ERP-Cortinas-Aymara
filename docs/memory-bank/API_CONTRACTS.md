# API CONTRACTS - ERP Cortinas Aymara

## 📋 Información General

### Base URL
<!-- TODO: Definir base URL -->
- **Desarrollo**: http://localhost:4000/api
- **Staging**: 
- **Producción**: 

### Autenticación
<!-- TODO: Documentar autenticación -->
- **Tipo**: JWT Bearer Token (preparado)
- **Header**: `Authorization: Bearer <token>`
- **Expiración**: 

### Formato de Respuesta
<!-- TODO: Definir formato estándar de respuesta -->
```json
{
  "success": true,
  "data": {},
  "message": "Mensaje descriptivo",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Códigos de Estado HTTP
<!-- TODO: Documentar códigos de estado utilizados -->
- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado
- **400**: Bad Request - Error en la petición
- **401**: Unauthorized - No autenticado
- **403**: Forbidden - Sin permisos
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## 👥 Módulo de Clientes

### GET /clientes
<!-- TODO: Documentar endpoint GET clientes -->
**Descripción**: Obtener todos los clientes

**Request**:
```http
GET /api/clientes
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "string",
      "email": "string",
      "telefono": "string",
      "calle": "string",
      "numero": "string",
      "ciudad": "string",
      "provincia": "string",
      "codigoPostal": "string",
      "createdAt": "datetime"
    }
  ]
}
```

### POST /clientes
<!-- TODO: Documentar endpoint POST clientes -->
**Descripción**: Crear nuevo cliente

**Request**:
```http
POST /api/clientes
Content-Type: application/json

{
  "nombre": "string (required)",
  "email": "string (optional)",
  "telefono": "string (optional)",
  "calle": "string (optional)",
  "numero": "string (optional)",
  "ciudad": "string (optional)",
  "provincia": "string (optional)",
  "codigoPostal": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "string",
    // ... otros campos
  },
  "message": "Cliente creado exitosamente"
}
```

### GET /clientes/:id
<!-- TODO: Documentar endpoint GET cliente por ID -->
**Descripción**: Obtener cliente por ID

**Request**:
```http
GET /api/clientes/1
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "string",
    // ... otros campos
  }
}
```

### PUT /clientes/:id
<!-- TODO: Documentar endpoint PUT clientes -->
**Descripción**: Actualizar cliente

**Request**:
```http
PUT /api/clientes/1
Content-Type: application/json

{
  "nombre": "string",
  // ... otros campos opcionales
}
```

### DELETE /clientes/:id
<!-- TODO: Documentar endpoint DELETE clientes -->
**Descripción**: Eliminar cliente

**Request**:
```http
DELETE /api/clientes/1
```

## 📋 Módulo de Presupuestos

### GET /presupuestos
<!-- TODO: Documentar endpoint GET presupuestos -->
**Descripción**: Obtener todos los presupuestos

**Request**:
```http
GET /api/presupuestos
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "descripcion": "string",
      "valor": "number",
      "fecha": "datetime",
      "estado": "string",
      "clienteId": "number",
      "cliente": {
        "id": 1,
        "nombre": "string"
      },
      "items": [
        {
          "id": 1,
          "descripcion": "string",
          "cantidad": "number",
          "precioUnitario": "number"
        }
      ]
    }
  ]
}
```

### POST /presupuestos
<!-- TODO: Documentar endpoint POST presupuestos -->
**Descripción**: Crear nuevo presupuesto

**Request**:
```http
POST /api/presupuestos
Content-Type: application/json

{
  "descripcion": "string (required)",
  "valor": "number (required)",
  "clienteId": "number (required)",
  "items": [
    {
      "descripcion": "string (required)",
      "cantidad": "number (required)",
      "precioUnitario": "number (required)"
    }
  ]
}
```

### GET /presupuestos/cliente/:clienteId
<!-- TODO: Documentar endpoint GET presupuestos por cliente -->
**Descripción**: Obtener presupuestos de un cliente específico

**Request**:
```http
GET /api/presupuestos/cliente/1
```

### POST /presupuestos/:id/aprobar
<!-- TODO: Documentar endpoint POST aprobar presupuesto -->
**Descripción**: Aprobar presupuesto y crear venta

**Request**:
```http
POST /api/presupuestos/1/aprobar
Content-Type: application/json

{
  "observaciones": "string (optional)"
}
```

### POST /presupuestos/:id/enviar-email
**Descripción**: Envía un presupuesto por email con el PDF adjunto

**Request**:
```http
POST /api/presupuestos/1/enviar-email
Content-Type: application/json

{
  "to": "cliente@email.com (required)",
  "subject": "string (optional)",
  "message": "string (optional)"
}
```

**Parámetros**:
- `to`: Email de destino (requerido, debe ser un email válido)
- `subject`: Asunto del email (opcional, default: "Presupuesto #[id] - [descripción]")
- `message`: Mensaje del email (opcional, incluye mensaje predeterminado con datos del presupuesto)

**Funcionalidad**:
1. Obtiene el presupuesto por ID
2. Genera el PDF automáticamente si no existe usando `PDFService.generarPresupuestoPDFPorId()`
3. Envía el email con el PDF adjunto usando `EmailService.sendEmail()`
4. Incluye mensaje personalizado con datos del presupuesto formateados

**Response exitosa (200)**:
```json
{
  "success": true,
  "message": "Presupuesto enviado por email con éxito"
}
```

**Errores**:
- **400**: Validación de datos
  ```json
  {
    "success": false,
    "error": "El campo 'to' es requerido" | "Email de destino inválido"
  }
  ```

- **404**: Presupuesto no encontrado
  ```json
  {
    "success": false,
    "error": "Presupuesto no encontrado"
  }
  ```

- **500**: Error generando PDF o enviando email
  ```json
  {
    "success": false,
    "error": "Error al generar el archivo PDF" | "Error al enviar el email",
    "details": "Mensaje específico del error"
  }
  ```

**Ejemplos de uso**:

```bash
# curl
curl -X POST http://localhost:4000/api/presupuestos/1/enviar-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "cliente@email.com",
    "subject": "Su presupuesto de cortinas",
    "message": "Estimado cliente, adjuntamos el presupuesto solicitado."
  }'
```

```javascript
// JavaScript/Frontend
const response = await fetch('/api/presupuestos/1/enviar-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'cliente@email.com',
    subject: 'Su presupuesto de cortinas',
    message: 'Estimado cliente, adjuntamos el presupuesto solicitado.'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Email enviado exitosamente');
} else {
  console.error('Error:', result.error);
}
```

### POST /presupuestos/:id/pdf
**Descripción**: Genera PDF de presupuesto con autodiagnóstico y reutilización de archivos existentes

**Request**:
```http
POST /api/presupuestos/1/pdf
Content-Type: application/json
```

**Query Parameters**:
- `dryRun=true` (opcional): Ejecuta validaciones sin generar el archivo

**Response exitosa (200)**:
```json
{
  "ok": true,
  "filename": "Presupuesto-1.pdf",
  "publicUrl": "http://localhost:4000/public/pdfs/Presupuesto-1.pdf",
  "cached": false
}
```

**Response con archivo existente (200)**:
```json
{
  "ok": true,
  "filename": "Presupuesto-1.pdf",
  "publicUrl": "http://localhost:4000/public/pdfs/Presupuesto-1.pdf",
  "cached": true
}
```

**Response dry run exitoso (200)**:
```json
{
  "ok": true,
  "canGenerate": true,
  "filename": "Presupuesto-1.pdf",
  "message": "Validaciones pasadas, listo para generar PDF"
}
```

**Response con error y diagnóstico**:
```json
{
  "ok": false,
  "diagnostico": {
    "stage": "fetchBudget" | "templateLoad" | "renderHTML" | "launchBrowser" | "renderPDF" | "ensureDir" | "writeFile" | "staticServe" | "buildPublicUrl",
    "message": "Descripción breve del error",
    "probableCause": ["causa1", "causa2"],
    "suggestedFix": "Acción concreta para solucionar"
  }
}
```

**Errores comunes**:
- **404**: Presupuesto no encontrado
- **400**: Datos del presupuesto incompletos
- **500**: Errores en diferentes etapas (template, browser, PDF, etc.)

**Funcionalidades**:
- Reutiliza PDF existente si ya fue generado
- Validaciones completas de datos del presupuesto
- Formateo es-AR para moneda y fechas
- Logs detallados si `DIAG_VERBOSE=true`
- Autodiagnóstico estructurado en caso de error
- Soporte para dry run con `?dryRun=true`

## 💰 Módulo de Ventas

### GET /ventas
<!-- TODO: Documentar endpoint GET ventas -->
**Descripción**: Obtener todas las ventas

**Request**:
```http
GET /api/ventas
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fecha": "datetime",
      "total": "number",
      "estado": "string",
      "observaciones": "string",
      "clienteId": "number",
      "presupuestoId": "number",
      "cliente": {
        "id": 1,
        "nombre": "string"
      },
      "presupuesto": {
        "id": 1,
        "descripcion": "string"
      },
      "items": [
        {
          "id": 1,
          "descripcion": "string",
          "cantidad": "number",
          "precioUnitario": "number"
        }
      ]
    }
  ]
}
```

### POST /ventas
<!-- TODO: Documentar endpoint POST ventas -->
**Descripción**: Crear nueva venta

**Request**:
```http
POST /api/ventas
Content-Type: application/json

{
  "total": "number (required)",
  "clienteId": "number (required)",
  "presupuestoId": "number (optional)",
  "observaciones": "string (optional)",
  "items": [
    {
      "descripcion": "string (required)",
      "cantidad": "number (required)",
      "precioUnitario": "number (required)"
    }
  ]
}
```

### GET /ventas/presupuesto/:presupuestoId
<!-- TODO: Documentar endpoint GET ventas por presupuesto -->
**Descripción**: Obtener ventas originadas de un presupuesto

**Request**:
```http
GET /api/ventas/presupuesto/1
```

## 📄 Módulo de PDFs

### POST /pdf/presupuesto
<!-- TODO: Documentar endpoint POST generar PDF -->
**Descripción**: Generar PDF de presupuesto

**Request**:
```http
POST /api/pdf/presupuesto
Content-Type: application/json

{
  "presupuestoId": "number (required)",
  "template": "string (optional, default: presupuesto_v1)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "pdfUrl": "string",
    "filename": "string"
  },
  "message": "PDF generado exitosamente"
}
```

### GET /public/pdfs/:filename
<!-- TODO: Documentar endpoint GET descargar PDF -->
**Descripción**: Descargar PDF generado

**Request**:
```http
GET /api/public/pdfs/presupuesto_123_20240101.pdf
```

**Response**: Archivo PDF

## 🔍 Módulo de Diagnóstico

### GET /diag/presupuestos/:id/pdf/status
**Descripción**: Diagnóstico no disruptivo del estado del PDF de un presupuesto

**Request**:
```http
GET /api/diag/presupuestos/1/pdf/status
```

**Response**:
```json
{
  "exists": true,
  "absolutePath": "/path/to/backend/public/pdfs/Presupuesto-1.pdf",
  "expectedUrl": "http://localhost:4000/public/pdfs/Presupuesto-1.pdf",
  "staticMount": "/public"
}
```

**Campos de respuesta**:
- `exists`: boolean - Si el archivo PDF existe físicamente
- `absolutePath`: string - Ruta absoluta del archivo en el servidor
- `expectedUrl`: string - URL pública esperada del archivo
- `staticMount`: string - Punto de montaje de archivos estáticos

**Errores**:
- **500**: Error interno del servidor

## ⚙️ Módulo de Configuración

### GET /config/envios
**Descripción**: Obtener configuración de envíos (email/WhatsApp) con campos sensibles enmascarados

**Autenticación**: Requiere token de administrador

**Request**:
```http
GET /api/config/envios
Authorization: Bearer <admin_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "default",
    "fromName": "Cortinas Aymara",
    "fromEmail": "info@cortinasaymara.com",
    "host": "smtp.gmail.com",
    "port": 587,
    "secureTLS": true,
    "replyTo": "ventas@cortinasaymara.com",
    "wabaId": "123456789",
    "smtpUsername_enc": "***masked***",
    "smtpPassword_enc": "***masked***",
    "whatsappPhoneNumberId_enc": "***masked***",
    "whatsappToken_enc": "***masked***"
  },
  "message": "Configuración obtenida correctamente"
}
```

**Errores**:
- **401**: No autenticado
- **403**: Sin permisos de administrador
- **500**: Error interno del servidor

### PUT /config/envios
**Descripción**: Actualizar configuración de envíos. Los campos sensibles se cifran automáticamente con AES-256-GCM

**Autenticación**: Requiere token de administrador

**Request**:
```http
PUT /api/config/envios
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "fromName": "string (optional)",
  "fromEmail": "string (optional)",
  "host": "string (optional)",
  "port": "number (optional)",
  "secureTLS": "boolean (optional)",
  "replyTo": "string (optional)",
  "wabaId": "string (optional)",
  "smtpUsername": "string (optional) - se cifra automáticamente",
  "smtpPassword": "string (optional) - se cifra automáticamente",
  "whatsappPhoneNumberId": "string (optional) - se cifra automáticamente",
  "whatsappToken": "string (optional) - se cifra automáticamente"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "default",
    "fromName": "Cortinas Aymara",
    "fromEmail": "info@cortinasaymara.com",
    // ... otros campos con sensibles enmascarados
  },
  "message": "Configuración actualizada correctamente"
}
```

**Errores**:
- **400**: Datos inválidos o payload vacío
- **401**: No autenticado
- **403**: Sin permisos de administrador
- **500**: Error de cifrado o error interno

### POST /config/envios/test-email
**Descripción**: Probar configuración de email enviando un correo de prueba

**Autenticación**: Requiere header X-Admin-Key

**Request**:
```http
POST /api/config/envios/test-email
X-Admin-Key: <admin_key>
Content-Type: application/json

{
  "to": "string (required) - email destino válido",
  "subject": "string (optional, max 200 chars) - asunto del email",
  "message": "string (optional, max 1000 chars) - mensaje personalizado"
}
```

**Validaciones**:
- `to`: email válido (requerido)
- `subject`: opcional, máximo 200 caracteres (default: "Prueba de envío")
- `message`: opcional, máximo 1000 caracteres (default: mensaje estándar)

**Response exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "messageId": "string - ID del mensaje enviado",
    "to": "string - email destino",
    "subject": "string - asunto usado",
    "sentAt": "string - timestamp ISO",
    "provider": "smtp"
  },
  "message": "Email de prueba enviado correctamente"
}
```

**Errores**:
- **400**: Validación de datos
  ```json
  {
    "success": false,
    "error": "Datos inválidos",
    "message": "El campo 'to' es requerido" | "Email inválido" | "Subject/message muy largo"
  }
  ```

- **401**: No autenticado
  ```json
  {
    "error": "Acceso no autorizado",
    "message": "Se requiere autenticación de administrador"
  }
  ```

- **403**: Sin permisos
  ```json
  {
    "error": "Acceso denegado", 
    "message": "Credenciales de administrador inválidas"
  }
  ```

- **424**: Configuración incompleta
  ```json
  {
    "success": false,
    "error": "Configuración incompleta",
    "message": "Faltan datos SMTP requeridos: host, fromEmail, smtpUsername y smtpPassword son obligatorios."
  }
  ```

- **502**: Error SMTP
  ```json
  {
    "success": false,
    "error": "Error de autenticación SMTP" | "Error de conexión SMTP" | "Error del servidor SMTP",
    "message": "Mensaje específico del error sin exponer credenciales"
  }
  ```

- **500**: Error interno
  ```json
  {
    "success": false,
    "error": "Error interno del servidor",
    "message": "No se pudo enviar el email de prueba"
  }
  ```

**Funcionalidades**:
- Usa `getConfigForInternalUse()` para obtener credenciales descifradas
- Crea transporter de nodemailer con configuración actual
- Maneja formato From con/sin fromName
- Incluye replyTo si está configurado
- Registra auditoría sin exponer datos sensibles
- Manejo específico de errores SMTP (EAUTH, ECONNECTION, etc.)

### POST /config/envios/test-whatsapp
**Descripción**: Probar configuración de WhatsApp enviando un mensaje de prueba

**Autenticación**: Requiere token de administrador

**Request**:
```http
POST /api/config/envios/test-whatsapp
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "to": "string (required) - número en formato E.164"
}
```

**Validaciones**:
- `to`: formato E.164 válido (requerido) - regex: `^\+[1-9]\d{1,14}$`

**Response exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "messageId": "string - ID del mensaje de WhatsApp",
    "to": "string - número destino",
    "sentAt": "string - timestamp ISO",
    "provider": "whatsapp_cloud",
    "status": "sent"
  },
  "message": "Mensaje de WhatsApp enviado correctamente"
}
```

**Errores**:
- **400**: Validación de datos
  ```json
  {
    "success": false,
    "error": "Datos inválidos",
    "message": "El número de teléfono debe estar en formato E.164 (ej: +5491123456789)"
  }
  ```

- **401**: No autenticado
  ```json
  {
    "error": "Acceso no autorizado",
    "message": "Se requiere autenticación de administrador"
  }
  ```

- **403**: Sin permisos
  ```json
  {
    "error": "Acceso denegado", 
    "message": "Credenciales de administrador inválidas"
  }
  ```

- **424**: Configuración incompleta
  ```json
  {
    "success": false,
    "error": "Configuración incompleta",
    "message": "Configuración incompleta: faltan credenciales de WhatsApp"
  }
  ```

- **502**: Errores de WhatsApp Cloud API
  ```json
  {
    "success": false,
    "error": "Error de autenticación WhatsApp" | "Error de destinatario WhatsApp" | "Error de configuración WhatsApp" | "Error de límite de WhatsApp" | "Error de conexión WhatsApp" | "Error de WhatsApp Cloud API",
    "message": "Mensaje específico del error sin exponer credenciales"
  }
  ```

- **500**: Error interno
  ```json
  {
    "success": false,
    "error": "Error interno del servidor",
    "message": "No se pudo enviar el mensaje de WhatsApp"
  }
  ```

**Funcionalidades**:
- Usa `getConfigForInternalUse()` para obtener credenciales descifradas
- Valida formato E.164 con regex estricto
- Integra con WhatsApp Cloud API v20.0 de Meta
- Timeout de 10 segundos para requests HTTP
- Registra auditoría sin exponer tokens
- Manejo específico de errores de WhatsApp (401, 400, 429, etc.)
- Mensaje de prueba: "Mensaje de prueba desde ERP Cortinas"

**Ejemplos de uso**:

```bash
# curl
curl -X POST http://localhost:4000/api/config/envios/test-whatsapp \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"to": "+5491123456789"}'
```

```powershell
# PowerShell
$headers = @{
    "Authorization" = "Bearer <admin_token>"
    "Content-Type" = "application/json"
}
$body = @{
    "to" = "+5491123456789"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/config/envios/test-whatsapp" -Method POST -Headers $headers -Body $body
```

## 📱 Servicio de WhatsApp

### sendBudgetPdfWhatsApp(presupuesto, publicUrl)
**Descripción**: Servicio interno para enviar PDF de presupuesto al cliente por WhatsApp

**Ubicación**: `src/services/whatsapp.service.js`

**Parámetros**:
- `presupuesto`: Objeto presupuesto con datos del cliente incluidos
- `publicUrl`: URL pública del PDF generado

**Validaciones**:
- Credenciales de WhatsApp completas (`whatsappPhoneNumberId` y `whatsappToken`)
- Número de teléfono del cliente en formato E.164 válido
- Presupuesto con datos de cliente válidos

**Mensaje Enviado**:
```
📄 ¡Hola [nombre]! Te compartimos el presupuesto #[número]. Podés verlo en el siguiente enlace:
[publicUrl]
```

**Response exitosa**:
```javascript
{
  success: true,
  messageId: "string - ID del mensaje de WhatsApp",
  to: "string - número destino",
  presupuestoId: "number - ID del presupuesto",
  sentAt: "string - timestamp ISO"
}
```

**Errores**:
- `"Credenciales de WhatsApp incompletas"`: Faltan credenciales en configuración
- `"Número de teléfono del cliente inválido"`: Teléfono no está en formato E.164
- `"Error enviando WhatsApp: [mensaje]"`: Errores de la API de WhatsApp

**Funcionalidades**:
- Usa `getConfigForInternalUse()` para obtener credenciales descifradas
- Valida formato E.164 del teléfono del cliente
- Personaliza mensaje con nombre del cliente y número de presupuesto
- Integra con WhatsApp Cloud API v20.0
- Timeout de 10 segundos para requests HTTP
- Logs detallados sin exponer tokens
- Manejo de errores con información útil

**Ejemplo de uso**:
```javascript
import { sendBudgetPdfWhatsApp } from '../services/whatsapp.service.js';

try {
  const presupuesto = {
    id: 123,
    cliente: {
      nombre: "Juan Pérez",
      telefono: "+5491123456789"
    }
  };
  
  const publicUrl = "https://example.com/public/pdfs/Presupuesto-123.pdf";
  
  const result = await sendBudgetPdfWhatsApp(presupuesto, publicUrl);
  console.log('WhatsApp enviado:', result.messageId);
} catch (error) {
  console.error('Error:', error.message);
}
```

### DELETE /config/envios/credenciales-corruptas
**[ENDPOINT SEGURO - ADMIN]** Limpia las credenciales cifradas corruptas que pueden estar causando errores en el sistema de cifrado.

**Autenticación**: Requiere header X-Admin-Key

**Request**:
```http
DELETE /api/config/envios/credenciales-corruptas
X-Admin-Key: <admin_key>
Content-Type: application/json
```

**Funcionalidad**:
- Busca la configuración con ID "default"
- Establece como null los campos: `smtpUsername_enc`, `smtpPassword_enc`, `whatsappPhoneNumberId_enc`, `whatsappToken_enc`
- Registra la acción en logs de auditoría detallados

**Response exitosa (200)**:
```json
{
  "success": true,
  "message": "Credenciales cifradas corruptas limpiadas correctamente",
  "detalles": {
    "configuracionId": "default",
    "camposLimpiados": [
      "smtpUsername_enc",
      "smtpPassword_enc", 
      "whatsappPhoneNumberId_enc",
      "whatsappToken_enc"
    ],
    "timestamp": "2025-01-10T16:50:49.123Z"
  }
}
```

**Response si no se encuentra configuración (404)**:
```json
{
  "success": false,
  "message": "No se encontró configuración con ID \"default\" para limpiar",
  "detalles": {
    "configuracionId": "default",
    "encontrada": false,
    "timestamp": "2025-01-10T16:50:49.123Z"
  }
}
```

**Errores**:
- **401**: No autenticado
  ```json
  {
    "error": "Acceso no autorizado",
    "message": "Se requiere autenticación de administrador"
  }
  ```

- **403**: Sin permisos
  ```json
  {
    "error": "Acceso denegado", 
    "message": "Credenciales de administrador inválidas"
  }
  ```

- **500**: Error interno
  ```json
  {
    "success": false,
    "error": "Error interno del servidor",
    "message": "Error interno del servidor al limpiar credenciales",
    "timestamp": "2025-01-10T16:50:49.123Z"
  }
  ```

**Casos de uso**:
- Recuperación cuando las credenciales quedan mal guardadas debido a errores de cifrado
- Limpieza después de cambios en claves de cifrado que corrompen los datos existentes
- Reseteo completo de credenciales cuando el sistema de cifrado falla

**Funcionalidades de seguridad**:
- Registra IP del administrador que ejecuta la acción
- Logs detallados sin exponer datos sensibles
- Auditoría completa de la operación
- Timestamp preciso de la operación

**Ejemplos de uso**:

```bash
# curl
curl -X DELETE http://localhost:4000/api/config/envios/credenciales-corruptas \
  -H "X-Admin-Key: admin-key-default" \
  -H "Content-Type: application/json"
```

```powershell
# PowerShell
$headers = @{
    "X-Admin-Key" = "admin-key-default"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:4000/api/config/envios/credenciales-corruptas" -Method DELETE -Headers $headers
```

## 🔒 Autenticación (Preparado)

### POST /auth/login
<!-- TODO: Documentar endpoint POST login -->
**Descripción**: Iniciar sesión

**Request**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": 1,
      "email": "string",
      "name": "string"
    }
  }
}
```

### POST /auth/logout
<!-- TODO: Documentar endpoint POST logout -->
**Descripción**: Cerrar sesión

### GET /auth/me
<!-- TODO: Documentar endpoint GET perfil usuario -->
**Descripción**: Obtener perfil del usuario autenticado

## 🚨 Manejo de Errores

### Formato de Error
<!-- TODO: Definir formato estándar de errores -->
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo del error",
    "details": "Detalles adicionales (opcional)"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Códigos de Error Comunes
<!-- TODO: Documentar códigos de error específicos -->
- **VALIDATION_ERROR**: Error de validación de datos
- **NOT_FOUND**: Recurso no encontrado
- **UNAUTHORIZED**: No autenticado
- **FORBIDDEN**: Sin permisos
- **INTERNAL_ERROR**: Error interno del servidor
- **DATABASE_ERROR**: Error de base de datos
- **ENCRYPTION_ERROR**: Error de cifrado/descifrado

### Ejemplos de Errores
<!-- TODO: Proporcionar ejemplos de errores -->

#### Error de Validación
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": {
      "field": "email",
      "message": "Email inválido"
    }
  }
}
```

#### Recurso No Encontrado
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Cliente no encontrado"
  }
}
```

## 📊 Rate Limiting

### Límites por Endpoint
<!-- TODO: Definir límites de rate limiting -->
- **General**: 100 requests/minuto
- **Auth**: 10 requests/minuto
- **PDF Generation**: 20 requests/minuto

### Headers de Rate Limiting
<!-- TODO: Documentar headers de rate limiting -->
- `X-RateLimit-Limit`: Límite total
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp de reset

## 🔄 Versionado de API

### Estrategia de Versionado
<!-- TODO: Definir estrategia de versionado -->
- **Método**: URL path versioning
- **Formato**: `/api/v1/endpoint`
- **Versión Actual**: v1

### Compatibilidad
<!-- TODO: Definir política de compatibilidad -->
- **Backward Compatibility**: 
- **Deprecation Policy**: 
- **Migration Guide**: 

## 📝 Ejemplos de Uso

### Flujo Completo: Cliente → Presupuesto → Venta
<!-- TODO: Proporcionar ejemplo de flujo completo -->
```javascript
// 1. Crear cliente
const cliente = await fetch('/api/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Juan Pérez',
    email: 'juan@email.com'
  })
});

// 2. Crear presupuesto
const presupuesto = await fetch('/api/presupuestos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    descripcion: 'Cortina metálica',
    valor: 15000,
    clienteId: cliente.data.id,
    items: [
      {
        descripcion: 'Cortina 3x2m',
        cantidad: 1,
        precioUnitario: 15000
      }
    ]
  })
});

// 3. Generar PDF
const pdf = await fetch('/api/pdf/presupuesto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    presupuestoId: presupuesto.data.id
  })
});

// 4. Aprobar presupuesto (crear venta)
const venta = await fetch(`/api/presupuestos/${presupuesto.data.id}/aprobar`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    observaciones: 'Aprobado por el cliente'
  })
});
```

## 🧪 Testing de APIs

### Herramientas Recomendadas
<!-- TODO: Listar herramientas para testing -->
- **Postman**: Collection disponible
- **curl**: Ejemplos de comandos
- **Jest/Supertest**: Tests automatizados

### Collection de Postman
<!-- TODO: Proporcionar link a collection -->
- **URL**: 
- **Variables de entorno**: 

---

*Última actualización: [FECHA]*
*Responsable: [NOMBRE]*
