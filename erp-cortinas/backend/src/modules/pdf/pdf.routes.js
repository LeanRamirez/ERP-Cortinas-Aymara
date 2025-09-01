import express from 'express';
import PDFController from './pdf.controller.js';

const router = express.Router();

// Generar PDF de presupuesto con datos personalizados
router.post('/presupuesto', PDFController.generarPresupuestoPDF);

// Generar PDF desde un presupuesto existente en la base de datos
router.post('/presupuesto/:id', PDFController.generarPDFDesdePresupuesto);

// Listar todos los PDFs generados
router.get('/listar', PDFController.listarPDFs);

// Eliminar un PDF específico
router.delete('/:nombreArchivo', PDFController.eliminarPDF);

export default router;
