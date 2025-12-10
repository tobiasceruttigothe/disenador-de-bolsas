import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Componentes y Configuración
import { apiClient } from '../../config/axios';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import ModalConfirmacion from '../ModalConfirmacion';

// Assets y Estilos
import "../../index.css";
import "../../styles/main.css";

export default function TablaLogos() {
  const [logos, setLogos] = useState([]);
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null });

  // --- LÓGICA DE CARGA ---
  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const id = Cookies.get("usuarioId");
      const token = Cookies.get('access_token');
      const response = await apiClient.get(`/logos/usuario/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setLogos(response.data.data || []);
    } catch (error) {
      console.error('Error fetching logos:', error);
      mostrarError("Error al cargar los logos.");
    }
  };

  // --- MANEJADORES ---
  const handleEliminarClick = (idEl) => {
    setModalEliminar({ visible: true, id: idEl });
  };

  const confirmarEliminar = async () => {
    const idEl = modalEliminar.id;
    try {
      await apiClient.delete(`/logos/${idEl}`);
      mostrarExito("Logo eliminado exitosamente.");
      setLogos((prev) => prev.filter((c) => c.id !== idEl));
    } catch (error) {
      console.error('Error al eliminar logo:', error);
      mostrarError("No se pudo eliminar el logo.");
    }
    setModalEliminar({ visible: false, id: null });
  };

  const handleNuevoLogo = () => {
    navigate('/nuevoDiseno'); // Ajusta si la ruta es otra
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
          zIndex: 1000 // Asegura que quede por encima
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
              <h2 className="fw-bold text-dark mb-1">Mis Logos</h2>
              <p className="text-muted mb-0">Gestiona los recursos de imagen de tu empresa</p>
            </div>
          </div>

          {/* Grid de Logos */}
          <div className="row g-4">
            
            {/* LISTA DE LOGOS EXISTENTES */}
            {logos.length > 0 ? (
              logos.map((logo) => (
                <div key={logo.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: "16px", transition: "transform 0.2s" }}>
                    
                    {/* Imagen del Logo */}
                    <div 
                      className="bg-white border-bottom d-flex align-items-center justify-content-center p-4 position-relative"
                      style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                    >
                      {/* Fondo de cuadrícula transparente */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
                        backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee)',
                        backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px', opacity: 0.3
                      }}></div>

                      <img 
                        src={`data:image/png;base64,${logo.base64Logo}`} 
                        alt={logo.nombre} 
                        className="img-fluid position-relative"
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", zIndex: 1 }}
                      />
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="card-title fw-bold text-dark mb-3 text-truncate" title={logo.nombre}>{logo.nombre}</h5>
                      
                      <div className="mt-auto d-grid">
                        <button 
                          className="btn btn-outline-danger fw-bold" 
                          onClick={() => handleEliminarClick(logo.id)}
                          style={{ border: "2px solid #dc3545", color: "#dc3545", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dc3545"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#dc3545"; }}
                        >
                          <i className="fa fa-trash-alt me-2"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="mb-3 opacity-25">
                  <i className="fa fa-images fa-4x text-muted"></i>
                </div>
                <h5 className="text-muted">No tienes logos guardados.</h5>
                <p className="text-muted small">Sube tu primer logo para empezar.</p>
              </div>
            )}

            {/* TARJETA DE "NUEVO LOGO" */}
            <div className="col-12 col-md-6 col-lg-4">
              <div 
                className="card h-100 border-2 border-dashed shadow-none bg-transparent d-flex align-items-center justify-content-center text-center p-5"
                style={{ 
                  borderRadius: "16px", 
                  borderColor: "#dee2e6", 
                  minHeight: "350px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "rgba(255,255,255,0.5)" // Semi-transparente para que se vea sutilmente el fondo
                }}
                onClick={handleNuevoLogo}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = primaryColor;
                  e.currentTarget.style.backgroundColor = "#eef6ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#dee2e6";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.5)";
                }}
              >
                <div>
                  <div className="mb-3 text-primary">
                    <i className="fa fa-cloud-upload-alt fa-4x"></i>
                  </div>
                  <h5 className="fw-bold text-primary">Subir Nuevo Logo</h5>
                  <p className="text-muted small">Formatos: PNG, JPG, SVG</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- MODAL CONFIRMACIÓN --- */}
        <ModalConfirmacion
          isVisible={modalEliminar.visible}
          onClose={() => setModalEliminar({ visible: false, id: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar Logo"
          mensaje="¿Estás seguro que deseas eliminar este logo? Si está siendo usado en diseños guardados, podría dejar de verse."
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