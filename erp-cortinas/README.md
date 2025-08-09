# 🏢 ERP Cortinas Aymara

Sistema de gestión empresarial (ERP) especializado para empresas de cortinas metálicas, desarrollado con tecnologías modernas y arquitectura escalable.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## ✨ Características

### 🎯 Módulos Principales

- **👥 Gestión de Clientes**: Registro completo de clientes con validación de datos y navegación directa a presupuestos
- **📋 Presupuestos**: Sistema completo de cotizaciones vinculado a clientes específicos
- **💰 Módulo de Ventas**: Registro y seguimiento de ventas con integración a presupuestos
- **🏢 Gestión de Proveedores**: Administración de proveedores y contactos
- **📦 Control de Inventario**: Gestión de stock, productos y materiales
- **🛒 Gestión de Compras**: Control de órdenes de compra
- **💳 Módulo Financiero**: Control contable y financiero
- **📊 Reportes y Analytics**: Análisis de datos y reportes
- **⚙️ Configuración**: Ajustes del sistema y preferencias

### 🚀 Características Técnicas

- **Interfaz Moderna**: Diseño responsive con React y CSS Modules
- **API RESTful**: Backend robusto con Node.js y Express
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: Sistema de usuarios y permisos
- **Dockerizado**: Fácil despliegue con Docker y Docker Compose
- **Escalable**: Arquitectura modular y extensible

## 🛠 Tecnologías

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **React Router DOM** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP para APIs
- **CSS Modules** - Estilos modulares y encapsulados
- **Vite** - Herramienta de construcción rápida

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista
- **Prisma** - ORM moderno para bases de datos
- **PostgreSQL** - Base de datos relacional
- **CORS** - Middleware para recursos de origen cruzado

### DevOps
- **Docker** - Contenedorización de aplicaciones
- **Docker Compose** - Orquestación de contenedores
- **Nodemon** - Recarga automática en desarrollo

## 🏗 Arquitectura

```
erp-cortinas/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── styles/         # Estilos CSS Modules
│   │   └── main.jsx        # Punto de entrada
│   ├── Dockerfile          # Imagen Docker del frontend
│   └── package.json        # Dependencias del frontend
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── modules/        # Módulos de negocio
│   │   ├── config/         # Configuraciones
│   │   └── server.js       # Servidor principal
│   ├── prisma/             # Esquemas y migraciones
│   ├── Dockerfile          # Imagen Docker del backend
│   └── package.json        # Dependencias del backend
└── docker-compose.yml      # Orquestación de servicios
```

## 📦 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** y **Docker Compose** (opcional)
- **PostgreSQL** (si no usas Docker)

### 🚀 Instalación Rápida con Docker

```bash
# Clonar el repositorio
git clone https://github.com/LeanRamirez/ERP-Cortinas-Aymara.git
cd erp-cortinas

# Levantar todos los servicios
docker-compose up --build
```

### 🔧 Instalación Manual

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

# Ejecutar migraciones (opcional)
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm start
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
DATABASE_URL="postgresql://usuario:password@localhost:5432/erp_cortinas"

# Servidor
PORT=4000
NODE_ENV=development

# JWT (si implementas autenticación)
JWT_SECRET=tu_clave_secreta_muy_segura

# CORS
FRONTEND_URL=http://localhost:3000
```

### Configuración de Vite (Frontend)

El archivo `vite.config.js` ya está configurado para:
- Proxy hacia el backend en desarrollo
- Puerto 3000 por defecto
- Hot Module Replacement (HMR)

## 🚀 Uso

### Acceso a la Aplicación

Una vez levantados los servicios:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Documentación API**: http://localhost:4000/api-docs (si está implementada)

### Navegación Principal

1. **Dashboard**: Vista general con métricas y accesos rápidos
2. **Clientes**: Gestión completa de clientes
3. **Ventas**: Registro y seguimiento de ventas
4. **Inventario**: Control de stock y productos
5. **Reportes**: Análisis y reportes del negocio

## 🔌 API Endpoints

### Clientes
```http
GET    /api/clientes          # Obtener todos los clientes
POST   /api/clientes          # Crear nuevo cliente
GET    /api/clientes/:id      # Obtener cliente por ID
PUT    /api/clientes/:id      # Actualizar cliente
DELETE /api/clientes/:id      # Eliminar cliente
```

### Presupuestos
```http
GET    /api/presupuestos/cliente/:clienteId    # Obtener presupuestos de un cliente
POST   /api/presupuestos                       # Crear nuevo presupuesto
GET    /api/presupuestos/:id                   # Obtener presupuesto por ID
PUT    /api/presupuestos/:id                   # Actualizar presupuesto
DELETE /api/presupuestos/:id                   # Eliminar presupuesto
```

### Ventas
```http
GET    /api/ventas            # Obtener todas las ventas
POST   /api/ventas            # Crear nueva venta
GET    /api/ventas/:id        # Obtener venta por ID
PUT    /api/ventas/:id        # Actualizar venta
DELETE /api/ventas/:id        # Eliminar venta
```

### Ejemplo de Uso de API

```javascript
// Obtener clientes
const response = await fetch('http://localhost:4000/api/clientes');
const clientes = await response.json();

// Crear nuevo cliente
const nuevoCliente = {
  nombre: "Juan Pérez",
  email: "juan@email.com",
  telefono: "123456789"
};

const response = await fetch('http://localhost:4000/api/clientes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(nuevoCliente)
});
```

## 📁 Estructura del Proyecto

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── Navbar.jsx           # Barra de navegación
│   └── DashboardCard.jsx    # Tarjetas del dashboard
├── pages/
│   ├── Home.jsx             # Página principal
│   ├── Clientes.jsx         # Gestión de clientes
│   └── Ventas.jsx           # Gestión de ventas
├── styles/
│   ├── global.css           # Estilos globales
│   ├── Navbar.module.css    # Estilos de navegación
│   ├── Home.module.css      # Estilos del home
│   └── *.module.css         # Estilos modulares
└── main.jsx                 # Punto de entrada
```

### Backend (`/backend`)
```
src/
├── modules/
│   ├── clientes/
│   │   ├── clientes.controller.js  # Controlador de clientes
│   │   ├── clientes.service.js     # Lógica de negocio
│   │   └── clientes.routes.js      # Rutas de clientes
│   └── ventas/
│       ├── ventas.controller.js    # Controlador de ventas
│       ├── ventas.service.js       # Lógica de negocio
│       └── ventas.routes.js        # Rutas de ventas
├── config/
│   └── db.js                # Configuración de base de datos
└── server.js                # Servidor principal
```

## 🔧 Desarrollo

### Comandos Útiles

```bash
# Backend
cd backend
npm run dev          # Desarrollo con nodemon
npm start           # Producción
npm run migrate     # Ejecutar migraciones
npm run seed        # Poblar base de datos

# Frontend
cd frontend
npm run dev         # Servidor de desarrollo
npm run build       # Construir para producción
npm run preview     # Vista previa de producción
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
   ```

3. **Commit y push**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

### Estándares de Código

- **ESLint**: Linting de JavaScript
- **Prettier**: Formateo de código
- **Conventional Commits**: Formato de commits
- **CSS Modules**: Estilos encapsulados

## 🚀 Despliegue

### Con Docker Compose (Recomendado)

```bash
# Producción
docker-compose -f docker-compose.prod.yml up -d

# Desarrollo
docker-compose up --build
```

### Despliegue Manual

#### Backend
```bash
cd backend
npm install --production
npm run build  # Si tienes build script
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run build
# Servir archivos estáticos con nginx o similar
```

### Variables de Entorno para Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/erp_cortinas
JWT_SECRET=clave_super_segura_para_produccion
FRONTEND_URL=https://tu-dominio.com
```

## 📊 Monitoreo y Logs

### Logs de Aplicación
```bash
# Ver logs en tiempo real
docker-compose logs -f backend
docker-compose logs -f frontend

# Logs específicos
docker-compose logs --tail=100 backend
```

### Métricas de Rendimiento
- Tiempo de respuesta de APIs
- Uso de memoria y CPU
- Conexiones de base de datos
- Errores de aplicación

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test              # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Cobertura de código
```

### Frontend Testing
```bash
cd frontend
npm test              # Tests unitarios
npm run test:e2e      # Tests end-to-end
```

## 🔒 Seguridad

### Medidas Implementadas
- **CORS** configurado correctamente
- **Validación** de datos de entrada
- **Sanitización** de queries SQL con Prisma
- **Variables de entorno** para datos sensibles

### Recomendaciones
- Usar HTTPS en producción
- Implementar rate limiting
- Configurar firewall adecuadamente
- Mantener dependencias actualizadas

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** rama de feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** Pull Request

### Reportar Bugs

Usar el sistema de issues de GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Lean Ramirez** - Desarrollador Principal - [@LeanRamirez](https://github.com/LeanRamirez)

## 📞 Soporte

- **Email**: soporte@erp-cortinas.com
- **Issues**: [GitHub Issues](https://github.com/LeanRamirez/ERP-Cortinas-Aymara/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/LeanRamirez/ERP-Cortinas-Aymara/wiki)

## 🎯 Roadmap

### Versión 1.1
- [ ] Sistema de autenticación completo
- [ ] Módulo de reportes avanzados
- [ ] Integración con APIs de facturación
- [ ] Notificaciones en tiempo real

### Versión 1.2
- [ ] Aplicación móvil
- [ ] Integración con sistemas contables
- [ ] Dashboard analytics avanzado
- [ ] API GraphQL

---

## 📋 Documentación de Levantamiento Paso a Paso

### ✅ Proceso Completado Exitosamente

#### **Paso 1: Verificación del Entorno**
```bash
# Verificar herramientas disponibles
which node npm docker
npm --version  # v9.6.7 con Node.js v18.17.0
```

#### **Paso 2: Instalación de Dependencias Backend**
```bash
cd erp-cortinas/backend
npm install
# ✅ 123 paquetes instalados exitosamente
```

#### **Paso 3: Instalación de Dependencias Frontend**
```bash
cd erp-cortinas/frontend
npm install
# ✅ 85 paquetes instalados exitosamente
```

#### **Paso 4: Generación del Cliente Prisma**
```bash
cd erp-cortinas/backend
npx prisma generate
# ✅ Cliente Prisma generado correctamente
```

#### **Paso 5: Inicio del Servidor Backend**
```bash
cd erp-cortinas/backend
npm start
# ✅ Servidor corriendo en puerto 4000
```

#### **Paso 6: Inicio del Servidor Frontend**
```bash
cd erp-cortinas/frontend
npm run dev
# ✅ Vite server iniciado en puerto 3000
```

#### **Paso 7: Verificación de Servicios**
```bash
# Frontend funcionando correctamente
curl http://192.168.100.9:3000/
# ✅ HTML de React cargado correctamente

# Backend API funcionando
curl http://192.168.100.9:4000/
# ✅ {"message":"API funcionando"}

# Endpoints de API disponibles
curl http://192.168.100.9:4000/api/clientes
# ⚠️ Error esperado (base de datos no configurada)
```

### 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000 o http://192.168.100.9:3000
- **Backend API**: http://localhost:4000 o http://192.168.100.9:4000

### 📝 Notas Importantes

1. **Entorno WSL2**: La aplicación se ejecuta en Windows Subsystem for Linux
2. **Node.js**: Versión 18.17.0 funcionando correctamente
3. **Puertos**: Frontend en 3000, Backend en 4000
4. **Base de Datos**: Requiere configuración de PostgreSQL para funcionalidad completa
5. **Desarrollo**: Ambos servidores con hot-reload activado

### 🔧 Próximos Pasos Recomendados

1. **Configurar Base de Datos PostgreSQL**
2. **Ejecutar Migraciones de Prisma**
3. **Poblar Base de Datos con Datos de Prueba**
4. **Configurar Variables de Entorno**
5. **Implementar Autenticación**

---

**¡ERP Cortinas Aymara está listo para desarrollo! 🚀**

*Última actualización: 8 de Agosto, 2025*
