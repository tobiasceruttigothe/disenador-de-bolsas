import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";

import "../../index.css";
import "../../styles/main.css";

export default function TablaClientes() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, nombre: null });

  const primaryColor = "#016add";

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    setClientesFiltrados(
      clientes.filter((c) =>
        c?.username.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, clientes]);

  const fetchClientes = async () => {
    try {
      const res = await apiClient.get("/usuarios/list/users/clients");
      setClientes(res.data);
    } catch (e) {
      console.error("Error al cargar clientes:", e);
      mostrarError("No se pudieron cargar los clientes.");
    }
  };

  const handleEliminarClick = (nombre) => {
    setModalEliminar({ visible: true, nombre });
  };

  const confirmarEliminar = async () => {
    const nombre = modalEliminar.nombre;
    if (!nombre) return;
    
    try {
      await apiClient.delete(`/usuarios/eliminate/${nombre}`);
      mostrarExito("Cliente eliminado exitosamente.");
      setClientes((prev) => prev.filter((c) => c.username !== nombre));
    } catch (error) {
      console.error("Error al eliminar:", error);
      mostrarError("No se pudo eliminar el cliente.");
    }
    setModalEliminar({ visible: false, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/clientes/nuevo");
  };

  // Función para volver al submenú de usuarios en InicioAdmin
  const handleVolver = () => {
    navigate("/inicio", { state: { vistaUsuarios: true } });
  };

  return (
    <>
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed", top: "9vh", left: "3vw", width: "70px", height: "40px",
          padding: "10px", backgroundColor: "white", color: "#016add",
          border: "1px solid #016add", borderRadius: "7px", zIndex: 1000
        }}
        onClick={handleVolver} // Redirige a /inicio con el panel de usuarios abierto
      >
        ←
      </button>

      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-white py-4 px-4 px-md-5 border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h2 className="fw-bold text-dark mb-1">Clientes</h2>
                      <p className="text-muted mb-0">Gestión de usuarios clientes</p>
                    </div>
                    <button 
                      className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
                      style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                      onClick={irAOtroComponente}
                    >
                      <i className="fa fa-user-plus me-2"></i> Nuevo Cliente
                    </button>
                  </div>
                  
                  <div className="position-relative">
                    <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 bg-light border-0"
                      placeholder="Buscar cliente por usuario..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      style={{ fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 ps-5 text-muted small fw-bold text-uppercase">Usuario</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase">Email</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase">Razón Social</th>
                          <th className="py-3 pe-5 text-end text-muted small fw-bold text-uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientesFiltrados.length > 0 ? (
                          clientesFiltrados.map((c, index) => (
                            <tr key={index}>
                              <td className="ps-5 fw-bold text-dark">{c.username}</td>
                              <td className="text-muted">{c.email}</td>
                              <td>{c.razonSocial || "-"}</td>
                              <td className="pe-5 text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger fw-bold"
                                  onClick={() => handleEliminarClick(c.username)}
                                  style={{ border: "1px solid #dc3545", color: "#dc3545" }}
                                >
                                  <i className="fa fa-trash-alt me-1"></i> Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="text-center py-5 text-muted">No se encontraron clientes.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="card-footer bg-white border-top-0 py-3 text-center">
                  <small className="text-muted">Total: {clientesFiltrados.length} clientes</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Notificacion tipo={notificacion.tipo} mensaje={notificacion.mensaje} visible={notificacion.visible} onClose={ocultarNotificacion} />
        <ModalConfirmacion isVisible={modalEliminar.visible} onClose={() => setModalEliminar({ visible: false, nombre: null })} onConfirm={confirmarEliminar} titulo="Eliminar Cliente" mensaje={`¿Estás seguro que deseas eliminar a ${modalEliminar.nombre}?`} tipo="danger" />
      </div>
    </>
  );
}