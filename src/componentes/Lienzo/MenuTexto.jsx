import React, { useState, useRef } from "react";

export default function MenuTexto({ agregarTexto, objetoSeleccionado, eliminarObjeto }) {
    const [texto, setTexto] = useState("");
    const [color, setColor] = useState("#000000");
    const [fuente, setFuente] = useState("Arial");
    const [tamaño, setTamaño] = useState(30);
    const [coloresGuardados, setColoresGuardados] = useState(["#000000", "#016add"]);

    const inputTextRef = useRef(null);
    const fuentes = ["Arial", "Verdana", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Impact", "Tahoma", "Arial Black"];

    const guardarColorActual = () => {
        if (!coloresGuardados.includes(color)) setColoresGuardados([...coloresGuardados, color]);
    };

    const handleAgregarTexto = () => {
        if (!texto.trim()) return;
        agregarTexto(texto, color, tamaño, fuente);
        setTexto("");
        if (inputTextRef.current) inputTextRef.current.value = "";
    };

    const esTextoSeleccionado = objetoSeleccionado && (objetoSeleccionado.type === 'i-text' || objetoSeleccionado.type === 'text');

    return (
        <div className="p-4 bg-white shadow-sm h-100 overflow-auto" style={{ borderRight: "1px solid #dee2e6" }}>
            
            <h4 className="mb-3 text-primary fw-bold">Agregar Texto</h4>

            <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">CONTENIDO</label>
                <input type="text" className="form-control form-control-sm bg-light border" placeholder="Escribe aquí..." 
                    onChange={(e) => setTexto(e.target.value)} value={texto} ref={inputTextRef} style={{ fontWeight: "500" }} />
            </div>

            {/* SECCIÓN DE COLOR */}
            <div className="mb-3 bg-light p-2 rounded border">
                <label className="form-label text-muted small fw-bold mb-1">COLOR</label>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="d-flex align-items-center bg-white p-1 rounded border flex-grow-1">
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} 
                            className="form-control form-control-color border-0 p-0 shadow-none me-2"
                            style={{ width: "30px", height: "30px", cursor: "pointer", backgroundColor: 'transparent' }} />
                        <span className="text-muted small fw-bold text-uppercase">{color}</span>
                    </div>
                    <button className="btn btn-outline-secondary btn-sm" onClick={guardarColorActual} style={{ height: "38px", width: "38px" }}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {coloresGuardados.map((c, idx) => (
                        <div key={idx} onClick={() => setColor(c)} className="rounded-circle border"
                            style={{ width: "20px", height: "20px", backgroundColor: c, cursor: "pointer",
                            boxShadow: color === c ? "0 0 0 2px white, 0 0 0 3px #016add" : "none" }} />
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">TIPOGRAFÍA</label>
                <select onChange={(e) => setFuente(e.target.value)} className="form-select form-select-sm border-light bg-light" value={fuente} style={{ fontFamily: fuente, cursor: "pointer" }}>
                    {fuentes.map((f, index) => <option key={index} style={{ fontFamily: f }} value={f}>{f}</option>)}
                </select>
            </div>

            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label text-muted small fw-bold mb-0">TAMAÑO</label>
                    <span className="badge bg-primary rounded-pill small">{tamaño}px</span>
                </div>
                <input type="range" className="form-range" min="10" max="100" step="1" value={tamaño} onChange={(e) => setTamaño(parseInt(e.target.value))} style={{ cursor: "pointer" }} />
            </div>

            <hr className="text-muted opacity-25 my-3" />

            {/* VISTA PREVIA (Más chica) */}
            <div className="mb-3 text-center">
                <label className="form-label text-muted small fw-bold mb-1">VISTA PREVIA</label>
                <div className="d-flex justify-content-center align-items-center border rounded bg-white"
                    style={{ 
                        height: "80px", // Reducido de 100px a 80px
                        width: "100%", 
                        padding: "5px", 
                        overflow: "hidden", 
                        backgroundImage: "radial-gradient(#e9ecef 1px, transparent 1px)", 
                        backgroundSize: "10px 10px" 
                    }}>
                    <p style={{ 
                        fontSize: `${Math.min(tamaño, 36)}px`, // Tope visual de 36px para que no rompa la caja chica
                        fontFamily: fuente, 
                        color: color, 
                        margin: 0, 
                        lineHeight: 1, 
                        wordBreak: "break-word", 
                        textAlign: "center",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                        {texto || "Abc"}
                    </p>
                </div>
                {tamaño > 36 && <small className="text-muted" style={{fontSize: '0.65rem'}}>* Tamaño real mayor al mostrado</small>}
            </div>

            <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" onClick={handleAgregarTexto} disabled={!texto.trim()} style={{ backgroundColor: "#016add", borderColor: "#016add", opacity: !texto.trim() ? 0.6 : 1 }}>
                <i className="fa fa-font me-2"></i> Insertar Texto
            </button>

            {esTextoSeleccionado && (
                <div className="mt-4 pt-3 border-top">
                    <div className="p-2 bg-light rounded border border-danger border-opacity-25">
                        <button className="btn btn-outline-danger w-100 fw-bold btn-sm" onClick={eliminarObjeto}>
                            <i className="fa fa-trash-alt me-2"></i> Eliminar Texto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}