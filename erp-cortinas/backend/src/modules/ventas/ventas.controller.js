import { obtenerVentas, guardarVenta } from "./ventas.service.js";

export const getVentas = async (req, res) => {
  try {
    const ventas = await obtenerVentas();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

export const crearVenta = async (req, res) => {
  try {
    const venta = await guardarVenta(req.body);
    res.status(201).json(venta);
  } catch (err) {
    res.status(500).json({ error: "Error al crear venta" });
  }
};
