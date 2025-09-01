import React, { useState } from 'react';
import TarjetaConfiguracion from '../components/TarjetaConfiguracion';
import SeccionExpandable from '../components/SeccionExpandable';
import FormularioWhatsApp from '../components/FormularioWhatsApp';
import FormularioPreferenciasEnvio from '../components/FormularioPreferenciasEnvio';
import useConfiguracion from '../hooks/useConfiguracion';
import styles from '../styles/Configuracion.module.css';

const Configuracion = () => {
  // Estado independiente para cada sección
  const [formularioAbierto, setFormularioAbierto] = useState({
    empresa: false,
    presupuestos: false,
    envios: false,
    generales: false,
    facturacion: false
  });

  // Estado para controlar animaciones de cierre
  const [cerrando, setCerrando] = useState({
    empresa: false,
    presupuestos: false,
    envios: false,
    generales: false,
    facturacion: false
  });

  // Hook para manejar la configuración
  const {
    configuracion,
    loading,
    error,
    saving,
    guardarConfiguracion,
    probarWhatsApp
  } = useConfiguracion();

  // Definir las secciones de configuración
  const seccionesConfiguracion = [
    {
      id: 'empresa',
      titulo: 'Datos de la empresa',
      icono: '🏢',
      descripcion: 'Información básica de la empresa, logo y datos de contacto'
    },
    {
      id: 'presupuestos',
      titulo: 'Preferencias de presupuestos',
      icono: '🧾',
      descripcion: 'Configuración de plantillas, numeración y términos'
    },
    {
      id: 'envios',
      titulo: 'Configuración de envío',
      icono: '📤',
      descripcion: 'Configuración de email SMTP y WhatsApp para envío de documentos'
    },
    {
      id: 'generales',
      titulo: 'Parámetros generales',
      icono: '⚙️',
      descripcion: 'Configuraciones generales del sistema y preferencias'
    },
    {
      id: 'facturacion',
      titulo: 'Parámetros de facturación',
      icono: '💰',
      descripción: 'Configuración de impuestos, monedas y datos fiscales'
    }
  ];

  // Manejar clic en una tarjeta de configuración
  const handleSeccionClick = (seccionId) => {
    if (formularioAbierto[seccionId]) {
      // Si está abierto, iniciar animación de cierre
      setCerrando(prev => ({ ...prev, [seccionId]: true }));
      
      // Después de 300ms, cerrar el formulario
      setTimeout(() => {
        setFormularioAbierto(prev => ({ ...prev, [seccionId]: false }));
        setCerrando(prev => ({ ...prev, [seccionId]: false }));
      }, 300);
    } else {
      // Si está cerrado, abrirlo inmediatamente
      setFormularioAbierto(prev => ({ ...prev, [seccionId]: true }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Configuración del Sistema</h1>
        <p className={styles.subtitulo}>
          Gestiona todas las configuraciones de tu ERP desde un solo lugar
        </p>
      </div>

      <div className={styles.seccionesConfiguracion}>
        {seccionesConfiguracion.map((seccion) => (
          <TarjetaConfiguracion
            key={seccion.id}
            titulo={seccion.titulo}
            icono={seccion.icono}
            descripcion={seccion.descripcion}
            onClick={() => handleSeccionClick(seccion.id)}
            isExpanded={formularioAbierto[seccion.id]}
            isCerrando={cerrando[seccion.id]}
          />
        ))}
      </div>

      {/* Formularios expandidos fuera del grid */}
      {Object.keys(formularioAbierto).some(key => formularioAbierto[key] || cerrando[key]) && (
        <div className={styles.formularioExpandido}>
          {/* Formulario de Configuración de Envíos (WhatsApp) */}
          {(formularioAbierto.envios || cerrando.envios) && (
            <div className={`${styles.formularioContainer} ${cerrando.envios ? styles.cerrando : ''}`}>
              <div className={styles.formularioHeader}>
                <h2 className={styles.formularioTitulo}>📤 Configuración de Envío</h2>
                <button 
                  className={styles.botonCerrar}
                  onClick={() => handleSeccionClick('envios')}
                >
                  ✕
                </button>
              </div>
              <div className={styles.formularioContenido}>
                {loading ? (
                  <div className={styles.loading}>Cargando configuración...</div>
                ) : error ? (
                  <div className={styles.error}>
                    Error al cargar la configuración: {error}
                  </div>
                ) : (
                  <FormularioWhatsApp
                    configuracion={configuracion}
                    onGuardar={guardarConfiguracion}
                    onProbar={probarWhatsApp}
                    saving={saving}
                  />
                )}
              </div>
            </div>
          )}

          {/* Formulario de Preferencias de Presupuestos */}
          {(formularioAbierto.presupuestos || cerrando.presupuestos) && (
            <div className={`${styles.formularioContainer} ${cerrando.presupuestos ? styles.cerrando : ''}`}>
              <div className={styles.formularioHeader}>
                <h2 className={styles.formularioTitulo}>🧾 Preferencias de Presupuestos</h2>
                <button 
                  className={styles.botonCerrar}
                  onClick={() => handleSeccionClick('presupuestos')}
                >
                  ✕
                </button>
              </div>
              <div className={styles.formularioContenido}>
                <FormularioPreferenciasEnvio />
              </div>
            </div>
          )}

          {/* Placeholders para otras secciones */}
          {seccionesConfiguracion.map((seccion) => (
            !['envios', 'presupuestos'].includes(seccion.id) && (formularioAbierto[seccion.id] || cerrando[seccion.id]) && (
              <div key={seccion.id} className={`${styles.formularioContainer} ${cerrando[seccion.id] ? styles.cerrando : ''}`}>
                <div className={styles.formularioHeader}>
                  <h2 className={styles.formularioTitulo}>{seccion.icono} {seccion.titulo}</h2>
                  <button 
                    className={styles.botonCerrar}
                    onClick={() => handleSeccionClick(seccion.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.formularioContenido}>
                  <div className={styles.placeholder}>
                    <p>Configuración de <strong>{seccion.titulo}</strong> próximamente disponible.</p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Configuracion;
