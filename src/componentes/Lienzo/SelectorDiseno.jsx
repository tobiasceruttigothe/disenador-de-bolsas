import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import bolsa from '../../assets/pack designer final.png';
import "../../index.css"
import "../../styles/main.css"
import { useNavigate } from 'react-router-dom';

import MenuVer from "./MenuVer"
import MenuDescargar from "./MenuDescargar"
import Modal from "./ModalConfirmacion"

export default function SelectorDiseno({ }) {
  const [disenos, setDisenos] = useState([])
  const [disenoClick, setDisenoClick] = useState()

  const navigate = useNavigate();

  const [modalVer, setModalVer] = useState(false)
  const [modalDescargar, setModalDescargar] = useState(false)

  useEffect(() => {
    const fetchDisenos = async () => {
      try {
        const token = Cookies.get("access_token");
        const id = Cookies.get("usuarioId");
        const res = await axios.get(`http://localhost:9090/api/disenos/usuario/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        setDisenos(res.data.data);
      } catch (e) {
        console.error("Error al cargar los diseños", e);
      }
    };
    fetchDisenos();
  }, []);


  const handleClick = (diseno) => {
    navigate(`/disenos/${diseno.id}`);
  }

  const handleVer = (diseno) => {
    setDisenoClick(diseno)
    setModalVer(true)
  }

  const handleDescargar = (diseno) => {
    setDisenoClick(diseno)
    setModalDescargar(true)

  }

  const handleGenerar = (diseno) => {
    console.log(diseno.base64Preview)
  }

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro que deseas eliminar el diseño? Esta acción no es revertible.")) {
      try {
        const token = Cookies.get("access_token")
        const res = await axios.delete(`http://localhost:9090/api/disenos/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        setDisenos((prev) => prev.filter((d) => d.id !== id));
      }
      catch (e) {
        console.log("Surgió un error al eliminar el diseño.")
      }
    }
  }

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed", top: "85px", left: "20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>

      <div style={{ marginTop: "85px" }} className='fondo'>
        <div className="container">
          <h2 className="my-3">Tus diseños</h2>
          <hr></hr>
          <div className="row">
            {disenos.length > 0 ? (disenos.map((diseno) => (
              <div
                key={diseno.id}
                className={`col-md-4 mb-4`}
              >

                <div className="card h-100">
                  <img onClick={() => handleClick(diseno)} src={`data:image/png;base64, ${diseno.base64Preview}`} className="card-img-top" alt={diseno.nombre} />
                  <hr />
                  <div className="card-body">
                    <h5 className="card-title">{diseno.nombre}</h5>
                    <p className="card-text">{diseno.descripcion ? diseno.descripcion : <>&nbsp;</>}</p>
                    <div className="d-flex gap-2">
                      <button className="boton-2" onClick={() => handleClick(diseno)}>Editar diseño</button>
                      <button className="boton-1" onClick={() => handleEliminar(diseno.id)}>Eliminar diseño</button>
                      <div className="dropdown">
                        <button
                          className="btn"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ⋮
                        </button>

                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item" onClick={() => handleVer(diseno)}>Ver mi diseño</button></li>
                          <li><button className="dropdown-item" onClick={() => handleDescargar(diseno)}>Descargar</button></li>
                          <li><button className="dropdown-item" onClick={() => handleGenerar(diseno)}>Generar vista 3D</button></li>
                        </ul>
                      </div>

                    </div>

                  </div>
                </div>
              </div>

            ))) : (
              <p>No tienes diseños guardados. ¡Creá uno nuevo!</p>
            )}
            <hr />
            <div
              key={"nuevoDiseno"}
              className={`col-md-4 mb-4`}
            >
              <Link to={`/nuevoDiseno`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card h-100">
                  <img src={bolsa} className="card-img-top" alt={"nuevo diseño"} />
                  <hr />
                  <div className="card-body">
                    <h5 className="card-title">Nuevo diseño</h5>
                    <p className="card-text">Crear nuevo diseño</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <Modal isVisible={modalVer} onClose={() => { setModalVer(false); setDisenoClick() }}>
          <MenuVer setModalVer={setModalVer} disenoClick={disenoClick} setDisenoClick={setDisenoClick}></MenuVer>
        </Modal>
        <Modal isVisible={modalDescargar} onClose={() => { setModalDescargar(false); setDisenoClick() }}>
          <MenuDescargar setModalDescargar={setModalDescargar} disenoClick={disenoClick} setDisenoClick={setDisenoClick}></MenuDescargar>
        </Modal>

      </div>
    </>
  );
}
