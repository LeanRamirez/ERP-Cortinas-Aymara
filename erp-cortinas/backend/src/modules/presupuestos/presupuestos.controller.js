import { 
  obtenerPresupuestos, 
  obtenerPresupuestoPorId, 
  obtenerPresupuestosPorCliente,
  guardarPresupuesto, 
  actualizarPresupuesto, 
  eliminarPresupuesto 
} from "./presupuestos.service.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPresupuestos = async (req, res) => {
  try {
    const presupuestos = await obtenerPresupuestos();
    res.json(presupuestos);
  } catch (err) {
    console.error("Error al obtener presupuestos:", err);
    res.status(500).json({ error: "Error al obtener presupuestos" });
  }
};

export const getPresupuestoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const presupuesto = await obtenerPresupuestoPorId(parseInt(id));
    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    res.json(presupuesto);
  } catch (err) {
    console.error("Error al obtener presupuesto:", err);
    res.status(500).json({ error: "Error al obtener presupuesto" });
  }
};

export const getPresupuestosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const presupuestos = await obtenerPresupuestosPorCliente(parseInt(clienteId));
    res.json(presupuestos);
  } catch (err) {
    console.error("Error al obtener presupuestos por cliente:", err);
    res.status(500).json({ error: "Error al obtener presupuestos por cliente" });
  }
};

export const crearPresupuesto = async (req, res) => {
  try {
    const { descripcion, valor, clienteId, estado } = req.body;
    
    // Validaciones básicas
    if (!descripcion || !valor || !clienteId) {
      return res.status(400).json({ 
        error: "Descripción, valor y cliente son requeridos" 
      });
    }

    if (isNaN(valor) || valor <= 0) {
      return res.status(400).json({ 
        error: "El valor debe ser un número mayor a 0" 
      });
    }

    const presupuesto = await guardarPresupuesto({
      descripcion,
      valor: parseFloat(valor),
      clienteId: parseInt(clienteId),
      estado: estado || 'pendiente'
    });
    
    res.status(201).json(presupuesto);
  } catch (err) {
    console.error("Error al crear presupuesto:", err);
    res.status(500).json({ error: "Error al crear presupuesto" });
  }
};

export const editarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, valor, estado } = req.body;

    // Validaciones básicas
    if (!descripcion || !valor) {
      return res.status(400).json({ 
        error: "Descripción y valor son requeridos" 
      });
    }

    if (isNaN(valor) || valor <= 0) {
      return res.status(400).json({ 
        error: "El valor debe ser un número mayor a 0" 
      });
    }

    const presupuesto = await actualizarPresupuesto(parseInt(id), {
      descripcion,
      valor: parseFloat(valor),
      estado: estado || 'pendiente'
    });
    
    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    
    res.json(presupuesto);
  } catch (err) {
    console.error("Error al actualizar presupuesto:", err);
    res.status(500).json({ error: "Error al actualizar presupuesto" });
  }
};

export const borrarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarPresupuesto(parseInt(id));
    res.json({ message: "Presupuesto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar presupuesto:", err);
    if (err.message === 'Presupuesto no encontrado') {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    res.status(500).json({ error: "Error al eliminar presupuesto" });
  }
};

/**
 * Genera PDF de presupuesto con autodiagnóstico
 * POST /api/presupuestos/:id/pdf
 */
export const generarPDFPresupuesto = async (req, res) => {
  const { id } = req.params;
  const { dryRun } = req.query;
  const isDryRun = dryRun === 'true';
  const isVerbose = process.env.DIAG_VERBOSE === 'true';
  
  let diagnostico = {
    stage: null,
    message: '',
    probableCause: [],
    suggestedFix: ''
  };

  try {
    // Stage 1: Fetch Budget
    diagnostico.stage = 'fetchBudget';
    if (isVerbose) console.log(`[PDF-GEN] Iniciando generación PDF para presupuesto ${id}`);
    
    const presupuesto = await obtenerPresupuestoPorId(parseInt(id));
    if (!presupuesto) {
      diagnostico.message = 'Presupuesto no encontrado';
      diagnostico.probableCause = ['ID inválido', 'presupuesto eliminado'];
      diagnostico.suggestedFix = 'Verificar que el ID del presupuesto sea correcto y que exista en la base de datos';
      return res.status(404).json({ ok: false, diagnostico });
    }

    if (isVerbose) console.log(`[PDF-GEN] Presupuesto obtenido: ${presupuesto.descripcion}`);

    // Validar datos del presupuesto
    const validationResult = validarDatosPresupuesto(presupuesto);
    if (!validationResult.valid) {
      diagnostico.message = 'Datos del presupuesto incompletos';
      diagnostico.probableCause = validationResult.missing;
      diagnostico.suggestedFix = 'Completar los datos faltantes del presupuesto: ' + validationResult.missing.join(', ');
      return res.status(400).json({ ok: false, diagnostico });
    }

    // Stage 2: Check if PDF exists
    const filename = `Presupuesto-${id}.pdf`;
    const publicPath = path.join(__dirname, '../../../public/pdfs');
    const filePath = path.join(publicPath, filename);
    
    try {
      await fs.access(filePath);
      // PDF exists, return existing file
      const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
      const publicUrl = `${baseUrl}/public/pdfs/${filename}`;
      
      if (isVerbose) console.log(`[PDF-GEN] PDF existente encontrado: ${filePath}`);
      
      return res.status(200).json({
        ok: true,
        filename,
        publicUrl,
        cached: true
      });
    } catch {
      // PDF doesn't exist, continue with generation
      if (isVerbose) console.log(`[PDF-GEN] PDF no existe, procediendo con generación`);
    }

    // Si es dry run, no generar el archivo
    if (isDryRun) {
      return res.status(200).json({
        ok: true,
        canGenerate: true,
        filename,
        message: 'Validaciones pasadas, listo para generar PDF'
      });
    }

    // Stage 3: Template Load
    diagnostico.stage = 'templateLoad';
    const templatesPath = path.join(__dirname, '../../../templates');
    const templatePath = path.join(templatesPath, 'presupuesto_v1.html');
    const cssPath = path.join(templatesPath, 'presupuesto_v1.css');

    if (isVerbose) {
      console.log(`[PDF-GEN] Template path: ${templatePath}`);
      console.log(`[PDF-GEN] CSS path: ${cssPath}`);
    }

    let templateContent, cssContent;
    try {
      templateContent = await fs.readFile(templatePath, 'utf-8');
      cssContent = await fs.readFile(cssPath, 'utf-8');
    } catch (error) {
      diagnostico.message = 'Error cargando template';
      diagnostico.probableCause = ['template no encontrado', 'permisos de archivo'];
      diagnostico.suggestedFix = `Verificar que existan los archivos: ${templatePath} y ${cssPath}`;
      return res.status(500).json({ ok: false, diagnostico });
    }

    // Stage 4: Render HTML
    diagnostico.stage = 'renderHTML';
    const datosTemplate = procesarDatosTemplate(presupuesto);
    
    try {
      const template = handlebars.compile(templateContent);
      let htmlContent = template(datosTemplate);
      htmlContent = htmlContent.replace(
        '<link rel="stylesheet" href="presupuesto_v1.css">',
        `<style>${cssContent}</style>`
      );
      
      if (isVerbose) console.log(`[PDF-GEN] HTML renderizado correctamente`);
    } catch (error) {
      diagnostico.message = 'Error renderizando HTML';
      diagnostico.probableCause = ['datos obligatorios vacíos', 'template malformado'];
      diagnostico.suggestedFix = 'Verificar que los datos del presupuesto estén completos y el template sea válido';
      return res.status(500).json({ ok: false, diagnostico });
    }

    // Stage 5: Ensure Directory
    diagnostico.stage = 'ensureDir';
    try {
      await fs.mkdir(publicPath, { recursive: true });
      if (isVerbose) console.log(`[PDF-GEN] Directorio asegurado: ${publicPath}`);
    } catch (error) {
      diagnostico.message = 'Error creando directorio';
      diagnostico.probableCause = ['permisos de carpeta', 'espacio insuficiente'];
      diagnostico.suggestedFix = `Verificar permisos de escritura en: ${publicPath}`;
      return res.status(500).json({ ok: false, diagnostico });
    }

    // Stage 6: Launch Browser
    diagnostico.stage = 'launchBrowser';
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      if (isVerbose) console.log(`[PDF-GEN] Browser lanzado correctamente`);
    } catch (error) {
      diagnostico.message = 'Error lanzando browser';
      diagnostico.probableCause = ['puppeteer sin flags', 'dependencias faltantes'];
      diagnostico.suggestedFix = 'Verificar instalación de Puppeteer y dependencias del sistema';
      return res.status(500).json({ ok: false, diagnostico });
    }

    // Stage 7: Render PDF
    diagnostico.stage = 'renderPDF';
    try {
      const page = await browser.newPage();
      const template = handlebars.compile(templateContent);
      let htmlContent = template(datosTemplate);
      htmlContent = htmlContent.replace(
        '<link rel="stylesheet" href="presupuesto_v1.css">',
        `<style>${cssContent}</style>`
      );

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        }
      });

      if (isVerbose) console.log(`[PDF-GEN] PDF generado: ${filePath}`);
    } catch (error) {
      diagnostico.message = 'Error generando PDF';
      diagnostico.probableCause = ['datos obligatorios vacíos', 'template malformado'];
      diagnostico.suggestedFix = 'Verificar datos del presupuesto y template HTML';
      return res.status(500).json({ ok: false, diagnostico });
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    // Stage 8: Build Public URL
    diagnostico.stage = 'buildPublicUrl';
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      diagnostico.message = 'BASE_URL no configurada';
      diagnostico.probableCause = ['BASE_URL faltante'];
      diagnostico.suggestedFix = 'Configurar variable de entorno BASE_URL';
      return res.status(500).json({ ok: false, diagnostico });
    }

    // Stage 9: Static Serve Check
    diagnostico.stage = 'staticServe';
    const publicUrl = `${baseUrl}/public/pdfs/${filename}`;
    
    if (isVerbose) {
      console.log(`[PDF-GEN] PDF generado exitosamente`);
      console.log(`[PDF-GEN] Archivo: ${filePath}`);
      console.log(`[PDF-GEN] URL pública: ${publicUrl}`);
    }

    res.status(200).json({
      ok: true,
      filename,
      publicUrl
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    diagnostico.message = 'Error interno del servidor';
    diagnostico.probableCause = ['error inesperado'];
    diagnostico.suggestedFix = 'Revisar logs del servidor para más detalles';
    res.status(500).json({ ok: false, diagnostico });
  }
};

/**
 * Diagnóstico de estado del PDF
 * GET /api/diag/presupuestos/:id/pdf/status
 */
export const diagnosticarEstadoPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const filename = `Presupuesto-${id}.pdf`;
    const publicPath = path.join(__dirname, '../../../public/pdfs');
    const absolutePath = path.join(publicPath, filename);
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    const expectedUrl = `${baseUrl}/public/pdfs/${filename}`;

    let exists = false;
    try {
      await fs.access(absolutePath);
      exists = true;
    } catch {
      exists = false;
    }

    res.status(200).json({
      exists,
      absolutePath,
      expectedUrl,
      staticMount: '/public'
    });

  } catch (error) {
    console.error('Error en diagnóstico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Valida que el presupuesto tenga los datos necesarios
 */
function validarDatosPresupuesto(presupuesto) {
  const missing = [];
  
  if (!presupuesto.id) missing.push('número/ID');
  if (!presupuesto.fecha) missing.push('fecha');
  if (!presupuesto.cliente?.nombre) missing.push('nombre del cliente');
  if (!presupuesto.cliente?.email && !presupuesto.cliente?.telefono) {
    missing.push('contacto del cliente (email o teléfono)');
  }
  if (!presupuesto.items || presupuesto.items.length === 0) {
    missing.push('ítems del presupuesto');
  } else {
    presupuesto.items.forEach((item, index) => {
      if (!item.descripcion) missing.push(`descripción del ítem ${index + 1}`);
      if (!item.cantidad) missing.push(`cantidad del ítem ${index + 1}`);
      if (!item.precioUnitario) missing.push(`precio del ítem ${index + 1}`);
    });
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Procesa los datos del presupuesto para el template
 */
function procesarDatosTemplate(presupuesto) {
  // Formatear moneda argentina
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  // Formatear fecha argentina
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Procesar items
  const itemsProcesados = presupuesto.items?.map(item => ({
    descripcion: item.descripcion,
    cantidad: item.cantidad,
    precio_unitario: formatearMoneda(item.precioUnitario),
    total_item: formatearMoneda(item.cantidad * item.precioUnitario)
  })) || [{
    descripcion: presupuesto.descripcion || 'Servicio',
    cantidad: 1,
    precio_unitario: formatearMoneda(presupuesto.valor || 0),
    total_item: formatearMoneda(presupuesto.valor || 0)
  }];

  // Calcular subtotal
  const subtotal = presupuesto.items?.reduce((sum, item) => 
    sum + (item.cantidad * item.precioUnitario), 0
  ) || presupuesto.valor || 0;

  return {
    numero_presupuesto: `PRES-${presupuesto.id}`,
    fecha_presupuesto: formatearFecha(presupuesto.fecha || new Date()),
    nombre_emisor: 'Cortinas Aymara',
    telefono_emisor: '',
    direccion_emisor: '',
    nombre_cliente: presupuesto.cliente?.nombre || 'Cliente',
    cuil_cuit_cliente: '',
    direccion_cliente: presupuesto.cliente?.direccion || '',
    telefono_cliente: presupuesto.cliente?.telefono || '',
    items: itemsProcesados,
    subtotal: formatearMoneda(subtotal),
    total_final: formatearMoneda(presupuesto.valor || subtotal),
    comentarios_adicionales: '',
    comentarios: presupuesto.descripcion || '',
    forma_pago: 'A convenir'
  };
}
