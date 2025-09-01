import PDFService from './pdf.service.js';

class PDFController {
  /**
   * Genera un PDF de presupuesto
   * POST /api/pdf/presupuesto
   */
  async generarPresupuestoPDF(req, res) {
    try {
      const datosPresupuesto = req.body;

      // Validar que se enviaron datos
      if (!datosPresupuesto || Object.keys(datosPresupuesto).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se enviaron datos del presupuesto'
        });
      }

      // Generar el PDF
      const resultado = await PDFService.generarPresupuestoPDF(datosPresupuesto);

      res.status(200).json(resultado);

    } catch (error) {
      console.error('Error en generarPresupuestoPDF:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  /**
   * Lista todos los PDFs generados
   * GET /api/pdf/listar
   */
  async listarPDFs(req, res) {
    try {
      const pdfs = await PDFService.listarPDFs();

      res.status(200).json({
        success: true,
        pdfs,
        total: pdfs.length
      });

    } catch (error) {
      console.error('Error en listarPDFs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar PDFs'
      });
    }
  }

  /**
   * Elimina un PDF específico
   * DELETE /api/pdf/:nombreArchivo
   */
  async eliminarPDF(req, res) {
    try {
      const { nombreArchivo } = req.params;

      if (!nombreArchivo) {
        return res.status(400).json({
          success: false,
          message: 'Nombre de archivo requerido'
        });
      }

      const eliminado = await PDFService.eliminarPDF(nombreArchivo);

      if (eliminado) {
        res.status(200).json({
          success: true,
          message: 'PDF eliminado exitosamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'PDF no encontrado'
        });
      }

    } catch (error) {
      console.error('Error en eliminarPDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar PDF'
      });
    }
  }

  /**
   * Genera un PDF de presupuesto desde un ID de presupuesto existente
   * POST /api/pdf/presupuesto/:id
   */
  async generarPDFDesdePresupuesto(req, res) {
    try {
      const { id } = req.params;
      const { obtenerPresupuestoPorId } = await import('../presupuestos/presupuestos.service.js');

      // Obtener el presupuesto de la base de datos
      const presupuesto = await obtenerPresupuestoPorId(parseInt(id));

      if (!presupuesto) {
        return res.status(404).json({
          success: false,
          message: 'Presupuesto no encontrado'
        });
      }

      // Transformar los datos del presupuesto al formato esperado por el template
      const datosTemplate = {
        numero_presupuesto: `PRES-${presupuesto.id}`,
        fecha_presupuesto: presupuesto.fecha || new Date(),
        nombre_emisor: 'Cortinas Aymara',
        telefono_emisor: '',
        direccion_emisor: '',
        nombre_cliente: presupuesto.clienteNombre || 'Cliente',
        cuil_cuit_cliente: '',
        direccion_cliente: '',
        telefono_cliente: presupuesto.clienteTelefono || '',
        items: presupuesto.items?.map(item => ({
          descripcion: item.descripcion,
          cantidad: item.cantidad || 1,
          precio_unitario: item.precio_unitario || 0
        })) || [{
          descripcion: presupuesto.descripcion || 'Servicio',
          cantidad: 1,
          precio_unitario: presupuesto.valor || 0
        }],
        total_final: presupuesto.valor || 0,
        comentarios_adicionales: '',
        comentarios: presupuesto.descripcion || '',
        forma_pago: 'A convenir'
      };

      // Generar el PDF
      const resultado = await PDFService.generarPresupuestoPDF(datosTemplate);

      res.status(200).json(resultado);

    } catch (error) {
      console.error('Error en generarPDFDesdePresupuesto:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}

export default new PDFController();
