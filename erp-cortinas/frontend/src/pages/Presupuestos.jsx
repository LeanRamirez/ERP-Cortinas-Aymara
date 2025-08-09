import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/Presupuestos.module.css";
import axios from "axios";

export default function Presupuestos() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [todosLosPresupuestos, setTodosLosPresupuestos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [presupuestoEditando, setPresupuestoEditando] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [formData, setFormData] = useState({
    descripcion: "",
    valor: "",
    estado: "pendiente"
  });
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState(clienteId ? 'cliente' : 'todos');

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

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida";
    }

    if (!formData.valor || isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      nuevosErrores.valor = "El valor debe ser un número mayor a 0";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      const dataToSend = {
        descripcion: formData.descripcion,
        valor: parseFloat(formData.valor),
        estado: formData.estado,
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
      
      resetFormulario();
      
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

  const handleEditar = (presupuesto) => {
    setPresupuestoEditando(presupuesto);
    setFormData({
      descripcion: presupuesto.descripcion || "",
      valor: presupuesto.valor || "",
      estado: presupuesto.estado || "pendiente"
    });
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

  const resetFormulario = () => {
    setFormData({
      descripcion: "",
      valor: "",
      estado: "pendiente"
    });
    setPresupuestoEditando(null);
    setMostrarFormulario(false);
    setErrores({});
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearValor = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
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

      {mostrarFormulario && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{presupuestoEditando ? "Editar Presupuesto" : "Nuevo Presupuesto"}</h3>
              <button 
                className={styles.btnCerrar}
                onClick={resetFormulario}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formulario}>
              <div className={styles.campo}>
                <label>Descripción del Trabajo *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="4"
                  className={errores.descripcion ? styles.error : ""}
                  placeholder="Describe el trabajo a realizar..."
                  required
                />
                {errores.descripcion && <span className={styles.mensajeError}>{errores.descripcion}</span>}
              </div>

              <div className={styles.camposGrupo}>
                <div className={styles.campo}>
                  <label>Valor del Presupuesto ($) *</label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={errores.valor ? styles.error : ""}
                    placeholder="0.00"
                    required
                  />
                  {errores.valor && <span className={styles.mensajeError}>{errores.valor}</span>}
                </div>
                <div className={styles.campo}>
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              <div className={styles.botonesFormulario}>
                <button 
                  type="button" 
                  onClick={resetFormulario}
                  className={styles.btnCancelar}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnGuardar}>
                  {presupuestoEditando ? "Actualizar" : "Crear"} Presupuesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <p className={styles.valor}>
                    <strong>Valor:</strong> {formatearValor(presupuesto.valor)}
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
          ))
        )}
      </div>
    </div>
  );
}
