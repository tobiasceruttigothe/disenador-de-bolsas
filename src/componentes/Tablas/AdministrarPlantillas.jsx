import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

// Configuración y Componentes
import { apiClient } from '../../config/axios';
import Modal from "../Lienzo/ModalConfirmacion.jsx";
import ModalPlantillas from './ModalPlantillas.jsx';

// Estilos
import "../../index.css";

export default function AdministrarPlantillas() {
  const [plantillasUsuario, setPlantillasUsuario] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imagenesBase64, setImagenesBase64] = useState({});
  const [loading, setLoading] = useState(true); // Estado general de carga

  const params = new URLSearchParams(window.location.search);
  const username = params.get('user');
  const id = params.get('id');

  const navigate = useNavigate();
  const handleClick = () => setModalAbierto(true);

  // Función para cargar datos (Memoizada para usar en useEffect)
  const fetchPlantillas = useCallback(async () => {
    if (!id) return;
    setLoading(true); // Mostrar spinner
    try {
      const res = await apiClient.get(`/plantillas/usuario/${id}/habilitadas`);
      const plantillas = res.data.data;
      setPlantillasUsuario(plantillas);

      // Cargar imágenes en paralelo
      const imagenes = {};
      await Promise.all(
        plantillas.map(async p => {
          imagenes[p.id] = await buscarImagenBase64(p.id);
        })
      );

      setImagenesBase64(imagenes);
    } catch (e) {
      console.error("Error al cargar las plantillas del cliente", e);
    } finally {
      setLoading(false); // Ocultar spinner
    }
  }, [id]);

  useEffect(() => {
    fetchPlantillas();
  }, [fetchPlantillas]);

  const buscarImagenBase64 = async (p) => {
    try {
      const res = await apiClient.get(`/plantillas/${p}`);
      return res.data.data.base64Plantilla;
    } catch (e) {
      console.error("Error al cargar la imagen de la plantilla", e);
      return "";
    }
  }

  // Esta función se pasa al Modal para que actualice la lista al cerrar
  const handleModalClose = () => {
    setModalAbierto(false);
    fetchPlantillas(); // Recargar datos sin refrescar toda la página
  };

  const primaryColor = "#016add";

  return (
    <>
      {/* Botón Volver ORIGINAL (Posición Fija) */}
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
        onClick={() => navigate("/verClientes")}
      >
        ←
      </button>

      {/* Contenedor Principal */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              
              {/* Tarjeta Contenedora */}
              <div className="tabla-card border-0 shadow-lg rounded-4 overflow-hidden">
                
                {/* Cabecera */}
                <div className="card-header bg-white py-4 px-5 border-bottom-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h3 className="fw-bold mb-1">Administrar Plantillas</h3>
                    <p className="text-muted mb-0">
                      Cliente: <span className="fw-bold text-primary">{username}</span>
                    </p>
                  </div>
                  
                  <button 
                    className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
                    style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                    onClick={handleClick}
                  >
                    <i className="fa fa-plus-circle me-2"></i> Asignar Plantillas
                  </button>
                </div>

                {/* Cuerpo (Tabla) */}
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 ps-5 text-muted small fw-bold text-uppercase" style={{ width: "60%" }}>Nombre de la Plantilla</th>
                          <th className="py-3 text-center text-muted small fw-bold text-uppercase" style={{ width: "40%" }}>Vista Previa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* ESTADO DE CARGA GLOBAL */}
                        {loading ? (
                          <tr>
                            <td colSpan="2" className="text-center py-5">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                              </div>
                              <p className="mt-2 text-muted small">Cargando plantillas...</p>
                            </td>
                          </tr>
                        ) : plantillasUsuario.length > 0 ? (
                          plantillasUsuario.map((p) => (
                            <tr key={p.id} style={{ transition: "background-color 0.2s" }}>
                              <td className="ps-5">
                                <span className="fw-bold fs-5">{p.nombre}</span>
                              </td>
                              <td className="text-center py-3">
                                {imagenesBase64[p.id] ? (
                                  <div className="bg-white p-2 rounded border d-inline-block shadow-sm">
                                    <img
                                      src={`data:image/png;base64,${imagenesBase64[p.id]}`}
                                      alt={p.nombre}
                                      style={{ width: '100px', height: '100px', objectFit: "contain", display: "block" }}
                                    />
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                    <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center py-5">
                              <div className="opacity-50 mb-3">
                                <i className="fa fa-folder-open fa-3x text-muted"></i>
                              </div>
                              <h5 className="text-muted fw-bold">Sin plantillas asignadas</h5>
                              <p className="text-muted mb-0">Este cliente aún no tiene plantillas habilitadas.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-footer bg-light py-3 text-center border-top-0">
                  <small className="text-muted">Mostrando {plantillasUsuario.length} plantillas habilitadas</small>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Modal de Selección con Callback de Actualización */}
        <Modal isVisible={modalAbierto} onClose={handleModalClose}>
          <ModalPlantillas
            setModalAbierto={setModalAbierto}
            idCliente={id}
            userName={username}
            setPlantillasUsuario={(nuevasPlantillas) => {
               // Opción A: Actualización Optimista inmediata
               setPlantillasUsuario(nuevasPlantillas);
               // Opción B: Recargar todo desde el server para estar seguros (más lento pero seguro)
               fetchPlantillas();
            }}
          />
        </Modal>

      </div>
    </>
  );
}