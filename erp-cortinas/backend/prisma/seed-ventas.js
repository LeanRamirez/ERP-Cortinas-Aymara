import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVentas() {
  try {
    console.log('🧹 Limpiando datos de ventas existentes...');
    
    // Eliminar todos los items de ventas primero (por la relación)
    await prisma.ventaItem.deleteMany({});
    
    // Eliminar todas las ventas
    await prisma.venta.deleteMany({});
    
    console.log('✅ Datos de ventas limpiados');
    
    // Obtener algunos clientes existentes
    const clientes = await prisma.cliente.findMany();
    
    if (clientes.length === 0) {
      console.log('⚠️  No hay clientes en la base de datos. Creando algunos clientes de prueba...');
      
      const clientesPrueba = await Promise.all([
        prisma.cliente.create({
          data: {
            nombre: 'Juan Pérez',
            email: 'juan@email.com',
            telefono: '123456789'
          }
        }),
        prisma.cliente.create({
          data: {
            nombre: 'María García',
            email: 'maria@email.com',
            telefono: '987654321'
          }
        })
      ]);
      
      clientes.push(...clientesPrueba);
    }
    
    console.log('📦 Creando ventas de prueba...');
    
    // Crear algunas ventas de prueba
    const ventasPrueba = [
      {
        clienteId: clientes[0].id,
        fecha: new Date('2025-01-01'),
        estado: 'completada',
        total: 15000,
        observaciones: 'Venta de cortina metálica para garage',
        items: [
          {
            descripcion: 'Cortina metálica 3x2.5m',
            cantidad: 1,
            precioUnitario: 12000
          },
          {
            descripcion: 'Instalación',
            cantidad: 1,
            precioUnitario: 3000
          }
        ]
      },
      {
        clienteId: clientes[1] ? clientes[1].id : clientes[0].id,
        fecha: new Date('2025-01-05'),
        estado: 'pendiente',
        total: 8500,
        observaciones: 'Cortina para local comercial',
        items: [
          {
            descripcion: 'Cortina metálica 2x2m',
            cantidad: 1,
            precioUnitario: 7000
          },
          {
            descripcion: 'Mantenimiento',
            cantidad: 1,
            precioUnitario: 1500
          }
        ]
      }
    ];
    
    for (const ventaData of ventasPrueba) {
      const { items, ...venta } = ventaData;
      
      await prisma.venta.create({
        data: {
          ...venta,
          items: {
            create: items
          }
        }
      });
    }
    
    console.log('✅ Ventas de prueba creadas exitosamente');
    
    // Verificar que todo esté correcto
    const ventasCreadas = await prisma.venta.findMany({
      include: {
        cliente: true,
        items: true,
        presupuesto: true
      }
    });
    
    console.log(`📊 Total de ventas en la base de datos: ${ventasCreadas.length}`);
    ventasCreadas.forEach(venta => {
      console.log(`   - Venta #${venta.id}: ${venta.cliente.nombre} - $${venta.total}`);
    });
    
  } catch (error) {
    console.error('❌ Error al crear datos de ventas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedVentas()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
