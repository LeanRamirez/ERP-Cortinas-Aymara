import PDFService from './src/modules/pdf/pdf.service.js';

// Datos de ejemplo para probar el servicio PDF
const datosEjemplo = {
  numero_presupuesto: 'PRES-001',
  fecha_presupuesto: new Date(),
  nombre_emisor: 'Cortinas Aymara',
  telefono_emisor: '+54 9 11 1234-5678',
  direccion_emisor: 'Av. Corrientes 1234, CABA',
  nombre_cliente: 'Juan Pérez',
  cuil_cuit_cliente: '20-12345678-9',
  direccion_cliente: 'Av. Rivadavia 5678, CABA',
  telefono_cliente: '+54 9 11 8765-4321',
  items: [
    {
      descripcion: 'Cortina Roller Blackout 1.20m x 1.50m',
      cantidad: 2,
      precio_unitario: 15000
    },
    {
      descripcion: 'Instalación y colocación',
      cantidad: 1,
      precio_unitario: 5000
    },
    {
      descripcion: 'Cortina Tradicional con Barral 2.00m x 2.20m',
      cantidad: 1,
      precio_unitario: 25000
    }
  ],
  total_final: 60000,
  comentarios_adicionales: 'Promoción especial - 10% descuento',
  comentarios: 'Incluye garantía de 2 años. Instalación programada para la próxima semana.',
  forma_pago: 'Efectivo - 50% seña, 50% contra entrega'
};

async function probarGeneracionPDF() {
  try {
    console.log('🔄 Iniciando prueba de generación de PDF...');
    
    const resultado = await PDFService.generarPresupuestoPDF(datosEjemplo);
    
    console.log('✅ PDF generado exitosamente:');
    console.log('📄 Nombre:', resultado.archivo.nombre);
    console.log('📁 Ruta:', resultado.archivo.ruta);
    console.log('🌐 URL:', resultado.archivo.url);
    
    // Listar PDFs generados
    console.log('\n📋 Listando PDFs generados:');
    const pdfs = await PDFService.listarPDFs();
    pdfs.forEach((pdf, index) => {
      console.log(`${index + 1}. ${pdf.nombre} - ${pdf.url}`);
    });
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error.message);
  }
}

// Ejecutar la prueba
probarGeneracionPDF();
