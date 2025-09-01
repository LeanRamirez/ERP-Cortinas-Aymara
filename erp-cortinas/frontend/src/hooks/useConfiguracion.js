import { useState, useEffect } from 'react';
import { getAdminHeaders, createAuthHeaders } from '../utils/auth';

const useConfiguracion = () => {
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar configuración inicial
  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4000/api/config/envios', {
        headers: getAdminHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al cargar la configuración');
      }

      const data = await response.json();
      setConfiguracion(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando configuración:', err);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (datosActualizados) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/config/envios', {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la configuración');
      }

      const data = await response.json();
      setConfiguracion(data.data);
      return { success: true, message: 'Configuración guardada exitosamente' };
    } catch (err) {
      setError(err.message);
      console.error('Error guardando configuración:', err);
      return { success: false, message: err.message };
    } finally {
      setSaving(false);
    }
  };

  const probarEmail = async (datosEmail) => {
    try {
      const response = await fetch('http://localhost:4000/api/config/envios/test-email', {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(datosEmail)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al probar el email');
      }

      return { success: true, message: 'Email de prueba enviado correctamente', data: data.data };
    } catch (err) {
      console.error('Error probando email:', err);
      return { success: false, message: err.message };
    }
  };

  const probarWhatsApp = async (datosWhatsApp) => {
    try {
      const response = await fetch('http://localhost:4000/api/config/envios/test-whatsapp', {
        method: 'POST',
        headers: createAuthHeaders(), // useBearer = true para WhatsApp
        body: JSON.stringify(datosWhatsApp)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al probar WhatsApp');
      }

      return { success: true, message: 'Mensaje de WhatsApp enviado correctamente', data: data.data };
    } catch (err) {
      console.error('Error probando WhatsApp:', err);
      return { success: false, message: err.message };
    }
  };

  return {
    configuracion,
    loading,
    error,
    saving,
    cargarConfiguracion,
    guardarConfiguracion,
    probarEmail,
    probarWhatsApp
  };
};

export default useConfiguracion;
