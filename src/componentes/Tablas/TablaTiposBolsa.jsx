import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";
import  "../../styles/main.css"

export default function TablaTipoBolsa() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [tiposBolsa, setTiposBolsa] = useState([]);
  const [tiposBolsaFiltrados, setTiposBolsaFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, nombre: null });

  useEffect(() => {
    fetchTiposBolsa();
  }, []);

  useEffect(() => {
    setTiposBolsaFiltrados(
      tiposBolsa.filter((t) =>
        t?.nombre.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, tiposBolsa]);

  const fetchTiposBolsa = async () => {
    try {
      const res = await apiClient.get("/tipos-bolsa");
      setTiposBolsa(res.data.data || []);
    } catch (e) {
      console.error("Error al cargar tipos de bolsa:", e);
      if (e.response && e.response.status === 403) {
        mostrarError("No tienes permisos para ver los tipos de bolsa. Verifica que tu usuario tenga el rol de administrador.");
      } else if (e.response && e.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        mostrarError("No se pudieron cargar los tipos de bolsa. Intente nuevamente más tarde.");
      }
    }
  };

  const handleEliminarClick = (id, nombre) => {
    setModalEliminar({ visible: true, id, nombre });
  };

  const confirmarEliminar = async () => {
    const { id, nombre } = modalEliminar;
    if (!id) {
      mostrarError("Error: No se pudo identificar el tipo de bolsa a eliminar.");
      setModalEliminar({ visible: false, id: null, nombre: null });
      return;
    }
    
    try {
      await apiClient.delete(`/tipos-bolsa/${id}`);
      mostrarExito("Tipo de bolsa eliminado exitosamente.");
      setTiposBolsa((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tipo de bolsa:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      if (error.response && error.response.status === 403) {
        mostrarError("No tienes permisos para eliminar tipos de bolsa. Verifica que tu usuario tenga el rol de administrador.");
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (error.response && error.response.status === 404) {
        mostrarError("El tipo de bolsa no fue encontrado. Puede que ya haya sido eliminado.");
      } else {
        mostrarError("Error al eliminar el tipo de bolsa. Intente nuevamente más tarde.");
      }
    }
    setModalEliminar({ visible: false, id: null, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/productos/tiposbolsa/nuevo");
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
          <div className="col-12 col-md-8 col-lg-6">
            <h2>Consultar tipos de bolsa</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">Ingrese nombre para buscar</label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre del tipo de bolsa..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo tipo de bolsa
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tiposBolsaFiltrados.length > 0 ? (
                    tiposBolsaFiltrados.map((t, index) => (
                      <tr key={index}>
                        <td>{t.nombre}</td>
                        <td style={{ width: "100px", textAlign: "center" }}>
                          <button
                            className="boton-2"
                            onClick={() => handleEliminarClick(t.id, t.nombre)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">No hay tipos de bolsa para mostrar</td>
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
          titulo="Eliminar tipo de bolsa"
          mensaje={`¿Estás seguro que deseas eliminar el tipo de bolsa "${modalEliminar.nombre}"? Esta acción no se puede deshacer.`}
          tipo="danger"
        />
      </div>
    </>
  );
}
