import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";

// Importa estilos
import "../../index.css";
import "../../styles/main.css";

export default function ConsultaClientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();
  const { notificacion, mostrarError, ocultarNotificacion } = useNotificacion();

  const primaryColor = "#016add";

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (filtro.trim() === "") {
      setClientesFiltrados(clientes);
    } else {
      setClientesFiltrados(
        clientes.filter((c) =>
          c?.username?.toLowerCase().includes(filtro.toLowerCase())
        )
      );
    }
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

  const handleClick = (id) => () => {
    // Redirige a la lista de diseños de este cliente específico
    navigate(`/disenos/cliente/${id}`);
  };

  const plantillas = (nombre, id) => {
    navigate(`/verClientes/plantillas?id=${id}&user=${nombre}`);
  };

  return (
    <>
      {/* --- BOTÓN VOLVER ORIGINAL (FIJO) --- */}
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
          borderRadius: "7px",
          zIndex: 1000
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>

      {/* CONTENEDOR PRINCIPAL CON FONDO DE CÍRCULOS */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">

              {/* TARJETA MODERNA */}
              <div className="tabla-card border-0 shadow-lg rounded-4 overflow-hidden">

                {/* Cabecera y Buscador */}
                <div className="card-header bg-white py-4 px-4 px-md-5 border-bottom-0">
                  <h3 className="fw-bold text-dark mb-1">Consultar Clientes</h3>
                  <p className="text-muted mb-4">Gestiona los diseños y plantillas de tus clientes</p>

                  <div className="position-relative">
                    <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 bg-light border-0"
                      placeholder="Buscar cliente por nombre de usuario..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      style={{ fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                {/* Tabla Estilizada */}
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "800px" }}>
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 ps-4 ps-md-5 text-muted small fw-bold text-uppercase" style={{ width: "25%" }}>Usuario</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase" style={{ width: "25%" }}>Email</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase" style={{ width: "20%" }}>Razón Social</th>
                          <th className="py-3 pe-4 pe-md-5 text-end text-muted small fw-bold text-uppercase" style={{ width: "30%" }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientesFiltrados.length > 0 ? (
                          clientesFiltrados.map((c, index) => (
                            <tr key={index} style={{ transition: "background-color 0.2s" }}>

                              <td className="py-3 ps-4 ps-md-5">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold me-3"
                                    style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}>
                                    {c.username.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="fw-bold">{c.username}</span>
                                </div>
                              </td>

                              <td className="text-muted">{c.email}</td>

                              <td>
                                {c.razonSocial || "N/A"}
                              </td>

                              {/* Botones de Acción */}
                              <td className="pe-4 pe-md-5 text-end">
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    className="btn btn-sm btn-outline-primary fw-bold"
                                    onClick={handleClick(c.id)}
                                    title="Ver todos los diseños de este cliente"
                                  >
                                    <i className="fa fa-paint-brush me-1"></i> Diseños
                                  </button>

                                  <button
                                    className="btn btn-sm btn-primary fw-bold text-white"
                                    style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                                    onClick={() => plantillas(c.username, c.id)}
                                    title="Administrar Plantillas Habilitadas"
                                  >
                                    <i className="fa fa-layer-group me-1"></i> Plantillas
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-5">
                              <div className="opacity-50 mb-2">
                                <i className="fa fa-users-slash fa-3x text-muted"></i>
                              </div>
                              <p className="text-muted mb-0">No se encontraron clientes</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-footer bg-white border-top-0 py-3 text-center">
                  <small className="text-muted">Mostrando {clientesFiltrados.length} clientes</small>
                </div>

              </div>
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
      </div>
    </>
  );
}