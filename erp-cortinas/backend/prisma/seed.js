import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Eliminar en orden correcto para evitar violaciones de clave foránea
  await prisma.presupuesto.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.cliente.deleteMany();

  const c1 = await prisma.cliente.create({
    data: { 
      nombre: "María González", 
      telefono: "11-5555-0001", 
      email: "maria.gonzalez@email.com",
      calle: "Av. Corrientes",
      numero: "1234",
      ciudad: "Buenos Aires",
      provincia: "CABA",
      codigoPostal: "1043"
    }
  });

  const c2 = await prisma.cliente.create({
    data: { 
      nombre: "Juan Pérez", 
      telefono: "11-5555-0002", 
      email: "juan.perez@email.com",
      calle: "Calle Florida",
      numero: "567",
      ciudad: "Buenos Aires",
      provincia: "CABA",
      codigoPostal: "1005"
    }
  });

  const c3 = await prisma.cliente.create({
    data: { 
      nombre: "Ana Rodríguez", 
      telefono: "11-5555-0003", 
      email: "ana.rodriguez@email.com",
      calle: "Av. Santa Fe",
      numero: "890",
      ciudad: "Buenos Aires",
      provincia: "CABA",
      codigoPostal: "1059"
    }
  });

  await prisma.venta.create({
    data: { total: 25000, clienteId: c1.id }
  });

  await prisma.venta.create({
    data: { total: 4800, clienteId: c2.id }
  });

  // Crear algunos presupuestos de ejemplo
  await prisma.presupuesto.create({
    data: {
      descripcion: "Instalación de cortinas blackout para dormitorio principal",
      valor: 450.00,
      estado: "pendiente",
      clienteId: c1.id
    }
  });

  await prisma.presupuesto.create({
    data: {
      descripcion: "Cortinas enrollables para oficina con sistema motorizado",
      valor: 1200.00,
      estado: "aprobado",
      clienteId: c2.id
    }
  });

  await prisma.presupuesto.create({
    data: {
      descripcion: "Cortinas de tela para sala de estar con cenefas decorativas",
      valor: 680.00,
      estado: "en_revision",
      clienteId: c3.id
    }
  });

  console.log("Seed ejecutado con clientes y presupuestos de ejemplo");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
