import prisma from "../../config/db.js";

export const obtenerPresupuestos = async () => {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
      include: {
        cliente: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Formatear los datos para mantener compatibilidad con el frontend
    return presupuestos.map(p => ({
      id: p.id,
      descripcion: p.descripcion,
      valor: p.valor,
      fecha: p.fecha,
      estado: p.estado,
      clienteId: p.clienteId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      clienteNombre: p.cliente.nombre,
      clienteEmail: p.cliente.email,
      clienteTelefono: p.cliente.telefono,
      items: p.items
    }));
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    throw error;
  }
};

export const obtenerPresupuestoPorId = async (id) => {
  try {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: true,
        items: true
      }
    });
    
    if (!presupuesto) {
      return null;
    }
    
    // Formatear los datos para mantener compatibilidad con el frontend
    return {
      id: presupuesto.id,
      descripcion: presupuesto.descripcion,
      valor: presupuesto.valor,
      fecha: presupuesto.fecha,
      estado: presupuesto.estado,
      clienteId: presupuesto.clienteId,
      createdAt: presupuesto.createdAt,
      updatedAt: presupuesto.updatedAt,
      clienteNombre: presupuesto.cliente.nombre,
      clienteEmail: presupuesto.cliente.email,
      clienteTelefono: presupuesto.cliente.telefono,
      items: presupuesto.items
    };
  } catch (error) {
    console.error('Error al obtener presupuesto por ID:', error);
    throw error;
  }
};

export const obtenerPresupuestosPorCliente = async (clienteId) => {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
      where: { clienteId: parseInt(clienteId) },
      include: {
        cliente: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Formatear los datos para mantener compatibilidad con el frontend
    return presupuestos.map(p => ({
      id: p.id,
      descripcion: p.descripcion,
      valor: p.valor,
      fecha: p.fecha,
      estado: p.estado,
      clienteId: p.clienteId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      clienteNombre: p.cliente.nombre,
      clienteEmail: p.cliente.email,
      clienteTelefono: p.cliente.telefono,
      items: p.items
    }));
  } catch (error) {
    console.error('Error al obtener presupuestos por cliente:', error);
    throw error;
  }
};

export const guardarPresupuesto = async (data) => {
  try {
    const { descripcion, valor, clienteId, estado = 'pendiente' } = data;
    
    const presupuesto = await prisma.presupuesto.create({
      data: {
        descripcion,
        valor,
        clienteId: parseInt(clienteId),
        estado
      },
      include: {
        cliente: true,
        items: true
      }
    });
    
    // Formatear los datos para mantener compatibilidad con el frontend
    return {
      id: presupuesto.id,
      descripcion: presupuesto.descripcion,
      valor: presupuesto.valor,
      fecha: presupuesto.fecha,
      estado: presupuesto.estado,
      clienteId: presupuesto.clienteId,
      createdAt: presupuesto.createdAt,
      updatedAt: presupuesto.updatedAt,
      clienteNombre: presupuesto.cliente.nombre,
      clienteEmail: presupuesto.cliente.email,
      clienteTelefono: presupuesto.cliente.telefono,
      items: presupuesto.items
    };
  } catch (error) {
    console.error('Error al guardar presupuesto:', error);
    throw error;
  }
};

export const actualizarPresupuesto = async (id, data) => {
  try {
    const { descripcion, valor, estado } = data;
    
    const presupuesto = await prisma.presupuesto.update({
      where: { id: parseInt(id) },
      data: {
        descripcion,
        valor,
        estado
      },
      include: {
        cliente: true,
        items: true
      }
    });
    
    // Formatear los datos para mantener compatibilidad con el frontend
    return {
      id: presupuesto.id,
      descripcion: presupuesto.descripcion,
      valor: presupuesto.valor,
      fecha: presupuesto.fecha,
      estado: presupuesto.estado,
      clienteId: presupuesto.clienteId,
      createdAt: presupuesto.createdAt,
      updatedAt: presupuesto.updatedAt,
      clienteNombre: presupuesto.cliente.nombre,
      clienteEmail: presupuesto.cliente.email,
      clienteTelefono: presupuesto.cliente.telefono,
      items: presupuesto.items
    };
  } catch (error) {
    console.error('Error al actualizar presupuesto:', error);
    throw error;
  }
};

export const eliminarPresupuesto = async (id) => {
  try {
    const presupuesto = await prisma.presupuesto.delete({
      where: { id: parseInt(id) },
      include: {
        cliente: true,
        items: true
      }
    });
    
    return presupuesto;
  } catch (error) {
    console.error('Error al eliminar presupuesto:', error);
    throw error;
  }
};
