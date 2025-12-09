import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";

export default function TablaDisenadores() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [disenadores, setDisenadores] = useState([]);
  const [disenadoresFiltrados, setDisenadoresFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, nombre: null });

  useEffect(() => {
    fetchDisenadores();
  }, []);

  useEffect(() => {

    setDisenadoresFiltrados(
      disenadores.filter((d) =>
        d?.username.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, disenadores]);

  const fetchDisenadores = async () => {
    try {
      const res = await apiClient.get("/usuarios/list/users/disenadores");
      setDisenadores(res.data);
    } catch (e) {
      console.error("Error al cargar diseñadores:", e);
      mostrarError("No se pudieron cargar los diseñadores. Intente nuevamente más tarde.");
    }
  };

  const handleEliminarClick = (nombre) => {
    setModalEliminar({ visible: true, nombre });
  };

  const confirmarEliminar = async () => {
    const nombre = modalEliminar.nombre;
    if (!nombre) {
      mostrarError("Error: No se pudo identificar el diseñador a eliminar.");
      setModalEliminar({ visible: false, nombre: null });
      return;
    }

    try {
      await apiClient.delete(`/usuarios/eliminate/${nombre}`);
      mostrarExito("Diseñador eliminado exitosamente.");
      setDisenadores((prev) => prev.filter((d) => d.username !== nombre));
    } catch (error) {
      console.error("Error al eliminar diseñador:", error);
      if (error.response && error.response.status === 403) {
        mostrarError("No tienes permisos para eliminar diseñadores. Verifica que tu usuario tenga el rol de administrador.");
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        mostrarError("No se pudo eliminar el diseñador. Intente nuevamente más tarde.");
      }
    }
    setModalEliminar({ visible: false, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/disenadores/nuevo");
  };

  return (
    <>
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed",
          top: "9vh",
          left: "3vw",
          width: "70px",
          height: "40px",
          padding: "10px",
          backgroundColor: "white",
          color: "#016add",
          border: "1px solid #016add",
          borderRadius: "7px"
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>
      <div style={{ marginTop: "85px" }} className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h2>Consultar diseñadores</h2>
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
              <button className="btn btn-primary me-2" onClick={irAOtroComponente}>
                Nuevo diseñador
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'auto' }}>
                <thead className="table-light">
                  <tr>
                    <th>Nombre de Usuario</th>
                    <th>Mail</th>
                    <th>Nombre y Apellido</th>
                    <th style={{ width: "110px", whiteSpace: "nowrap" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {disenadoresFiltrados.length > 0 ? (
                    disenadoresFiltrados.map((d, index) => (
                      <tr key={index}>
                        <td>{d.username}</td>
                        <td>{d.email}</td>
                        <td>{d.razonSocial}</td>
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
                            onClick={() => handleEliminarClick(d.username)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No hay diseñadores para mostrar
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
          titulo="Eliminar diseñador"
          mensaje={`¿Estás seguro que deseas eliminar a ${modalEliminar.nombre}? Esta acción no se puede deshacer.`}
          tipo="danger"
        />
      </div>
    </>
  );
}
