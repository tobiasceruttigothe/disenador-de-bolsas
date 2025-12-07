import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { apiClient } from '../../config/axios';
import { Link } from 'react-router-dom';
import bolsa from '../../assets/pack designer final.png';
import "../../index.css"

export default function TablaLogos() {
  const [logos, setLogos] = useState([]);
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null });

  useEffect(() => {
    fetchLogos();
  }, []);
  const fetchLogos = async () => {
    try {
      const id = Cookies.get("usuarioId");
      const token = Cookies.get('access_token');
      const response = await apiClient.get(`/logos/usuario/${id}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setLogos(response.data.data);
    } catch (error) {
      console.error('Error fetching logos:', error);
    }
  };

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
    navigate('/logos/nuevo');
  };
  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{ position:"fixed", top:"85px", left:"20px",
          margin: "20px",  width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>
      <div style={{marginTop:"85px"}} className='fondo'>
        <div className="container">
          <h2 className="mb-3">Tus logos</h2>
          <hr></hr>
          <div className="row">
            {logos.length > 0 ? (logos.map((logo) => (
              <div
                key={logo.id}
                className={`col-md-4 mb-4`}
              >
                <div className="card h-100">
                  <img src={`data:image/png;base64,${logo.base64Logo}`} className="card-img-top" alt={logo.nombre} />
                  <hr />
                  <div className="card-body">
                    <h5 className="card-title">{logo.nombre}</h5>
                    <hr></hr>
                    <button
                      className="boton-2"
                      onClick={() => handleEliminarClick(logo.id)}
                    >
                      Eliminar Logo
                    </button>
                  </div>
                </div>
              </div>
            ))) : (
              <p>No tienes logos guardados. ¡Guardá uno nuevo!</p>
            )}
            <hr />
            <div
              key={"nuevoDiseno"}
              className={`col-md-4 mb-4`}
              onClick={() => handleNuevoLogo()}
            >
              <Link to={`/logos/nuevo`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card h-100">
                  <img src={bolsa} className="card-img-top" alt={"nuevo diseño"} />
                  <hr />
                  <div className="card-body">
                    <h5 className="card-title">Nuevo logo</h5>
                    <p className="card-text">Agregar nuevo logo</p>
                  </div>
                </div>
              </Link>
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
          onClose={() => setModalEliminar({ visible: false, id: null })}
          onConfirm={confirmarEliminar}
          titulo="Eliminar logo"
          mensaje="¿Estás seguro que deseas eliminar el logo? Esta acción no se puede deshacer."
          tipo="danger"
        />
      </div>
    </>
  )
}
