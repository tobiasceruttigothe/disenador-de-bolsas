import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// IMPORTANTE: Verifica nombres de archivos
import bolsa from "../../assets/pack designer final.png";
import disenador from "../../assets/iconos_inicio/Reg_disenador.png";
import admin from "../../assets/iconos_inicio/Reg_adm_gerencial.png";
import cliente from "../../assets/iconos_inicio/Reg_cliente.png";

export default function InicioAdmin() {
  const acciones = [
    { id: 1, nombre: "Administrar Diseñadores", ruta: "/disenadores", imagen: disenador },
    { id: 2, nombre: "Administrar Clientes", ruta: "/clientes", imagen: cliente },
    { id: 3, nombre: "Administrar Gerentes", ruta: "/admins", imagen: admin },
    { id: 4, nombre: "Administrar Productos", ruta: "/productos", imagen: bolsa },
  ];

  const [hovered, setHovered] = useState(null);
  const primaryColor = "#016add";

  return (
    // CAMBIO AQUÍ: 'fondo' recuperado
    <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container">
        
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Panel de Administración</h2>
          <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
        </div>

        <div className="row justify-content-center g-4">
          {acciones.map((accion) => (
            <div key={accion.id} className="col-12 col-sm-6 col-lg-3">
              <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                <div
                  className="card h-100 border-0 shadow-sm text-center py-4 px-2"
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: hovered === accion.id ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: hovered === accion.id ? "0 12px 24px rgba(1, 106, 221, 0.12)" : "0 4px 6px rgba(0,0,0,0.04)",
                    borderRadius: "16px",
                    backgroundColor: "#fff"
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    
                    <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: "90px" }}>
                      <img
                        src={accion.imagen}
                        alt={accion.nombre}
                        className="img-fluid"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                          filter: hovered === accion.id ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))" : "none",
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>

                    <h6 className="fw-bold mb-3 px-2" style={{ color: "#333", minHeight: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {accion.nombre}
                    </h6>

                    <button 
                      className="btn btn-sm px-4 py-2 rounded-pill fw-bold"
                      style={{
                        backgroundColor: hovered === accion.id ? primaryColor : "transparent",
                        color: hovered === accion.id ? "#fff" : primaryColor,
                        border: `2px solid ${primaryColor}`,
                        transition: "all 0.3s ease",
                        width: "100%"
                      }}
                    >
                      Gestionar
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