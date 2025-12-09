import React, {useState, useRef, useEffect} from 'react'
import { crearPDF } from '../../services/crearPDF'
import Cookies from "js-cookie"
import axios from "axios"
import "../../styles/main.css"

export default function Menu3d({ setModal3d, disenoClick, setDisenoClick, onSuccess, onError, onUpdateDisenos }) {
    const [isLoading, setIsLoading] = useState(false)
    const timeoutRef = useRef(null)
    const isMountedRef = useRef(true)

    // Limpieza de memoria por si el usuario cierra el navegador o cambia de pestaña
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [])

    const handle3d = async () => {
        if (!disenoClick || !disenoClick.id) {
            if (onError) onError("No se identificó el diseño seleccionado.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Chequeo de salud (opcional)
            await apiClient.get("/ia/health");

            // 2. Enviar la orden al servidor (Sin esperar respuesta para no bloquear)
            apiClient.post("/ia/generate-3d", { disenoId: disenoClick.id })
                .catch(err => console.error("Procesando en segundo plano:", err));

            // 3. TEMPORIZADOR DE 15 SEGUNDOS (Simulando el proceso)
            timeoutRef.current = setTimeout(() => {
                if (!isMountedRef.current) return;

                // --- AL TERMINAR LOS 15 SEGUNDOS ---
                
                setIsLoading(false);
                setModal3d(false);      // 1. Cerrar el modal
                setDisenoClick();       // 2. Limpiar selección

                // 3. Notificación de éxito
                if (onSuccess) {
                    onSuccess("¡Imagen 3D generada con éxito!");
                }

                // 4. Actualizar la lista en el componente padre (IMPORTANTE)
                // Esto hace que aparezca la imagen nueva sin recargar la página
                if (onUpdateDisenos) {
                    onUpdateDisenos();
                }

                // YA NO HAY RECARGA DE PÁGINA (window.location.reload eliminado)

            }, 15000); // <--- 15 Segundos de espera

        } catch (err) {
            console.error(err);
            setIsLoading(false);
            if (onError) onError("No se pudo conectar con el servidor.");
        }
    }

    return (
        <div style={{ width: "500px" }}>
            <h2 >Generar vista 3D</h2>
            <hr />

            <div className="p-3">
                {!isLoading ? (
                    // --- VISTA INICIAL (LIMPIA) ---
                    <div>
                        <h5 className="mb-4">Si lo desea, puede generar una vista 3D del diseño creado.</h5>
                        
                        {/* El botón ahora es el protagonista */}
                        <button onClick={handle3d} className="boton-1 w-100">
                            Generar imagen 3D
                        </button>

                        <p className="mt-4 text-muted" style={{ fontSize: "0.8rem" }}>
                            <i className="fa fa-info-circle"></i> La imagen es generada por inteligencia artificial. 
                            Paper SRL se desentiende del resultado conseguido.
                        </p>
                    </div>
                ) : (
                    // --- VISTA DE CARGA ---
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-4" style={{width: "3rem", height: "3rem"}} role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        
                        <h4 className="fw-bold mb-2">Creando visualización...</h4>
                        
                        <p className="text-muted small">
                            Estamos procesando tu diseño. <br/>
                            Esto tomará unos momentos.
                        </p>
                    </div>
                )}
            </div>

            {/* Botón Volver (Solo visible si NO está cargando) */}
            {!isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        className="boton-2 w-25 mt-3 me-3"
                        onClick={() => {
                            setModal3d(false);
                            setDisenoClick();
                        }}
                        type="button"
                    >
                        Volver
                    </button>
                </div>
            )}
        </div>
    )
}
