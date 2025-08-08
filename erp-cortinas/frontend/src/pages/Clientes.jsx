import React, { useEffect, useState } from "react";
import styles from "../styles/Clientes.module.css";
import axios from "axios";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    calle: "",
    numero: "",
    ciudad: "",
    provincia: "",
    codigoPostal: ""
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre (requerido)
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }

    // Validar email (formato)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "Formato de email inválido";
    }

    // Validar teléfono (solo números, guiones y espacios)
    if (formData.telefono && !/^[\d\s\-\+\(\)]+$/.test(formData.telefono)) {
      nuevosErrores.telefono = "El teléfono solo puede contener números, espacios, guiones y paréntesis";
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
    
    // Limpiar error del campo cuando el usuario empiece a escribir
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
      if (clienteEditando) {
        await axios.put(`http://localhost:4000/api/clientes/${clienteEditando.id}`, formData);
      } else {
        await axios.post("http://localhost:4000/api/clientes", formData);
      }
      
      resetFormulario();
      fetchClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setFormData({
      nombre: cliente.nombre || "",
      email: cliente.email || "",
      telefono: cliente.telefono || "",
      calle: cliente.calle || "",
      numero: cliente.numero || "",
      ciudad: cliente.ciudad || "",
      provincia: cliente.provincia || "",
      codigoPostal: cliente.codigoPostal || ""
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await axios.delete(`http://localhost:4000/api/clientes/${id}`);
        fetchClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
      }
    }
  };

  const resetFormulario = () => {
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      calle: "",
      numero: "",
      ciudad: "",
      provincia: "",
      codigoPostal: ""
    });
    setClienteEditando(null);
    setMostrarFormulario(false);
    setErrores({});
  };

  const formatearDireccion = (cliente) => {
    const partes = [];
    if (cliente.calle) partes.push(cliente.calle);
    if (cliente.numero) partes.push(cliente.numero);
    if (cliente.ciudad) partes.push(cliente.ciudad);
    if (cliente.provincia) partes.push(cliente.provincia);
    if (cliente.codigoPostal) partes.push(`CP: ${cliente.codigoPostal}`);
    return partes.length > 0 ? partes.join(", ") : "Sin dirección";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestión de Clientes</h2>
        <button 
          className={styles.btnNuevo}
          onClick={() => setMostrarFormulario(true)}
        >
          + Nuevo Cliente
        </button>
      </div>

      {mostrarFormulario && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}</h3>
              <button 
                className={styles.btnCerrar}
                onClick={resetFormulario}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formulario}>
              {/* Datos Personales */}
              <div className={styles.seccion}>
                <h4>Datos Personales</h4>
                <div className={styles.campo}>
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={errores.nombre ? styles.error : ""}
                  />
                  {errores.nombre && <span className={styles.mensajeError}>{errores.nombre}</span>}
                </div>
              </div>

              {/* Datos de Contacto */}
              <div className={styles.seccion}>
                <h4>Datos de Contacto</h4>
                <div className={styles.camposGrupo}>
                  <div className={styles.campo}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errores.email ? styles.error : ""}
                    />
                    {errores.email && <span className={styles.mensajeError}>{errores.email}</span>}
                  </div>
                  <div className={styles.campo}>
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={errores.telefono ? styles.error : ""}
                    />
                    {errores.telefono && <span className={styles.mensajeError}>{errores.telefono}</span>}
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className={styles.seccion}>
                <h4>Dirección</h4>
                <div className={styles.camposGrupo}>
                  <div className={styles.campo}>
                    <label>Calle</label>
                    <input
                      type="text"
                      name="calle"
                      value={formData.calle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.campo}>
                    <label>Número</label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.camposGrupo}>
                  <div className={styles.campo}>
                    <label>Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.campo}>
                    <label>Provincia</label>
                    <input
                      type="text"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.campo}>
                    <label>Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.botonesFormulario}>
                <button type="button" onClick={resetFormulario} className={styles.btnCancelar}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnGuardar}>
                  {clienteEditando ? "Actualizar" : "Crear"} Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.listaClientes}>
        {clientes.length === 0 ? (
          <p className={styles.sinClientes}>No hay clientes registrados</p>
        ) : (
          clientes.map(cliente => (
            <div key={cliente.id} className={styles.tarjetaCliente}>
              <div className={styles.infoCliente}>
                <h3>{cliente.nombre}</h3>
                <div className={styles.detalles}>
                  {cliente.email && (
                    <p><strong>Email:</strong> {cliente.email}</p>
                  )}
                  {cliente.telefono && (
                    <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                  )}
                  <p><strong>Dirección:</strong> {formatearDireccion(cliente)}</p>
                  <p className={styles.fecha}>
                    <strong>Registrado:</strong> {new Date(cliente.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className={styles.acciones}>
                <button 
                  onClick={() => handleEditar(cliente)}
                  className={styles.btnEditar}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleEliminar(cliente.id)}
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
