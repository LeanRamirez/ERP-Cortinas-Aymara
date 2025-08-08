import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    const res = await axios.get("http://localhost:4000/api/ventas");
    setVentas(res.data);
  };

  return (
    <div>
      <h2>Ventas</h2>
      <ul>
        {ventas.map(v => (
          <li key={v.id}>
            {new Date(v.fecha).toLocaleString()} - Cliente: {v.cliente?.nombre || "N/A"} - ${v.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
