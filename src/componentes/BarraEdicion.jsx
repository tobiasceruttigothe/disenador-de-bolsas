import React from 'react';

export default function BarraEdicion({ objetoSeleccionado, eliminarObjeto, deseleccionarObjeto }) {
    if (!objetoSeleccionado) return null; // Si no hay nada seleccionado, no se muestra nada

    // Determinar el nombre amigable del objeto
    const getNombreObjeto = () => {
        if (!objetoSeleccionado.type) return "Objeto";
        const tipo = objetoSeleccionado.type;
        if (tipo === 'i-text' || tipo === 'text') return "Texto";
        if (tipo === 'image') return "Imagen / Dibujo";
        if (tipo === 'rect') return "Rectángulo";
        if (tipo === 'circle') return "Círculo";
        if (tipo === 'triangle') return "Triángulo";
        if (tipo === 'path') return "Trazo / Forma";
        if (tipo === 'line') return "Línea";
        return "Elemento";
    };

    return (
        <div 
            className="position-absolute start-50 translate-middle-x bg-white shadow-lg d-flex align-items-center gap-3 px-4 py-2 rounded-pill"
            style={{ 
                bottom: "30px", // Flota en la parte inferior
                zIndex: 1000,
                border: "1px solid #e0e0e0",
                animation: "fadeIn 0.3s ease-out"
            }}
        >
            {/* Indicador del objeto */}
            <div className="d-flex align-items-center gap-2 text-muted border-end pe-3">
                <i className="fa fa-mouse-pointer small"></i>
                <span className="fw-bold small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    {getNombreObjeto()}
                </span>
            </div>

            {/* Acciones */}
            <div className="d-flex gap-2">
                <button 
                    onClick={eliminarObjeto}
                    className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}
                    title="Eliminar (Supr)"
                >
                    <i className="fa fa-trash"></i>
                </button>

                <button 
                    onClick={deseleccionarObjeto}
                    className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}
                    title="Cerrar selección"
                >
                    <i className="fa fa-times"></i>
                </button>
            </div>

            {/* Estilo para la animación de entrada */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
}