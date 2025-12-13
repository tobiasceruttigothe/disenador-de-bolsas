import React, { useState, useRef } from "react";

export default function MenuImagen({ agregarFoto }) {
    const [imagen, setImagen] = useState(null);
    const inputImgRef = useRef(null);

    const handleAddImagen = () => {
        if (!imagen) return;
        agregarFoto(imagen);
        setImagen(null);
        if (inputImgRef.current) inputImgRef.current.value = null;
    };

    const onChangeImagen = (e) => {
        let file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImagen(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-4 card-diseno shadow-sm h-100 overflow-auto">
            
            <h4 className="mb-4 text-primary fw-bold">Agregar Imagen</h4>

            <div className="mb-4">
                <label className="form-label text-muted small fw-bold">SUBIR ARCHIVO</label>
                <div className="d-grid gap-2">
                    <input 
                        id="inputArchivo" 
                        accept='.jpg, .jpeg, .png' 
                        type="file" 
                        className="form-control archivo-input" 
                        onChange={onChangeImagen} 
                        ref={inputImgRef} 
                    />
                    <div className="form-text small text-muted">
                        Formatos soportados: JPG, JPEG, PNG.
                    </div>
                </div>
            </div>

            <hr className="text-muted opacity-25 my-4" />

            {/* VISTA PREVIA */}
            {imagen ? (
                <div className="mb-4">
                    <label className="form-label text-muted small fw-bold mb-2">VISTA PREVIA</label>
                    <div 
                        className="d-flex justify-content-center align-items-center p-3"
                        style={{ minHeight: "150px" }}
                    >
                        <img 
                            src={imagen} 
                            alt="Vista previa" 
                            style={{ 
                                maxWidth: "100%", 
                                maxHeight: "200px", 
                                objectFit: "contain",
                                borderRadius: "4px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                            }} 
                        />
                    </div>
                </div>
            ) : (
                <div className="fondo-menu mb-4 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "150px", color: "#6c757d" }}>
                    <i className="fa fa-image fs-3 mb-2 d-block opacity-50"></i>
                    No hay imagen seleccionada
                </div>
            )}

            {/* BOTÓN DE ACCIÓN */}
            <button 
                className="btn btn-primary w-100 py-2 fw-bold shadow-sm mt-3"
                onClick={handleAddImagen}
                disabled={!imagen}
                style={{
                    backgroundColor: "#016add",
                    borderColor: "#016add",
                    opacity: !imagen ? 0.6 : 1
                }}
            >
                <i className="fa fa-plus-circle me-2"></i> Añadir al Diseño
            </button>

        </div>
    );
}