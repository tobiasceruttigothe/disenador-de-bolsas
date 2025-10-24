
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import user from "../../assets/user.png";
import bolsa from "../../assets/pack designer final.png";

export default function InicioDisenador() {
  const acciones = [
    { id: 1, nombre: "Ver Clientes", ruta: "/verClientes", imagen: user },
    { id: 2, nombre: "Crear diseño", ruta: "/nuevoDiseno", imagen: bolsa },
  ];

  const [seleccionada, setSeleccionada] = useState(null);

  const handleClick = (accion) => {
    setSeleccionada(accion.id);
  };

  return (
    <>
      <div className="fondo py-5">
        <div className="container">
          <h2 className="mb-4 text-center">Selecciona una acción</h2>
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
