import express from "express";
import { 
  getPresupuestos, 
  getPresupuestoPorId, 
  getPresupuestosPorCliente,
  crearPresupuesto, 
  editarPresupuesto, 
  borrarPresupuesto 
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

export default router;
