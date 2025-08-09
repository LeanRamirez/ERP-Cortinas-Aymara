import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import clientesRoutes from "./modules/clientes/clientes.routes.js";
import ventasRoutes from "./modules/ventas/ventas.routes.js";
import presupuestosRoutes from "./modules/presupuestos/presupuestos.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/presupuestos", presupuestosRoutes);

app.get("/", (req, res) => res.json({ message: "API funcionando" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
