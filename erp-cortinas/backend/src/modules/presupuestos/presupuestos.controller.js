import { 
  obtenerPresupuestos, 
  obtenerPresupuestoPorId, 
  obtenerPresupuestosPorCliente,
  guardarPresupuesto, 
  actualizarPresupuesto, 
  eliminarPresupuesto 
} from "./presupuestos.service.js";

export const getPresupuestos = async (req, res) => {
  try {
    const presupuestos = await obtenerPresupuestos();
    res.json(presupuestos);
  } catch (err) {
    console.error("Error al obtener presupuestos:", err);
    res.status(500).json({ error: "Error al obtener presupuestos" });
  }
};

export const getPresupuestoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const presupuesto = await obtenerPresupuestoPorId(parseInt(id));
    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    res.json(presupuesto);
  } catch (err) {
    console.error("Error al obtener presupuesto:", err);
    res.status(500).json({ error: "Error al obtener presupuesto" });
  }
};

export const getPresupuestosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const presupuestos = await obtenerPresupuestosPorCliente(parseInt(clienteId));
    res.json(presupuestos);
  } catch (err) {
    console.error("Error al obtener presupuestos por cliente:", err);
    res.status(500).json({ error: "Error al obtener presupuestos por cliente" });
  }
};

export const crearPresupuesto = async (req, res) => {
  try {
    const { descripcion, valor, clienteId, estado } = req.body;
    
    // Validaciones básicas
    if (!descripcion || !valor || !clienteId) {
      return res.status(400).json({ 
        error: "Descripción, valor y cliente son requeridos" 
      });
    }

    if (isNaN(valor) || valor <= 0) {
      return res.status(400).json({ 
        error: "El valor debe ser un número mayor a 0" 
      });
    }

    const presupuesto = await guardarPresupuesto({
      descripcion,
      valor: parseFloat(valor),
      clienteId: parseInt(clienteId),
      estado: estado || 'pendiente'
    });
    
    res.status(201).json(presupuesto);
  } catch (err) {
    console.error("Error al crear presupuesto:", err);
    res.status(500).json({ error: "Error al crear presupuesto" });
  }
};

export const editarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, valor, estado } = req.body;

    // Validaciones básicas
    if (!descripcion || !valor) {
      return res.status(400).json({ 
        error: "Descripción y valor son requeridos" 
      });
    }

    if (isNaN(valor) || valor <= 0) {
      return res.status(400).json({ 
        error: "El valor debe ser un número mayor a 0" 
      });
    }

    const presupuesto = await actualizarPresupuesto(parseInt(id), {
      descripcion,
      valor: parseFloat(valor),
      estado: estado || 'pendiente'
    });
    
    if (!presupuesto) {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    
    res.json(presupuesto);
  } catch (err) {
    console.error("Error al actualizar presupuesto:", err);
    res.status(500).json({ error: "Error al actualizar presupuesto" });
  }
};

export const borrarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarPresupuesto(parseInt(id));
    res.json({ message: "Presupuesto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar presupuesto:", err);
    if (err.message === 'Presupuesto no encontrado') {
      return res.status(404).json({ error: "Presupuesto no encontrado" });
    }
    res.status(500).json({ error: "Error al eliminar presupuesto" });
  }
};
