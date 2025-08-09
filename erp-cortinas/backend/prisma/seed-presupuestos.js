import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const db = await open({
    filename: path.join(__dirname, 'dev.db'),
    driver: sqlite3.Database
  });

  console.log('🌱 Creando presupuestos de ejemplo...');

  // Obtener algunos clientes existentes
  const clientes = await db.all('SELECT id, nombre FROM Cliente LIMIT 3');
  
  if (clientes.length === 0) {
    console.log('❌ No hay clientes en la base de datos. Primero crea algunos clientes.');
    return;
  }

  // Crear presupuestos de ejemplo
  const presupuestosEjemplo = [
    {
      descripcion: 'Instalación de cortinas blackout para dormitorio principal. Incluye medición, confección e instalación de cortinas con sistema de rieles.',
      valor: 450.00,
      estado: 'pendiente',
      clienteId: clientes[0].id
    },
    {
      descripcion: 'Cortinas enrollables para oficina. 3 ventanas grandes con sistema motorizado y control remoto.',
      valor: 1200.00,
      estado: 'aprobado',
      clienteId: clientes[0].id
    },
    {
      descripcion: 'Cortinas de tela para sala de estar. Diseño personalizado con cenefas decorativas.',
      valor: 680.00,
      estado: 'en_revision',
      clienteId: clientes.length > 1 ? clientes[1].id : clientes[0].id
    },
    {
      descripcion: 'Persianas venecianas de aluminio para cocina y baño. Resistentes a la humedad.',
      valor: 320.00,
      estado: 'pendiente',
      clienteId: clientes.length > 1 ? clientes[1].id : clientes[0].id
    },
    {
      descripcion: 'Cortinas panel japonés para separar ambientes. Incluye sistema de rieles y paneles deslizantes.',
      valor: 890.00,
      estado: 'rechazado',
      clienteId: clientes.length > 2 ? clientes[2].id : clientes[0].id
    }
  ];

  for (const presupuesto of presupuestosEjemplo) {
    await db.run(
      `INSERT INTO Presupuesto (descripcion, valor, estado, clienteId, fecha, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
      [presupuesto.descripcion, presupuesto.valor, presupuesto.estado, presupuesto.clienteId]
    );
    
    console.log(`✅ Presupuesto creado para ${clientes.find(c => c.id === presupuesto.clienteId)?.nombre}: ${presupuesto.descripcion.substring(0, 50)}...`);
  }

  console.log('🎉 ¡Presupuestos de ejemplo creados exitosamente!');
  
  // Mostrar resumen
  const totalPresupuestos = await db.get('SELECT COUNT(*) as count FROM Presupuesto');
  console.log(`📊 Total de presupuestos en la base de datos: ${totalPresupuestos.count}`);

  await db.close();
}

main()
  .catch((e) => {
    console.error('❌ Error al crear presupuestos de ejemplo:', e);
    process.exit(1);
  });
