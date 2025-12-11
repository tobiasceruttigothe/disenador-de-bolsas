import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form'; // Necesitamos useForm para el modal

// Componentes y Configuración
import { apiClient } from '../../config/axios';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import ModalConfirmacion from '../ModalConfirmacion';

// Assets y Estilos
import "../../index.css";
import "../../styles/main.css";

// --- COMPONENTE MODAL PARA SUBIR LOGO (Interno) ---
function ModalSubirLogo({ isVisible, onClose, onSuccess, mostrarError }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [base64Logo, setBase64Logo] = useState("");
  const [cargando, setCargando] = useState(false);
  const primaryColor = "#016add";

  // Limpiar formulario al cerrar/abrir
  useEffect(() => {
    if (isVisible) {
      reset();
      setBase64Logo("");
      setCargando(false);
    }
  }, [isVisible, reset]);

  if (!isVisible) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tamaño (ej. 5MB)
    if (file.size > 5 * 1024 * 1024) {
        mostrarError("La imagen excede los 5Mb");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setBase64Logo(base64String);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    if (!base64Logo) {
      mostrarError("Debe seleccionar un archivo de imagen");
      return;
    }

    const payload = {
      usuarioId: Cookies.get("usuarioId"),
      nombre: data.nombre,
      base64Logo: base64Logo,
    };

    try {
      setCargando(true);
      await apiClient.post("/logos", payload);
      onSuccess(); // Avisar al padre que recargue
      onClose();   // Cerrar modal
    } catch (error) {
      console.error(error);
      mostrarError("Ocurrió un error al subir el logo");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="card border-0 shadow-lg rounded-4 p-4 bg-white animate-scale-in" style={{ width: "90%", maxWidth: "450px" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark mb-0">Nuevo Logo</h4>
          <button onClick={onClose} className="btn btn-close"></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">NOMBRE</label>
            <input
              type="text"
              className={`form-control bg-light border-0 ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Ej: Logo Principal"
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
            {errors.nombre && <div className="text-danger small">{errors.nombre.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">IMAGEN</label>
            <input
              type="file"
              accept=".jpg,.png,.jpeg,.svg"
              className="form-control bg-light border-0"
              onChange={handleFileChange}
            />
          </div>

          {/* Previsualización */}
          {base64Logo && (
            <div className="mb-3 text-center p-2 border rounded bg-light">
              <img src={`data:image/*;base64,${base64Logo}`} alt="Previsualización" style={{ maxHeight: '100px', maxWidth: '100%' }} />
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn text-white fw-bold rounded-pill"
              style={{ backgroundColor: primaryColor }}
              disabled={cargando}
            >
              {cargando ? "Guardando..." : "Subir Logo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function TablaLogos() {
  const [logos, setLogos] = useState([]);
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  
  // Estados para modales
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null });
  const [modalSubir, setModalSubir] = useState(false); // Estado para abrir/cerrar el modal de subida

  const primaryColor = "#016add";

  // --- LÓGICA DE CARGA ---
  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const id = Cookies.get("usuarioId");
      const response = await apiClient.get(`/logos/usuario/${id}`);
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

  // Cuando se sube un logo con éxito desde el modal
  const handleLogoSubido = () => {
    fetchLogos(); // Recargar la lista
    mostrarExito("Logo agregado correctamente.");
  };

  return (
    <>
      {/* Botón Volver */}
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed", top: "9vh", left: "3vw", width: "70px", height: "40px",
          padding: "10px", backgroundColor: "white", color: "#016add",
          border: "1px solid #016add", borderRadius: "7px", zIndex: 1000
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>

      {/* Contenedor Principal */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold text-dark mb-1">Mis Logos</h2>
              <p className="text-muted mb-0">Gestiona los recursos de imagen de tu empresa</p>
            </div>
          </div>

          <div className="row g-4">
            
            {/* TARJETA DE "NUEVO LOGO" (Ahora abre el modal) */}
            <div className="col-12 col-md-6 col-lg-4">
              <div 
                className="card h-100 border-2 border-dashed shadow-none bg-transparent d-flex align-items-center justify-content-center text-center p-5"
                style={{ 
                  borderRadius: "16px", borderColor: "#dee2e6", minHeight: "350px",
                  cursor: "pointer", transition: "all 0.2s",
                  backgroundColor: "rgba(255,255,255,0.5)"
                }}
                onClick={() => setModalSubir(true)} // ABRIR MODAL
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

            {/* LISTA DE LOGOS */}
            {logos.length > 0 ? (
              logos.map((logo) => (
                <div key={logo.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: "16px", transition: "transform 0.2s" }}>
                    
                    <div 
                      className="bg-white border-bottom d-flex align-items-center justify-content-center p-4 position-relative"
                      style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                    >
                      {/* Fondo ajedrez */}
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
            ) : null}

          </div>
        </div>

        {/* --- MODALES --- */}
        
        {/* Modal para Subir Logo */}
        <ModalSubirLogo 
          isVisible={modalSubir} 
          onClose={() => setModalSubir(false)} 
          onSuccess={handleLogoSubido}
          mostrarError={mostrarError}
        />

        {/* Modal de Confirmación de Eliminación */}
        <ModalConfirmacion
          isVisible={modalEliminar.visible}
          onClose={() => setModalEliminar({ visible: false, id: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar Logo"
          mensaje="¿Estás seguro que deseas eliminar este logo?"
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