
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import misLogos from "../../assets/iconos_inicio/Mis_logos.png";
import nuevoDiseño from "../../assets/iconos_inicio/Nuevo_diseño-logo.png";
import misDiseños from "../../assets/iconos_inicio/Mis_disenos.png";

export default function InicioCliente() {
  const acciones = [
    { id: 1, nombre: "Mis diseños", ruta: "/disenos", imagen: misDiseños },
    { id: 2, nombre: "Crear diseño", ruta: "/nuevoDiseno", imagen: nuevoDiseño },
    { id: 3, nombre: "Mis Logos", ruta: "/logos", imagen: misLogos }
  ];

  const [seleccionada, setSeleccionada] = useState(null);

  const handleClick = (accion) => {
    setSeleccionada(accion.id);
  };

  return (
    <>
      <div style={{ marginTop: "85px" }} className="fondo py-5">
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
                    <img
                      src={accion.imagen}
                      className="card-img-top"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain"
                      }}
                    />
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
