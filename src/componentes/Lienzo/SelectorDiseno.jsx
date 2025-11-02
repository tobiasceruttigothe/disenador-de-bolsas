import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import bolsa from '../../assets/pack designer final.png';
import "../../index.css"

export default function SelectorDiseno({ }) {
  const [disenos, setDisenos] = useState([])

  useEffect(() => {
    const fetchDisenos = async () => {
      try {
        const token = Cookies.get("access_token");
        const id = Cookies.get("usuarioId");
        console.log(id)
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
    console.log("Diseño seleccionado:", diseno);
  }

  const handleNuevoDiseno = () => {
    console.log("Nuevo diseño seleccionado");
  }

  return (
    <>
      <div className='fondo'>
        <div className="container">
          <br />
          <h2 className="mb-3">Tus diseños</h2>
          <div className="row">
            {disenos.length > 0 ? (disenos.map((diseno) => (
              <div
                key={diseno.id}
                className={`col-md-4 mb-4`}
                onClick={() => handleClick(diseno)}
              >
                <Link to={`/lienzo/${diseno.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card h-100">
                    <img src={diseno.base64Diseno} className="card-img-top" alt={diseno.nombre} />
                    <hr />
                    <div className="card-body">
                      <h5 className="card-title">{diseno.nombre}</h5>
                      <p className="card-text">{diseno.descripcion}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))) : (
              <p>No tienes diseños guardados. ¡Creá uno nuevo!</p>
            )}
            <hr />
            <div
                key={"nuevoDiseno"}
                className={`col-md-4 mb-4`}
                onClick={() => handleNuevoDiseno()}
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
      </div>
    </>
  );
}
