
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import paper from "../../assets/papersrl.png";
import bolsa from "../../assets/pack designer final.png";

export default function InicioCliente() {
  const acciones = [
    { id: 1, nombre: "Mis diseños", ruta: "/disenos", imagen: bolsa },
    { id: 2, nombre: "Crear diseño", ruta: "/nuevoDiseno", imagen: bolsa },
    { id: 3, nombre: "Mis Logos", ruta: "/logos", imagen: paper}
  ];

  const [seleccionada, setSeleccionada] = useState(null);

  const handleClick = (accion) => {
    setSeleccionada(accion.id);
  };

  return (
    <>
      <div className="fondo py-5 mt-5">
        <div className="container">
          <h2 className="mb-4 text-center">Seleccioná una acción</h2>
          <hr></hr>
          <div className="row justify-content-center">
            {acciones.map((accion) => (
              <div key={accion.id} className="col-12 col-sm-6 col-md-4 mb-3">
                <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                  <div
                    className={`card card-accion text-center py-4 ${seleccionada === accion.id ? "border-warning" : ""}`}
                    onClick={() => handleClick(accion)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={accion.imagen} className="card-img-top"/>
                    <button className="btn btn-primary mt-3 w-75">
                      {accion.nombre}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
