import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import bolsa from '../../assets/pack designer final.png';
import "../../index.css"

export default function TablaLogos() {
  const [logos, setLogos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogos();
  }, []);
  const fetchLogos = async () => {
    try {
      const id = Cookies.get("usuarioId");
      const token = Cookies.get('access_token');
      const response = await axios.get(`http://localhost:9090/api/logos/usuario/${id}`, {
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

  const eliminarLogo = async (idEl) => {
    if (window.confirm("¿Estás seguro que deseas eliminar el logo?")) {
      try {
        const token = Cookies.get('access_token');
        await axios.delete(`http://localhost:9090/api/logos/${idEl}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setLogos((prev) => prev.filter((c) => c.id !== idEl));
      } catch (error) {
        console.error('Error fetching logos:', error);
      }
    }
  }
  const handleNuevoLogo = () => {
    navigate('/logos/nuevo');
  };
  return (
    <>
      <div className='fondo'>
        <div className="container">
          <br />
          <h2 className="mb-3">Tus logos</h2>
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
                      className="btn m-1"
                      style={{
                        border: "2px solid #016add",
                        backgroundColor: "transparent",
                        color: "#016add",
                        fontWeight: "500",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#016add";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#016add";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onClick={() => alert(`Modificar diseñador: ${d.username}`)}
                    >
                      Modificar
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
      </div>
    </>
  )
}
