import { useState, useEffect } from 'react';

const useVentasFromPresupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const cargarPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/presupuestos');
      if (!response.ok) {
        throw new Error('Error al cargar los presupuestos');
      }
      const data = await response.json();
      setPresupuestos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando presupuestos:', err);
    } finally {
      setLoading(false);
    }
  };

  const aprobarPresupuesto = async (presupuestoId) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Aprobando presupuesto:', presupuestoId);
      
      // Usar el nuevo endpoint que maneja todo automáticamente
      const response = await fetch('http://localhost:4000/api/ventas/desde-presupuesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ presupuestoId }),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || 'Error al crear la venta desde presupuesto');
      }

      const ventaCreada = await response.json();
      console.log('Venta creada exitosamente:', ventaCreada);

      // Actualizar la lista local de presupuestos
      setPresupuestos(presupuestos.map(p => 
        p.id === presupuestoId 
          ? { ...p, estado: 'aprobado' }
          : p
      ));

      return ventaCreada;
    } catch (err) {
      console.error('Error aprobando presupuesto:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    presupuestos,
    loading,
    error,
    aprobarPresupuesto,
    recargar: cargarPresupuestos,
    clearError
  };
};

export default useVentasFromPresupuestos;
