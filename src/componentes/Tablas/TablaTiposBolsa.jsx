import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";

import "../../index.css";
import "../../styles/main.css";

export default function TablaTipoBolsa() {
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [tiposBolsa, setTiposBolsa] = useState([]);
  const [tiposBolsaFiltrados, setTiposBolsaFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, nombre: null });

  const primaryColor = "#016add";

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
      console.error("Error al cargar tipos de productos:", e);
      if (e.response && e.response.status === 403) {
        mostrarError("No tienes permisos para ver los tipos de productos.");
      } else {
        mostrarError("No se pudieron cargar los tipos de productos.");
      }
    }
  };

  const handleEliminarClick = (id, nombre) => {
    setModalEliminar({ visible: true, id, nombre });
  };

  const confirmarEliminar = async () => {
    const { id } = modalEliminar;
    if (!id) return;
    
    try {
      await apiClient.delete(`/tipos-bolsa/${id}`);
      mostrarExito("Tipo de bolsa eliminado exitosamente.");
      setTiposBolsa((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      mostrarError("Error al eliminar el tipo de bolsa.");
    }
    setModalEliminar({ visible: false, id: null, nombre: null });
  };

  const irAOtroComponente = () => {
    navigate("/productos/tiposbolsa/nuevo");
  };

  return (
    <>
      {/* Botón Volver ORIGINAL */}
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed", top: "9vh", left: "3vw", width: "70px", height: "40px",
          padding: "10px", backgroundColor: "white", color: "#016add",
          border: "1px solid #016add", borderRadius: "7px", zIndex: 1000
        }}
        onClick={() => navigate("/productos")}
      >
        ←
      </button>

      {/* Contenedor con FONDO */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              
              <div className="tabla-card border-0 shadow-lg rounded-4 overflow-hidden">
                
                {/* Cabecera */}
                <div className="card-header bg-white py-4 px-4 px-md-5 border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="fw-bold text-dark mb-1">Tipos de producto</h3>
                      <p className="text-muted mb-0">Gestión de categorías de tipos productos</p>
                    </div>
                    <button 
                      className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
                      style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                      onClick={irAOtroComponente}
                    >
                      <i className="fa fa-plus me-2"></i> Nuevo tipo de producto
                    </button>
                  </div>
                  
                  {/* Buscador */}
                  <div className="position-relative">
                    <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 bg-light border-0"
                      placeholder="Buscar por nombre..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      style={{ fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                {/* Tabla */}
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 ps-5 text-muted small fw-bold text-uppercase w-75">Nombre</th>
                          <th className="py-3 pe-5 text-end text-muted small fw-bold text-uppercase w-25">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tiposBolsaFiltrados.length > 0 ? (
                          tiposBolsaFiltrados.map((t, index) => (
                            <tr key={index}>
                              <td className="ps-4 fw-bold text-dark">{t.nombre}</td>
                              <td className="pe-5 text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger fw-bold"
                                  onClick={() => handleEliminarClick(t.id, t.nombre)}
                                  style={{ border: "1px solid #dc3545", color: "#dc3545" }}
                                >
                                  <i className="fa fa-trash-alt me-2"></i> Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center py-5 text-muted">
                              No hay tipos de productos registrados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="card-footer bg-white border-top-0 py-3 text-center">
                  <small className="text-muted">Total: {tiposBolsaFiltrados.length} tipos de productos</small>
                </div>

              </div>
            </div>
          </div>
        </div>

        <Notificacion tipo={notificacion.tipo} mensaje={notificacion.mensaje} visible={notificacion.visible} onClose={ocultarNotificacion} />
        
        <ModalConfirmacion
          isVisible={modalEliminar.visible}
          onClose={() => setModalEliminar({ visible: false, id: null, nombre: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar Tipo de Bolsa"
          mensaje={`¿Estás seguro que deseas eliminar "${modalEliminar.nombre}"?`}
          tipo="danger"
        />
      </div>
    </>
  );
}