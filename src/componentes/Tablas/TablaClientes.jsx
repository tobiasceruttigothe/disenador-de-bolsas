import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";

export default function TablaClientes() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, nombre: null });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    // Filtra en tiempo real al cambiar el filtro o la lista de clientes
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
      mostrarError("No se pudieron cargar los clientes. Intente nuevamente más tarde.");
    }
  };

  const handleEliminarClick = (nombre) => {
    setModalEliminar({ visible: true, nombre });
  };

  const confirmarEliminar = async () => {
    const nombre = modalEliminar.nombre;
    if (!nombre) {
      mostrarError("Error: No se pudo identificar el cliente a eliminar.");
      setModalEliminar({ visible: false, nombre: null });
      return;
    }
    
    try {
      await apiClient.delete(`/usuarios/eliminate/${nombre}`);
      mostrarExito("Cliente eliminado exitosamente.");
      setClientes((prev) => prev.filter((c) => c.username !== nombre));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      if (error.response && error.response.status === 403) {
        mostrarError("No tienes permisos para eliminar clientes. Verifica que tu usuario tenga el rol de administrador.");
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        mostrarError("No se pudo eliminar el cliente. Intente nuevamente más tarde.");
      }
    }
    setModalEliminar({ visible: false, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/clientes/nuevo");
  };

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>
      <div style={{marginTop: "85px"}}className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h2>Consultar clientes</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre de usuario para buscar..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo cliente
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'auto' }}>
                <thead className="table-light">
                  <tr>
                    <th>Nombre de Usuario</th>
                    <th>Mail</th>
                    <th>Razón Social</th>
                    <th style={{ width: "110px", whiteSpace: "nowrap" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((c, index) => (
                      <tr key={index}>
                        <td>{c.username}</td>
                        <td>{c.email}</td>
                        <td>{c.razonSocial}</td>
                        <td style={{ width: "110px", whiteSpace: "nowrap" }}>
                          <button
                            className="btn m-1"
                            style={{
                              backgroundColor: "#016add",
                              color: "#fff",
                              border: "2px solid #016add",
                              fontWeight: "500",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#014bb5";
                              e.currentTarget.style.borderColor = "#014bb5";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#016add";
                              e.currentTarget.style.borderColor = "#016add";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => handleEliminarClick(c.username)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No hay clientes para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          visible={notificacion.visible}
          onClose={ocultarNotificacion}
          duracion={notificacion.duracion}
        />
        
        <ModalConfirmacion
          isVisible={modalEliminar.visible}
          onClose={() => setModalEliminar({ visible: false, nombre: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar cliente"
          mensaje={`¿Estás seguro que deseas eliminar a ${modalEliminar.nombre}? Esta acción no se puede deshacer.`}
          tipo="danger"
        />
      </div>
    </>
  );
}
