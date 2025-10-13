import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/Presupuestos.module.css";
import axios from "axios";
import FormularioPresupuesto from "../components/FormularioPresupuesto";
import BotonAprobarPresupuesto from "../components/BotonAprobarPresupuesto";
import ModalPDF from "../components/ModalPDF";
import ModalEnviarEmail from "../components/ModalEnviarEmail";
import ModalEnviarWhatsApp from "../components/ModalEnviarWhatsApp";

export default function Presupuestos() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [todosLosPresupuestos, setTodosLosPresupuestos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [presupuestoEditando, setPresupuestoEditando] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(true);

  // Estados para modales de envío
  const [modalPDFVisible, setModalPDFVisible] = useState(false);
  const [modalEmailVisible, setModalEmailVisible] = useState(false);
  const [modalWhatsAppVisible, setModalWhatsAppVisible] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
      fetchPresupuestosPorCliente();
    } else {
      fetchTodosLosPresupuestos();
    }
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/clientes/${clienteId}`);
      setCliente(res.data);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      mostrarMensaje("Error al cargar información del cliente", "error");
    }
  };

  const fetchPresupuestosPorCliente = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/presupuestos/cliente/${clienteId}`);
      setPresupuestos(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener presupuestos:", error);
      mostrarMensaje("Error al cargar los presupuestos", "error");
      setLoading(false);
    }
  };

  const fetchTodosLosPresupuestos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/presupuestos");
      setTodosLosPresupuestos(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener todos los presupuestos:", error);
      mostrarMensaje("Error al cargar los presupuestos", "error");
      setLoading(false);
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje({ texto: "", tipo: "" });
    }, 4000);
  };

  const handleFormularioSubmit = async (dataToSubmit) => {
    try {
      const dataToSend = {
        descripcion: dataToSubmit.descripcion,
        valor: dataToSubmit.valor,
        cantidad: dataToSubmit.cantidad,
        precioUnitario: dataToSubmit.precioUnitario,
        precioTotal: dataToSubmit.precioTotal,
        estado: dataToSubmit.estado,
        ...(clienteId && { clienteId: parseInt(clienteId) })
      };

      if (presupuestoEditando) {
        await axios.put(`http://localhost:4000/api/presupuestos/${presupuestoEditando.id}`, dataToSend);
        mostrarMensaje("Presupuesto actualizado con éxito", "success");
      } else {
        if (!clienteId) {
          mostrarMensaje("Error: No se puede crear presupuesto sin cliente", "error");
          return;
        }
        await axios.post("http://localhost:4000/api/presupuestos", dataToSend);
        mostrarMensaje("Presupuesto creado con éxito", "success");
      }
      
      handleFormularioCancel();
      
      // Actualizar lista según la vista actual
      if (clienteId) {
        await fetchPresupuestosPorCliente();
      } else {
        await fetchTodosLosPresupuestos();
      }
      
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
      mostrarMensaje("Error al guardar el presupuesto", "error");
    }
  };

  const handleFormularioCancel = () => {
    setPresupuestoEditando(null);
    setMostrarFormulario(false);
  };

  const handleEditar = (presupuesto) => {
    // Convertir el presupuesto existente al formato esperado por el componente
    const presupuestoParaEditar = {
      ...presupuesto,
      cantidad: presupuesto.cantidad || 1,
      precioUnitario: presupuesto.precioUnitario || presupuesto.valor || 0
    };
    
    setPresupuestoEditando(presupuestoParaEditar);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este presupuesto?")) {
      try {
        await axios.delete(`http://localhost:4000/api/presupuestos/${id}`);
        mostrarMensaje("Presupuesto eliminado correctamente", "success");
        
        // Actualizar lista según la vista actual
        if (clienteId) {
          await fetchPresupuestosPorCliente();
        } else {
          await fetchTodosLosPresupuestos();
        }
      } catch (error) {
        console.error("Error al eliminar presupuesto:", error);
        mostrarMensaje("Error al eliminar el presupuesto", "error");
      }
    }
  };

  const handleVentaCreada = (venta) => {
    mostrarMensaje(`¡Venta creada exitosamente! Venta #${venta.id}`, "success");
  };

  const handlePresupuestoActualizado = (presupuestoActualizado) => {
    // Actualizar la lista local
    if (clienteId) {
      setPresupuestos(presupuestos.map(p => 
        p.id === presupuestoActualizado.id ? presupuestoActualizado : p
      ));
    } else {
      setTodosLosPresupuestos(todosLosPresupuestos.map(p => 
        p.id === presupuestoActualizado.id ? presupuestoActualizado : p
      ));
    }
  };

  // Funciones para manejar modales de envío
  const abrirModalPDF = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setModalPDFVisible(true);
  };

  const abrirModalEmail = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setModalEmailVisible(true);
  };

  const abrirModalWhatsApp = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setModalWhatsAppVisible(true);
  };

  const cerrarModales = () => {
    setModalPDFVisible(false);
    setModalEmailVisible(false);
    setModalWhatsAppVisible(false);
    setPresupuestoSeleccionado(null);
  };

  const handleEnvioExitoso = (mensaje) => {
    mostrarMensaje(mensaje, "success");
    cerrarModales();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearValor = (valor) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado': return styles.estadoAprobado;
      case 'rechazado': return styles.estadoRechazado;
      case 'en_revision': return styles.estadoRevision;
      default: return styles.estadoPendiente;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  const presupuestosAMostrar = clienteId ? presupuestos : todosLosPresupuestos;

  return (
    <div className={styles.container}>
      {mensaje.texto && (
        <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
          {mensaje.texto}
        </div>
      )}

      <div className={styles.header}>
        {clienteId ? (
          <>
            <button 
              className={styles.btnVolver}
              onClick={() => navigate('/clientes')}
            >
              ← Volver a Clientes
            </button>
            <div className={styles.clienteInfo}>
              <h2>Presupuestos</h2>
              {cliente && (
                <div className={styles.clienteDetalle}>
                  <h3>{cliente.nombre}</h3>
                  <p>{cliente.email && `📧 ${cliente.email}`}</p>
                  <p>{cliente.telefono && `📞 ${cliente.telefono}`}</p>
                </div>
              )}
            </div>
            <button 
              className={styles.btnNuevo}
              onClick={() => setMostrarFormulario(true)}
            >
              + Nuevo Presupuesto
            </button>
          </>
        ) : (
          <>
            <h2>Todos los Presupuestos</h2>
            <div className={styles.navegacion}>
              <button 
                className={styles.btnNavegar}
                onClick={() => navigate('/clientes')}
              >
                Ir a Clientes
              </button>
            </div>
          </>
        )}
      </div>

      <FormularioPresupuesto
        presupuesto={presupuestoEditando}
        onSubmit={handleFormularioSubmit}
        onCancel={handleFormularioCancel}
        isVisible={mostrarFormulario}
      />

      <div className={styles.listaPresupuestos}>
        {presupuestosAMostrar.length === 0 ? (
          <div className={styles.sinPresupuestos}>
            <p>No hay presupuestos {clienteId ? 'para este cliente' : 'registrados'}</p>
            <p className={styles.subtexto}>
              {clienteId 
                ? 'Crea el primer presupuesto usando el botón "Nuevo Presupuesto"'
                : 'Los presupuestos se crean desde la página de cada cliente'
              }
            </p>
          </div>
        ) : (
          presupuestosAMostrar.map(presupuesto => (
            <div key={presupuesto.id} className={styles.tarjetaPresupuesto}>
              <div className={styles.infoPresupuesto}>
                <div className={styles.encabezadoPresupuesto}>
                  <h3>{presupuesto.descripcion}</h3>
                  <span className={`${styles.estadoBadge} ${getEstadoColor(presupuesto.estado)}`}>
                    {presupuesto.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                {!clienteId && (
                  <div className={styles.clientePresupuesto}>
                    <strong>Cliente:</strong> {presupuesto.clienteNombre}
                    {presupuesto.clienteTelefono && (
                      <span className={styles.telefonoCliente}>
                        📞 {presupuesto.clienteTelefono}
                      </span>
                    )}
                  </div>
                )}
                
                <div className={styles.detalles}>
                  {presupuesto.cantidad && presupuesto.precioUnitario && (
                    <div className={styles.detallePresupuesto}>
                      <p><strong>Cantidad:</strong> {presupuesto.cantidad}</p>
                      <p><strong>Precio Unitario:</strong> {formatearValor(presupuesto.precioUnitario)}</p>
                    </div>
                  )}
                  <p className={styles.valor}>
                    <strong>Valor Total:</strong> {formatearValor(presupuesto.valor)}
                  </p>
                  <p className={styles.fecha}>
                    <strong>Creado:</strong> {formatearFecha(presupuesto.createdAt)}
                  </p>
                  {presupuesto.updatedAt !== presupuesto.createdAt && (
                    <p className={styles.fecha}>
                      <strong>Actualizado:</strong> {formatearFecha(presupuesto.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.acciones}>
                {/* Botones de envío */}
                <div className={styles.accionesEnvio}>
                  <button
                    onClick={() => abrirModalPDF(presupuesto)}
                    className={styles.btnVerPdf}
                    title="Ver PDF"
                  >
                    📄
                  </button>
                  <button
                    onClick={() => abrirModalEmail(presupuesto)}
                    className={styles.btnEnviarEmail}
                    title="Enviar por Email"
                  >
                    📧
                  </button>
                  <button
                    onClick={() => abrirModalWhatsApp(presupuesto)}
                    className={styles.btnEnviarWhatsApp}
                    title="Enviar por WhatsApp"
                  >
                    📱
                  </button>
                </div>

                {/* Botones principales */}
                <div className={styles.accionesPrincipales}>
                  <BotonAprobarPresupuesto
                    presupuesto={{
                      id: presupuesto.id,
                      cliente: presupuesto.clienteNombre || cliente?.nombre,
                      total: presupuesto.valor,
                      estado: presupuesto.estado
                    }}
                    onVentaCreada={handleVentaCreada}
                    onPresupuestoActualizado={handlePresupuestoActualizado}
                  />
                  <button 
                    onClick={() => handleEditar(presupuesto)}
                    className={styles.btnEditar}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(presupuesto.id)}
                    className={styles.btnEliminar}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modales de envío */}
      <ModalPDF 
        presupuesto={presupuestoSeleccionado}
        isVisible={modalPDFVisible}
        onClose={cerrarModales}
      />

      <ModalEnviarEmail
        presupuesto={presupuestoSeleccionado}
        isVisible={modalEmailVisible}
        onClose={cerrarModales}
        onEnvioExitoso={handleEnvioExitoso}
      />

      <ModalEnviarWhatsApp
        presupuesto={presupuestoSeleccionado}
        isVisible={modalWhatsAppVisible}
        onClose={cerrarModales}
        onEnvioExitoso={handleEnvioExitoso}
      />
    </div>
  );
}
