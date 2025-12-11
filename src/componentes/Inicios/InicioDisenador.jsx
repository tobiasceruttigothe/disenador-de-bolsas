import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// IMPORTANTE: Verifica nombres de archivos
import nuevoDiseño from "../../assets/iconos_inicio/Nuevo_diseño-logo.png";
import misDiseños from "../../assets/iconos_inicio/Mis_disenos.png"; 
import consultarClientes from "../../assets/iconos_inicio/Consultar_clientes.png"; 

export default function InicioDisenador() {
  const acciones = [
    { id: 1, nombre: "Ver Clientes", ruta: "/verClientes", imagen: consultarClientes },
    { id: 2, nombre: "Mis Diseños", ruta: "/disenos", imagen: misDiseños },
    { id: 3, nombre: "Crear Diseño", ruta: "/nuevoDiseno", imagen: nuevoDiseño },
  ];

  const [hovered, setHovered] = useState(null);
  const primaryColor = "#016add";

  return (
    <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container">
        
        {/* Encabezado */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Panel de Diseño</h2>
          <p className="text-muted">Herramientas creativas y gestión de proyectos</p>
          <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
        </div>

        <div className="row justify-content-center g-4 animate-fade-in">
          {acciones.map((accion) => (
            <div key={accion.id} className="col-12 col-sm-6 col-lg-4">
              <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                <div
                  className="card h-100 text-center py-5 px-3"
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: hovered === accion.id ? "translateY(-8px)" : "translateY(0)",
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    // Borde gris suave visible por defecto (#dee2e6), Azul sólido al hover
                    border: hovered === accion.id ? `2px solid ${primaryColor}` : "1px solid #dee2e6",
                    // Sombra sutil por defecto, Resplandor al hover
                    boxShadow: hovered === accion.id ? "0 10px 25px rgba(1, 106, 221, 0.15)" : "0 2px 5px rgba(0,0,0,0.05)"
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    
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

                    <h4 className="fw-bold mb-3" style={{ color: "#333" }}>
                      {accion.nombre}
                    </h4>
                    
                    

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