import React from 'react'
import { apiClient } from '../../config/axios'

export default function MenuEstado({ setModalEstado, disenoClick, onSuccess, onError, setDisenoClick }) {
    const handleCambio = async (estado) => {
        try {
            await apiClient.patch(`disenos/${disenoClick.id}/estado?estado=${estado}`)
            disenoClick.status = estado
            onSuccess("Cambio de estado exitoso.");
        } catch (e) {
            onError("Ocurrió un error. Intente más tarde.")
        }
    }
    return (
        <div style={{ width: "500px" }}>
            <h2 >Gestionar estado del diseño</h2>
            <hr />
            <div className="p-3">
                <h3 className="fw-bold">Diseño: {disenoClick.nombre}</h3>
                <p>Todas las transiciones entre estados son posibles y revertibles.</p>
                <p className="fw-bold">Estado actual: <span className={`cuadro-estado-${disenoClick.status} rounded`}>{disenoClick.status}</span></p>
                <div className="d-grid gap-2">
                    <button className={`btn ${disenoClick.status === "PROGRESO" ? "disabled" : "boton-1"} w-100`} disabled={disenoClick.status === "PROGRESO"} onClick={() => handleCambio("PROGRESO")}>Marcar como PROGRESO</button>
                    <button className={`btn ${disenoClick.status === "TERMINADO" ? "disabled" : "boton-1"} w-100`} disabled={disenoClick.status === "TERMINADO"} onClick={() => handleCambio("TERMINADO")}>Marcar como TERMINADO</button>
                    <button className={`btn ${disenoClick.status === "CANCELADO" ? "disabled" : "boton-1"} w-100`} disabled={disenoClick.status === "CANCELADO"} onClick={() => handleCambio("CANCELADO")}>Marcar como CANCELADO</button>
                </div>
            </div>
            <button
                className="boton-2 w-25 mt-3 ms-3"
                onClick={() => {
                    setModalEstado(false);
                    setDisenoClick();
                }}
                type="button"
            >
                Volver
            </button>
        </div>
    )
}
