import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";
import "../../styles/main.css";

export default function TablaMateriales() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [materiales, setMateriales] = useState([]);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, nombre: null });

  const primaryColor = "#016add";

  useEffect(() => {
    fetchMateriales();
  }, []);

  useEffect(() => {
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
      mostrarError("No se pudieron cargar los materiales.");
    }
  };

  const handleEliminarClick = (id, nombre) => {
    setModalEliminar({ visible: true, id, nombre });
  };

  const confirmarEliminar = async () => {
    const { id } = modalEliminar;
    if (!id) return;
    try {
      await apiClient.delete(`/materiales/${id}`);
      mostrarExito("Material eliminado exitosamente.");
      setMateriales((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar material:", error);
      mostrarError("Error al eliminar el material.");
    }
    setModalEliminar({ visible: false, id: null, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/productos/materiales/nuevo");
  };

  return (
    <>
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/productos")}
      >
        ←
      </button>

      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="tabla-card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-white py-4 px-4 border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="fw-bold text-dark mb-1">Materiales</h3>
                      <p className="text-muted mb-0">Gestión de materiales de productos</p>
                    </div>
                    <button 
                      className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
                      style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                      onClick={irAOtroComponente}
                    >
                      <i className="fa fa-plus me-2"></i> Nuevo material
                    </button>
                  </div>
                  <div className="position-relative">
                    <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 bg-light border-0"
                      placeholder="Buscar material..."
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
                          <th className="py-3 ps-4 text-muted small fw-bold text-uppercase">Nombre</th>
                          <th className="py-3 pe-4 text-end text-muted small fw-bold text-uppercase" style={{ width: "150px" }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialesFiltrados.length > 0 ? (
                          materialesFiltrados.map((m, index) => (
                            <tr key={index}>
                              <td className="ps-4 fw-bold text-dark">{m.nombre}</td>
                              <td className="pe-4 text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger fw-bold"
                                  onClick={() => handleEliminarClick(m.id, m.nombre)}
                                  style={{ border: "1px solid #dc3545", color: "#dc3545" }}
                                >
                                  <i className="fa fa-trash-alt me-1"></i> Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="2" className="text-center py-5 text-muted">No se encontraron materiales.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 py-3 text-center">
                  <small className="text-muted">Total: {materialesFiltrados.length} materiales</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notificacion tipo={notificacion.tipo} mensaje={notificacion.mensaje} visible={notificacion.visible} onClose={ocultarNotificacion} />
        <ModalConfirmacion isVisible={modalEliminar.visible} onClose={() => setModalEliminar({ visible: false, id: null, nombre: null })} onConfirm={confirmarEliminar} titulo="Eliminar Material" mensaje={`¿Estás seguro que deseas eliminar el material "${modalEliminar.nombre}"?`} tipo="danger" />
      </div>
    </>
  );
}