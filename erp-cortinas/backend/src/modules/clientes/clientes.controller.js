import { obtenerClientes, guardarCliente, actualizarCliente, eliminarCliente } from "./clientes.service.js";

export const getClientes = async (req, res) => {
  try {
    const clientes = await obtenerClientes();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

export const crearCliente = async (req, res) => {
  try {
    const cliente = await guardarCliente(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

export const editarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await actualizarCliente(parseInt(id), req.body);
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

export const borrarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarCliente(parseInt(id));
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};
