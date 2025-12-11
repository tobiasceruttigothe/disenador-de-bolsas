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
    { id: 1, nombre: "Materiales", ruta: "/productos/materiales", imagen: materiales },
    { id: 2, nombre: "Plantillas", ruta: "/productos/plantillas", imagen: plantillas },
    { id: 3, nombre: "Tipos de Bolsa", ruta: "/productos/tiposbolsa", imagen: tipoBolsa },
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
            <h2 className="fw-bold text-dark">Administrar Productos</h2>
            <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }}></div>
          </div>

          <div className="row justify-content-center g-4 animate-fade-in">
            {acciones.map((accion) => (
              <div key={accion.id} className="col-12 col-sm-6 col-md-4">
                <div 
                  className="card h-100 text-center py-5 px-3"
                  style={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: "#fff",
                    border: "1px solid #dee2e6", // Borde suave por defecto
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                  }}
                  onClick={() => navigate(accion.ruta)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(1, 106, 221, 0.15)";
                    e.currentTarget.style.border = `1px solid ${primaryColor}`; // Borde azul al hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
                    e.currentTarget.style.border = "1px solid #dee2e6";
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
                          transition: "all 0.3s ease" 
                        }}
                      />
                    </div>

                    <h4 className="fw-bold mb-3 text-dark">
                      {accion.nombre}
                    </h4>
                    
                    

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