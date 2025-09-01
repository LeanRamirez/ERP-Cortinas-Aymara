# Ejemplos de Uso - API PDF

## Iniciar el servidor

```bash
cd erp-cortinas/backend
npm run dev
```

## 1. Generar PDF con datos personalizados

```bash
curl -X POST http://localhost:4001/api/pdf/presupuesto \
  -H "Content-Type: application/json" \
  -d '{
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
      },
      {
        "descripcion": "Instalación y colocación",
        "cantidad": 1,
        "precio_unitario": 5000
      }
    ],
    "total_final": 35000,
    "comentarios_adicionales": "Promoción especial - 10% descuento",
    "comentarios": "Incluye garantía de 2 años. Instalación programada para la próxima semana.",
    "forma_pago": "Efectivo - 50% seña, 50% contra entrega"
  }'
```

## 2. Generar PDF desde presupuesto existente

```bash
curl -X POST http://localhost:4001/api/pdf/presupuesto/1
```

## 3. Listar PDFs generados

```bash
curl http://localhost:4001/api/pdf/listar
```

## 4. Eliminar un PDF

```bash
curl -X DELETE http://localhost:4001/api/pdf/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf
```

## 5. Descargar un PDF generado

Una vez generado el PDF, puedes acceder directamente a la URL devuelta:

```bash
# Ejemplo de URL generada
http://localhost:4001/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf
```

## Respuesta de ejemplo

```json
{
  "success": true,
  "archivo": {
    "nombre": "presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf",
    "ruta": "/path/to/backend/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf",
    "url": "http://localhost:4001/public/pdfs/presupuesto-PRES001-2025-01-12T15-30-45-123Z.pdf"
  },
  "mensaje": "PDF generado exitosamente"
}
```

## Prueba con JavaScript (Frontend)

```javascript
// Generar PDF
const generarPDF = async () => {
  const datos = {
    numero_presupuesto: 'PRES-001',
    fecha_presupuesto: new Date().toISOString(),
    nombre_emisor: 'Cortinas Aymara',
    nombre_cliente: 'Juan Pérez',
    items: [
      {
        descripcion: 'Cortina Roller Blackout',
        cantidad: 2,
        precio_unitario: 15000
      }
    ],
    total_final: 30000
  };

  try {
    const response = await fetch('http://localhost:4001/api/pdf/presupuesto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    const resultado = await response.json();
    
    if (resultado.success) {
      console.log('PDF generado:', resultado.archivo.url);
      // Abrir el PDF en una nueva ventana
      window.open(resultado.archivo.url, '_blank');
    } else {
      console.error('Error:', resultado.message);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};

// Listar PDFs
const listarPDFs = async () => {
  try {
    const response = await fetch('http://localhost:4001/api/pdf/listar');
    const resultado = await response.json();
    
    console.log('PDFs disponibles:', resultado.pdfs);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Validaciones

El servicio validará que los siguientes campos estén presentes:

- `numero_presupuesto`
- `fecha_presupuesto`
- `nombre_emisor`
- `nombre_cliente`
- `items` (array con al menos un elemento)
- `total_final`

Cada item debe tener:
- `descripcion`
- `cantidad`
- `precio_unitario`

## Códigos de Error

- `400`: Datos faltantes o inválidos
- `404`: Presupuesto no encontrado (para endpoint con ID)
- `500`: Error interno del servidor
