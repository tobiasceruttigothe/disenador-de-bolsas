import React from 'react'
import { crearPDF } from '../../services/crearPDF'
import "../../styles/main.css"

export default function MenuDescargar({ setModalDescargar, disenoClick, setDisenoClick }) {

    const base = disenoClick.base64Preview

    const descargarArchivo = (base64, nombreArchivo) => {
        const link = document.createElement("a");
        link.href = base64;
        link.download = nombreArchivo;
        link.click();
    };

    const base64ToJPG = (base64) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "diseño.jpg";
                link.click();
                URL.revokeObjectURL(link.href);
            }, "image/jpeg", 0.95);
        };
    };


    const handlePDF = async () => {
        crearPDF(base, disenoClick.nombre, disenoClick.descripcion, disenoClick.plantillaNombre)
    };

    const handlePNG = async () => {
        descargarArchivo(`data:image/png;base64,${base}`, "diseño.png");
    }

    const handleJPG = async () => {
        base64ToJPG(`data:image/png;base64,${base}`);
    }

    return (
        <div style={{ width: "500px" }}>
            <h2 >Descargar diseño</h2>
            <hr />

            {/* 3 columnas */}
            <div
                className="p-3"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "20px",
                    textAlign: "center"
                }}
            >
                {/* PDF */}
                <div>
                    <h5>PDF</h5>
                    <button onClick={handlePDF} className="boton-1 w-100">Descargar</button>
                </div>

                {/* JPG */}
                <div>
                    <h5>JPG</h5>
                    <button onClick={handleJPG} className="boton-1 w-100">Descargar</button>
                </div>

                {/* PNG */}
                <div>
                    <h5>PNG</h5>
                    <button onClick={handlePNG} className="boton-1 w-100">Descargar</button>
                </div>
            </div>

            {/* Botón volver */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    className="boton-2 w-25 mt-3 me-3"
                    onClick={() => { setModalDescargar(false); setDisenoClick("") }}
                    type="submit"
                >
                    Volver
                </button>
            </div>
        </div>
    )
}
