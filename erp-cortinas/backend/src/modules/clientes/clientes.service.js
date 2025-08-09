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

export const obtenerClientes = async () => {
  try {
    const database = await getDb();
    const clientes = await database.all('SELECT * FROM Cliente ORDER BY createdAt DESC');
    return clientes;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

export const obtenerClientePorId = async (id) => {
  try {
    const database = await getDb();
    const cliente = await database.get('SELECT * FROM Cliente WHERE id = ?', [id]);
    return cliente;
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error);
    throw error;
  }
};

export const guardarCliente = async (data) => {
  try {
    const database = await getDb();
    const { nombre, email, telefono, calle, numero, ciudad, provincia, codigoPostal } = data;
    
    const result = await database.run(
      `INSERT INTO Cliente (nombre, email, telefono, calle, numero, ciudad, provincia, codigoPostal, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [nombre, email, telefono, calle, numero, ciudad, provincia, codigoPostal]
    );
    
    // Obtener el cliente recién creado
    const nuevoCliente = await database.get('SELECT * FROM Cliente WHERE id = ?', [result.lastID]);
    return nuevoCliente;
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    throw error;
  }
};

export const actualizarCliente = async (id, data) => {
  try {
    const database = await getDb();
    const { nombre, email, telefono, calle, numero, ciudad, provincia, codigoPostal } = data;
    
    await database.run(
      `UPDATE Cliente SET nombre = ?, email = ?, telefono = ?, calle = ?, numero = ?, ciudad = ?, provincia = ?, codigoPostal = ? 
       WHERE id = ?`,
      [nombre, email, telefono, calle, numero, ciudad, provincia, codigoPostal, id]
    );
    
    // Obtener el cliente actualizado
    const clienteActualizado = await database.get('SELECT * FROM Cliente WHERE id = ?', [id]);
    return clienteActualizado;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    throw error;
  }
};

export const eliminarCliente = async (id) => {
  try {
    const database = await getDb();
    const cliente = await database.get('SELECT * FROM Cliente WHERE id = ?', [id]);
    
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    await database.run('DELETE FROM Cliente WHERE id = ?', [id]);
    return cliente;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
};
