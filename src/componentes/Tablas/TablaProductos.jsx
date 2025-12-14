import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import materiales from "../../assets/iconos_inicio/Adm_materiales.png";
import tipoBolsa from "../../assets/iconos_inicio/Adm_tipos_bolsa.png";
import plantillas from "../../assets/iconos_inicio/Adm_plantillas.png";

import "../../index.css";
import "../../styles/main.css";

export default function TablaProductos() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const primaryColor = "#016add";

  const acciones = [
    { id: 1, nombre: "Materiales", ruta: "/productos/materiales", imagen: materiales },
    { id: 2, nombre: "Plantillas", ruta: "/productos/plantillas", imagen: plantillas },
    { id: 3, nombre: "Tipos de Producto", ruta: "/productos/tiposbolsa", imagen: tipoBolsa },
  ];

  return (
    <>
      {/* BOTÓN VOLVER */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>

      {/* CONTENIDO PRINCIPAL */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Administrar Productos</h2>
            <div
              className="mx-auto"
              style={{
                width: "60px",
                height: "4px",
                backgroundColor: primaryColor,
                borderRadius: "2px"
              }}
            ></div>
          </div>

          <div className="row justify-content-center g-4 animate-fade-in">

            {acciones.map((accion) => (
              <div key={accion.id} className="col-12 col-sm-6 col-md-4">
                <div
                  className={`card h-100 text-center py-4 px-2 card-opcion ${hovered === accion.id ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => navigate(accion.ruta)}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">

                    <div className="mb-4 d-flex align-items-center justify-content-center" style={{ height: "100px" }}>
                      <img
                        src={accion.imagen}
                        alt={accion.nombre}
                        className="img-fluid"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "contain",
                          filter: hovered === accion.id ? "brightness(1.1)" : "none",
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>

                    <h3 className="titulo">{accion.nombre}</h3>

                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
}
