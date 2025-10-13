# DECISIONS - ERP Cortinas Aymara

## 📋 Registro de Decisiones Arquitectónicas (ADRs)

### ADR-001: Arquitectura Frontend/Backend Separada
**Fecha**: 2024-08-08  
**Estado**: Aceptado  
**Contexto**: Necesidad de separar la lógica de presentación de la lógica de negocio  
**Decisión**: Implementar arquitectura con React frontend y Express backend  
**Consecuencias**: Mayor flexibilidad, mejor escalabilidad, complejidad adicional en despliegue  

### ADR-002: Base de Datos SQLite para Desarrollo
**Fecha**: 2024-08-08  
**Estado**: Aceptado  
**Contexto**: Necesidad de base de datos simple para desarrollo y prototipado  
**Decisión**: Usar SQLite con Prisma ORM, preparado para migrar a PostgreSQL en producción  
**Consecuencias**: Desarrollo más rápido, fácil setup, limitaciones de concurrencia  

### ADR-003: Sistema de Cifrado AES-256-GCM
**Fecha**: 2024-08-23  
**Estado**: Aceptado  
**Contexto**: Necesidad de proteger credenciales sensibles (SMTP, WhatsApp)  
**Decisión**: Implementar cifrado AES-256-GCM con claves derivadas de variables de entorno  
**Consecuencias**: Alta seguridad, complejidad adicional, dependencia de variables de entorno  

### ADR-004: Generación de PDFs con Puppeteer
**Fecha**: 2024-08-09  
**Estado**: Aceptado  
**Contexto**: Necesidad de generar documentos PDF profesionales para presupuestos  
**Decisión**: Usar Puppeteer con templates HTML/CSS para máxima flexibilidad de diseño  
**Consecuencias**: PDFs de alta calidad, mayor consumo de recursos, dependencia de Chrome  

### ADR-005: CSS Modules para Estilos
**Fecha**: 2024-08-08  
**Estado**: Aceptado  
**Contexto**: Necesidad de evitar conflictos de CSS y mantener estilos modulares  
**Decisión**: Usar CSS Modules con naming camelCase  
**Consecuencias**: Estilos encapsulados, mejor mantenibilidad, curva de aprendizaje  

### ADR-006: Patrón Controller-Service-Repository
**Fecha**: 2024-08-08  
**Estado**: Aceptado  
**Contexto**: Necesidad de organizar la lógica de negocio de forma escalable  
**Decisión**: Implementar patrón en capas con Controllers, Services y Prisma como Repository  
**Consecuencias**: Código más organizado, mejor testabilidad, más archivos  

### ADR-007: Autenticación con Headers Personalizados
**Fecha**: 2024-08-23  
**Estado**: Aceptado  
**Contexto**: Necesidad de proteger endpoints administrativos sin sistema complejo de usuarios  
**Decisión**: Usar X-Admin-Key header para operaciones administrativas  
**Consecuencias**: Implementación simple, adecuado para single-tenant, menos granularidad  

### ADR-008: Dockerización con Docker Compose
**Fecha**: 2024-08-08  
**Estado**: Aceptado  
**Contexto**: Necesidad de facilitar despliegue y desarrollo  
**Decisión**: Containerizar frontend y backend con Docker Compose  
**Consecuencias**: Despliegue consistente, fácil desarrollo, dependencia de Docker  

### ADR-009: Persistencia Cifrada de Credenciales WhatsApp
**Fecha**: 2025-09-30  
**Estado**: Aceptado  
**Contexto**: Necesidad de almacenar credenciales de WhatsApp de forma segura en base de datos  
**Decisión**: Implementar campos cifrados `whatsappPhoneNumberId_enc` y `whatsappToken_enc` en modelo ConfiguracionEmpresa  
**Consecuencias**: 
- **Positivas**: Credenciales protegidas con AES-256-GCM, compatibilidad con sistema existente, campos enmascarados en APIs públicas
- **Negativas**: Complejidad adicional en manejo de cifrado/descifrado, dependencia de claves de cifrado
- **Implementación**: 
  - Schema Prisma: Agregados campos `whatsappPhoneNumberId_enc` y `whatsappToken_enc`
  - Servicio: Funciones `getConfigForInternalUse()` descifra automáticamente, `getConfig()` enmascara campos
  - Controlador: `probarEnvioWhatsApp()` usa credenciales descifradas internamente
  - Frontend: FormularioWhatsApp maneja campos enmascarados correctamente

### ADR-010: Integración WhatsApp Cloud API v20.0
**Fecha**: 2025-09-30  
**Estado**: Aceptado  
**Contexto**: Necesidad de enviar mensajes de WhatsApp para notificaciones de presupuestos  
**Decisión**: Integrar con Meta WhatsApp Cloud API v20.0 usando Phone Number ID y Access Token  
**Consecuencias**:
- **Positivas**: API oficial de Meta, alta confiabilidad, formato E.164 estándar
- **Negativas**: Requiere configuración en Meta Business, limitaciones de números de prueba
- **Implementación**:
  - Validación formato E.164 con regex `/^\+[1-9]\d{1,14}$/`
  - Timeout de 10 segundos para requests HTTP
  - Manejo específico de errores (401, 400, 429)
  - Logs de auditoría sin exponer tokens

### ADR-011: Enmascaramiento de Campos Sensibles
**Fecha**: 2025-09-30  
**Estado**: Aceptado  
**Contexto**: Necesidad de mostrar estado de configuración sin exponer credenciales  
**Decisión**: Devolver `***masked***` para campos cifrados en GET /api/config/envios  
**Consecuencias**:
- **Positivas**: Usuario ve que hay credenciales configuradas, no se exponen datos sensibles
- **Negativas**: No se pueden pre-llenar formularios con valores existentes
- **Implementación**:
  - `getConfig()` enmascara campos con valor
  - `getConfigForInternalUse()` descifra para uso interno
  - Frontend detecta `***masked***` y deja campos vacíos

### ADR-012: Validación E.164 para Números WhatsApp
**Fecha**: 2025-09-30  
**Estado**: Aceptado  
**Contexto**: WhatsApp Cloud API requiere formato E.164 estricto  
**Decisión**: Implementar validación con regex `/^\+[1-9]\d{1,14}$/` en frontend y backend  
**Consecuencias**:
- **Positivas**: Previene errores de API, formato internacional estándar
- **Negativas**: Usuarios deben conocer formato E.164
- **Implementación**:
  - Frontend: Auto-agrega `+` si usuario empieza con números
  - Backend: Validación estricta antes de enviar a API
  - Mensajes de error claros con ejemplos

---

*Última actualización: 2025-09-30*  
*Responsable: Sistema ERP Cortinas Aymara*
