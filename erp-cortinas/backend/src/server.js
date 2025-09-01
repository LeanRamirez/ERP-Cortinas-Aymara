import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

import clientesRoutes from "./modules/clientes/clientes.routes.js";
import ventasRoutes from "./modules/ventas/ventas.routes.js";
import presupuestosRoutes from "./modules/presupuestos/presupuestos.routes.js";
import pdfRoutes from "./modules/pdf/pdf.routes.js";
import configuracionRoutes from "./modules/configuracion/configuracion.routes.js";
import diagRoutes from "./modules/diag/diag.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (PDFs)
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use("/api/clientes", clientesRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/presupuestos", presupuestosRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/config", configuracionRoutes);
app.use("/api/diag", diagRoutes);

app.get("/", (req, res) => res.json({ message: "API funcionando" }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
