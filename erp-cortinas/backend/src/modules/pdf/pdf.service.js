import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  constructor() {
    this.templatesPath = path.join(__dirname, '../../../templates');
    this.publicPath = path.join(__dirname, '../../../public/pdfs');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  }

  /**
   * Genera un PDF de presupuesto usando el template HTML
   * @param {Object} data - Datos del presupuesto
   * @returns {Object} - Información del archivo generado
   */
  async generarPresupuestoPDF(data) {
    try {
      // Validar datos requeridos
      this.validarDatosPresupuesto(data);

      // Procesar los datos para el template
      const datosTemplate = this.procesarDatosTemplate(data);

      // Cargar y compilar el template HTML
      const htmlContent = await this.compilarTemplate('presupuesto_v1.html', datosTemplate);

      // Generar nombre único para el archivo
      const nombreArchivo = this.generarNombreArchivo(data.numero_presupuesto);

      // Convertir HTML a PDF
      const rutaArchivo = await this.convertirHTMLaPDF(htmlContent, nombreArchivo);

      // Generar URL pública
      const urlPublica = `${this.baseUrl}/public/pdfs/${nombreArchivo}`;

      return {
        success: true,
        archivo: {
          nombre: nombreArchivo,
          ruta: rutaArchivo,
          url: urlPublica
        },
        mensaje: 'PDF generado exitosamente'
      };

    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Valida que los datos del presupuesto tengan los campos requeridos
   * @param {Object} data - Datos a validar
   */
  validarDatosPresupuesto(data) {
    const camposRequeridos = [
      'numero_presupuesto',
      'fecha_presupuesto',
      'nombre_emisor',
      'nombre_cliente',
      'items',
      'total_final'
    ];

    for (const campo of camposRequeridos) {
      if (!data[campo]) {
        throw new Error(`Campo requerido faltante: ${campo}`);
      }
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('El presupuesto debe tener al menos un item');
    }

    // Validar items
    data.items.forEach((item, index) => {
      if (!item.descripcion || !item.cantidad || !item.precio_unitario) {
        throw new Error(`Item ${index + 1} tiene campos faltantes`);
      }
    });
  }

  /**
   * Procesa los datos para que sean compatibles con el template
   * @param {Object} data - Datos originales
   * @returns {Object} - Datos procesados
   */
  procesarDatosTemplate(data) {
    // Calcular totales de items
    const itemsProcesados = data.items.map(item => ({
      ...item,
      precio_unitario: this.formatearMoneda(item.precio_unitario),
      total_item: this.formatearMoneda(item.cantidad * item.precio_unitario)
    }));

    // Calcular subtotal
    const subtotal = data.items.reduce((sum, item) => 
      sum + (item.cantidad * item.precio_unitario), 0
    );

    return {
      // Información del presupuesto
      numero_presupuesto: data.numero_presupuesto,
      fecha_presupuesto: this.formatearFecha(data.fecha_presupuesto),

      // Información del emisor
      nombre_emisor: data.nombre_emisor || 'Cortinas Aymara',
      telefono_emisor: data.telefono_emisor || '',
      direccion_emisor: data.direccion_emisor || '',

      // Información del cliente
      nombre_cliente: data.nombre_cliente,
      cuil_cuit_cliente: data.cuil_cuit_cliente || '',
      direccion_cliente: data.direccion_cliente || '',
      telefono_cliente: data.telefono_cliente || '',

      // Items del presupuesto
      items: itemsProcesados,

      // Totales
      subtotal: this.formatearMoneda(subtotal),
      total_final: this.formatearMoneda(data.total_final),

      // Información adicional
      comentarios_adicionales: data.comentarios_adicionales || '',
      comentarios: data.comentarios || '',
      forma_pago: data.forma_pago || 'A convenir'
    };
  }

  /**
   * Carga y compila el template HTML con los datos
   * @param {string} templateName - Nombre del template
   * @param {Object} data - Datos para el template
   * @returns {string} - HTML compilado
   */
  async compilarTemplate(templateName, data) {
    try {
      // Leer el template HTML
      const templatePath = path.join(this.templatesPath, templateName);
      const templateContent = await fs.readFile(templatePath, 'utf-8');

      // Leer el CSS
      const cssPath = path.join(this.templatesPath, 'presupuesto_v1.css');
      const cssContent = await fs.readFile(cssPath, 'utf-8');

      // Compilar el template con Handlebars
      const template = handlebars.compile(templateContent);
      let htmlContent = template(data);

      // Insertar CSS inline para mejor compatibilidad con PDF
      htmlContent = htmlContent.replace(
        '<link rel="stylesheet" href="presupuesto_v1.css">',
        `<style>${cssContent}</style>`
      );

      return htmlContent;

    } catch (error) {
      throw new Error(`Error compilando template: ${error.message}`);
    }
  }

  /**
   * Convierte HTML a PDF usando Puppeteer
   * @param {string} htmlContent - Contenido HTML
   * @param {string} nombreArchivo - Nombre del archivo PDF
   * @returns {string} - Ruta del archivo generado
   */
  async convertirHTMLaPDF(htmlContent, nombreArchivo) {
    let browser;
    try {
      // Asegurar que la carpeta de destino existe
      await fs.mkdir(this.publicPath, { recursive: true });

      // Configurar Puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Configurar el contenido HTML
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Configurar opciones del PDF
      const rutaArchivo = path.join(this.publicPath, nombreArchivo);
      
      await page.pdf({
        path: rutaArchivo,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        }
      });

      return rutaArchivo;

    } catch (error) {
      throw new Error(`Error convirtiendo a PDF: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Genera un nombre único para el archivo PDF
   * @param {string} numeroPresupuesto - Número del presupuesto
   * @returns {string} - Nombre del archivo
   */
  generarNombreArchivo(numeroPresupuesto) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const numeroLimpio = numeroPresupuesto.toString().replace(/[^a-zA-Z0-9]/g, '');
    return `presupuesto-${numeroLimpio}-${timestamp}.pdf`;
  }

  /**
   * Formatea un número como moneda
   * @param {number} valor - Valor a formatear
   * @returns {string} - Valor formateado
   */
  formatearMoneda(valor) {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }

  /**
   * Formatea una fecha
   * @param {string|Date} fecha - Fecha a formatear
   * @returns {string} - Fecha formateada
   */
  formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Lista todos los PDFs generados
   * @returns {Array} - Lista de archivos PDF
   */
  async listarPDFs() {
    try {
      const archivos = await fs.readdir(this.publicPath);
      const pdfs = archivos
        .filter(archivo => archivo.endsWith('.pdf'))
        .map(archivo => ({
          nombre: archivo,
          url: `${this.baseUrl}/public/pdfs/${archivo}`,
          ruta: path.join(this.publicPath, archivo)
        }));

      return pdfs;
    } catch (error) {
      console.error('Error listando PDFs:', error);
      return [];
    }
  }

  /**
   * Elimina un PDF específico
   * @param {string} nombreArchivo - Nombre del archivo a eliminar
   * @returns {boolean} - True si se eliminó exitosamente
   */
  async eliminarPDF(nombreArchivo) {
    try {
      const rutaArchivo = path.join(this.publicPath, nombreArchivo);
      await fs.unlink(rutaArchivo);
      return true;
    } catch (error) {
      console.error('Error eliminando PDF:', error);
      return false;
    }
  }
}

export default new PDFService();
