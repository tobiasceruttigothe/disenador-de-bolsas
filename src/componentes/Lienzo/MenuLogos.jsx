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
    <div style={{ maxHeight: "100%" }} className="p-4 card-diseno shadow-sm h-100 overflow-auto">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 text-primary fw-bold">Mis Logos</h4>
        <span className="badge text-muted border">{logos.length} disponibles</span>
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
        <div
          role="button"
          onClick={handlerNuevo}
          className="btn-crear-diseno d-flex flex-column align-items-center justify-content-center p-3"
        >
          <div className="mb-2 text-primary">
            <i className="fa fa-plus-circle fa-2x"></i>
          </div>
          <span className="texto-nuevo-logo">Nuevo Logo</span>
        </div>


        {/* TARJETAS: LOGOS EXISTENTES */}
        {logos.map((l, index) => (
          <button
            key={l.id || index}
            onClick={() => handler(l.base64Logo)}
            className="card-opcion-lienzo d-flex flex-column align-items-center justify-content-center p-3"
            title={l.nombre || `Logo ${index + 1}`}
          >
            <div
              className="d-flex align-items-center justify-content-center"
            >
              <img
                src={`data:image/png;base64,${l.base64Logo}`}
                alt={l.nombre}
                style={{
                  maxWidth: "60px",
                  maxHeight: "60px",
                  objectFit: "contain"
                }}
              />
            </div>

            <span
              className="text-truncate w-100 text-center"
              style={{ fontSize: "1rem", fontWeight: "500" }}
            >
              {l.nombre || `Logo ${index + 1}`}
            </span>
          </button>
        ))}

      </div>
    </div>
  );
}