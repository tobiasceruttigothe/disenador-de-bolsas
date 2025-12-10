import { useState } from "react";
// Asegúrate de que la ruta de la imagen sea correcta
import imagenAgregarNuevo from '../../assets/agregarLogo.png'; 

export default function MenuLogos({ agregarFoto, setLogosBool, logos }) {

  const handler = (imagen) => {
    const dataUrl = `data:image/png;base64,${imagen}`;
    agregarFoto(dataUrl);
  };

  const handlerNuevo = () => {
    setLogosBool(true);
  };

  return (
    <div className="p-4 bg-white shadow-sm h-100 overflow-auto" style={{ borderRight: "1px solid #dee2e6" }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-primary fw-bold">Mis Logos</h4>
        <span className="badge bg-light text-muted border">{logos.length} disponibles</span>
      </div>

      <div className="mb-3 text-muted small">
        <i className="fa fa-info-circle me-1"></i>
        Haz clic en un logo para añadirlo al diseño.
      </div>

      <hr className="text-muted opacity-25 mb-4" />

      {/* GRID RESPONSIVE */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
        gap: "15px",
        width: "100%"
      }}>
        
        {/* TARJETA: AGREGAR NUEVO */}
        <button
          onClick={handlerNuevo}
          className="btn btn-outline-primary d-flex flex-column align-items-center justify-content-center p-3"
          style={{
            border: "2px dashed #016add",
            borderRadius: "12px",
            height: "110px",
            backgroundColor: "#f8f9fa",
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e7f1ff";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="mb-2 text-primary">
            <i className="fa fa-plus-circle fa-2x"></i>
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Nuevo Logo</span>
        </button>

        {/* TARJETAS: LOGOS EXISTENTES */}
        {logos.map((l, index) => (
          <button
            key={l.id || index}
            onClick={() => handler(l.base64Logo)}
            className="btn btn-outline-light text-dark p-2 d-flex flex-column align-items-center justify-content-center"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              height: "110px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              transition: "all 0.2s ease",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(1, 106, 221, 0.15)";
              e.currentTarget.style.borderColor = "#016add";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
              e.currentTarget.style.borderColor = "#e9ecef";
            }}
            title={l.nombre || `Logo ${index + 1}`}
          >
            <div 
              className="d-flex align-items-center justify-content-center mb-2" 
              style={{ width: "100%", height: "60px" }}
            >
              <img
                src={`data:image/png;base64,${l.base64Logo}`}
                alt={l.nombre}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
            
            <span 
              className="text-truncate w-100 text-center" 
              style={{ fontSize: "0.75rem", color: "#6c757d", fontWeight: "500" }}
            >
              {l.nombre || `Logo ${index + 1}`}
            </span>
          </button>
        ))}

      </div>
    </div>
  );
}