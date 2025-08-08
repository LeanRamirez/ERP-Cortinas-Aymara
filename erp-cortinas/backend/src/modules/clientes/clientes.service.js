import prisma from "../../config/db.js";

export const obtenerClientes = async () => {
  return prisma.cliente.findMany({ orderBy: { createdAt: "desc" } });
};

export const guardarCliente = async (data) => {
  return prisma.cliente.create({ data });
};

export const actualizarCliente = async (id, data) => {
  return prisma.cliente.update({
    where: { id },
    data
  });
};

export const eliminarCliente = async (id) => {
  return prisma.cliente.delete({
    where: { id }
  });
};
