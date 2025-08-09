import express from "express";
import { getClientes, getClientePorId, crearCliente, editarCliente, borrarCliente } from "./clientes.controller.js";
const router = express.Router();

router.get("/", getClientes);
router.get("/:id", getClientePorId);
router.post("/", crearCliente);
router.put("/:id", editarCliente);
router.delete("/:id", borrarCliente);

export default router;
