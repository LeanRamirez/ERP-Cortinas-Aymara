# RUNBOOK - ERP Cortinas Aymara

## 🚀 Guía de Operaciones

### Información General
<!-- TODO: Completar información general -->
- **Proyecto**: ERP Cortinas Aymara
- **Versión**: 1.0.0
- **Responsable**: 
- **Última Actualización**: 

## 🔧 Setup y Configuración

### Prerrequisitos
- [x] Node.js >= 18.0.0
- [x] npm >= 9.0.0
- [x] Docker y Docker Compose (opcional)
- [x] Git
- [ ] PostgreSQL (solo para producción)
- [ ] Python 3 (para generar claves criptográficas)

### Variables de Entorno
```bash
# Base de datos
DATABASE_URL="file:./dev.db"  # SQLite para desarrollo
# DATABASE_URL="postgresql://admin:admin@localhost:5433/erp_cortinas"  # PostgreSQL

# Servidor
PORT=4000
NODE_ENV=development

# Claves de cifrado (generar con python3 generate-keys.py)
CONFIG_SECRETS_KEY=uT+YHtn32+j6PN8zlmGCnyDzFtlCcziisii8co2QqVg=
ADMIN_KEY=5f44df7ffdf9b8ad5ef3958e7eb8207acf8272aed60c4932823e619a5a874922

# CORS (opcional)
FRONTEND_URL=http://localhost:3000
```

### Instalación Inicial
```bash
# 1. Clonar repositorio
git clone https://github.com/LeanRamirez/ERP-Cortinas-Aymara.git
cd erp-cortinas

# 2. Generar claves criptográficas
python3 generate-keys.py
# Copiar las claves generadas al archivo .env del backend

# 3. Configurar backend
cd backend
npm install
# Crear .env con las variables de arriba
npx prisma generate
npx prisma migrate dev
npm run seed

# 4. Configurar frontend
cd ../frontend
npm install

# 5. Iniciar servicios
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

## 🐳 Docker Operations

### Comandos Docker
<!-- TODO: Documentar comandos Docker esenciales -->
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f [service]

# Reiniciar servicio
docker-compose restart [service]

# Parar todos los servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

### Troubleshooting Docker
<!-- TODO: Documentar problemas comunes de Docker -->
- **Problema**: Puerto ocupado
  - **Solución**: 
- **Problema**: Volúmenes corruptos
  - **Solución**: 

## 🗄 Base de Datos

### Operaciones Comunes
<!-- TODO: Documentar operaciones de base de datos -->
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Reset base de datos
npx prisma migrate reset

# Poblar con datos de prueba
npm run seed

# Abrir Prisma Studio
npx prisma studio
```

### Backup y Restore
<!-- TODO: Documentar procedimientos de backup -->
```bash
# Backup (PostgreSQL)
pg_dump [DATABASE_URL] > backup.sql

# Restore (PostgreSQL)
psql [DATABASE_URL] < backup.sql

# Backup (SQLite)
cp backend/prisma/dev.db backup/dev_$(date +%Y%m%d_%H%M%S).db
```

### Monitoreo de Base de Datos
<!-- TODO: Documentar monitoreo de BD -->
- **Conexiones activas**: 
- **Tamaño de base de datos**: 
- **Queries lentas**: 

## 🔄 Deployment

### Desarrollo
<!-- TODO: Documentar deployment de desarrollo -->
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Staging
<!-- TODO: Documentar deployment de staging -->
```bash
# Comandos para staging
```

### Producción
<!-- TODO: Documentar deployment de producción -->
```bash
# Comandos para producción
docker-compose -f docker-compose.prod.yml up -d
```

### Rollback
<!-- TODO: Documentar procedimiento de rollback -->
```bash
# Pasos para rollback
1. [ ] Parar servicios actuales
2. [ ] Restaurar versión anterior
3. [ ] Verificar funcionamiento
```

## 📊 Monitoreo y Logs

### Logs de Aplicación
<!-- TODO: Documentar ubicación y formato de logs -->
```bash
# Ver logs en tiempo real
docker-compose logs -f backend
docker-compose logs -f frontend

# Logs por fecha
docker-compose logs --since="2024-01-01" backend

# Exportar logs
docker-compose logs backend > logs/backend_$(date +%Y%m%d).log
```

### Métricas Importantes
<!-- TODO: Definir métricas críticas -->
- **CPU Usage**: < X%
- **Memory Usage**: < X MB
- **Response Time**: < X ms
- **Error Rate**: < X%
- **Database Connections**: < X

### Alertas
<!-- TODO: Configurar alertas -->
- **Servicio caído**: 
- **Alto uso de CPU**: 
- **Errores frecuentes**: 
- **Base de datos lenta**: 

## 🔐 Seguridad

### Gestión de Claves
<!-- TODO: Documentar gestión de claves -->
```bash
# Generar nuevas claves
python3 generate-keys.py

# Rotar claves en producción
1. [ ] Generar nuevas claves
2. [ ] Actualizar variables de entorno
3. [ ] Reiniciar servicios
4. [ ] Verificar funcionamiento
```

### Certificados SSL
<!-- TODO: Documentar gestión de certificados -->
- **Ubicación**: 
- **Renovación**: 
- **Verificación**: 

### Auditoría de Seguridad
<!-- TODO: Documentar auditoría de seguridad -->
- **Logs de acceso**: 
- **Intentos de login**: 
- **Cambios de configuración**: 

## 🚨 Troubleshooting

### Problemas Comunes

#### Backend No Responde
<!-- TODO: Documentar troubleshooting del backend -->
**Síntomas**: 
**Diagnóstico**:
```bash
# Verificar estado del servicio
docker-compose ps backend

# Ver logs
docker-compose logs backend

# Verificar conectividad
curl http://localhost:4000/
```
**Solución**:
1. [ ] Paso 1
2. [ ] Paso 2

#### Frontend No Carga
<!-- TODO: Documentar troubleshooting del frontend -->
**Síntomas**: 
**Diagnóstico**:
```bash
# Verificar estado del servicio
docker-compose ps frontend

# Ver logs
docker-compose logs frontend
```
**Solución**:
1. [ ] Paso 1
2. [ ] Paso 2

#### Base de Datos Inaccesible
<!-- TODO: Documentar troubleshooting de BD -->
**Síntomas**: 
**Diagnóstico**:
```bash
# Verificar conexión
npx prisma db pull

# Ver logs de PostgreSQL
docker-compose logs postgres
```
**Solución**:
1. [ ] Paso 1
2. [ ] Paso 2

#### PDFs No Se Generan
<!-- TODO: Documentar troubleshooting de PDFs -->
**Síntomas**: 
**Diagnóstico**:
```bash
# Probar generación manual
cd backend
node test-pdf.js
```
**Solución**:
1. [ ] Paso 1
2. [ ] Paso 2

### Comandos de Diagnóstico
<!-- TODO: Listar comandos útiles para diagnóstico -->
```bash
# Estado de servicios
docker-compose ps

# Uso de recursos
docker stats

# Conectividad de red
docker network ls
docker network inspect erp-cortinas_default

# Espacio en disco
df -h

# Procesos activos
ps aux | grep node
```

## 🔄 Mantenimiento

### Tareas Diarias
<!-- TODO: Definir tareas de mantenimiento diario -->
- [ ] Verificar estado de servicios
- [ ] Revisar logs de errores
- [ ] Monitorear métricas de rendimiento
- [ ] Verificar backups

### Tareas Semanales
<!-- TODO: Definir tareas de mantenimiento semanal -->
- [ ] Actualizar dependencias menores
- [ ] Limpiar logs antiguos
- [ ] Revisar métricas de uso
- [ ] Verificar certificados SSL

### Tareas Mensuales
<!-- TODO: Definir tareas de mantenimiento mensual -->
- [ ] Actualizar dependencias mayores
- [ ] Revisar configuración de seguridad
- [ ] Optimizar base de datos
- [ ] Revisar capacidad de almacenamiento

## 📞 Contactos de Emergencia

### Equipo Técnico
<!-- TODO: Listar contactos del equipo -->
- **Desarrollador Principal**: 
- **DevOps**: 
- **DBA**: 

### Proveedores
<!-- TODO: Listar contactos de proveedores -->
- **Hosting**: 
- **Base de Datos**: 
- **CDN**: 

## 📋 Checklists

### Checklist de Deployment
<!-- TODO: Crear checklist de deployment -->
- [ ] Tests pasando
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Backup realizado
- [ ] Servicios reiniciados
- [ ] Verificación funcional
- [ ] Monitoreo activo

### Checklist de Rollback
<!-- TODO: Crear checklist de rollback -->
- [ ] Identificar versión anterior estable
- [ ] Parar servicios actuales
- [ ] Restaurar código anterior
- [ ] Restaurar base de datos si necesario
- [ ] Reiniciar servicios
- [ ] Verificar funcionamiento
- [ ] Notificar al equipo

### Checklist de Incidentes
<!-- TODO: Crear checklist de manejo de incidentes -->
- [ ] Identificar y documentar el problema
- [ ] Evaluar impacto y urgencia
- [ ] Implementar solución temporal si es posible
- [ ] Comunicar estado a stakeholders
- [ ] Implementar solución definitiva
- [ ] Verificar resolución
- [ ] Documentar lecciones aprendidas

---

*Última actualización: [FECHA]*
*Responsable: [NOMBRE]*
