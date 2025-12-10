import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Componentes y Configuración
import { apiClient } from '../../config/axios';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import ModalConfirmacion from '../ModalConfirmacion';
import MenuVer from "./MenuVer";
import MenuDescargar from "./MenuDescargar";
import Menu3d from "./Menu3d";
import Modal from "./ModalConfirmacion";

// Estilos e Imágenes
import bolsa from '../../assets/pack designer final.png'; 
import "../../index.css";
import "../../styles/main.css";

export default function SelectorDiseno() {
  const [disenos, setDisenos] = useState([]);
  const [disenoClick, setDisenoClick] = useState();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  // Estados de Modales
  const [modalVer, setModalVer] = useState(false);
  const [modalDescargar, setModalDescargar] = useState(false);
  const [modal3d, setModal3d] = useState(false);
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null });

  // --- LÓGICA DE CARGA ---
  const fetchDisenos = async () => {
    try {
      const id = Cookies.get("usuarioId");
      const res = await apiClient.get(`/disenos/usuario/${id}`);
      setDisenos(res.data.data);
    } catch (e) {
      console.error("Error al cargar los diseños", e);
      mostrarError("Error al cargar los diseños. Intente nuevamente.");
    }
  };

  useEffect(() => {
    fetchDisenos();
  }, []);

  // --- MANEJADORES ---
  const handleClick = (diseno) => {
    navigate(`/disenos/${diseno.id}`);
  };

  const handleVer = (diseno) => {
    setDisenoClick(diseno);
    setModalVer(true);
  };

  const handleDescargar = (diseno) => {
    setDisenoClick(diseno);
    setModalDescargar(true);
  };

  const handleGenerar = (diseno) => {
    setDisenoClick(diseno);
    setModal3d(true);
  };

  const handleEliminarClick = (id) => {
    setModalEliminar({ visible: true, id });
  };

  const confirmarEliminar = async () => {
    const id = modalEliminar.id;
    if (!id) {
      mostrarError("Error: No se pudo identificar el diseño.");
      setModalEliminar({ visible: false, id: null });
      return;
    }

    try {
      await apiClient.delete(`/disenos/${id}`);
      mostrarExito("Diseño eliminado exitosamente.");
      setDisenos((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      if (error.response?.status === 403) {
        mostrarError("No tienes permisos para eliminar este diseño.");
      } else {
        mostrarError("Error al eliminar el diseño.");
      }
    }
    setModalEliminar({ visible: false, id: null });
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
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>

      {/* Contenedor con FONDO DE CÍRCULOS (clase 'fondo') */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        
        <div className="container">
          
          {/* Encabezado */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold text-dark mb-1">Mis Diseños</h2>
              <p className="text-muted mb-0">Gestiona y edita tus creaciones guardadas</p>
            </div>
          </div>

          {/* Grid de Diseños */}
          <div className="row g-4">
            
            {/* LISTA DE DISEÑOS EXISTENTES */}
            {disenos.length > 0 ? (
              disenos.map((diseno) => (
                <div key={diseno.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: "16px", transition: "transform 0.2s" }}>
                    
                    {/* --- CORRECCIÓN IMAGEN DEL DISEÑO --- */}
                    <div 
                      className="position-relative bg-white border-bottom d-flex align-items-center justify-content-center"
                      style={{ 
                        height: "240px", // Altura fija para el contenedor
                        width: "100%",   // Ancho total
                        cursor: "pointer", 
                        overflow: "hidden",
                        padding: "20px",  // Padding para que la imagen respire
                        backgroundColor: "#f8f9fa" // Fondo gris muy suave por si la imagen tiene transparencia
                      }}
                      onClick={() => handleClick(diseno)}
                    >
                      <img 
                        // FIX: Quité el espacio después de "base64,". Esto suele romper imágenes generadas.
                        src={`data:image/png;base64,${diseno.base64Preview}`} 
                        alt={diseno.nombre} 
                        className="img-fluid"
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "contain", // Asegura que la imagen entera se vea sin recortes
                          transition: "transform 0.3s" 
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </div>
                    {/* ------------------------------------ */}

                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={diseno.nombre}>{diseno.nombre}</h5>
                        
                        {/* Menú de 3 puntos */}
                        <div className="dropdown">
                          <button className="btn btn-light btn-sm rounded-circle" type="button" data-bs-toggle="dropdown">
                            <i className="fa fa-ellipsis-v text-muted"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><button className="dropdown-item" onClick={() => handleVer(diseno)}><i className="fa fa-eye me-2 text-primary"></i> Ver detalles</button></li>
                            <li><button className="dropdown-item" onClick={() => handleDescargar(diseno)}><i className="fa fa-download me-2 text-success"></i> Descargar</button></li>
                            <li><button className="dropdown-item" onClick={() => handleGenerar(diseno)}><i className="fa fa-cube me-2 text-warning"></i> Vista 3D</button></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><button className="dropdown-item text-danger" onClick={() => handleEliminarClick(diseno.id)}><i className="fa fa-trash me-2"></i> Eliminar</button></li>
                          </ul>
                        </div>
                      </div>

                      <p className="card-text text-muted small mb-4 text-truncate" style={{ minHeight: "20px" }}>
                        {diseno.descripcion || "Sin descripción"}
                      </p>

                      {/* Botones de acción rápida */}
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-outline-primary fw-bold" 
                          onClick={() => handleClick(diseno)}
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          <i className="fa fa-edit me-2"></i> Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="mb-3 opacity-25">
                  <i className="fa fa-folder-open fa-4x text-muted"></i>
                </div>
                <h5 className="text-muted">No tienes diseños guardados aún.</h5>
              </div>
            )}

            {/* TARJETA DE "CREAR NUEVO" (DISEÑO MEJORADO CON LOGO) */}
            <div className="col-12 col-md-6 col-lg-4">
              <Link to="/nuevoDiseno" style={{ textDecoration: 'none' }}>
                <div 
                  className="card h-100 d-flex align-items-center justify-content-center text-center p-5 position-relative overflow-hidden"
                  style={{ 
                    borderRadius: "16px", 
                    backgroundColor: "#f8faff",
                    border: `2px solid ${primaryColor}`,
                    minHeight: "380px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(1, 106, 221, 0.1)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(1, 106, 221, 0.2)";
                    e.currentTarget.style.backgroundColor = "#eef6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(1, 106, 221, 0.1)";
                    e.currentTarget.style.backgroundColor = "#f8faff";
                  }}
                >
                  <div>
                    <div className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center mx-auto mb-4" 
                         style={{ width: "100px", height: "100px" }}>
                      <img 
                        src={bolsa} 
                        alt="Nuevo Diseño" 
                        style={{ width: "50px", height: "50px", objectFit: "contain" }} 
                      />
                    </div>
                    
                    <h4 className="fw-bold mb-2" style={{ color: primaryColor }}>
                      Crear Nuevo Diseño
                    </h4>
                    <p className="text-muted small mb-0">
                      Comenzar desde una plantilla en blanco
                    </p>
                    
                    <div className="mt-4 text-primary opacity-50">
                      <i className="fa fa-plus-circle fa-2x"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>

        {/* --- MODALES --- */}
        <Modal isVisible={modalVer} onClose={() => { setModalVer(false); setDisenoClick() }}>
          <MenuVer setModalVer={setModalVer} disenoClick={disenoClick} setDisenoClick={setDisenoClick} />
        </Modal>
        
        <Modal isVisible={modalDescargar} onClose={() => { setModalDescargar(false); setDisenoClick() }}>
          <MenuDescargar setModalDescargar={setModalDescargar} disenoClick={disenoClick} setDisenoClick={setDisenoClick} />
        </Modal>
        
        <Modal isVisible={modal3d} onClose={() => { setModal3d(false); setDisenoClick() }}>
          <Menu3d
            setModal3d={setModal3d}
            disenoClick={disenoClick}
            setDisenoClick={setDisenoClick}
            onSuccess={mostrarExito}
            onError={mostrarError}
            onUpdateDisenos={fetchDisenos}
          />
        </Modal>

        <ModalConfirmacion
          isVisible={modalEliminar.visible}
          onClose={() => setModalEliminar({ visible: false, id: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar diseño"
          mensaje="¿Estás seguro que deseas eliminar este diseño? Esta acción no se puede deshacer."
          tipo="danger"
        />

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