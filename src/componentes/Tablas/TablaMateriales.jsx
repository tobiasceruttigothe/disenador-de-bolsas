import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";
import "../../styles/main.css"

export default function TablaMateriales() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [materiales, setMateriales] = useState([]);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, nombre: null });

  useEffect(() => {
    fetchMateriales();
  }, []);

  useEffect(() => {
    // Filtra en tiempo real al cambiar el filtro o la lista de materiales
    setMaterialesFiltrados(
      materiales.filter((m) =>
        m?.nombre.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, materiales]);

  const fetchMateriales = async () => {
    try {
      const res = await apiClient.get("/materiales");
      setMateriales(res.data.data || []);
    } catch (e) {
      console.error("Error al cargar materiales:", e);
      mostrarError("No se pudieron cargar los materiales. Intente nuevamente más tarde.");
    }
  };

  const handleEliminarClick = (id, nombre) => {
    setModalEliminar({ visible: true, id, nombre });
  };

  const confirmarEliminar = async () => {
    const { id, nombre } = modalEliminar;
    if (!id) {
      mostrarError("Error: No se pudo identificar el material a eliminar.");
      setModalEliminar({ visible: false, id: null, nombre: null });
      return;
    }
    
    try {
      await apiClient.delete(`/materiales/${id}`);
      mostrarExito("Material eliminado exitosamente.");
      setMateriales((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar material:", error);
      if (error.response && error.response.status === 403) {
        mostrarError("No tienes permisos para eliminar materiales. Verifica que tu usuario tenga el rol de administrador.");
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (error.response && error.response.status === 404) {
        mostrarError("El material no fue encontrado. Puede que ya haya sido eliminado.");
      } else {
        mostrarError("Error al eliminar el material. Intente nuevamente más tarde.");
      }
    }
    setModalEliminar({ visible: false, id: null, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/productos/materiales/nuevo");
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
        onClick={() => navigate("/productos")}
      >
        ←
      </button>

      <div style={{marginTop:"85px"}} className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <h2>Consultar materiales</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre del material..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo material
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
                  {materialesFiltrados.length > 0 ? (
                    materialesFiltrados.map((m, index) => (
                      <tr key={index}>
                        <td>{m.nombre}</td>
                        <td style={{ width: "100px", textAlign: "center" }}>
                          <button
                            className="boton-2"
                            onClick={() => handleEliminarClick(m.id, m.nombre)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No hay materiales para mostrar
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
          titulo="Eliminar material"
          mensaje={`¿Estás seguro que deseas eliminar el material "${modalEliminar.nombre}"? Esta acción no se puede deshacer.`}
          tipo="danger"
        />
      </div>
    </>
  );
}
