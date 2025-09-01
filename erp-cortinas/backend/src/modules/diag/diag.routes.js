import express from "express";
import { diagnosticarEstadoPDF } from "../presupuestos/presupuestos.controller.js";

const router = express.Router();

// Ruta de diagnóstico para estado del PDF
router.get("/presupuestos/:id/pdf/status", diagnosticarEstadoPDF);

export default router;
