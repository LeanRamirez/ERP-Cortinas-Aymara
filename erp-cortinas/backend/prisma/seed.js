import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.venta.deleteMany();
  await prisma.cliente.deleteMany();

  const c1 = await prisma.cliente.create({
    data: { nombre: "Taller Metalúrgico Sol", telefono: "11-5555-0001", direccion: "Calle Falsa 123" }
  });

  const c2 = await prisma.cliente.create({
    data: { nombre: "Suministros Gremiales SRL", telefono: "11-5555-0002", direccion: "Av. Siempre Viva 742" }
  });

  await prisma.venta.create({
    data: { total: 25000, clienteId: c1.id }
  });

  await prisma.venta.create({
    data: { total: 4800, clienteId: c2.id }
  });

  console.log("Seed ejecutado");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
