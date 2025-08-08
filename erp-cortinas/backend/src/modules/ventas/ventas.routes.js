import express from "express";
import { getVentas, crearVenta } from "./ventas.controller.js";
const router = express.Router();

router.get("/", getVentas);
router.post("/", crearVenta);

export default router;
