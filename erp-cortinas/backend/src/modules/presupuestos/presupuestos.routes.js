import express from "express";
import { requireAdminKey } from "../../middleware/auth.js";
import { 
  getPresupuestos, 
  getPresupuestoPorId, 
  getPresupuestosPorCliente,
  crearPresupuesto, 
  editarPresupuesto, 
  borrarPresupuesto,
  servirPDFPresupuesto,
  generarPDFPresupuesto,
  diagnosticarEstadoPDF,
  enviarPresupuestoPorEmail,
  enviarPresupuestoPorWhatsApp
} from "./presupuestos.controller.js";

const router = express.Router();

// Rutas principales
router.get("/", getPresupuestos);
router.get("/:id", getPresupuestoPorId);
router.post("/", crearPresupuesto);
router.put("/:id", editarPresupuesto);
router.delete("/:id", borrarPresupuesto);

// Ruta específica para obtener presupuestos por cliente
router.get("/cliente/:clienteId", getPresupuestosPorCliente);

// Rutas para PDFs
router.get("/:id/pdf", servirPDFPresupuesto);
router.post("/:id/pdf", generarPDFPresupuesto);

// Rutas para envío de presupuestos
router.post("/:id/enviar-email", enviarPresupuestoPorEmail);
router.post("/:id/enviar-whatsapp", requireAdminKey, enviarPresupuestoPorWhatsApp);

export default router;
