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
import MenuEstado from "./MenuEstado";


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
  const [modalEstado, setModalEstado] = useState(false);

  const [verEstados, setVerEstados] = useState(false);

  const [rol, setRol] = useState(Cookies.get("rol"))

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

  const handleEliminarClick = (id) => {
    setModalEliminar({ visible: true, id });
  };

  const handleDuplicar = async (diseno) => {
    try {
      const payload = {
        usuarioId: Cookies.get("usuarioId"),
        plantillaId: diseno.plantillaId,
        nombre: `Duplicado de ${diseno.nombre}`,
        descripcion: diseno.descripcion,
        base64Diseno: diseno.base64Diseno,
        base64Preview: diseno.base64Preview
      };
      await apiClient.post("/disenos", payload);
      mostrarExito("Diseño duplicado correctamente.");
    } catch (error) {
      console.error("Error al duplicar:", error);
      mostrarError("Error al duplicar el diseño.");
    }
  };
  const handleEstado = (diseno) => {
    setDisenoClick(diseno);
    setModalEstado(true);
  }

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

  const handleNavegar = () => {
    if (Cookies.get("rol") === "admin") {
      navigate(-1)
    } else {
      navigate("/verClientes")
    }
  }

  return (
    <>
      {/* Botón Volver ORIGINAL (Posición Fija) */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => handleNavegar()}
      >
        ←
      </button>

      {/* Contenedor con FONDO DE CÍRCULOS (clase 'fondo') */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>

        <div className="container">

          {/* Encabezado */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold text-dark mb-1">{`Diseños del usuario ${usuario.username} (${usuario.razonSocial || "-"})`}</h2>
              <p className="text-muted mb-0">Ver y gestionar diseños de clientes</p>
            </div>
          </div>
          {disenos.length > 0 ? (
            <div className="mb-5 d-flex">
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={verEstados}
                  onChange={() => { setVerEstados(!verEstados); }}
                />
                <span className="switch-slider"></span>
              </label>
              <h5 className="ms-3">Ver estados de los diseños</h5>
            </div>
          ) : ""}
          {/* Grid de Diseños */}
          <div className="row g-4">

            {/* LISTA DE DISEÑOS EXISTENTES */}
            {disenos.length > 0 ? (
              disenos.map((diseno) => (
                <div key={diseno.id} className="col-12 col-md-6 col-lg-4">
                  <div className={`${verEstados ? `borde-estado-${diseno.status}` : "card-opcion"} h-100 shadow-sm overflow-hidden`} style={{ borderRadius: "16px", transition: "transform 0.2s" }}>
                    <div
                      className="position-relative border-bottom d-flex align-items-center justify-content-center"
                      style={{
                        height: "240px",
                        width: "100%",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                      onClick={() => handleClick(diseno)}
                    >
                      <img
                        src={`data:image/png;base64,${diseno.base64Preview}`}
                        alt={diseno.nombre}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          transition: "transform 0.3s",
                          zIndex: 1,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                      {/* CAMBIAR */}
                      {verEstados && (
                        <span
                          className={`position-absolute top-0 end-0 cuadro-estado-${diseno.status}`}
                          style={{ fontSize: "1rem", zIndex: 10, borderRadius: "0 0 0 8px" }}
                        >
                          {diseno.status}
                        </span>
                      )}
                    </div>

                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={diseno.nombre}>{diseno.nombre}</h5>
                        {/* Menú de 3 puntos */}
                        <div className="dropdown">
                          <button className="btn btn-sm" type="button" data-bs-toggle="dropdown">
                            <i className="fa fa-ellipsis-v text-muted"></i>
                          </button>
                          <ul className="menu dropdown-menu dropdown-menu-end shadow border-0">
                            <li><button className="texto-menu dropdown-item" onClick={() => handleVer(diseno)}><i className="fa fa-eye me-2 text-primary"></i> Ver detalles</button></li>
                            <li><button className="texto-menu dropdown-item" onClick={() => handleDescargar(diseno)}><i className="fa fa-download me-2 text-success"></i> Descargar</button></li>
                            {rol === "disenador" ?
                              (<>
                                <li><button className="texto-menu dropdown-item" onClick={() => handleDuplicar(diseno)}><i className="fa fa-copy me-2 text-warning"></i> Duplicar</button></li>
                                <li><button className="texto-menu dropdown-item" onClick={() => handleEstado(diseno)}><i className="fa fa-toggle-on me-2 text-secondary"></i> Estado</button></li>
                              </>
                              ) : ""}
                            <li><hr className="divider-menu" /></li>
                            <li><button className="dropdown-item text-danger" onClick={() => handleEliminarClick(diseno.id)}><i className="fa fa-trash me-2"></i> Eliminar</button></li>
                          </ul>
                        </div>
                      </div>

                      <p className="card-text text-muted small mb-4 text-truncate" style={{ minHeight: "20px" }}>
                        {diseno.descripcion || "Sin descripción"}
                      </p>

                      {/* Botones de acción rápida */}
                      {(Cookies.get("rol") === "disenador") ? <div className="d-grid gap-2">
                        <button
                          className="btn boton-cambiar"
                          onClick={() => handleClick(diseno)}
                          disabled={diseno.status === "TERMINADO"}
                        >
                          <i className="fa fa-edit me-2"></i> Editar
                        </button>
                        {diseno.status === "TERMINADO" ? <p className="text-muted mt-1 ms-2" style={{fontSize:"0.8rem"}}>El diseño no se puede editar si está terminado. Para modificarlo, cambiá su estado en la pestaña de Estado</p>
                          : ""}
                      </div> : ""}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="mb-3 opacity-25">
                  <i className="fa fa-folder-open fa-4x text-muted"></i>
                </div>
                <h5 className="text-muted">Este cliente no tiene diseños guardados aún.</h5>
              </div>
            )}

          </div>
        </div>

        {/* --- MODALES --- */}
        <Modal isVisible={modalVer} onClose={() => { setModalVer(false); setDisenoClick() }}>
          <MenuVer setModalVer={setModalVer} disenoClick={disenoClick} setDisenoClick={setDisenoClick} />
        </Modal>

        <Modal isVisible={modalDescargar} onClose={() => { setModalDescargar(false); setDisenoClick() }}>
          <MenuDescargar setModalDescargar={setModalDescargar} disenoClick={disenoClick} setDisenoClick={setDisenoClick} />
        </Modal>

        <Modal isVisible={modalEstado} onClose={() => { setModalEstado(false); setDisenoClick() }}>
          <MenuEstado
            setModalEstado={setModalEstado}
            disenoClick={disenoClick}
            setDisenoClick={setDisenoClick}
            onSuccess={mostrarExito}
            onError={mostrarError}
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