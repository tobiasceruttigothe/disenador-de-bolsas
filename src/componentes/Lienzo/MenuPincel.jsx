import React, { useState } from "react";

export default function MenuPincel({ activarModoDibujo }) {
    const [color, setColor] = useState("#000000");
    const [grosor, setGrosor] = useState(5);
    const [pincel, setPincel] = useState("PencilBrush");
    const [coloresGuardados, setColoresGuardados] = useState(["#000000", "#016add"]);

    const guardarColorActual = () => {
        if (!coloresGuardados.includes(color)) setColoresGuardados([...coloresGuardados, color]);
    };

    const handleActivar = () => {
        activarModoDibujo({
            color, width: grosor, brush: pincel,
            shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, shadowColor: "#000000"
        });
    };

    return (
        <div className="p-4 bg-white shadow-sm h-100 overflow-auto" style={{ borderRight: "1px solid #dee2e6" }}>
            
            <h4 className="mb-4 text-primary fw-bold">Pincel</h4>

            {/* SECCIÓN DE COLOR CON PALETA */}
            <div className="mb-4 bg-light p-3 rounded border">
                <label className="form-label text-muted small fw-bold mb-2">COLOR</label>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center bg-white p-1 rounded border flex-grow-1">
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} 
                            className="form-control form-control-color border-0 p-0 shadow-none me-2"
                            style={{ width: "35px", height: "35px", cursor: "pointer", backgroundColor: 'transparent' }} />
                        <span className="text-muted small fw-bold text-uppercase">{color}</span>
                    </div>
                    <button className="btn btn-outline-secondary btn-sm" onClick={guardarColorActual} style={{ height: "45px", width: "45px" }}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                
                {/* Paleta */}
                <div className="d-flex flex-wrap gap-2">
                    {coloresGuardados.map((c, idx) => (
                        <div key={idx} onClick={() => setColor(c)} className="rounded-circle border"
                            style={{ width: "25px", height: "25px", backgroundColor: c, cursor: "pointer",
                            boxShadow: color === c ? "0 0 0 2px white, 0 0 0 4px #016add" : "none" }} />
                    ))}
                </div>
            </div>

            <hr className="text-muted opacity-25 my-4" />

            {/* GROSOR */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label text-muted small fw-bold mb-0">GROSOR</label>
                    <span className="badge bg-primary rounded-pill">{grosor}px</span>
                </div>
                <input type="range" className="form-range" min="1" max="50" step="1" value={grosor} onChange={(e) => setGrosor(parseInt(e.target.value, 10))} style={{ cursor: "pointer" }} />
            </div>

            {/* TIPO */}
            <div className="mb-4">
                <label className="form-label text-muted small fw-bold mb-2">ESTILO</label>
                <select value={pincel} onChange={(e) => setPincel(e.target.value)} className="form-select border-light bg-light py-2" style={{ cursor: "pointer" }}>
                    <option value="PencilBrush">✏️ Lápiz Clásico</option>
                    <option value="CircleBrush">⚫ Punteado</option>
                    <option value="SprayBrush">💨 Spray</option>
                    <option value="PatternBrush">▦ Patrón</option>
                </select>
            </div>

            <hr className="text-muted opacity-25 my-4" />

            <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm mb-4" onClick={handleActivar} style={{ backgroundColor: "#016add", borderColor: "#016add" }}>
                <i className="fa fa-paint-brush me-2"></i> Activar Dibujo
            </button>

            {/* VISTA PREVIA */}
            <div className="p-3 bg-light rounded border text-center">
                <small className="text-muted d-block mb-2 text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Vista previa</small>
                <div className="d-flex justify-content-center align-items-center bg-white rounded border" style={{ height: "60px" }}>
                    <div style={{ width: grosor, height: grosor, borderRadius: "50%", backgroundColor: color, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                </div>
            </div>
        </div>
    );
}