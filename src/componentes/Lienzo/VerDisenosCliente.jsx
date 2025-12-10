import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Componentes y Configuración
import { apiClient } from '../../config/axios';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import ModalConfirmacion from '../ModalConfirmacion';
import MenuVer from "./MenuVer";
import MenuDescargar from "./MenuDescargar";
import Modal from "./ModalConfirmacion";

// Estilos
import bolsa from '../../assets/pack designer final.png';
import "../../index.css";
import "../../styles/main.css";

export default function VerDisenosCliente() {
  const [disenos, setDisenos] = useState([]);
  const [disenoClick, setDisenoClick] = useState();
  const [usuario, setUsuario] = useState({ username: "Cargando..." });

  const navigate = useNavigate();
  const { id } = useParams();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  // Estados de Modales
  const [modalVer, setModalVer] = useState(false);
  const [modalDescargar, setModalDescargar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null });

  // --- LÓGICA DE CARGA ---
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        // Cargar diseños
        const resDisenos = await apiClient.get(`/disenos/usuario/${id}`);
        setDisenos(resDisenos.data.data);

        // Cargar datos del usuario
        const resUsers = await apiClient.get(`/usuarios/list/users/clients`);
        const encontrado = resUsers.data.find(u => u.id === id);
        setUsuario(encontrado || { username: "Usuario desconocido" });

      } catch (e) {
        console.error("Error al cargar datos", e);
        mostrarError("Error al cargar los diseños. Intente nuevamente.");
      }
    };

    fetchData();
  }, [id]);

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
    // Lógica para vista 3D si la tienes implementada
    console.log("Generar 3D", diseno);
  };



  const handleEliminarClick = (id) => {
    setModalEliminar({ visible: true, id });
  };

  const confirmarEliminar = async () => {
    const id = modalEliminar.id;
    try {
      await apiClient.delete(`/disenos/${id}`);
      mostrarExito("Diseño eliminado exitosamente.");
      setDisenos((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error("Error al eliminar:", e);
      mostrarError("Error al eliminar el diseño.");
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
        onClick={() => navigate("/verClientes")}
      >
        ←
      </button>

      {/* Contenedor Principal */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        
        <div className="container">
          
          {/* Encabezado */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold text-dark mb-1">Diseños de {usuario.username}</h2>
              <p className="text-muted mb-0">Visualiza y gestiona los trabajos de este cliente</p>
            </div>
          </div>

          {/* Grid de Diseños */}
          <div className="row g-4">
            
            {/* LISTA DE DISEÑOS */}
            {disenos.length > 0 ? (
              disenos.map((diseno) => (
                <div key={diseno.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: "16px", transition: "transform 0.2s" }}>
                    
                    {/* Imagen del diseño */}
                    <div 
                      className="position-relative bg-white border-bottom d-flex align-items-center justify-content-center"
                      style={{ height: "220px", cursor: "pointer", overflow: "hidden" }}
                      onClick={() => handleClick(diseno)}
                    >
                      <img 
                        src={`data:image/png;base64, ${diseno.base64Preview}`} 
                        alt={diseno.nombre} 
                        className="img-fluid"
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.3s" }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </div>

                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={diseno.nombre}>{diseno.nombre}</h5>
                        
                        {/* Menú de 3 puntos (Dropdown) */}
                        <div className="dropdown">
                          <button className="btn btn-light btn-sm rounded-circle" type="button" data-bs-toggle="dropdown">
                            <i className="fa fa-ellipsis-v text-muted"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><button className="dropdown-item" onClick={() => handleVer(diseno)}><i className="fa fa-eye me-2 text-primary"></i> Ver</button></li>
                            <li><button className="dropdown-item" onClick={() => handleDescargar(diseno)}><i className="fa fa-download me-2 text-success"></i> Descargar</button></li>
                            <li><button className="dropdown-item" onClick={() => handleGenerar(diseno)}><i className="fa fa-cube me-2 text-warning"></i> Vista 3D</button></li>
                            <li><button className="dropdown-item" onClick={() => handleDuplicar(diseno)}><i className="fa fa-copy me-2 text-info"></i> Duplicar</button></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><button className="dropdown-item text-danger" onClick={() => handleEliminarClick(diseno.id)}><i className="fa fa-trash me-2"></i> Eliminar</button></li>
                          </ul>
                        </div>
                      </div>

                      <p className="card-text text-muted small mb-4" style={{ minHeight: "40px" }}>
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
                <h5 className="text-muted">Este cliente no tiene diseños guardados.</h5>
              </div>
            )}

            {/* TARJETA "CREAR NUEVO" (Opcional, si el diseñador puede crear para el cliente) */}
            {/* Si no quieres que aparezca, simplemente borra este bloque div */}
            <div className="col-12 col-md-6 col-lg-4">
                <Link to="/nuevoDiseno" style={{ textDecoration: 'none' }}>
                  <div 
                    className="card h-100 border-2 border-dashed shadow-none bg-transparent d-flex align-items-center justify-content-center text-center p-5"
                    style={{ 
                      borderRadius: "16px", 
                      borderColor: "#dee2e6", 
                      minHeight: "380px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = primaryColor;
                      e.currentTarget.style.backgroundColor = "#eef6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#dee2e6";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div>
                      <div className="mb-3 text-primary">
                        <i className="fa fa-plus-circle fa-4x"></i>
                      </div>
                      <h5 className="fw-bold text-primary">Crear Nuevo Diseño</h5>
                      <p className="text-muted small">Para este cliente</p>
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