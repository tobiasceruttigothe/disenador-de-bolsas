import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// IMPORTANTE: Verifica rutas de imágenes
import bolsa from "../../assets/pack designer final.png";
import disenador from "../../assets/iconos_inicio/Reg_disenador.png";
import admin from "../../assets/iconos_inicio/Reg_adm_gerencial.png";
import cliente from "../../assets/iconos_inicio/Reg_cliente.png";
import grupoUsuarios from "../../assets/iconos_inicio/Reg_adm_gerencial.png"; 

export default function InicioAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  
  const [mostrarUsuarios, setMostrarUsuarios] = useState(location.state?.vistaUsuarios || false);
  const primaryColor = "#016add";

  useEffect(() => {
    if (location.state?.vistaUsuarios) {
      setMostrarUsuarios(true);
    }
  }, [location]);

  const opcionesPrincipales = [
    { 
      id: 'productos', 
      nombre: "Administrar Productos", 
      ruta: "/productos", 
      imagen: bolsa,
      esGrupo: false 
    },
    { 
      id: 'usuarios', 
      nombre: "Administrar Usuarios", 
      imagen: grupoUsuarios,
      esGrupo: true 
    }
  ];

  const opcionesUsuarios = [
    { id: 1, nombre: "Diseñadores", ruta: "/disenadores", imagen: disenador },
    { id: 2, nombre: "Clientes", ruta: "/clientes", imagen: cliente },
    { id: 3, nombre: "Gerentes", ruta: "/admins", imagen: admin },
  ];

  const handleNavigation = (opcion) => {
    if (opcion.esGrupo) {
      setMostrarUsuarios(true);
    } else {
      navigate(opcion.ruta);
    }
  };

  const volverAlMenuPrincipal = () => {
    setMostrarUsuarios(false);
    navigate(".", { state: {} }); 
  };

  return (
    <>
      {mostrarUsuarios && (
        <button
          className="align-items-center d-flex justify-content-center"
          style={{
            position: "fixed", top: "9vh", left: "3vw", width: "70px", height: "40px",
            padding: "10px", backgroundColor: "white", color: "#016add",
            border: "1px solid #016add", borderRadius: "7px", zIndex: 1000
          }}
          onClick={volverAlMenuPrincipal}
        >
          ←
        </button>
      )}

      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
        <div className="container">
          
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">
              {mostrarUsuarios ? "Panel de Sistema" : "Panel de Administración"}
            </h2>
            <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
          </div>

          <div className="row justify-content-center g-4 animate-fade-in">
            
            {!mostrarUsuarios && opcionesPrincipales.map((accion) => (
              <div key={accion.id} className="col-12 col-md-5 col-lg-4">
                <div
                  className="card h-100 text-center py-5 px-3"
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleNavigation(accion)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: hovered === accion.id ? "translateY(-8px)" : "translateY(0)",
                    borderRadius: "16px",
                    backgroundColor: "#fff", 
                    // CAMBIO AQUÍ: Borde sólido y visible por defecto
                    border: hovered === accion.id ? `2px solid ${primaryColor}` : "1px solid #dee2e6",
                    // Sombra sutil para dar volumen
                    boxShadow: hovered === accion.id ? "0 10px 25px rgba(1, 106, 221, 0.15)" : "0 2px 5px rgba(0,0,0,0.05)"
                  }}
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
                          filter: hovered === accion.id ? "brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.1))" : "none",
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: "#333" }}>{accion.nombre}</h4>
                  </div>
                </div>
              </div>
            ))}

            {mostrarUsuarios && (
              <>
                {opcionesUsuarios.map((accion) => (
                  <div key={accion.id} className="col-12 col-sm-6 col-lg-3">
                    <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                      <div
                        className="card h-100 text-center py-4 px-2"
                        onMouseEnter={() => setHovered(accion.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          transform: hovered === accion.id ? "translateY(-8px)" : "translateY(0)",
                          borderRadius: "16px",
                          backgroundColor: "#fff",
                          // CAMBIO AQUÍ: Borde sólido y visible por defecto
                          border: hovered === accion.id ? `2px solid ${primaryColor}` : "1px solid #dee2e6",
                          // Sombra sutil para dar volumen
                          boxShadow: hovered === accion.id ? "0 10px 25px rgba(1, 106, 221, 0.15)" : "0 2px 5px rgba(0,0,0,0.05)"
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
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}