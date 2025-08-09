import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar la conexión a SQLite
let db = null;

const getDb = async () => {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, '../../../prisma/dev.db'),
      driver: sqlite3.Database
    });
  }
  return db;
};

export const obtenerPresupuestos = async () => {
  try {
    const database = await getDb();
    const presupuestos = await database.all(`
      SELECT 
        p.id,
        p.descripcion,
        p.valor,
        p.fecha,
        p.estado,
        p.clienteId,
        p.createdAt,
        p.updatedAt,
        c.nombre as clienteNombre,
        c.email as clienteEmail,
        c.telefono as clienteTelefono
      FROM Presupuesto p
      INNER JOIN Cliente c ON p.clienteId = c.id
      ORDER BY p.createdAt DESC
    `);
    return presupuestos;
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    throw error;
  }
};

export const obtenerPresupuestoPorId = async (id) => {
  try {
    const database = await getDb();
    const presupuesto = await database.get(`
      SELECT 
        p.id,
        p.descripcion,
        p.valor,
        p.fecha,
        p.estado,
        p.clienteId,
        p.createdAt,
        p.updatedAt,
        c.nombre as clienteNombre,
        c.email as clienteEmail,
        c.telefono as clienteTelefono
      FROM Presupuesto p
      INNER JOIN Cliente c ON p.clienteId = c.id
      WHERE p.id = ?
    `, [id]);
    return presupuesto;
  } catch (error) {
    console.error('Error al obtener presupuesto por ID:', error);
    throw error;
  }
};

export const obtenerPresupuestosPorCliente = async (clienteId) => {
  try {
    const database = await getDb();
    const presupuestos = await database.all(`
      SELECT 
        p.id,
        p.descripcion,
        p.valor,
        p.fecha,
        p.estado,
        p.clienteId,
        p.createdAt,
        p.updatedAt,
        c.nombre as clienteNombre,
        c.email as clienteEmail,
        c.telefono as clienteTelefono
      FROM Presupuesto p
      INNER JOIN Cliente c ON p.clienteId = c.id
      WHERE p.clienteId = ?
      ORDER BY p.createdAt DESC
    `, [clienteId]);
    return presupuestos;
  } catch (error) {
    console.error('Error al obtener presupuestos por cliente:', error);
    throw error;
  }
};

export const guardarPresupuesto = async (data) => {
  try {
    const database = await getDb();
    const { descripcion, valor, clienteId, estado = 'pendiente' } = data;
    
    const result = await database.run(
      `INSERT INTO Presupuesto (descripcion, valor, clienteId, estado, fecha, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
      [descripcion, valor, clienteId, estado]
    );
    
    // Obtener el presupuesto recién creado con información del cliente
    const nuevoPresupuesto = await database.get(`
      SELECT 
        p.id,
        p.descripcion,
        p.valor,
        p.fecha,
        p.estado,
        p.clienteId,
        p.createdAt,
        p.updatedAt,
        c.nombre as clienteNombre,
        c.email as clienteEmail,
        c.telefono as clienteTelefono
      FROM Presupuesto p
      INNER JOIN Cliente c ON p.clienteId = c.id
      WHERE p.id = ?
    `, [result.lastID]);
    
    return nuevoPresupuesto;
  } catch (error) {
    console.error('Error al guardar presupuesto:', error);
    throw error;
  }
};

export const actualizarPresupuesto = async (id, data) => {
  try {
    const database = await getDb();
    const { descripcion, valor, estado } = data;
    
    await database.run(
      `UPDATE Presupuesto SET descripcion = ?, valor = ?, estado = ?, updatedAt = datetime('now')
       WHERE id = ?`,
      [descripcion, valor, estado, id]
    );
    
    // Obtener el presupuesto actualizado con información del cliente
    const presupuestoActualizado = await database.get(`
      SELECT 
        p.id,
        p.descripcion,
        p.valor,
        p.fecha,
        p.estado,
        p.clienteId,
        p.createdAt,
        p.updatedAt,
        c.nombre as clienteNombre,
        c.email as clienteEmail,
        c.telefono as clienteTelefono
      FROM Presupuesto p
      INNER JOIN Cliente c ON p.clienteId = c.id
      WHERE p.id = ?
    `, [id]);
    
    return presupuestoActualizado;
  } catch (error) {
    console.error('Error al actualizar presupuesto:', error);
    throw error;
  }
};

export const eliminarPresupuesto = async (id) => {
  try {
    const database = await getDb();
    const presupuesto = await database.get('SELECT * FROM Presupuesto WHERE id = ?', [id]);
    
    if (!presupuesto) {
      throw new Error('Presupuesto no encontrado');
    }
    
    await database.run('DELETE FROM Presupuesto WHERE id = ?', [id]);
    return presupuesto;
  } catch (error) {
    console.error('Error al eliminar presupuesto:', error);
    throw error;
  }
};
