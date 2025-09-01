# 🏢 ERP Cortinas Aymara

Sistema de gestión empresarial (ERP) especializado para empresas de cortinas metálicas, desarrollado con tecnologías modernas y arquitectura escalable.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Base de Datos](#-base-de-datos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)
- [Seguridad](#-seguridad)
- [Contribución](#-contribución)

## ✨ Características

### 🎯 Módulos Principales Implementados

- **👥 Gestión de Clientes**: CRUD completo con datos de contacto y dirección
- **📋 Presupuestos**: Sistema de cotizaciones con items detallados vinculado a clientes
- **💰 Módulo de Ventas**: Registro de ventas con items y vinculación a presupuestos
- **📄 Generación de PDFs**: Sistema completo de generación de presupuestos en PDF con Puppeteer
- **⚙️ Configuración Empresarial**: Gestión de configuración SMTP y WhatsApp con cifrado AES-256-GCM
- **🔐 Sistema de Cifrado**: Protección de datos sensibles con claves criptográficas

### 🚀 Características Técnicas

- **Interfaz Moderna**: React 18 con CSS Modules y diseño responsive
- **API RESTful**: Backend robusto con Node.js, Express y ES Modules
- **Base de Datos**: SQLite con Prisma ORM (configurable para PostgreSQL)
- **Generación de PDFs**: Puppeteer para documentos profesionales
- **Cifrado de Datos**: AES-256-GCM para información sensible
- **Dockerizado**: Configuración completa con Docker Compose
- **Arquitectura Modular**: Separación clara de responsabilidades

## 🛠 Tecnologías

### Frontend
- **React 18.2.0** - Biblioteca de interfaz de usuario
- **React Router DOM 6.14.0** - Enrutamiento del lado del cliente
- **Axios 1.4.0** - Cliente HTTP para APIs
- **CSS Modules** - Estilos modulares y encapsulados
- **Vite 4.4.5** - Herramienta de construcción rápida

### Backend
- **Node.js 18+** - Entorno de ejecución con ES Modules
- **Express.js 4.18.2** - Framework web minimalista
- **Prisma 5.0.0** - ORM moderno para bases de datos
- **SQLite/PostgreSQL** - Base de datos (configurable)
- **Puppeteer 24.16.1** - Generación de PDFs
- **Bcrypt 6.0.0** - Hash de contraseñas
- **Nodemailer 7.0.5** - Envío de emails
- **Handlebars 4.7.8** - Templates para PDFs
- **CORS 2.8.5** - Middleware para recursos de origen cruzado

### DevOps
- **Docker & Docker Compose** - Contenedorización
- **Nodemon 2.0.22** - Recarga automática en desarrollo
- **PostgreSQL 16** - Base de datos en producción

## 🏗 Arquitectura

```
erp-cortinas/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── Navbar.jsx      # Navegación principal
│   │   │   ├── TablaVentas.jsx # Tabla de ventas
│   │   │   ├── FormularioPresupuesto.jsx
│   │   │   └── BotonAprobarPresupuesto.jsx
│   │   ├── pages/              # Páginas principales
│   │   │   ├── Home.jsx        # Dashboard principal
│   │   │   ├── Clientes.jsx    # Gestión de clientes
│   │   │   ├── Presupuestos.jsx # Gestión de presupuestos
│   │   │   └── Ventas.jsx      # Gestión de ventas
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useVentasFromPresupuestos.js
│   │   ├── styles/             # CSS Modules
│   │   └── main.jsx            # Punto de entrada
│   ├── Dockerfile              # Imagen Docker del frontend
│   └── package.json            # Dependencias del frontend
├── backend/                     # API Node.js
│   ├── src/
│   │   ├── modules/            # Módulos de negocio
│   │   │   ├── clientes/       # Gestión de clientes
│   │   │   ├── presupuestos/   # Gestión de presupuestos
│   │   │   ├── ventas/         # Gestión de ventas
│   │   │   ├── pdf/            # Generación de PDFs
│   │   │   └── configuracion/  # Configuración empresarial
│   │   ├── config/             # Configuraciones
│   │   │   ├── db.js           # Conexión a base de datos
│   │   │   └── encryption.js   # Sistema de cifrado
│   │   ├── middleware/         # Middlewares
│   │   │   └── auth.js         # Autenticación
│   │   └── server.js           # Servidor principal
│   ├── prisma/                 # Esquemas y migraciones
│   │   ├── schema.prisma       # Modelo de datos
│   │   ├── migrations/         # Migraciones de BD
│   │   ├── seed.js             # Datos de prueba
│   │   └── dev.db              # Base de datos SQLite
│   ├── public/pdfs/            # PDFs generados
│   ├── templates/              # Templates para PDFs
│   ├── Dockerfile              # Imagen Docker del backend
│   ├── .env                    # Variables de entorno
│   └── package.json            # Dependencias del backend
└── docker-compose.yml          # Orquestación de servicios
```

## 🗄 Base de Datos

### Modelo de Datos (Prisma Schema)

#### Cliente
```prisma
model Cliente {
  id           Int      @id @default(autoincrement())
  nombre       String
  email        String?
  telefono     String?
  calle        String?
  numero       String?
  ciudad       String?
  provincia    String?
  codigoPostal String?
  createdAt    DateTime @default(now())
  ventas       Venta[]
  presupuestos Presupuesto[]
}
```

#### Presupuesto
```prisma
model Presupuesto {
  id          Int               @id @default(autoincrement())
  descripcion String
  valor       Float
  fecha       DateTime          @default(now())
  estado      String            @default("pendiente")
  clienteId   Int
  cliente     Cliente           @relation(fields: [clienteId], references: [id])
  items       PresupuestoItem[]
  ventas      Venta[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}
```

#### Venta
```prisma
model Venta {
  id            Int           @id @default(autoincrement())
  fecha         DateTime      @default(now())
  total         Float
  estado        String        @default("pendiente")
  observaciones String?
  clienteId     Int
  cliente       Cliente       @relation(fields: [clienteId], references: [id])
  presupuestoId Int?
  presupuesto   Presupuesto?  @relation(fields: [presupuestoId], references: [id])
  items         VentaItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}
```

#### Configuración Empresarial (con Cifrado)
```prisma
model ConfiguracionEmpresa {
  id        String   @id @default("default")
  
  // Campos no sensibles
  fromName  String?
  fromEmail String?
  host      String?
  port      Int?
  secureTLS Boolean?
  replyTo   String?
  wabaId    String?
  
  // Campos cifrados con AES-256-GCM
  smtpUsername_enc         String?
  smtpPassword_enc         String?
  whatsappPhoneNumberId_enc String?
  whatsappToken_enc        String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Relaciones
- **Cliente** → **Presupuestos** (1:N)
- **Cliente** → **Ventas** (1:N)
- **Presupuesto** → **PresupuestoItems** (1:N)
- **Presupuesto** → **Ventas** (1:N) - Una venta puede originarse de un presupuesto
- **Venta** → **VentaItems** (1:N)

## 📦 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** y **Docker Compose** (opcional)
- **PostgreSQL** (para producción)

### 🚀 Instalación Rápida con Docker

```bash
# Clonar el repositorio
git clone https://github.com/LeanRamirez/ERP-Cortinas-Aymara.git
cd erp-cortinas

# Levantar todos los servicios (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Acceder a:
# Frontend: http://localhost:3002
# Backend: http://localhost:4000
# PostgreSQL: localhost:5433
```

### 🔧 Instalación Manual (Desarrollo)

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/LeanRamirez/ERP-Cortinas-Aymara.git
cd erp-cortinas
```

#### 2. Configurar Backend
```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar base de datos (opcional)
npm run seed

# Iniciar servidor de desarrollo
npm run dev  # Con nodemon
# o
npm start    # Producción
```

#### 3. Configurar Frontend
```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno (Backend)

Crear archivo `.env` en la carpeta `backend/`:

```env
# Base de datos
DATABASE_URL="file:./dev.db"  # SQLite para desarrollo
# DATABASE_URL="postgresql://admin:admin@localhost:5433/erp_cortinas"  # PostgreSQL

# Servidor
PORT=4000
NODE_ENV=development

# Claves de cifrado (generar con script incluido)
CONFIG_SECRETS_KEY=tu_clave_base64_32_bytes
ADMIN_KEY=tu_clave_hex_64_caracteres

# CORS (opcional)
FRONTEND_URL=http://localhost:3000
```

### Generación de Claves Criptográficas

El sistema incluye un script para generar claves seguras:

```bash
# Ejecutar desde la raíz del proyecto
python3 generate-keys.py

# Copiar las claves generadas al archivo .env
```

### Configuración de Vite (Frontend)

El archivo `vite.config.js` está configurado para:
- Proxy hacia el backend en desarrollo
- Puerto 3000 por defecto
- Hot Module Replacement (HMR)

### Configuración Docker

#### Desarrollo
```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: erp_cortinas
    ports:
      - "5433:5432"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgres://admin:admin@postgres:5432/erp_cortinas

  frontend:
    build: ./frontend
    ports:
      - "3002:3000"
```

## 🚀 Uso

### Acceso a la Aplicación

#### Desarrollo Local
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

#### Con Docker
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:4000
- **PostgreSQL**: localhost:5433

### Navegación Principal

1. **Dashboard (Home)**: Vista general con métricas y accesos rápidos
2. **Clientes**: Gestión completa de clientes con formularios
3. **Presupuestos**: Creación y gestión de cotizaciones
4. **Ventas**: Registro y seguimiento de ventas
5. **Configuración**: Ajustes de empresa y comunicaciones

### Flujo de Trabajo Típico

1. **Registrar Cliente** → Crear nuevo cliente con datos completos
2. **Crear Presupuesto** → Generar cotización para el cliente
3. **Generar PDF** → Crear documento profesional del presupuesto
4. **Aprobar Presupuesto** → Convertir presupuesto en venta
5. **Gestionar Venta** → Seguimiento del proceso de venta

## 🔌 API Endpoints

### Clientes
```http
GET    /api/clientes              # Obtener todos los clientes
POST   /api/clientes              # Crear nuevo cliente
GET    /api/clientes/:id          # Obtener cliente por ID
PUT    /api/clientes/:id          # Actualizar cliente
DELETE /api/clientes/:id          # Eliminar cliente
```

### Presupuestos
```http
GET    /api/presupuestos                    # Obtener todos los presupuestos
POST   /api/presupuestos                    # Crear nuevo presupuesto
GET    /api/presupuestos/:id                # Obtener presupuesto por ID
PUT    /api/presupuestos/:id                # Actualizar presupuesto
DELETE /api/presupuestos/:id                # Eliminar presupuesto
GET    /api/presupuestos/cliente/:clienteId # Presupuestos de un cliente
POST   /api/presupuestos/:id/aprobar        # Aprobar presupuesto (crear venta)
```

### Ventas
```http
GET    /api/ventas                # Obtener todas las ventas
POST   /api/ventas                # Crear nueva venta
GET    /api/ventas/:id            # Obtener venta por ID
PUT    /api/ventas/:id            # Actualizar venta
DELETE /api/ventas/:id            # Eliminar venta
GET    /api/ventas/presupuesto/:presupuestoId  # Ventas de un presupuesto
```

### PDFs
```http
POST   /api/pdf/presupuesto       # Generar PDF de presupuesto
GET    /public/pdfs/:filename     # Descargar PDF generado
```

### Configuración
```http
GET    /api/config                # Obtener configuración (datos enmascarados)
PUT    /api/config                # Actualizar configuración
POST   /api/config/test-email     # Probar configuración de email
```

### Ejemplos de Uso de API

#### Crear Cliente
```javascript
const nuevoCliente = {
  nombre: "Juan Pérez",
  email: "juan@email.com",
  telefono: "123456789",
  calle: "Av. Principal",
  numero: "123",
  ciudad: "Buenos Aires",
  provincia: "CABA",
  codigoPostal: "1000"
};

const response = await fetch('http://localhost:4000/api/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(nuevoCliente)
});
```

#### Crear Presupuesto
```javascript
const nuevoPresupuesto = {
  descripcion: "Cortina metálica para local comercial",
  valor: 15000.00,
  clienteId: 1,
  items: [
    {
      descripcion: "Cortina metálica 3x2m",
      cantidad: 1,
      precioUnitario: 12000.00
    },
    {
      descripcion: "Instalación",
      cantidad: 1,
      precioUnitario: 3000.00
    }
  ]
};

const response = await fetch('http://localhost:4000/api/presupuestos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(nuevoPresupuesto)
});
```

#### Generar PDF
```javascript
const pdfData = {
  presupuestoId: 1,
  template: "presupuesto_v1"
};

const response = await fetch('http://localhost:4000/api/pdf/presupuesto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pdfData)
});

const result = await response.json();
// result.pdfUrl contiene la URL del PDF generado
```

## 🧩 Módulos del Sistema

### 1. Módulo de Clientes (`/backend/src/modules/clientes/`)
- **Controller**: Manejo de requests HTTP
- **Service**: Lógica de negocio
- **Routes**: Definición de endpoints
- **Funcionalidades**: CRUD completo, validaciones, búsquedas

### 2. Módulo de Presupuestos (`/backend/src/modules/presupuestos/`)
- **Gestión de cotizaciones** con items detallados
- **Vinculación con clientes**
- **Estados**: pendiente, aprobado, rechazado
- **Conversión a ventas**

### 3. Módulo de Ventas (`/backend/src/modules/ventas/`)
- **Registro de ventas** con items
- **Vinculación con presupuestos**
- **Estados**: pendiente, completada, cancelada
- **Hook personalizado**: `useVentasFromPresupuestos`

### 4. Módulo de PDFs (`/backend/src/modules/pdf/`)
- **Generación con Puppeteer**
- **Templates personalizables** (Handlebars)
- **Estilos CSS** para documentos profesionales
- **Almacenamiento** en `/public/pdfs/`

### 5. Módulo de Configuración (`/backend/src/modules/configuracion/`)
- **Configuración SMTP** para emails
- **Configuración WhatsApp Business**
- **Cifrado AES-256-GCM** para datos sensibles
- **Singleton pattern** (una sola configuración)

### 6. Sistema de Cifrado (`/backend/src/config/encryption.js`)
- **AES-256-GCM** para máxima seguridad
- **Claves de 32 bytes** (256 bits)
- **Vectores de inicialización únicos**
- **Funciones**: `encrypt()`, `decrypt()`

### 7. Middleware de Autenticación (`/backend/src/middleware/auth.js`)
- **Preparado para JWT**
- **Validación de tokens**
- **Protección de rutas sensibles**

## 📁 Estructura del Proyecto Detallada

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── Navbar.jsx                    # Navegación principal con enlaces
│   ├── DashboardCard.jsx             # Tarjetas del dashboard
│   ├── TablaVentas.jsx               # Tabla de ventas con filtros
│   ├── FormularioPresupuesto.jsx     # Formulario de presupuestos
│   └── BotonAprobarPresupuesto.jsx   # Botón para aprobar presupuestos
├── pages/
│   ├── Home.jsx                      # Dashboard con métricas
│   ├── Clientes.jsx                  # CRUD de clientes
│   ├── Presupuestos.jsx              # Gestión de presupuestos
│   └── Ventas.jsx                    # Gestión de ventas
├── hooks/
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

### Backend (`/backend`)
```
src/
├── modules/
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

### Base de Datos (`/backend/prisma/`)
```
prisma/
├── schema.prisma                     # Modelo de datos completo
├── migrations/                       # Migraciones de base de datos
│   ├── migration_lock.toml
│   ├── 20250808234423_init/
│   ├── 20250809001330_add_presupuestos/
│   └── 20250811145504_add_ventas_items/
├── seed.js                           # Datos de prueba
├── seed-presupuestos.js              # Seed específico de presupuestos
├── seed-ventas.js                    # Seed específico de ventas
└── dev.db                            # Base de datos SQLite
```

### Templates y Assets
```
backend/
├── templates/                        # Templates para PDFs
│   ├── presupuesto_v1.html          # Template HTML
│   └── presupuesto_v1.css           # Estilos para PDF
├── public/pdfs/                      # PDFs generados
├── test-pdf.js                       # Script de prueba de PDFs
└── ejemplos-api-pdf.md               # Documentación de API PDF

frontend/assets/                      # Assets del frontend
├── logo.pdf
└── presupuesto.pdf
```

## 🔧 Desarrollo

### Comandos Útiles

#### Backend
```bash
cd backend

# Desarrollo
npm run dev              # Servidor con nodemon
npm start               # Servidor de producción

# Base de datos
npx prisma generate     # Generar cliente Prisma
npx prisma migrate dev  # Ejecutar migraciones
npm run seed           # Poblar base de datos
npx prisma studio      # Interfaz gráfica de BD

# Utilidades
node test-pdf.js       # Probar generación de PDFs
```

#### Frontend
```bash
cd frontend

# Desarrollo
npm run dev            # Servidor de desarrollo (Vite)
npm run build          # Construir para producción
npm run preview        # Vista previa de producción
```

#### Docker
```bash
# Desarrollo completo
docker-compose up --build

# Solo base de datos
docker-compose up postgres

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Limpiar
docker-compose down -v
```

### Flujo de Desarrollo

1. **Crear rama de feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y probar**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   
   # Terminal 3: Base de datos (si es necesario)
   docker-compose up postgres
   ```

3. **Probar funcionalidades**
   ```bash
   # Probar PDFs
   cd backend && node test-pdf.js
   
   # Probar API
   curl http://localhost:4000/api/clientes
   ```

4. **Commit y push**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

### Estándares de Código

- **ES Modules**: Uso de `import/export` en lugar de `require`
- **Async/Await**: Para operaciones asíncronas
- **Error Handling**: Try-catch en todos los controladores
- **Validación**: Validación de datos en servicios
- **CSS Modules**: Estilos encapsulados en frontend
- **Conventional Commits**: Formato estándar de commits

### Debugging

#### Backend
```bash
# Logs detallados
DEBUG=* npm run dev

# Inspeccionar base de datos
npx prisma studio

# Probar endpoints
curl -X GET http://localhost:4000/api/clientes
curl -X POST http://localhost:4000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com"}'
```

#### Frontend
```bash
# Modo desarrollo con hot reload
npm run dev

# Build para verificar errores
npm run build
```

## 🚀 Despliegue

### Con Docker Compose (Recomendado)

#### Producción
```bash
# Crear docker-compose.prod.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend

volumes:
  pgdata:
```

```bash
# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Despliegue Manual

#### Backend
```bash
cd backend

# Instalar dependencias de producción
npm ci --only=production

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Iniciar aplicación
NODE_ENV=production npm start
```

#### Frontend
```bash
cd frontend

# Instalar dependencias
npm ci

# Construir aplicación
npm run build

# Servir con nginx o servidor estático
# Los archivos están en dist/
```

### Variables de Entorno para Producción

```env
# Backend (.env)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/erp_cortinas
PORT=4000

# Claves de cifrado (generar nuevas para producción)
CONFIG_SECRETS_KEY=nueva_clave_base64_32_bytes
ADMIN_KEY=nueva_clave_hex_64_caracteres

# CORS
FRONTEND_URL=https://tu-dominio.com

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app
```

### Configuración Nginx

```nginx
# nginx.conf
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # PDFs estáticos
    location /public/ {
        proxy_pass http://backend:4000;
    }
}
```

## 🔒 Seguridad

### Medidas Implementadas

#### Cifrado de Datos
- **AES-256-GCM** para datos sensibles
- **Claves de 32 bytes** generadas criptográficamente
- **Vectores de inicialización únicos** por operación
- **Campos enmascarados** en respuestas API

#### Validación y Sanitización
- **Prisma ORM** previene inyección SQL
- **Validación de tipos** en controladores
- **CORS** configurado correctamente
- **Variables de entorno** para datos sensibles

#### Autenticación y Autorización
- **Middleware de autenticación** preparado
- **Sistema de tokens JWT** (preparado para implementar)
- **Protección de rutas** sensibles

### Recomendaciones de Seguridad

#### Para Producción
- Usar **HTTPS** obligatoriamente
- Implementar **rate limiting**
- Configurar **firewall** adecuadamente
- Mantener **dependencias actualizadas**
- **Rotar claves** criptográficas periódicamente
- **Auditorías de seguridad** regulares

#### Gestión de Claves
```bash
# Generar nuevas claves para producción
python3 generate-keys.py

# Nunca commitear claves reales
echo "*.env" >> .gitignore
echo "generate-keys.py" >> .gitignore
```

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** rama de feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** Pull Request

### Estándares de Contribución

#### Commits
- Usar **Conventional Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- **Mensajes descriptivos** en español
- **Un commit por funcionalidad**

#### Código
- **ESLint** para JavaScript
- **Prettier** para formateo
- **Comentarios** en español
- **Tests** para nuevas funcionalidades

#### Pull Requests
- **Descripción clara** del cambio
- **Screenshots** si afecta UI
- **Tests** pasando
- **Documentación** actualizada

### Reportar Bugs

Usar el sistema de issues de GitHub con:
- **Descripción clara** del problema
- **Pasos para reproducir**
- **Comportamiento esperado** vs actual
- **Screenshots** si aplica
- **Información del entorno**

### Solicitar Funcionalidades

- **Descripción detallada** de la funcionalidad
- **Casos de uso** específicos
- **Mockups** o wireframes si aplica
- **Justificación** del valor agregado

## 📊 Monitoreo y Logs

### Logs de Aplicación

#### Desarrollo
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Producción
```bash
# Logs en tiempo real
docker-compose logs -f --tail=100 backend

# Logs específicos por fecha
docker-compose logs --since="2024-01-01" backend

# Exportar logs
docker-compose logs backend > backend.log
```

### Métricas de Rendimiento

#### Backend
- **Tiempo de respuesta** de APIs
- **Uso de memoria** y CPU
- **Conexiones** de base de datos
- **Errores** de aplicación
- **Generación de PDFs** (tiempo)

#### Frontend
- **Tiempo de carga** inicial
- **Interacciones** de usuario
- **Errores** de JavaScript
- **Rendimiento** de componentes

### Herramientas de Monitoreo

#### Recomendadas
- **PM2** para gestión de procesos Node.js
- **Nginx** logs para proxy reverso
- **PostgreSQL** logs para base de datos
- **Grafana** + **Prometheus** para métricas
- **Sentry** para tracking de errores

## 🧪 Testing

### Estructura de Tests

```
backend/
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── controllers/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── workflows/

frontend/
├── src/
│   └── __tests__/
│       ├── components/
│       ├── pages/
│       └── hooks/
```

### Backend Testing

```bash
cd backend

# Tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

### Frontend Testing

```bash
cd frontend

# Tests unitarios (Jest + React Testing Library)
npm test

# Tests E2E (Cypress)
npm run test:e2e

# Tests de componentes (Storybook)
npm run storybook
```

### Ejemplos de Tests

#### Backend - Test de Servicio
```javascript
// tests/unit/services/clientes.service.test.js
import { describe, it, expect } from 'vitest';
import { ClientesService } from '../../../src/modules/clientes/clientes.service.js';

describe('ClientesService', () => {
  it('should create a new client', async () => {
    const clienteData = {
      nombre: 'Test Cliente',
      email: 'test@test.com'
    };
    
    const result = await ClientesService.create(clienteData);
    
    expect(result).toHaveProperty('id');
    expect(result.nombre).toBe(clienteData.nombre);
  });
});
```

#### Frontend - Test de Componente
```javascript
// src/__tests__/components/Navbar.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Clientes')).toBeInTheDocument();
  expect(screen.getByText('Presupuestos')).toBeInTheDocument();
  expect(screen.getByText('Ventas')).toBeInTheDocument();
});
```

## 📈 Roadmap

### Versión 1.1 (Próxima)
- [ ] **Sistema de autenticación completo** con JWT
- [ ] **Módulo de reportes avanzados** con gráficos
- [ ] **Integración con APIs de facturación** (AFIP)
- [ ] **Notificaciones en tiempo real** con WebSockets
- [ ] **Backup automático** de base de datos
- [ ] **Logs estructurados** con Winston

### Versión 1.2 (Futuro)
- [ ] **Aplicación móvil** (React Native)
- [ ] **Integración con sistemas contables**
- [ ] **Dashboard analytics avanzado** con BI
- [ ] **API GraphQL** como alternativa
- [ ] **Microservicios** para escalabilidad
- [ ] **Integración con WhatsApp Business API**

### Versión 2.0 (Visión)
- [ ] **Multi-tenancy** para múltiples empresas
- [ ] **Marketplace** de plugins
- [ ] **IA para predicciones** de ventas
- [ ] **Integración con IoT** para cortinas inteligentes
- [ ] **Blockchain** para trazabilidad
- [ ] **PWA** con funcionalidades offline

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2024 Lean Ramirez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👥 Equipo

### Desarrolladores
- **Lean Ramirez** - Desarrollador Principal - [@LeanRamirez](https://github.com/LeanRamirez)

### Contribuidores
- Ver [Contributors](https://github.com/LeanRamirez/ERP-Cortinas-Aymara/contributors)

### Agradecimientos
- Comunidad de **React** y **Node.js**
- Equipo de **Prisma** por el excelente ORM
- **Puppeteer** team por la generación de PDFs
- Contribuidores de **open source**

## 📞 Soporte

### Canales de Comunicación
- **Email**: soporte@erp-cortinas.com
- **Issues**: [GitHub Issues](https://github.com/LeanRamirez/ERP-Cortinas-Aymara/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/LeanRamirez/ERP-Cortinas-Aymara/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/LeanRamirez/ERP-Cortinas-Aymara/discussions)

### FAQ (Preguntas Frecuentes)

#### ¿Cómo cambio de SQLite a PostgreSQL?
```env
# En .env cambiar:
DATABASE_URL="postgresql://user:password@localhost:5432/erp_cortinas"
```

#### ¿Cómo genero nuevas claves de cifrado?
```bash
python3 generate-keys.py
# Copiar las claves al archivo .env
```

#### ¿Cómo reseteo la base de datos?
```bash
cd backend
npx prisma migrate reset
npm run seed
```

#### ¿Cómo agrego un nuevo módulo?
1. Crear carpeta en `/backend/src/modules/nuevo-modulo/`
2. Crear `controller.js`, `service.js`, `routes.js`
3. Agregar ruta en `server.js`
4. Actualizar esquema Prisma si es necesario

## 🔄 Changelog

### [1.0.0] - 2024-08-23
#### Agregado
- ✅ Sistema completo de gestión de clientes
- ✅ Módulo de presupuestos con items
- ✅ Módulo de ventas vinculado a presupuestos
- ✅ Generación de PDFs con Puppeteer
- ✅ Sistema de cifrado AES-256-GCM
- ✅ Configuración empresarial segura
- ✅ API RESTful completa
- ✅ Frontend React con CSS Modules
- ✅ Dockerización completa
- ✅ Base de datos con Prisma ORM

#### Técnico
- ✅ ES Modules en backend
- ✅ Arquitectura modular
- ✅ Middleware de autenticación preparado
- ✅ Sistema de migraciones
- ✅ Scripts de seed para datos de prueba

## 🎯 Estado del Proyecto

### ✅ Completado
- [x] **Gestión de Clientes** - CRUD completo
- [x] **Presupuestos** - Creación, edición, items
- [x] **Ventas** - Registro y vinculación
- [x] **PDFs** - Generación profesional
- [x] **Cifrado** - Datos sensibles protegidos
- [x] **API** - Endpoints RESTful
- [x] **Frontend** - Interfaz React moderna
- [x] **Docker** - Contenedorización
- [x] **Base de Datos** - Modelo relacional

### 🚧 En Desarrollo
- [ ] **Autenticación JWT** - Sistema completo
- [ ] **Reportes** - Dashboard analytics
- [ ] **Tests** - Cobertura completa
- [ ] **Documentación API** - Swagger/OpenAPI

### 📋 Pendiente
- [ ] **Notificaciones** - Email y WhatsApp
- [ ] **Backup** - Sistema automático
- [ ] **Logs** - Sistema estructurado
- [ ] **Monitoreo** - Métricas de rendimiento

## 🌟 Características Destacadas

### 🔐 Seguridad Avanzada
- **Cifrado AES-256-GCM** para datos sensibles
- **Claves criptográficas** de 32 bytes
- **Variables de entorno** para configuración
- **Prisma ORM** previene inyección SQL

### 📊 Gestión Completa
- **Flujo completo**: Cliente → Presupuesto → Venta
- **PDFs profesionales** con templates personalizables
- **Vinculación de datos** entre módulos
- **Estados de seguimiento** para procesos

### 🚀 Tecnología Moderna
- **React 18** con hooks y CSS Modules
- **Node.js** con ES Modules
- **Prisma** como ORM moderno
- **Docker** para despliegue fácil

### 🎨 Experiencia de Usuario
- **Interfaz intuitiva** y responsive
- **Navegación fluida** entre módulos
- **Formularios validados** y user-friendly
- **Feedback visual** en todas las acciones

---

## 📋 Resumen Ejecutivo

**ERP Cortinas Aymara** es un sistema de gestión empresarial completo y moderno, específicamente diseñado para empresas del sector de cortinas metálicas. 

### 🎯 Propósito
Digitalizar y optimizar los procesos de negocio desde la gestión de clientes hasta la generación de ventas, pasando por presupuestos profesionales en PDF.

### 💡 Valor Agregado
- **Eficiencia**: Automatización de procesos manuales
- **Profesionalismo**: Documentos PDF de alta calidad
- **Seguridad**: Protección de datos sensibles
- **Escalabilidad**: Arquitectura preparada para crecimiento
- **Modernidad**: Tecnologías actuales y mejores prácticas

### 🚀 Implementación
Sistema listo para producción con:
- **Instalación rápida** con Docker
- **Configuración flexible** para diferentes entornos
- **Documentación completa** para desarrolladores
- **Soporte técnico** disponible

---

**¡ERP Cortinas Aymara está listo para transformar tu negocio! 🚀**

*Última actualización: 23 de Agosto, 2025*
*Versión: 1.0.0*
*Estado: Producción Ready ✅*
