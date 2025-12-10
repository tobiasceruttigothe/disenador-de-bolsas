import React from "react";
import { useNavigate } from "react-router-dom";
import materiales from "../../assets/iconos_inicio/Adm_materiales.png";
import tipoBolsa from "../../assets/iconos_inicio/Adm_tipos_bolsa.png";
import plantillas from "../../assets/iconos_inicio/Adm_plantillas.jpg";

// Estilos
import "../../index.css";
import "../../styles/main.css";

export default function TablaProductos() {
  const navigate = useNavigate();
  const acciones = [
    { id: 1, nombre: "Administrar Materiales", ruta: "/productos/materiales", imagen: materiales },
    { id: 2, nombre: "Administrar Plantillas", ruta: "/productos/plantillas", imagen: plantillas },
    { id: 3, nombre: "Administrar Tipos de Bolsa", ruta: "/productos/tiposbolsa", imagen: tipoBolsa },
  ];

  const primaryColor = "#016add";

  return (
    <>
      {/* Botón Volver ORIGINAL */}
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed",
          top: "9vh",
          left: "3vw",
          width: "70px",
          height: "40px",
          padding: "10px",
          backgroundColor: "white",
          color: "#016add",
          border: "1px solid #016add",
          borderRadius: "7px",
          zIndex: 1000
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>

      {/* Contenedor con FONDO */}
      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Gestión de Productos</h2>
            <p className="text-muted">Administra los recursos base para los diseños</p>
            <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
          </div>

          <div className="row justify-content-center g-4">
            {acciones.map((accion) => (
              <div key={accion.id} className="col-12 col-sm-6 col-md-4">
                <div 
                  className="card h-100 border-0 shadow-sm text-center py-5 px-3"
                  style={{ borderRadius: "16px", cursor: "pointer", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                  onClick={() => navigate(accion.ruta)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 15px 30px rgba(1, 106, 221, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    
                    <div 
                      className="mb-4 d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: "130px", height: "130px", backgroundColor: "#f8f9fa" }}
                    >
                      <img
                        src={accion.imagen}
                        alt={accion.nombre}
                        className="img-fluid"
                        style={{ width: "80px", height: "80px", objectFit: "contain" }}
                      />
                    </div>

                    <h5 className="fw-bold mb-3 text-dark">
                      {accion.nombre}
                    </h5>

                    <button 
                      className="btn px-4 py-2 rounded-pill fw-bold"
                      style={{
                        color: primaryColor,
                        border: `2px solid ${primaryColor}`,
                        backgroundColor: "transparent",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor;
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = primaryColor;
                      }}
                    >
                      Gestionar
                    </button>
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