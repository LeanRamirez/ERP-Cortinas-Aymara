# DECISIONS - ERP Cortinas Aymara

## 📋 Registro de Decisiones Arquitectónicas (ADR)

### Información General
- **Proyecto**: ERP Cortinas Aymara
- **Responsable**: Equipo de Desarrollo
- **Última Actualización**: Agosto 2025

## 🏗 Decisiones Arquitectónicas

### ADR-001: Arquitectura Monolítica Modular
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de un sistema ERP para pequeña empresa de cortinas metálicas con requerimientos claros y equipo pequeño
**Decisión**: Implementar arquitectura monolítica con separación por módulos de negocio
**Consecuencias**: 
- ✅ Simplicidad de deployment y desarrollo
- ✅ Menor complejidad operacional
- ❌ Acoplamiento entre módulos
- ❌ Escalabilidad limitada
**Alternativas Consideradas**: Microservicios (rechazado por complejidad innecesaria)

### ADR-002: Base de Datos SQLite (Dev) + PostgreSQL (Prod)
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de desarrollo rápido local y robustez en producción
**Decisión**: SQLite para desarrollo, PostgreSQL para producción
**Consecuencias**: 
- ✅ Desarrollo sin dependencias externas
- ✅ Robustez en producción
- ❌ Diferencias menores entre ambientes
**Alternativas Consideradas**: PostgreSQL en todos los ambientes (rechazado por complejidad de setup local)

### ADR-003: ORM Prisma
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de type-safety y migraciones automáticas
**Decisión**: Usar Prisma como ORM principal
**Consecuencias**: 
- ✅ Type-safety excelente
- ✅ Migraciones automáticas
- ✅ Introspección de DB
- ❌ Curva de aprendizaje
**Alternativas Consideradas**: Sequelize, TypeORM (rechazados por menor type-safety)

### ADR-004: Frontend React 18
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de UI reactiva y ecosistema maduro
**Decisión**: React 18 con hooks y functional components
**Consecuencias**: 
- ✅ Ecosistema maduro
- ✅ Concurrent features
- ✅ Hooks para state management
- ❌ Bundle size considerable
**Alternativas Consideradas**: Vue.js, Svelte (rechazados por menor ecosistema)

### ADR-005: CSS Modules
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de estilos scoped sin runtime overhead
**Decisión**: CSS Modules para estilos componentes
**Consecuencias**: 
- ✅ Scoping automático
- ✅ Sin runtime overhead
- ✅ Compatibilidad con Vite
- ❌ Sintaxis menos elegante que styled-components
**Alternativas Consideradas**: Styled-components, Tailwind (rechazados por complejidad/tamaño)

### ADR-006: Generación de PDFs con Puppeteer
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de PDFs profesionales con diseño complejo
**Decisión**: Puppeteer + templates HTML/CSS para PDFs
**Consecuencias**: 
- ✅ Control total sobre diseño
- ✅ Reutilización de skills HTML/CSS
- ✅ PDFs de alta calidad
- ❌ Mayor consumo de recursos
**Alternativas Consideradas**: PDFKit, jsPDF (rechazados por limitaciones de diseño)

### ADR-007: Sistema de Cifrado AES-256-GCM
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de proteger credenciales SMTP y WhatsApp
**Decisión**: AES-256-GCM para cifrado de datos sensibles
**Consecuencias**: 
- ✅ Seguridad robusta
- ✅ Autenticación integrada
- ✅ Estándar de la industria
- ❌ Complejidad de gestión de claves
**Alternativas Consideradas**: AES-256-CBC (rechazado por falta de autenticación)

### ADR-008: Contenedorización con Docker
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de deployment consistente y aislamiento
**Decisión**: Docker + Docker Compose para desarrollo y producción
**Consecuencias**: 
- ✅ Consistencia entre ambientes
- ✅ Aislamiento de dependencias
- ✅ Escalabilidad horizontal preparada
- ❌ Overhead de recursos
**Alternativas Consideradas**: Deployment nativo (rechazado por inconsistencias)

### ADR-009: No Usar window.alert para Feedback
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: window.alert bloquea la UI y proporciona mala UX
**Decisión**: Implementar sistema de notificaciones custom en lugar de window.alert
**Consecuencias**: 
- ✅ Mejor experiencia de usuario
- ✅ UI no bloqueante
- ✅ Consistencia visual
- ❌ Más código a mantener
**Alternativas Consideradas**: window.alert (rechazado por mala UX)

### ADR-010: Eliminar Estado Global de Ventas
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Estado de ventas causaba complejidad innecesaria y re-renders
**Decisión**: Manejar datos de ventas con fetch directo desde componentes
**Consecuencias**: 
- ✅ Menor complejidad de estado
- ✅ Menos re-renders innecesarios
- ✅ Datos siempre actualizados
- ❌ Más llamadas a API
**Alternativas Consideradas**: Context API, Zustand (rechazados por over-engineering)

### ADR-011: Generación PDF con Autodiagnóstico
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de generar PDFs de presupuestos con manejo robusto de errores y reutilización de archivos
**Decisión**: Implementar sistema de generación PDF con autodiagnóstico estructurado y reutilización de archivos existentes
**Consecuencias**: 
- ✅ Diagnóstico claro de errores por etapas
- ✅ Reutilización de PDFs existentes (performance)
- ✅ Logs detallados controlados por variable de entorno
- ✅ Validaciones completas de datos
- ❌ Mayor complejidad en el código
**Alternativas Consideradas**: Sistema simple sin diagnóstico (rechazado por dificultad de debugging)

### ADR-012: Rutas de Diagnóstico Separadas
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de endpoints de diagnóstico no disruptivos para troubleshooting
**Decisión**: Crear módulo `/api/diag` separado para funciones de diagnóstico
**Consecuencias**: 
- ✅ Separación clara entre funcionalidad y diagnóstico
- ✅ Endpoints no disruptivos
- ✅ Facilita troubleshooting sin afectar operaciones
- ❌ Más rutas a mantener
**Alternativas Consideradas**: Integrar diagnóstico en rutas principales (rechazado por mezclar responsabilidades)

### ADR-013: Formato de Diagnóstico Estructurado
**Fecha**: Agosto 2025
**Estado**: Aceptada
**Contexto**: Necesidad de formato consistente para reportar errores con información útil para resolución
**Decisión**: Usar formato `{ stage, message, probableCause, suggestedFix }` para todos los errores de diagnóstico
**Consecuencias**: 
- ✅ Información estructurada y útil para debugging
- ✅ Consistencia en manejo de errores
- ✅ Facilita automatización de troubleshooting
- ❌ Más código para manejar cada tipo de error
**Alternativas Consideradas**: Mensajes de error simples (rechazado por falta de información útil)

## 🛠 Decisiones Técnicas

### Tecnologías Seleccionadas

#### Backend
<!-- TODO: Documentar decisiones del backend -->
- **Node.js**: Razón de selección
- **Express.js**: Razón de selección
- **ES Modules**: Razón de selección
- **Prisma**: Razón de selección

#### Frontend
<!-- TODO: Documentar decisiones del frontend -->
- **React 18**: Razón de selección
- **Vite**: Razón de selección
- **Axios**: Razón de selección
- **React Router**: Razón de selección

#### DevOps
<!-- TODO: Documentar decisiones de DevOps -->
- **Docker Compose**: Razón de selección
- **PostgreSQL**: Razón de selección para producción
- **Nginx**: Razón de selección para proxy

### Patrones de Diseño

#### Arquitectura por Módulos
<!-- TODO: Documentar decisión sobre módulos -->
**Decisión**: Organizar código por módulos de negocio
**Razón**: 
**Beneficios**: 
**Desventajas**: 

#### Separación Controller-Service-Repository
<!-- TODO: Documentar decisión sobre capas -->
**Decisión**: Implementar separación de capas
**Razón**: 
**Beneficios**: 
**Desventajas**: 

#### Singleton para Configuración
<!-- TODO: Documentar decisión sobre singleton -->
**Decisión**: Usar patrón singleton para configuración empresarial
**Razón**: 
**Beneficios**: 
**Desventajas**: 

## 🔐 Decisiones de Seguridad

### Cifrado de Datos Sensibles
<!-- TODO: Documentar decisiones de seguridad -->
**Decisión**: Cifrar datos sensibles con AES-256-GCM
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Gestión de Claves
<!-- TODO: Documentar gestión de claves -->
**Decisión**: Usar variables de entorno para claves
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Autenticación JWT (Preparada)
<!-- TODO: Documentar decisión sobre autenticación -->
**Decisión**: Preparar infraestructura para JWT
**Razón**: 
**Implementación**: 
**Consideraciones**: 

## 📊 Decisiones de Base de Datos

### Modelo de Datos
<!-- TODO: Documentar decisiones del modelo -->
**Decisión**: Modelo relacional con Prisma
**Razón**: 
**Entidades Principales**: Cliente, Presupuesto, Venta, ConfiguracionEmpresa
**Relaciones**: 

### Estrategia de Migraciones
<!-- TODO: Documentar estrategia de migraciones -->
**Decisión**: Usar Prisma Migrate
**Razón**: 
**Proceso**: 
**Consideraciones**: 

### Datos de Prueba (Seeding)
<!-- TODO: Documentar estrategia de seeding -->
**Decisión**: Scripts de seed modulares
**Razón**: 
**Implementación**: 
**Consideraciones**: 

## 🎨 Decisiones de UI/UX

### Diseño Responsive
<!-- TODO: Documentar decisiones de diseño -->
**Decisión**: Diseño mobile-first
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Sistema de Navegación
<!-- TODO: Documentar navegación -->
**Decisión**: Navegación por pestañas
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Feedback Visual
<!-- TODO: Documentar feedback visual -->
**Decisión**: Estados de carga y confirmación
**Razón**: 
**Implementación**: 
**Consideraciones**: 

## 🔄 Decisiones de Integración

### APIs Externas
<!-- TODO: Documentar integraciones -->
**Decisión**: Preparar para SMTP y WhatsApp
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Generación de Documentos
<!-- TODO: Documentar generación de documentos -->
**Decisión**: PDFs con Puppeteer y templates HTML
**Razón**: 
**Implementación**: 
**Consideraciones**: 

## 📈 Decisiones de Escalabilidad

### Estrategia de Caching
<!-- TODO: Documentar estrategia de caching -->
**Decisión**: Sin caching inicial, preparado para implementar
**Razón**: 
**Futuras Consideraciones**: 

### Optimización de Consultas
<!-- TODO: Documentar optimización -->
**Decisión**: Usar includes de Prisma para relaciones
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Manejo de Archivos
<!-- TODO: Documentar manejo de archivos -->
**Decisión**: Almacenamiento local para PDFs
**Razón**: 
**Implementación**: 
**Futuras Consideraciones**: 

## 🧪 Decisiones de Testing

### Estrategia de Testing
<!-- TODO: Documentar estrategia de testing -->
**Decisión**: Testing preparado pero no implementado inicialmente
**Razón**: 
**Plan Futuro**: 
**Herramientas Consideradas**: 

### Cobertura de Código
<!-- TODO: Documentar cobertura -->
**Decisión**: Objetivo de cobertura futura
**Razón**: 
**Métricas Objetivo**: 

## 🚀 Decisiones de Deployment

### Estrategia de Contenedorización
<!-- TODO: Documentar contenedorización -->
**Decisión**: Docker para desarrollo y producción
**Razón**: 
**Implementación**: 
**Consideraciones**: 

### Orquestación de Servicios
<!-- TODO: Documentar orquestación -->
**Decisión**: Docker Compose para simplicidad
**Razón**: 
**Implementación**: 
**Futuras Consideraciones**: 

### Ambientes de Deployment
<!-- TODO: Documentar ambientes -->
**Decisión**: Desarrollo local, preparado para staging/producción
**Razón**: 
**Configuración**: 

## 📝 Decisiones Rechazadas

### Alternativas No Seleccionadas

#### GraphQL vs REST
<!-- TODO: Documentar decisión rechazada -->
**Alternativa**: GraphQL
**Razón del Rechazo**: 
**Consideraciones Futuras**: 

#### TypeScript vs JavaScript
<!-- TODO: Documentar decisión rechazada -->
**Alternativa**: TypeScript
**Razón del Rechazo**: 
**Consideraciones Futuras**: 

#### State Management (Redux, Zustand)
<!-- TODO: Documentar decisión rechazada -->
**Alternativa**: Redux/Zustand
**Razón del Rechazo**: 
**Consideraciones Futuras**: 

#### Microservicios
<!-- TODO: Documentar decisión rechazada -->
**Alternativa**: Arquitectura de microservicios
**Razón del Rechazo**: 
**Consideraciones Futuras**: 

## 🔄 Decisiones Pendientes

### Decisiones por Tomar
<!-- TODO: Listar decisiones pendientes -->
- [ ] **Sistema de Logging**: Winston vs alternativas
- [ ] **Monitoreo**: Prometheus + Grafana vs alternativas
- [ ] **Testing Framework**: Jest vs Vitest
- [ ] **CI/CD Pipeline**: GitHub Actions vs alternativas
- [ ] **Error Tracking**: Sentry vs alternativas

### Criterios de Evaluación
<!-- TODO: Definir criterios para futuras decisiones -->
- **Performance**: 
- **Mantenibilidad**: 
- **Costo**: 
- **Curva de Aprendizaje**: 
- **Comunidad y Soporte**: 

## 📊 Métricas de Decisiones

### Criterios de Evaluación Utilizados
<!-- TODO: Documentar criterios utilizados -->
- **Simplicidad**: Peso X
- **Performance**: Peso X
- **Mantenibilidad**: Peso X
- **Escalabilidad**: Peso X
- **Costo**: Peso X

### Matriz de Decisión (Ejemplo)
<!-- TODO: Proporcionar ejemplo de matriz -->
| Criterio | React | Vue | Angular | Peso |
|----------|-------|-----|---------|------|
| Simplicidad | 9 | 8 | 6 | 30% |
| Performance | 8 | 9 | 8 | 25% |
| Ecosistema | 10 | 7 | 9 | 25% |
| Curva Aprendizaje | 7 | 9 | 5 | 20% |
| **Total** | **8.4** | **8.1** | **7.0** | **100%** |

## 🔍 Revisión de Decisiones

### Proceso de Revisión
<!-- TODO: Definir proceso de revisión -->
- **Frecuencia**: 
- **Criterios para Revisión**: 
- **Responsables**: 
- **Documentación**: 

### Decisiones a Revisar
<!-- TODO: Listar decisiones para revisar -->
- [ ] **ADR-001**: Revisar en 6 meses
- [ ] **ADR-002**: Revisar cuando se alcance X usuarios
- [ ] **ADR-003**: Revisar si surgen problemas de performance

## ADR-009: Implementación de WhatsApp Cloud API para Pruebas

**Fecha**: 2025-08-27
**Estado**: Aceptado
**Contexto**: Necesidad de implementar endpoint de prueba para WhatsApp Cloud API

### Decisión
Implementar endpoint `POST /api/config/envios/test-whatsapp` con las siguientes características:

#### Validación E.164
- **Regex utilizado**: `^\+[1-9]\d{1,14}$`
- **Justificación**: Formato estándar internacional para números telefónicos
- **Cobertura**: Valida números de 2 a 15 dígitos con prefijo + obligatorio

#### Versión de Graph API
- **Versión seleccionada**: v20.0
- **Justificación**: Versión estable y ampliamente soportada de Meta Graph API
- **URL base**: `https://graph.facebook.com/v20.0/{phoneNumberId}/messages`

#### Manejo de Errores Específicos
- **401**: Token inválido o expirado
- **400**: Número no registrado o no autorizado como tester
- **400**: Phone Number ID inválido
- **429**: Rate limiting excedido
- **502**: Errores genéricos de Cloud API

#### Seguridad
- **Middleware**: requireAdmin + auditLog('TEST_WHATSAPP')
- **Auditoría**: Registra destinatario y timestamp sin exponer tokens
- **Timeout**: 10 segundos para requests HTTP

#### Mensaje de Prueba
- **Contenido**: "Mensaje de prueba desde ERP Cortinas"
- **Tipo**: Mensaje de texto simple
- **Justificación**: Mensaje claro y identificable para pruebas

### Alternativas Consideradas
1. **Usar libphonenumber-js**: Descartado por simplicidad, regex E.164 es suficiente
2. **Graph API v19.0**: Descartado por ser versión anterior
3. **Timeout de 30s**: Reducido a 10s para mejor UX

### Consecuencias
- **Positivas**: Validación robusta, manejo específico de errores, integración segura
- **Negativas**: Dependencia de Meta Graph API, requiere configuración previa
- **Riesgos**: Cambios en API de Meta, límites de rate limiting

## ADR-010: Servicio de Envío Automático de PDFs por WhatsApp

**Fecha**: 2025-08-27
**Estado**: Aceptado
**Contexto**: Necesidad de enviar automáticamente PDFs de presupuestos a clientes por WhatsApp

### Decisión
Crear servicio `sendBudgetPdfWhatsApp()` en `src/services/whatsapp.service.js` para envío automático de PDFs de presupuestos al aprobar.

#### Características del Servicio
- **Ubicación**: `src/services/whatsapp.service.js`
- **Función**: `sendBudgetPdfWhatsApp(presupuesto, publicUrl)`
- **Integración**: WhatsApp Cloud API v20.0 de Meta
- **Validación**: E.164 para teléfono del cliente
- **Mensaje personalizado**: Incluye nombre del cliente y número de presupuesto

#### Formato del Mensaje
```
📄 ¡Hola [nombre]! Te compartimos el presupuesto #[número]. Podés verlo en el siguiente enlace:
[publicUrl]
```

#### Validaciones Implementadas
- **Credenciales**: Verifica `whatsappPhoneNumberId` y `whatsappToken`
- **Teléfono**: Valida formato E.164 del cliente
- **Datos**: Verifica integridad del objeto presupuesto

#### Manejo de Errores
- **Credenciales incompletas**: Error específico si faltan credenciales
- **Teléfono inválido**: Error si no está en formato E.164
- **API WhatsApp**: Captura y loguea errores sin exponer tokens
- **Timeout**: 10 segundos para requests HTTP

#### Logging Seguro
- **Éxito**: Registra presupuesto, cliente y teléfono sin credenciales
- **Error**: Loguea errores sin exponer tokens de autenticación
- **Formato**: `[WHATSAPP] Acción - Detalles relevantes`

### Alternativas Consideradas
1. **Integrar en controlador**: Descartado por separación de responsabilidades
2. **Usar libphonenumber-js**: Descartado por simplicidad, regex E.164 suficiente
3. **Envío síncrono**: Mantenido para simplicidad inicial
4. **Queue de mensajes**: Considerado para futuro si hay problemas de performance

### Consecuencias
- **Positivas**: Automatización del envío, experiencia de usuario mejorada, logs seguros
- **Negativas**: Dependencia adicional de WhatsApp API, requiere teléfonos válidos
- **Riesgos**: Rate limiting de Meta, cambios en API, fallos de red

### Integración Futura
- Se integrará en el flujo de aprobación de presupuestos
- Posible extensión para otros tipos de documentos
- Consideración de queue para envíos masivos

---

*Última actualización: 2025-08-27*
*Responsable: Cline*
