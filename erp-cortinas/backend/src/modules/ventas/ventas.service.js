import prisma from "../../config/db.js";

export const obtenerVentas = async () => {
  return prisma.venta.findMany({ include: { cliente: true }, orderBy: { fecha: "desc" } });
};

export const guardarVenta = async (data) => {
  return prisma.venta.create({ data });
};
