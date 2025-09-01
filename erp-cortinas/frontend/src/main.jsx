import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Ventas from "./pages/Ventas";
import Presupuestos from "./pages/Presupuestos";
import Configuracion from "./pages/Configuracion";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="presupuestos" element={<Presupuestos />} />
          <Route path="presupuestos/:clienteId" element={<Presupuestos />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
