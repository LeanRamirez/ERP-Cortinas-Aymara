import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/global.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}
