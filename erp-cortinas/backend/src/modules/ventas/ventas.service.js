import prisma from "../../config/db.js";

export const obtenerVentas = async () => {
  return prisma.venta.findMany({ 
    include: { 
      cliente: true,
      items: true,
      presupuesto: true
    }, 
    orderBy: { fecha: "desc" } 
  });
};

export const obtenerVentaPorId = async (id) => {
  return prisma.venta.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: true,
      items: true,
      presupuesto: true
    }
  });
};

export const guardarVenta = async (data) => {
  try {
    console.log('Datos recibidos en guardarVenta:', data);
    
    const { items, clienteId, cliente, ...ventaData } = data;
    
    // Si se proporciona el nombre del cliente en lugar del ID, buscar o crear el cliente
    let finalClienteId = clienteId;
    if (cliente && !clienteId) {
      console.log('Buscando cliente por nombre:', cliente);
      
      const clienteExistente = await prisma.cliente.findFirst({
        where: { nombre: cliente }
      });
      
      if (clienteExistente) {
        finalClienteId = clienteExistente.id;
        console.log('Cliente encontrado:', clienteExistente);
      } else {
        // Crear nuevo cliente
        console.log('Creando nuevo cliente:', cliente);
        const nuevoCliente = await prisma.cliente.create({
          data: { nombre: cliente }
        });
        finalClienteId = nuevoCliente.id;
        console.log('Nuevo cliente creado:', nuevoCliente);
      }
    }

    // Validar que tenemos un clienteId válido
    if (!finalClienteId) {
      throw new Error('Se requiere un cliente válido para crear la venta');
    }

    // Validar que tenemos items
    if (!items || items.length === 0) {
      throw new Error('Se requiere al menos un item para crear la venta');
    }

    // Validar y limpiar items
    const itemsValidos = items.filter(item => {
      const descripcionValida = item.descripcion && item.descripcion.trim() !== '';
      const cantidadValida = parseFloat(item.cantidad || 0) > 0;
      const precioValido = parseFloat(item.precioUnitario || 0) >= 0;
      
      return descripcionValida && cantidadValida && precioValido;
    }).map(item => ({
      descripcion: item.descripcion.trim(),
      cantidad: parseFloat(item.cantidad),
      precioUnitario: parseFloat(item.precioUnitario)
    }));

    console.log('Items válidos procesados:', itemsValidos);

    if (itemsValidos.length === 0) {
      throw new Error('Los items deben tener descripción, cantidad mayor a 0 y precio válido');
    }

    // Calcular el total si no se proporciona
    const totalCalculado = itemsValidos.reduce((total, item) => {
      return total + (item.cantidad * item.precioUnitario);
    }, 0);

    const ventaFinal = {
      ...ventaData,
      clienteId: finalClienteId,
      total: ventaData.total || totalCalculado,
      fecha: ventaData.fecha ? new Date(ventaData.fecha) : new Date(),
      estado: ventaData.estado || 'pendiente'
    };

    console.log('Datos finales para crear venta:', ventaFinal);

    const ventaCreada = await prisma.venta.create({
      data: {
        ...ventaFinal,
        items: {
          create: itemsValidos
        }
      },
      include: {
        cliente: true,
        items: true,
        presupuesto: true
      }
    });

    console.log('Venta creada exitosamente:', ventaCreada);
    return ventaCreada;
    
  } catch (error) {
    console.error('Error en guardarVenta:', error);
    throw error;
  }
};

export const actualizarVenta = async (id, data) => {
  try {
    console.log('Actualizando venta ID:', id, 'con datos:', data);
    
    const { items, clienteId, cliente, ...ventaData } = data;
    
    // Verificar que la venta existe
    const ventaExistente = await prisma.venta.findUnique({
      where: { id: parseInt(id) },
      include: { cliente: true, items: true }
    });

    if (!ventaExistente) {
      throw new Error('Venta no encontrada');
    }

    // Si se proporciona el nombre del cliente en lugar del ID, buscar o crear el cliente
    let finalClienteId = clienteId || ventaExistente.clienteId;
    if (cliente && !clienteId) {
      console.log('Buscando cliente por nombre:', cliente);
      
      const clienteExistente = await prisma.cliente.findFirst({
        where: { nombre: cliente }
      });
      
      if (clienteExistente) {
        finalClienteId = clienteExistente.id;
        console.log('Cliente encontrado:', clienteExistente);
      } else {
        // Crear nuevo cliente
        console.log('Creando nuevo cliente:', cliente);
        const nuevoCliente = await prisma.cliente.create({
          data: { nombre: cliente }
        });
        finalClienteId = nuevoCliente.id;
        console.log('Nuevo cliente creado:', nuevoCliente);
      }
    }

    // Preparar datos de actualización
    const datosActualizacion = {
      ...ventaData,
      clienteId: finalClienteId,
      updatedAt: new Date()
    };

    // Si se proporcionan items, validarlos y actualizarlos
    if (items) {
      const itemsValidos = items.filter(item => {
        const descripcionValida = item.descripcion && item.descripcion.trim() !== '';
        const cantidadValida = parseFloat(item.cantidad || 0) > 0;
        const precioValido = parseFloat(item.precioUnitario || 0) >= 0;
        
        return descripcionValida && cantidadValida && precioValido;
      }).map(item => ({
        descripcion: item.descripcion.trim(),
        cantidad: parseFloat(item.cantidad),
        precioUnitario: parseFloat(item.precioUnitario)
      }));

      console.log('Items válidos para actualización:', itemsValidos);

      // Calcular el total si se actualizan los items
      if (itemsValidos.length > 0) {
        const totalCalculado = itemsValidos.reduce((total, item) => {
          return total + (item.cantidad * item.precioUnitario);
        }, 0);
        datosActualizacion.total = totalCalculado;
      }

      const ventaActualizada = await prisma.venta.update({
        where: { id: parseInt(id) },
        data: {
          ...datosActualizacion,
          items: {
            deleteMany: {},
            create: itemsValidos
          }
        },
        include: {
          cliente: true,
          items: true,
          presupuesto: true
        }
      });

      console.log('Venta actualizada exitosamente:', ventaActualizada);
      return ventaActualizada;
    } else {
      // Solo actualizar datos básicos sin tocar los items
      const ventaActualizada = await prisma.venta.update({
        where: { id: parseInt(id) },
        data: datosActualizacion,
        include: {
          cliente: true,
          items: true,
          presupuesto: true
        }
      });

      console.log('Venta actualizada exitosamente (sin items):', ventaActualizada);
      return ventaActualizada;
    }
    
  } catch (error) {
    console.error('Error en actualizarVenta:', error);
    throw error;
  }
};

export const eliminarVenta = async (id) => {
  return prisma.venta.delete({
    where: { id: parseInt(id) }
  });
};
