import { 
  obtenerVentas, 
  obtenerVentaPorId, 
  guardarVenta, 
  actualizarVenta, 
  eliminarVenta 
} from "./ventas.service.js";
import prisma from "../../config/db.js";

export const getVentas = async (req, res) => {
  try {
    const ventas = await obtenerVentas();
    res.json(ventas);
  } catch (err) {
    console.error("Error al obtener ventas:", err);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

export const getVentaPorId = async (req, res) => {
  try {
    const venta = await obtenerVentaPorId(req.params.id);
    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json(venta);
  } catch (err) {
    console.error("Error al obtener venta:", err);
    res.status(500).json({ error: "Error al obtener venta" });
  }
};

export const crearVenta = async (req, res) => {
  try {
    console.log("Datos recibidos para crear venta:", req.body);
    const venta = await guardarVenta(req.body);
    console.log("Venta creada exitosamente:", venta);
    res.status(201).json(venta);
  } catch (err) {
    console.error("Error al crear venta:", err);
    res.status(400).json({ 
      error: err.message || "Error al crear venta",
      details: err.stack
    });
  }
};

export const editarVenta = async (req, res) => {
  try {
    console.log("Actualizando venta ID:", req.params.id, "con datos:", req.body);
    const venta = await actualizarVenta(req.params.id, req.body);
    console.log("Venta actualizada exitosamente:", venta);
    res.json(venta);
  } catch (err) {
    console.error("Error al actualizar venta:", err);
    res.status(400).json({ 
      error: err.message || "Error al actualizar venta",
      details: err.stack
    });
  }
};

export const borrarVenta = async (req, res) => {
  try {
    await eliminarVenta(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Error al eliminar venta:", err);
    res.status(500).json({ error: "Error al eliminar venta" });
  }
};

export const crearVentaDesdePresupuesto = async (req, res) => {
  try {
    const { presupuestoId } = req.body;
    
    // Obtener el presupuesto
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: parseInt(presupuestoId) },
      include: { cliente: true, items: true }
    });

    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }

    // Crear items para la venta basados en el presupuesto
    let ventaItems = [];
    
    if (presupuesto.items && presupuesto.items.length > 0) {
      // Si el presupuesto tiene items, usarlos
      ventaItems = presupuesto.items.map(item => ({
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      }));
    } else {
      // Si no tiene items, crear uno genérico basado en la descripción y valor del presupuesto
      ventaItems = [{
        descripcion: presupuesto.descripcion || 'Servicio/Producto',
        cantidad: 1,
        precioUnitario: presupuesto.valor || 0
      }];
    }

    // Crear la venta basada en el presupuesto
    const ventaData = {
      clienteId: presupuesto.clienteId,
      fecha: new Date(),
      estado: 'completada',
      total: presupuesto.valor || 0,
      observaciones: `Venta generada desde presupuesto #${presupuesto.id}`,
      presupuestoId: presupuesto.id,
      items: ventaItems
    };

    const venta = await guardarVenta(ventaData);

    // Actualizar el estado del presupuesto a aprobado
    await prisma.presupuesto.update({
      where: { id: parseInt(presupuestoId) },
      data: { estado: 'aprobado' }
    });

    res.status(201).json(venta);
  } catch (err) {
    console.error("Error al crear venta desde presupuesto:", err);
    res.status(500).json({ error: "Error al crear venta desde presupuesto: " + err.message });
  }
};
