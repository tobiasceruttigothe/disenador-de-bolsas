import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// IMPORTANTE: Verifica nombres de archivos
import nuevoDiseño from "../../assets/iconos_inicio/Nuevo_diseño-logo.png";
import misDiseños from "../../assets/iconos_inicio/Mis_disenos.png"; 
import consultarClientes from "../../assets/iconos_inicio/Consultar_clientes.png"; 

export default function InicioDisenador() {
  const acciones = [
    { id: 1, nombre: "Ver Clientes", ruta: "/verClientes", imagen: consultarClientes },
    { id: 2, nombre: "Mis diseños", ruta: "/disenos", imagen: misDiseños },
    { id: 3, nombre: "Crear diseño", ruta: "/nuevoDiseno", imagen: nuevoDiseño },
  ];

  const [hovered, setHovered] = useState(null);
  const primaryColor = "#016add";

  return (
    // CAMBIO AQUÍ: Reemplacé 'bg-light' por 'fondo' para recuperar los círculos
    <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container">
        
        {/* Encabezado */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Panel de Diseño</h2>
          <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
        </div>

        <div className="row justify-content-center g-4">
          {acciones.map((accion) => (
            <div key={accion.id} className="col-12 col-sm-6 col-lg-4">
              <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                <div
                  className="card h-100 border-0 shadow-sm text-center py-5 px-3"
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: hovered === accion.id ? "translateY(-10px)" : "translateY(0)",
                    boxShadow: hovered === accion.id ? "0 15px 30px rgba(1, 106, 221, 0.15)" : "0 4px 6px rgba(0,0,0,0.05)",
                    borderRadius: "16px",
                    backgroundColor: "#fff" // Las tarjetas siguen blancas para resaltar sobre el fondo
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    
                    {/* Imagen sin círculo de fondo */}
                    <div className="mb-4 d-flex align-items-center justify-content-center" style={{ height: "120px" }}>
                      <img
                        src={accion.imagen}
                        alt={accion.nombre}
                        className="img-fluid"
                        style={{
                          width: "100px", 
                          height: "100px",
                          objectFit: "contain",
                          filter: hovered === accion.id ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))" : "none",
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>

                    <h5 className="fw-bold mb-3" style={{ color: "#333" }}>
                      {accion.nombre}
                    </h5>

                    <button 
                      className="btn px-4 py-2 rounded-pill fw-bold"
                      style={{
                        backgroundColor: hovered === accion.id ? primaryColor : "transparent",
                        color: hovered === accion.id ? "#fff" : primaryColor,
                        border: `2px solid ${primaryColor}`,
                        transition: "all 0.3s ease",
                        width: "80%"
                      }}
                    >
                      Ingresar
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}