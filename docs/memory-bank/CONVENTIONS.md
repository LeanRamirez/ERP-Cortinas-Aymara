# CONVENTIONS - ERP Cortinas Aymara

## 📝 Convenciones de Código

### Estilo General
- **Idioma**: Español para comentarios y variables de negocio
- **Encoding**: UTF-8
- **Line Endings**: LF (Unix)
- **Indentación**: 2 espacios
- **Módulos**: ES Modules (import/export)
- **Async**: Preferir async/await sobre Promises

### Naming Conventions

#### Variables y Funciones
- **JavaScript**: camelCase (`clienteId`, `calcularTotal`)
- **Constantes**: UPPER_SNAKE_CASE (`CONFIG_SECRETS_KEY`, `ADMIN_KEY`)
- **Componentes React**: PascalCase (`FormularioPresupuesto`, `TablaVentas`)
- **Archivos**: 
  - Componentes: PascalCase (`Navbar.jsx`)
  - Servicios: camelCase (`clientes.service.js`)
  - Estilos: PascalCase + `.module.css` (`Navbar.module.css`)

#### Base de Datos
- **Tablas**: PascalCase (`Cliente`, `Presupuesto`, `VentaItem`)
- **Campos**: camelCase (`clienteId`, `precioUnitario`, `codigoPostal`)
- **Relaciones**: camelCase descriptivos (`cliente`, `presupuesto`, `items`)
- **Campos cifrados**: sufijo `_enc` (`smtpPassword_enc`)

#### APIs
- **Endpoints**: kebab-case (`/api/clientes`, `/api/config/test-email`)
- **Parámetros**: camelCase (`clienteId`, `presupuestoId`)
- **Headers**: kebab-case (`Content-Type`, `Authorization`)
- **Response Fields**: camelCase (`clienteId`, `precioUnitario`)

## 🗂 Estructura de Archivos

### Frontend
<!-- TODO: Definir estructura de archivos del frontend -->
```
src/
├── components/
│   ├── ComponentName.jsx
│   └── ComponentName.module.css
├── pages/
│   ├── PageName.jsx
│   └── PageName.module.css
├── hooks/
│   └── useHookName.js
└── styles/
    └── global.css
```

### Backend
<!-- TODO: Definir estructura de archivos del backend -->
```
src/modules/module-name/
├── module-name.controller.js
├── module-name.service.js
└── module-name.routes.js
```

### Documentación
<!-- TODO: Definir estructura de documentación -->
```
docs/
├── memory-bank/
├── api/
└── user-guides/
```

## 💬 Comentarios y Documentación

### Comentarios en Código
<!-- TODO: Definir estándares de comentarios -->
- **Funciones**: JSDoc para funciones públicas
- **Componentes**: Descripción del propósito
- **Lógica Compleja**: Explicar el "por qué"
- **TODOs**: Formato estándar

#### Ejemplos
```javascript
/**
 * Calcula el total de un presupuesto incluyendo todos los items
 * @param {Array} items - Array de items del presupuesto
 * @returns {number} Total calculado
 */
function calcularTotal(items) {
  // TODO: Agregar validación de items
  return items.reduce((total, item) => total + (item.cantidad * item.precioUnitario), 0);
}
```

### Documentación de APIs
<!-- TODO: Definir estándares de documentación de APIs -->
- **Formato**: OpenAPI/Swagger
- **Descripción**: Clara y concisa
- **Ejemplos**: Request/Response examples
- **Códigos de Error**: Documentados

## 🔧 Configuración de Herramientas

### ESLint
<!-- TODO: Configurar reglas de ESLint -->
```json
{
  "extends": [],
  "rules": {}
}
```

### Prettier
<!-- TODO: Configurar reglas de Prettier -->
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

### Git Hooks
<!-- TODO: Configurar git hooks -->
- **pre-commit**: Linting y formatting
- **pre-push**: Tests
- **commit-msg**: Conventional commits

## 📦 Gestión de Dependencias

### Package.json
<!-- TODO: Definir estándares para package.json -->
- **Versioning**: Semantic versioning
- **Dependencies**: Separar dev vs prod
- **Scripts**: Nombres estándar

### Actualizaciones
<!-- TODO: Definir proceso de actualización -->
- **Frecuencia**: 
- **Testing**: 
- **Rollback**: 

## 🔀 Git Workflow

### Branching Strategy
<!-- TODO: Definir estrategia de branching -->
- **Main Branch**: `main`
- **Development**: `develop`
- **Features**: `feature/nombre-funcionalidad`
- **Hotfixes**: `hotfix/descripcion`
- **Releases**: `release/version`

### Commit Messages
<!-- TODO: Definir formato de commit messages -->
```
<type>(<scope>): <description>

<body>

<footer>
```

#### Tipos de Commit
- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **docs**: Documentación
- **style**: Formato de código
- **refactor**: Refactoring
- **test**: Tests
- **chore**: Tareas de mantenimiento

### Pull Requests
<!-- TODO: Definir proceso de pull requests -->
- **Template**: Usar template estándar
- **Reviews**: Mínimo X reviewers
- **Tests**: Deben pasar todos los tests
- **Documentation**: Actualizar si es necesario

## 🧪 Testing

### Estructura de Tests
<!-- TODO: Definir estructura de tests -->
```
tests/
├── unit/
├── integration/
└── e2e/
```

### Naming Conventions
<!-- TODO: Definir convenciones de naming para tests -->
- **Test Files**: `*.test.js` o `*.spec.js`
- **Test Suites**: `describe('ModuleName', () => {})`
- **Test Cases**: `it('should do something', () => {})`

### Coverage
<!-- TODO: Definir métricas de coverage -->
- **Mínimo**: X%
- **Objetivo**: X%
- **Exclusiones**: Archivos de configuración

## 🔐 Seguridad

### Secrets Management
<!-- TODO: Definir manejo de secrets -->
- **Variables de Entorno**: Usar .env
- **Claves**: Nunca en código
- **Rotación**: Proceso definido

### Validación de Entrada
<!-- TODO: Definir estándares de validación -->
- **Sanitización**: Siempre sanitizar input
- **Validación**: En controller y service
- **Error Handling**: Manejo consistente

## 📊 Logging

### Niveles de Log
<!-- TODO: Definir niveles de log -->
- **ERROR**: Errores críticos
- **WARN**: Advertencias
- **INFO**: Información general
- **DEBUG**: Información de debug

### Formato de Logs
<!-- TODO: Definir formato de logs -->
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "message": "Mensaje del log",
  "module": "nombre-modulo",
  "userId": "user-id"
}
```

## 🚀 Deployment

### Ambientes
<!-- TODO: Definir convenciones por ambiente -->
- **Development**: Configuración y naming
- **Staging**: Configuración y naming
- **Production**: Configuración y naming

### Variables de Entorno
<!-- TODO: Definir naming de variables de entorno -->
- **Formato**: UPPER_SNAKE_CASE
- **Prefijos**: Por módulo o ambiente
- **Documentación**: Todas documentadas

## 📱 Frontend Específico

### Componentes React
<!-- TODO: Definir convenciones para React -->
- **Functional Components**: Preferir sobre class components
- **Hooks**: Usar hooks personalizados para lógica compleja
- **Props**: Destructuring en parámetros
- **State**: useState para estado local

### CSS Modules
<!-- TODO: Definir convenciones para CSS -->
- **Naming**: camelCase para clases
- **Estructura**: Un archivo por componente
- **Variables**: Usar CSS custom properties

### Estado Global
<!-- TODO: Definir manejo de estado global -->
- **Context**: Para estado compartido
- **Reducers**: Para lógica compleja
- **Local Storage**: Para persistencia

## 🔧 Backend Específico

### Express.js
<!-- TODO: Definir convenciones para Express -->
- **Middleware**: Un archivo por middleware
- **Routes**: Separar por módulo
- **Error Handling**: Middleware centralizado

### Prisma
<!-- TODO: Definir convenciones para Prisma -->
- **Models**: PascalCase
- **Fields**: camelCase
- **Relations**: Descriptivos
- **Migrations**: Nombres descriptivos

### APIs
<!-- TODO: Definir convenciones para APIs -->
- **HTTP Methods**: Usar correctamente
- **Status Codes**: Códigos apropiados
- **Response Format**: Consistente
- **Error Format**: Estandarizado

---

*Última actualización: [FECHA]*
*Responsable: [NOMBRE]*
