import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// IMPORTANTE: Verifica nombres de archivos
import misLogos from "../../assets/iconos_inicio/Mis_logos.png";
import nuevoDiseño from "../../assets/iconos_inicio/Nuevo_diseño.png";
import misDiseños from "../../assets/iconos_inicio/Mis_disenos.png";

export default function InicioCliente() {
  const acciones = [
    { id: 1, nombre: "Mis Diseños", ruta: "/disenos", imagen: misDiseños },
    { id: 2, nombre: "Nuevo Diseño", ruta: "/nuevoDiseno", imagen: nuevoDiseño },
    { id: 3, nombre: "Mis Logos", ruta: "/logos", imagen: misLogos }
  ];

  const [hovered, setHovered] = useState(null);
  const primaryColor = "#016add";

  return (
    <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container">
        
        {/* Encabezado */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Panel de Cliente</h2>
          <p className="text-muted">Gestiona tus proyectos y recursos</p>
          <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
        </div>

        <div className="row justify-content-center g-4 animate-fade-in">
          {acciones.map((accion) => (
            <div key={accion.id} className="col-12 col-sm-6 col-lg-4">
              <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                <div
                  className={`card h-100 text-center py-4 px-2 card-opcion ${hovered === accion.id ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
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

                    <h3 className="titulo">
                      {accion.nombre}
                    </h3>
                    
                    

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