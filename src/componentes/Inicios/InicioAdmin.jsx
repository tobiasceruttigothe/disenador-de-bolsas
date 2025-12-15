import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// IMPORTANTE: Verifica rutas de imágenes
import bolsa from "../../assets/pack designer final.png";
import disenador from "../../assets/iconos_inicio/Reg_disenador.png";
import admin from "../../assets/iconos_inicio/Reg_adm_gerencial.png";
import cliente from "../../assets/iconos_inicio/Reg_cliente.png";
import grupoUsuarios from "../../assets/iconos_inicio/Reg_adm_gerencial.png";
import seguimiento from "../../assets/iconos_inicio/Seguimiento.png"
import panel_sistema from "../../assets/iconos_inicio/panel_de_sistema.png"

export default function InicioAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const [mostrarUsuarios, setMostrarUsuarios] = useState(location.state?.vistaUsuarios || false);
  const [mostrarSistema, setMostrarSistema] = useState(location.state?.vistaSistema || false);

  const primaryColor = "#016add";

  useEffect(() => {
    if (location.state?.vistaUsuarios) {
      setMostrarUsuarios(true);
    }
    if (location.state?.vistaSistema) {
      setMostrarSistema(true);
    }
  }, [location]);

  const opcionesPrincipales = [
    {
      id: 'sistema',
      nombre: "Panel de Sistema",
      imagen: panel_sistema,
      esGrupo: "sistema"
    },
    {
      id: 'usuarios',
      nombre: "Panel de Usuarios",
      imagen: grupoUsuarios,
      esGrupo: "usuarios"
    }
  ];

  const opcionesUsuarios = [
    { id: 1, nombre: "Diseñadores", ruta: "/disenadores", imagen: disenador },
    { id: 2, nombre: "Clientes", ruta: "/clientes", imagen: cliente },
    { id: 3, nombre: "Gerentes", ruta: "/gerentes", imagen: admin },
  ];

  const opcionesSistema = [
    { id: 1, nombre: "Panel de Productos", ruta: "/productos", imagen: bolsa },
    { id: 2, nombre: "Seguimiento de Diseños", ruta: "/seguimiento", imagen: seguimiento },
  ]

  const handleNavigation = (opcion) => {
    if (opcion.esGrupo === "usuarios") {
      setMostrarUsuarios(true);
      setMostrarSistema(false)
    } else if (opcion.esGrupo === "sistema") {
      setMostrarSistema(true);
      setMostrarUsuarios(false);
    }
    else {
      navigate(opcion.ruta);
    }
  };

  const volverAlMenuPrincipal = () => {
    setMostrarUsuarios(false);
    setMostrarSistema(false)
    navigate(".", { state: {} });
  };

  return (
    <>
      {(mostrarUsuarios || mostrarSistema) && (
        <button
          className="boton-atras d-flex align-items-center justify-content-center"
          onClick={volverAlMenuPrincipal}
        >
          ←
        </button>
      )}

      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">
              {mostrarUsuarios
                ? "Panel de Usuarios"
                : mostrarSistema
                  ? "Panel de Sistema"
                  : "Panel de Administración"}
            </h2>
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

            {/* OPCIONES PRINCIPALES */}
            {!mostrarUsuarios && !mostrarSistema && opcionesPrincipales.map((accion) => (
              <div key={accion.id} className="col-12 col-md-5 col-lg-4">
                <div
                  onClick={() => handleNavigation(accion)}
                  className={`card h-100 text-center py-4 px-2 card-opcion ${hovered === accion.id ? "hovered" : ""}`}
                  onMouseEnter={() => setHovered(accion.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <div
                      className="mb-4 d-flex align-items-center justify-content-center"
                      style={{ height: "100px" }}
                    >
                      <img
                        src={accion.imagen}
                        alt={accion.nombre}
                        className="img-fluid"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                          filter: hovered === accion.id ? "brightness(1.1)" : "none", // 🔥 SIN DROP-SHADOW
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>
                    <h3 className="titulo">{accion.nombre}</h3>
                  </div>
                </div>
              </div>
            ))}

            {mostrarSistema && opcionesSistema.map((accion) => (
              <div key={accion.id} className="col-12 col-sm-6 col-lg-3">
                <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                  <div
                    className={`card h-100 text-center py-4 px-2 card-opcion ${hovered === accion.id ? "hovered" : ""}`}
                    onMouseEnter={() => setHovered(accion.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate(accion)}
                  >
                    <div className="card-body d-flex flex-column align-items-center">
                      <div className="mb-3 d-flex align-items-center" style={{ height: "90px" }}>
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
                      <h3
                        className="fw-bold mb-3 px-2 text-center"
                        style={{
                          minHeight: "65px",   // 👈 reserva espacio
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {accion.nombre}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {mostrarUsuarios && opcionesUsuarios.map((accion) => (
              <div key={accion.id} className="col-12 col-sm-6 col-lg-3">
                <Link to={accion.ruta} style={{ textDecoration: 'none' }}>
                  <div
                    className={`card h-100 text-center py-4 px-2 card-opcion ${hovered === accion.id ? "hovered" : ""}`}
                    onMouseEnter={() => setHovered(accion.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate(accion)}
                  >
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                      <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: "90px" }}>
                        <img
                          src={accion.imagen}
                          alt={accion.nombre}
                          className="img-fluid"
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "contain",
                            filter: hovered === accion.id ? "brightness(1.1)" : "none", // 🔥 SIN DROP-SHADOW
                            transition: "all 0.3s ease"
                          }}
                        />
                      </div>
                      <h3 className="fw-bold mb-3 px-2" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
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
    </>
  );
}
