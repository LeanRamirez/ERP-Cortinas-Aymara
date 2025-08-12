import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/TablaVentas';
import styles from '../styles/Ventas.module.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  // Formulario de nueva venta
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    items: [
      {
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0
      }
    ],
    observaciones: ''
  });

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/ventas');
      if (!response.ok) {
        throw new Error('Error al cargar las ventas');
      }
      const data = await response.json();
      setVentas(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarVenta = async (e) => {
    e.preventDefault();
    
    try {
      // Validar campos básicos
      if (!nuevaVenta.cliente || nuevaVenta.cliente.trim() === '') {
        throw new Error('El nombre del cliente es requerido');
      }

      if (!nuevaVenta.fecha) {
        throw new Error('La fecha es requerida');
      }

      // Validar que hay items válidos
      const itemsValidos = nuevaVenta.items.filter(item => 
        item.descripcion && 
        item.descripcion.trim() !== '' &&
        parseFloat(item.cantidad || 0) > 0 &&
        parseFloat(item.precioUnitario || 0) >= 0
      );

      if (itemsValidos.length === 0) {
        throw new Error('Debe agregar al menos un item válido con descripción, cantidad mayor a 0 y precio válido');
      }

      const ventaData = {
        ...nuevaVenta,
        items: itemsValidos,
        total: calcularTotalVenta(itemsValidos)
      };

      console.log('Enviando datos de venta:', ventaData);

      const response = await fetch('http://localhost:4000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.error || 'Error al guardar la venta');
      }

      const ventaGuardada = await response.json();
      console.log('Venta guardada:', ventaGuardada);
      
      setVentas([...ventas, ventaGuardada]);
      setMostrarFormulario(false);
      resetFormulario();
      setError(null); // Limpiar errores previos
      
      // Mostrar mensaje de éxito
      mostrarNotificacion(`¡Venta guardada exitosamente! Cliente: ${ventaGuardada.cliente.nombre}, Total: ${formatearMoneda(ventaGuardada.total)}`, 'success');
      
    } catch (err) {
      setError(err.message);
      console.error('Error guardando venta:', err);
    }
  };

  const handleEditarVenta = async (ventaId, ventaData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/ventas/${ventaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ventaData,
          total: calcularTotalVenta(ventaData.items)
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la venta');
      }

      const ventaActualizada = await response.json();
      setVentas(ventas.map(v => v.id === ventaId ? ventaActualizada : v));
      setVentaSeleccionada(null);
    } catch (err) {
      setError(err.message);
      console.error('Error actualizando venta:', err);
    }
  };

  // const handleCambiarEstado = async (venta) => {
  //   const estadosDisponibles = ['pendiente', 'completada', 'cancelada'];
  //   const estadoActual = venta.estado;
  //   const siguienteEstado = estadosDisponibles[(estadosDisponibles.indexOf(estadoActual) + 1) % estadosDisponibles.length];
    
  //   const clienteNombre = venta.cliente?.nombre || venta.cliente || 'Cliente';
  //   const mensaje = `¿Cambiar estado de la venta de ${clienteNombre} de "${estadoActual}" a "${siguienteEstado}"?`;
    
  //   if (!window.confirm(mensaje)) {
  //     return;
  //   }

  //   try {
  //     const ventaActualizada = {
  //       ...venta,
  //       estado: siguienteEstado
  //     };

  //     const response = await fetch(`http://localhost:4000/api/ventas/${venta.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(ventaActualizada),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Error al actualizar el estado de la venta');
  //     }

  //     const ventaGuardada = await response.json();
  //     setVentas(ventas.map(v => v.id === venta.id ? ventaGuardada : v));
      
  //     // Mostrar mensaje de confirmación
  //     mostrarNotificacion(`¡Estado actualizado exitosamente! La venta de ${clienteNombre} ahora está "${siguienteEstado}".`, 'success');
      
  //   } catch (err) {
  //     setError(err.message);
  //     console.error('Error cambiando estado de venta:', err);
  //   }
  // };

  const handleEliminarVenta = (venta) => {
    setVentaAEliminar(venta);
  };

  const confirmarEliminarVenta = async () => {
    if (!ventaAEliminar) return;

    try {
      const response = await fetch(`http://localhost:4000/api/ventas/${ventaAEliminar.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la venta');
      }

      setVentas(ventas.filter(v => v.id !== ventaAEliminar.id));
      setVentaAEliminar(null);
      
      // Mostrar notificación de éxito
      const clienteNombre = ventaAEliminar.cliente?.nombre || ventaAEliminar.cliente || 'Cliente';
      mostrarNotificacion(`¡Venta de ${clienteNombre} eliminada exitosamente!`, 'success');
      
    } catch (err) {
      setError(err.message);
      console.error('Error eliminando venta:', err);
      mostrarNotificacion('Error al eliminar la venta', 'error');
    }
  };

  const cancelarEliminarVenta = () => {
    setVentaAEliminar(null);
  };

  const calcularTotalVenta = (items) => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0));
    }, 0);
  };

  const resetFormulario = () => {
    setNuevaVenta({
      cliente: '',
      fecha: new Date().toISOString().split('T')[0],
      items: [
        {
          descripcion: '',
          cantidad: 1,
          precioUnitario: 0
        }
      ],
      observaciones: ''
    });
  };

  // Sistema de notificaciones
  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => {
      setNotificacion(null);
    }, 4000);
  };

  const handleItemsChange = (items) => {
    setNuevaVenta({ ...nuevaVenta, items });
  };

  const handleAddItem = () => {
    const nuevoItem = {
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0
    };
    setNuevaVenta({
      ...nuevaVenta,
      items: [...nuevaVenta.items, nuevoItem]
    });
  };

  const handleRemoveItem = (index) => {
    const nuevosItems = nuevaVenta.items.filter((_, i) => i !== index);
    setNuevaVenta({ ...nuevaVenta, items: nuevosItems });
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(valor);
  };


  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando ventas...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Gestión de Ventas</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className={styles.botonNuevo}
        >
          + Nueva Venta
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)} className={styles.cerrarError}>×</button>
        </div>
      )}

      {/* Lista de ventas */}
      <div className={styles.listaVentas}>
        {ventas.length === 0 ? (
          <div className={styles.sinVentas}>
            <p>No hay ventas registradas</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className={styles.botonCrearPrimera}
            >
              Crear primera venta
            </button>
          </div>
        ) : (
          <div className={styles.tarjetas}>
            {ventas.map((venta) => (
              <div key={venta.id} className={styles.tarjetaVenta}>
                <div className={styles.cabeceraTarjeta}>
                  <div className={styles.infoVenta}>
                    <h3 className={styles.clienteVenta}>{venta.cliente?.nombre || venta.cliente}</h3>
                    <p className={styles.fechaVenta}>{formatearFecha(venta.fecha)}</p>
                  </div>
                  <div className={styles.estadoYAcciones}>
                    <div className={styles.acciones}>
                      <button
                        onClick={() => setVentaSeleccionada(venta)}
                        className={styles.botonVer}
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      {/* <button
                        onClick={() => handleCambiarEstado(venta)}
                        className={styles.botonEditar}
                        title="Cambiar estado"
                      >
                        ✏️
                      </button> */}
                      <button
                        onClick={() => handleEliminarVenta(venta)}
                        className={styles.botonEliminar}
                        title="Eliminar venta"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.resumenVenta}>
                  <p className={styles.totalVenta}>
                    Total: {formatearMoneda(venta.total)}
                  </p>
                  <p className={styles.itemsCount}>
                    {venta.items?.length || 0} item(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para nueva venta */}
      {mostrarFormulario && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Nueva Venta</h2>
              <button
                onClick={() => setMostrarFormulario(false)}
                className={styles.cerrarModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleGuardarVenta} className={styles.formulario}>
              <div className={styles.camposBasicos}>
                <div className={styles.campo}>
                  <label htmlFor="cliente">Cliente:</label>
                  <input
                    type="text"
                    id="cliente"
                    value={nuevaVenta.cliente}
                    onChange={(e) => setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.campo}>
                  <label htmlFor="fecha">Fecha:</label>
                  <input
                    type="date"
                    id="fecha"
                    value={nuevaVenta.fecha}
                    onChange={(e) => setNuevaVenta({ ...nuevaVenta, fecha: e.target.value })}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.seccionItems}>
                <h3>Items de la Venta</h3>
                <TablaVentas
                  items={nuevaVenta.items}
                  onItemChange={handleItemsChange}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                />
              </div>

              <div className={styles.campo}>
                <label htmlFor="observaciones">Observaciones:</label>
                <textarea
                  id="observaciones"
                  value={nuevaVenta.observaciones}
                  onChange={(e) => setNuevaVenta({ ...nuevaVenta, observaciones: e.target.value })}
                  className={styles.textarea}
                  rows="3"
                />
              </div>

              <div className={styles.botonesFormulario}>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className={styles.botonCancelar}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.botonGuardar}
                >
                  Guardar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver detalles de venta */}
      {ventaSeleccionada && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Detalles de Venta</h2>
              <button
                onClick={() => setVentaSeleccionada(null)}
                className={styles.cerrarModal}
              >
                ×
              </button>
            </div>
            <div className={styles.detallesVenta}>
              <div className={styles.infoGeneral}>
                <p><strong>Cliente:</strong> {ventaSeleccionada.cliente?.nombre || ventaSeleccionada.cliente}</p>
                <p><strong>Fecha:</strong> {formatearFecha(ventaSeleccionada.fecha)}</p>
                <p><strong>Total:</strong> {formatearMoneda(ventaSeleccionada.total)}</p>
              </div>
              
              <div className={styles.itemsDetalle}>
                <h3>Items:</h3>
                <TablaVentas
                  items={ventaSeleccionada.items || []}
                  readOnly={true}
                />
              </div>

              {ventaSeleccionada.observaciones && (
                <div className={styles.observaciones}>
                  <h3>Observaciones:</h3>
                  <p>{ventaSeleccionada.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar venta */}
      {ventaAEliminar && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Confirmar Eliminación</h2>
              <button
                onClick={cancelarEliminarVenta}
                className={styles.cerrarModal}
              >
                ×
              </button>
            </div>
            <div className={styles.confirmacionEliminar}>
              <div className={styles.iconoAdvertencia}>
                ⚠️
              </div>
              <div className={styles.mensajeConfirmacion}>
                <h3>¿Está seguro de que desea eliminar esta venta?</h3>
                <div className={styles.detallesVentaEliminar}>
                  <p><strong>Cliente:</strong> {ventaAEliminar.cliente?.nombre || ventaAEliminar.cliente}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(ventaAEliminar.fecha)}</p>
                  <p><strong>Total:</strong> {formatearMoneda(ventaAEliminar.total)}</p>
                  <p><strong>Items:</strong> {ventaAEliminar.items?.length || 0} item(s)</p>
                </div>
                <p className={styles.advertencia}>
                  Esta acción no se puede deshacer. La venta será eliminada permanentemente del sistema.
                </p>
              </div>
            </div>
            <div className={styles.botonesConfirmacion}>
              <button
                type="button"
                onClick={cancelarEliminarVenta}
                className={styles.botonCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminarVenta}
                className={styles.botonEliminarConfirmar}
              >
                Eliminar Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sistema de notificaciones */}
      {notificacion && (
        <div className={`${styles.notificacion} ${styles[notificacion.tipo]}`}>
          <div className={styles.notificacionContent}>
            <span className={styles.notificacionMensaje}>{notificacion.mensaje}</span>
            <button 
              onClick={() => setNotificacion(null)}
              className={styles.notificacionCerrar}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;
