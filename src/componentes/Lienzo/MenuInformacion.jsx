import React, { useState, useEffect } from 'react'
import { apiClient } from "../../config/axios";

export default function MenuInformacion({ plantilla }) {
    const [info, setInfo] = useState(null);
    const [material1, setMaterial] = useState(null);
    const [tipoBolsa1, setTipoBolsa] = useState(null);

    const esId = (v) =>
        typeof v === "number" || /^\d+$/.test(v);

    useEffect(() => {
        const cargarPlantilla = async () => {
            try {
                if (!plantilla) return;

                if (esId(plantilla)) {
                    const res = await apiClient.get(`/plantillas/${plantilla}`);
                    setInfo(res.data.data);
                } else {
                    setInfo(plantilla);
                    setMaterial(plantilla.materialNombre);
                    setTipoBolsa(plantilla.tipoBolsaNombre);
                }
            } catch (e) {
                console.error("Error al cargar la plantilla", e);
            }
        };

        cargarPlantilla();
    }, [plantilla]);

    if (!info) {
        return <div className="card-diseno h-100 p-4 text-muted">Cargando información...</div>;
    }

    const {
        nombre,
        material,
        tipoBolsa,
        ancho,
        alto,
        profundidad,
    } = info;


    return (
        <div className="p-4 card-diseno h-100 overflow-auto">
            <h4 className="mb-4 text-primary fw-bold">
                Información sobre la plantilla
            </h4>

            <Info label="Nombre" value={nombre} />
            <Info label="Material" value={material?.nombre ?? material1} />
            <Info label="Tipo de producto" value={tipoBolsa?.nombre ?? tipoBolsa1} />
            <Info label="Ancho (cm)" value={ancho} />
            <Info label="Alto (cm)" value={alto} />
            <Info label="Profundidad (cm)" value={profundidad} />
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="mb-3">
            <span className="text-muted small fw-bold text-uppercase">
                {label}:
            </span>
            <span className="ms-2 text-capitalize">
                {value}
            </span>
        </div>
    );
}
