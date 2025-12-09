import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";

export default function TablaPlantillas() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [plantillas, setPlantillas] = useState([]);
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, nombre: null });

  useEffect(() => {
    fetchPlantillas();
  }, []);

  useEffect(() => {
    setPlantillasFiltradas(
      plantillas.filter((p) =>
        p?.nombre.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, plantillas]);

  const fetchPlantillas = async () => {
    try {
      const res = await apiClient.get("/plantillas");
      setPlantillas(res.data.data || []);
    } catch (e) {
      console.error("Error al cargar plantillas:", e);
      if (e.response && e.response.status === 403) {
        mostrarError("No tienes permisos para ver las plantillas. Verifica que tu usuario tenga el rol correcto.");
      } else if (e.response && e.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        mostrarError("No se pudieron cargar las plantillas. Intente nuevamente más tarde.");
      }
    }
  };

  const verPlantilla = async (id) => {
    try {
      const res = await apiClient.get(`/plantillas/${id}`);
      const base64 = res.data.data.base64Plantilla;

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al cargar la plantilla:", error);
      mostrarError("No se pudo cargar la imagen de la plantilla.");
    }
  };

  const handleEliminarClick = (id, nombre) => {
    setModalEliminar({ visible: true, id, nombre });
  };

  const confirmarEliminar = async () => {
    const { id, nombre } = modalEliminar;
    if (!id) {
      mostrarError("Error: No se pudo identificar la plantilla a eliminar.");
      setModalEliminar({ visible: false, id: null, nombre: null });
      return;
    }
    
    try {
      await apiClient.delete(`/plantillas/${id}`);
      mostrarExito("Plantilla eliminada exitosamente.");
      setPlantillas((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar plantilla:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      if (error.response && error.response.status === 403) {
        mostrarError("No tienes permisos para eliminar plantillas. Verifica que tu usuario tenga el rol de administrador o diseñador.");
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (error.response && error.response.status === 404) {
        mostrarError("La plantilla no fue encontrada. Puede que ya haya sido eliminada.");
      } else {
        mostrarError("Error al eliminar la plantilla. Intente nuevamente más tarde.");
      }
    }
    setModalEliminar({ visible: false, id: null, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/productos/plantillas/nuevo");
  };

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/productos")}
      >
        ←
      </button>
      <div style={{marginTop:"85px"}} className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div style={{width:"973px"}} className="col-12 col-md-8 col-lg-6">
            <h2>Consultar plantillas</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre de la plantilla..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nueva plantilla
              </button>
            </div>

            {/* TABLA */}
            <div style={{width:"1000px"}} className="table-responsive mb-4">
              <table style={{width:"950px"}} className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Nombre material</th>
                    <th>Nombre Tipo de Bolsa</th>
                    <th>Ancho(cm)</th>
                    <th>Alto(cm)</th>
                    <th>Profundidad(cm)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {plantillasFiltradas.length > 0 ? (
                    plantillasFiltradas.map((p, index) => (
                      <tr key={index}>
                        <td>{p.nombre}</td>
                        <td>{p.materialNombre}</td>
                        <td>{p.tipoBolsaNombre}</td>
                        <td>{p.ancho}</td>
                        <td>{p.alto}</td>
                        <td>{p.profundidad}</td>
                        <td>

                          {/* Botón Eliminar */}
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
                            onClick={() => verPlantilla(p.id)}
                          >
                            Ver Plantilla
                          </button>
                          <button
                            className="btn m-1"
                            style={{
                              border: "2px solid #016add",
                              backgroundColor: "transparent",
                              color: "#016add",
                              fontWeight: "500",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#016add";
                              e.currentTarget.style.color = "#fff";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#016add";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => handleEliminarClick(p.id, p.nombre)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No hay plantillas para mostrar
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
          onClose={() => setModalEliminar({ visible: false, id: null, nombre: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar plantilla"
          mensaje={`¿Estás seguro que deseas eliminar la plantilla "${modalEliminar.nombre}"? Esta acción no se puede deshacer.`}
          tipo="danger"
        />
      </div>
    </>
  );
}
