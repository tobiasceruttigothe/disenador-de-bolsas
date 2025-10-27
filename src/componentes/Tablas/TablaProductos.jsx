import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bolsa from "../../assets/pack designer final.png";

export default function TablaProductos({ }) {
  const acciones = [
    { id: 1, nombre: "Administrar materiales", ruta: "/productos/materiales", imagen: bolsa },
    { id: 2, nombre: "Administrar plantillas", ruta: "/productos/plantillas", imagen: bolsa },
    { id: 3, nombre: "Administrar tipos de bolsa", ruta: "/productos/tiposbolsa", imagen: bolsa },
  ];

  return (
    <>
      <div className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h2>Administrar productos</h2>
            <hr />
            <div className="row justify-content-center">
              {acciones.map((accion) => (
                <div key={accion.id} className="col-12 col-sm-6 col-md-4 mb-3">
                  <a href={accion.ruta} style={{ textDecoration: 'none' }}>
                    <div
                      className={`card card-accion text-center py-4`}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={accion.imagen} className="card-img-top" />
                      <button className="btn btn-primary mt-3 w-75">
                        {accion.nombre}
                      </button>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
