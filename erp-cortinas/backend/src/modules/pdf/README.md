# Servicio de Generación de PDFs

Este módulo proporciona funcionalidades para generar PDFs de presupuestos usando templates HTML y Puppeteer.

## Características

- ✅ Generación de PDFs desde templates HTML
- ✅ Inyección de datos dinámicos usando Handlebars
- ✅ Formato A4 con estilos CSS respetados
- ✅ Almacenamiento en carpeta pública configurable
- ✅ URLs públicas para descarga
- ✅ Validación de datos de entrada
- ✅ Formateo automático de monedas y fechas

## Estructura de Archivos

```
pdf/
├── pdf.service.js      # Lógica principal del servicio
├── pdf.controller.js   # Controladores HTTP
├── pdf.routes.js       # Definición de rutas
└── README.md          # Esta documentación
```

## API Endpoints

### POST /api/pdf/presupuesto
Genera un PDF de presupuesto con datos personalizados.

**Body de ejemplo:**
```json
{
  "numero_presupuesto": "PRES-001",
  "fecha_presupuesto": "2025-01-12",
  "nombre_emisor": "Cortinas Aymara",
  "telefono_emisor": "+54 9 11 1234-5678",
  "direccion_emisor": "Av. Corrientes 1234, CABA",
  "nombre_cliente": "Juan Pérez",
  "cuil_cuit_cliente": "20-12345678-9",
  "direccion_cliente": "Av. Rivadavia 5678, CABA",
  "telefono_cliente": "+54 9 11 8765-4321",
  "items": [
    {
      "descripcion": "Cortina Roller Blackout 1.20m x 1.50m",
      "cantidad": 2,
      "precio_unitario": 15000
    }
  ],
  "total_final": 30000,
  "comentarios_adicionales": "Promoción especial",
  "comentarios": "Incluye garantía de 2 años",
  "forma_pago": "Efectivo"
}
```

**Respuesta:**
```json
{
  "success": true,
  "archivo": {
    "nombre": "presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf",
    "ruta": "/path/to/backend/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf",
    "url": "http://localhost:3001/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf"
  },
  "mensaje": "PDF generado exitosamente"
}
```

### POST /api/pdf/presupuesto/:id
Genera un PDF desde un presupuesto existente en la base de datos.

**Parámetros:**
- `id`: ID del presupuesto en la base de datos

### GET /api/pdf/listar
Lista todos los PDFs generados.

**Respuesta:**
```json
{
  "success": true,
  "pdfs": [
    {
      "nombre": "presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf",
      "url": "http://localhost:3001/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf",
      "ruta": "/path/to/backend/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf"
    }
  ],
  "total": 1
}
```

### DELETE /api/pdf/:nombreArchivo
Elimina un PDF específico.

**Parámetros:**
- `nombreArchivo`: Nombre del archivo PDF a eliminar

## Campos Requeridos

Para generar un PDF, los siguientes campos son obligatorios:

- `numero_presupuesto`: Número identificador del presupuesto
- `fecha_presupuesto`: Fecha del presupuesto
- `nombre_emisor`: Nombre de quien emite el presupuesto
- `nombre_cliente`: Nombre del cliente
- `items`: Array con al menos un item
  - `descripcion`: Descripción del producto/servicio
  - `cantidad`: Cantidad
  - `precio_unitario`: Precio unitario
- `total_final`: Total del presupuesto

## Campos Opcionales

- `telefono_emisor`: Teléfono del emisor
- `direccion_emisor`: Dirección del emisor
- `cuil_cuit_cliente`: CUIL/CUIT del cliente
- `direccion_cliente`: Dirección del cliente
- `telefono_cliente`: Teléfono del cliente
- `comentarios_adicionales`: Comentarios adicionales
- `comentarios`: Comentarios generales
- `forma_pago`: Forma de pago

## Configuración

### Variables de Entorno

- `BASE_URL`: URL base para generar URLs públicas (default: http://localhost:3001)

### Carpetas

- Templates: `backend/templates/`
- PDFs generados: `backend/public/pdfs/`

## Template HTML

El servicio utiliza el template `presupuesto_v1.html` con sintaxis Handlebars para inyectar datos dinámicos.

### Variables del Template

```handlebars
{{numero_presupuesto}}
{{fecha_presupuesto}}
{{nombre_emisor}}
{{telefono_emisor}}
{{direccion_emisor}}
{{nombre_cliente}}
{{cuil_cuit_cliente}}
{{direccion_cliente}}
{{telefono_cliente}}
{{#items}}
  {{descripcion}}
  {{cantidad}}
  {{precio_unitario}}
  {{total_item}}
{{/items}}
{{subtotal}}
{{total_final}}
{{comentarios_adicionales}}
{{comentarios}}
{{forma_pago}}
```

## Uso Programático

```javascript
import PDFService from './pdf.service.js';

const datos = {
  numero_presupuesto: 'PRES-001',
  fecha_presupuesto: new Date(),
  nombre_emisor: 'Cortinas Aymara',
  nombre_cliente: 'Juan Pérez',
  items: [
    {
      descripcion: 'Cortina Roller',
      cantidad: 1,
      precio_unitario: 15000
    }
  ],
  total_final: 15000
};

try {
  const resultado = await PDFService.generarPresupuestoPDF(datos);
  console.log('PDF generado:', resultado.archivo.url);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Dependencias

- `handlebars`: Para compilar templates HTML
- `puppeteer`: Para convertir HTML a PDF
- `fs/promises`: Para operaciones de archivos
- `path`: Para manejo de rutas

## Notas Técnicas

- Los PDFs se generan en formato A4
- Los estilos CSS se insertan inline para mejor compatibilidad
- Los nombres de archivos incluyen timestamp para evitar colisiones
- Las monedas se formatean en formato argentino (es-AR)
- Las fechas se formatean en formato DD/MM/YYYY
