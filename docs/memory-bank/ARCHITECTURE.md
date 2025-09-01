# ARCHITECTURE - ERP Cortinas Aymara

## 🏗 Arquitectura General

### Patrón Arquitectónico
- **Tipo**: Arquitectura en capas (Layered Architecture) con separación Frontend/Backend
- **Justificación**: Permite separación clara de responsabilidades, facilita el mantenimiento y escalabilidad. El frontend maneja la presentación mientras el backend gestiona la lógica de negocio y datos.

### Diagrama de Alto Nivel
```
[React Frontend] <--> [Express API] <--> [Prisma ORM] <--> [SQLite/PostgreSQL]
       |                    |                              
   [CSS Modules]        [Módulos de Negocio]              
   [React Router]       [Sistema de Cifrado]              
   [Axios HTTP]         [Generación PDFs]                 
```

### Flujo de Datos Principal: Presupuesto
```
1. Cliente crea presupuesto en frontend
2. FormularioPresupuesto envía datos via Axios
3. Backend valida y guarda en BD via Prisma
4. Usuario genera PDF con Puppeteer
5. Usuario aprueba presupuesto
6. BotonAprobarPresupuesto convierte a venta
7. TablaVentas muestra venta creada
```

## 🎯 Principios de Diseño

### Principios Aplicados
- [x] **Separación de responsabilidades**: Frontend/Backend, Controller/Service/Repository
- [x] **Principio de responsabilidad única**: Cada módulo tiene una función específica
- [x] **Modularidad**: Organización por módulos de negocio (clientes, presupuestos, ventas)
- [x] **Seguridad por diseño**: Cifrado AES-256-GCM para datos sensibles

### Patrones de Diseño
- **MVC (Model-View-Controller)**: Separación en capas con Controllers, Services y Models (Prisma)
- **Repository Pattern**: Prisma actúa como capa de acceso a datos
- **Singleton**: ConfiguracionEmpresa garantiza una sola configuración
- **Template Method**: Sistema de templates para generación de PDFs

## 🖥 Frontend Architecture

### Tecnologías
<!-- TODO: Completar stack tecnológico del frontend -->
- **Framework**: React 18.2.0
- **Bundler**: Vite 4.4.5
- **Routing**: React Router DOM 6.14.0
- **HTTP Client**: Axios 1.4.0
- **Styling**: CSS Modules

### Estructura de Carpetas
```
frontend/src/
├── components/                        # Componentes reutilizables
│   ├── Navbar.jsx                    # Navegación principal
│   ├── DashboardCard.jsx             # Tarjetas del dashboard
│   ├── TablaVentas.jsx               # Tabla de ventas con filtros
│   ├── FormularioPresupuesto.jsx     # Formulario de presupuestos
│   └── BotonAprobarPresupuesto.jsx   # Botón para aprobar presupuestos
├── pages/                            # Páginas principales
│   ├── Home.jsx                      # Dashboard con métricas
│   ├── Clientes.jsx                  # Gestión de clientes
│   ├── Presupuestos.jsx              # Gestión de presupuestos
│   └── Ventas.jsx                    # Gestión de ventas
├── hooks/                            # Custom hooks
│   └── useVentasFromPresupuestos.js  # Hook para ventas desde presupuestos
├── styles/                           # CSS Modules
│   ├── global.css                    # Estilos globales
│   ├── Navbar.module.css             # Estilos de navegación
│   ├── Home.module.css               # Estilos del dashboard
│   ├── Clientes.module.css           # Estilos de clientes
│   ├── Presupuestos.module.css       # Estilos de presupuestos
│   ├── Ventas.module.css             # Estilos de ventas
│   ├── TablaVentas.module.css        # Estilos de tabla de ventas
│   ├── FormularioPresupuesto.module.css
│   └── BotonAprobarPresupuesto.module.css
└── main.jsx                          # Punto de entrada con React Router
```

### Componentes Principales
- **Navbar**: Navegación principal con enlaces a todas las secciones del ERP
- **FormularioPresupuesto**: Formulario complejo para crear presupuestos con items dinámicos
- **TablaVentas**: Tabla que muestra ventas con filtros y vinculación a presupuestos
- **BotonAprobarPresupuesto**: Componente que convierte presupuestos en ventas
- **DashboardCard**: Tarjetas reutilizables para métricas del dashboard

### Estado y Gestión de Datos
- **Estado Local**: useState para formularios y estados de componentes
- **Estado Global**: No implementado (se usa prop drilling y hooks personalizados)
- **Cache**: Sin implementar, datos se obtienen en cada request
- **Custom Hooks**: useVentasFromPresupuestos para lógica específica de ventas

## 🔧 Backend Architecture

### Tecnologías
<!-- TODO: Completar stack tecnológico del backend -->
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **ORM**: Prisma 5.0.0
- **Database**: SQLite/PostgreSQL
- **Authentication**: JWT (preparado)

### Estructura de Carpetas
```
backend/src/
├── modules/                          # Módulos de negocio
│   ├── clientes/
│   │   ├── clientes.controller.js    # Controlador HTTP
│   │   ├── clientes.service.js       # Lógica de negocio
│   │   └── clientes.routes.js        # Rutas Express
│   ├── presupuestos/
│   │   ├── presupuestos.controller.js
│   │   ├── presupuestos.service.js
│   │   └── presupuestos.routes.js
│   ├── ventas/
│   │   ├── ventas.controller.js
│   │   ├── ventas.service.js
│   │   └── ventas.routes.js
│   ├── pdf/
│   │   ├── pdf.controller.js         # Generación de PDFs
│   │   ├── pdf.service.js            # Lógica con Puppeteer
│   │   ├── pdf.routes.js
│   │   └── README.md                 # Documentación del módulo
│   └── configuracion/
│       ├── configuracion.controller.js
│       ├── configuracion.service.js  # Cifrado/descifrado
│       └── configuracion.routes.js
├── config/
│   ├── db.js                         # Cliente Prisma
│   └── encryption.js                 # Sistema de cifrado AES-256-GCM
├── middleware/
│   └── auth.js                       # Middleware de autenticación
└── server.js                         # Servidor Express principal
```

### Módulos del Sistema
- **Clientes**: CRUD completo, validaciones, endpoints `/api/clientes`
- **Presupuestos**: Gestión de cotizaciones con items, aprobación, endpoints `/api/presupuestos`
- **Ventas**: Registro de ventas, vinculación con presupuestos, endpoints `/api/ventas`
- **PDFs**: Generación con Puppeteer, templates HTML/CSS, endpoints `/api/pdf`
- **Configuración**: Gestión segura con cifrado, endpoints `/api/config`

### Capas de la Aplicación
- **Controller Layer**: Manejo de HTTP requests/responses, validación de entrada, formateo de salida
- **Service Layer**: Lógica de negocio, validaciones complejas, orquestación de operaciones
- **Data Access Layer**: Prisma ORM, queries a base de datos, transacciones

## 🗄 Base de Datos

### Tecnología
<!-- TODO: Documentar tecnología de base de datos -->
- **Motor**: SQLite (desarrollo) / PostgreSQL (producción)
- **ORM**: Prisma
- **Migraciones**: Prisma Migrate

### Modelo de Datos
<!-- TODO: Documentar modelo de datos -->
- **Entidades Principales**: Cliente, Presupuesto, Venta, ConfiguracionEmpresa
- **Relaciones**: Documentar relaciones entre entidades

### Estrategia de Datos
<!-- TODO: Documentar estrategia de datos -->
- **Backup**: 
- **Replicación**: 
- **Indexación**: 

## 🔐 Seguridad

### Medidas de Seguridad
<!-- TODO: Documentar medidas de seguridad -->
- **Cifrado**: AES-256-GCM para datos sensibles
- **Autenticación**: JWT (preparado)
- **Autorización**: Middleware de auth
- **Validación**: Validación de entrada

### Gestión de Secretos
<!-- TODO: Documentar gestión de secretos -->
- **Variables de Entorno**: 
- **Claves de Cifrado**: 
- **Tokens**: 

## 🚀 Despliegue

### Estrategia de Despliegue
<!-- TODO: Documentar estrategia de despliegue -->
- **Contenedorización**: Docker + Docker Compose
- **Orquestación**: 
- **CI/CD**: 

### Ambientes
<!-- TODO: Documentar ambientes -->
- **Desarrollo**: Configuración y características
- **Staging**: Configuración y características
- **Producción**: Configuración y características

## 📊 Monitoreo y Observabilidad

### Logging
<!-- TODO: Documentar estrategia de logging -->
- **Nivel de Logs**: 
- **Formato**: 
- **Almacenamiento**: 

### Métricas
<!-- TODO: Documentar métricas -->
- **Métricas de Aplicación**: 
- **Métricas de Infraestructura**: 
- **Alertas**: 

### Tracing
<!-- TODO: Documentar tracing -->
- **Herramientas**: 
- **Configuración**: 

## 🔄 Integrations

### APIs Externas
<!-- TODO: Documentar integraciones con APIs externas -->
- **API 1**: Propósito y configuración
- **API 2**: Propósito y configuración

### Servicios Externos
<!-- TODO: Documentar servicios externos -->
- **Email**: SMTP configuration
- **WhatsApp**: Business API
- **Storage**: File storage

## 📈 Escalabilidad

### Estrategias de Escalabilidad
<!-- TODO: Documentar estrategias de escalabilidad -->
- **Escalabilidad Horizontal**: 
- **Escalabilidad Vertical**: 
- **Caching**: 

### Puntos de Mejora
<!-- TODO: Identificar puntos de mejora -->
- [ ] Punto 1
- [ ] Punto 2
- [ ] Punto 3

## 🔧 Herramientas de Desarrollo

### Herramientas Utilizadas
<!-- TODO: Documentar herramientas de desarrollo -->
- **IDE**: 
- **Version Control**: Git
- **Package Manager**: npm
- **Testing**: 
- **Linting**: 

---

*Última actualización: [FECHA]*
*Responsable: [NOMBRE]*
