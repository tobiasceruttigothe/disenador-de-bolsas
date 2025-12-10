import React, { useState } from 'react';

export default function MenuForma({ agregarCuadrado, agregarCirculo, agregarTriangulo, agregarRectangulo, agregarEstrella, agregarLinea }) {
  const [color, setColor] = useState("#000000");
  // Estado para guardar colores favoritos (iniciamos con negro y el azul corporativo)
  const [coloresGuardados, setColoresGuardados] = useState(["#000000", "#016add", "#dc3545", "#ffc107"]);

  const guardarColorActual = () => {
    if (!coloresGuardados.includes(color)) {
      setColoresGuardados([...coloresGuardados, color]);
    }
  };

  const borrarColor = (colorABorrar, e) => {
    e.stopPropagation(); // Evitar que se seleccione al borrar
    setColoresGuardados(coloresGuardados.filter(c => c !== colorABorrar));
  };

  // Iconos SVG dinámicos
  const formas = [
    {
      id: 1, name: "Cuadrado",
      icon: (c) => <svg viewBox="0 0 24 24" width="40" height="40" stroke={c} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>,
      handler: () => agregarCuadrado(color)
    },
    {
      id: 2, name: "Círculo",
      icon: (c) => <svg viewBox="0 0 24 24" width="40" height="40" stroke={c} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>,
      handler: () => agregarCirculo(color)
    },
    {
      id: 3, name: "Triángulo",
      icon: (c) => <svg viewBox="0 0 24 24" width="40" height="40" stroke={c} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 20h20L12 3z"></path></svg>,
      handler: () => agregarTriangulo(color)
    },
    {
      id: 4, name: "Rectángulo",
      icon: (c) => <svg viewBox="0 0 24 24" width="40" height="40" stroke={c} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect></svg>,
      handler: () => agregarRectangulo(color)
    },
    {
      id: 5, name: "Estrella",
      icon: (c) => <svg viewBox="0 0 24 24" width="40" height="40" stroke={c} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
      handler: () => agregarEstrella(color)
    },
    {
      id: 6, name: "Línea",
      icon: (c) => <svg viewBox="0 0 24 24" width="40" height="40" stroke={c} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="20" x2="20" y2="4"></line></svg>,
      handler: () => agregarLinea(color)
    },
  ];

  return (
    <div className="p-4 bg-white shadow-sm h-100 overflow-auto" style={{ borderRight: "1px solid #dee2e6" }}>
      
      <h4 className="mb-4 text-primary fw-bold">Formas Geométricas</h4>

      {/* SECCIÓN DE COLOR CON PALETA */}
      <div className="mb-4 bg-light p-3 rounded border">
        <label className="form-label text-muted small fw-bold mb-2">COLOR DEL TRAZO</label>
        
        {/* Selector y Botón Guardar */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="d-flex align-items-center bg-white p-1 rounded border flex-grow-1">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)} 
              className="form-control form-control-color border-0 p-0 shadow-none me-2"
              style={{ width: "35px", height: "35px", cursor: "pointer", backgroundColor: 'transparent' }}
            />
            <span className="text-muted small fw-bold text-uppercase">{color}</span>
          </div>
          
          <button 
            className="btn btn-outline-secondary btn-sm" 
            onClick={guardarColorActual}
            title="Guardar este color en mi paleta"
            style={{ height: "45px", width: "45px" }}
          >
            <i className="fa fa-plus"></i>
          </button>
        </div>

        {/* Paleta de Colores Guardados */}
        {coloresGuardados.length > 0 && (
          <div>
            <label className="form-label text-muted small fw-bold mb-1" style={{fontSize: '0.7rem'}}>MIS COLORES</label>
            <div className="d-flex flex-wrap gap-2">
              {coloresGuardados.map((c, idx) => (
                <div 
                  key={idx}
                  onClick={() => setColor(c)}
                  className="rounded-circle border position-relative"
                  style={{ 
                    width: "25px", 
                    height: "25px", 
                    backgroundColor: c, 
                    cursor: "pointer",
                    boxShadow: color === c ? "0 0 0 2px white, 0 0 0 4px #016add" : "none", // Resaltar seleccionado
                    transition: "transform 0.1s"
                  }}
                  title={c}
                  onContextMenu={(e) => { e.preventDefault(); borrarColor(c, e); }} // Click derecho borra
                />
              ))}
            </div>
            <small className="text-muted d-block mt-2" style={{fontSize: '0.65rem'}}>* Click para usar, Click derecho para borrar.</small>
          </div>
        )}
      </div>

      <hr className="text-muted opacity-25 my-4" />

      {/* GRID DE FORMAS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: "15px",
        width: "100%"
      }}>
        {formas.map((f) => (
          <button
            key={f.id}
            onClick={f.handler}
            className="btn btn-outline-light text-dark p-3 d-flex flex-column align-items-center justify-content-center"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              height: "100px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              transition: "all 0.2s ease"
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
          >
            <div className="mb-2 transition-all">
              {f.icon(color)}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#495057" }}>{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}