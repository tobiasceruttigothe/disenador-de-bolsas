import React, { useState } from 'react'

export default function MenuInformacion({ plantilla }) {
    const [nombre] = useState(plantilla.nombre);
    const [material] = useState(plantilla.materialNombre);
    const [tipoBolsa] = useState(plantilla.tipoBolsaNombre);
    const [ancho] = useState(plantilla.ancho);
    const [alto] = useState(plantilla.alto);
    const [profundidad] = useState(plantilla.profundidad);

    return (
        <div
            className="p-4 bg-white shadow-sm h-100 overflow-auto"
            style={{ borderRight: "1px solid #dee2e6" }}
        >
            <h4 className="mb-4 text-primary fw-bold">
                Información sobre la plantilla
            </h4>

            {/* NOMBRE */}
            <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                    NOMBRE:
                    <span
                        className="ms-1"
                        style={{ textTransform: 'capitalize', fontWeight: 600 }}
                    >
                        {nombre}
                    </span>
                </label>
            </div>

            {/* MATERIAL */}
            <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                    MATERIAL:
                    <span
                        className="ms-1"
                        style={{ textTransform: 'capitalize', fontWeight: 600 }}
                    >
                        {material}
                    </span>
                </label>
            </div>

            {/* TIPO DE BOLSA */}
            <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                    TIPO DE BOLSA:
                    <span
                        className="ms-1"
                        style={{ textTransform: 'capitalize', fontWeight: 600 }}
                    >
                        {tipoBolsa}
                    </span>
                </label>
            </div>

            {/* ANCHO */}
            <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                    ANCHO (cm):
                    <span className="ms-1 fw-semibold">{ancho}</span>
                </label>
            </div>

            {/* ALTO */}
            <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                    ALTO (cm):
                    <span className="ms-1 fw-semibold">{alto}</span>
                </label>
            </div>

            {/* PROFUNDIDAD */}
            <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                    PROFUNDIDAD (cm):
                    <span className="ms-1 fw-semibold">{profundidad}</span>
                </label>
            </div>
        </div>
    );
}
