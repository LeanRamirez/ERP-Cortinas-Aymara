import express from "express";
import { 
  getVentas, 
  getVentaPorId, 
  crearVenta, 
  editarVenta, 
  borrarVenta,
  crearVentaDesdePresupuesto 
} from "./ventas.controller.js";

const router = express.Router();

router.get("/", getVentas);
router.get("/:id", getVentaPorId);
router.post("/", crearVenta);
router.post("/desde-presupuesto", crearVentaDesdePresupuesto);
router.put("/:id", editarVenta);
router.delete("/:id", borrarVenta);

export default router;
