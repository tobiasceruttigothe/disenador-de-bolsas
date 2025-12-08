import React, { useState, useEffect, useRef } from 'react'
import { apiClient } from '../../config/axios'
import "../../styles/main.css"

export default function Menu3d({ setModal3d, disenoClick, setDisenoClick, onSuccess, onError, onUpdateDisenos }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isPolling, setIsPolling] = useState(false) // Nuevo estado para controlar el polling
    const disenoIdRef = useRef(null)

    // ESTE USEEFFECT MANEJA EL INTERVALO DE FORMA SEGURA
    useEffect(() => {
        let intervalId;

        if (isPolling) {
            console.log("🔄 Iniciando ciclo de verificación...");
            intervalId = setInterval(async () => {
                await verificarImagen3d();
            }, 2000); // Revisar cada 2 segundos (1s es muy agresivo para el servidor)
        }

        // Limpieza automática cuando el componente se desmonta o deja de hacer polling
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPolling]); // Se ejecuta cada vez que isPolling cambia

    const verificarImagen3d = async () => {
        if (!disenoIdRef.current) return;

        try {
            console.log(`🔍 Verificando diseño ID: ${disenoIdRef.current}...`);
            const res = await apiClient.get(`/disenos/${disenoIdRef.current}`);
            const diseno = res.data.data;

            // Validación robusta
            const tieneImagen3d = diseno.imagen3d && 
                                  String(diseno.imagen3d).trim() !== '' &&
                                  diseno.imagen3d !== 'null' &&
                                  diseno.imagen3d.length > 10;
            
            if (tieneImagen3d) {
                console.log("✅ IMAGEN 3D LISTA");
                
                // 1. Detener Polling y Loading
                setIsPolling(false);
                setIsLoading(false);

                // 2. Notificar éxito
                if (onSuccess) onSuccess("Imagen 3D generada correctamente. Recargando...");

                // 3. Cerrar modal y limpiar
                setModal3d(false);
                setDisenoClick();

                // 4. Actualizar lista (por si acaso falla la recarga)
                if (onUpdateDisenos) onUpdateDisenos();

                // 5. RECARGAR LA PÁGINA (Pequeño delay para que el usuario lea el mensaje)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } 
        } catch (err) {
            console.error("Error en verificación:", err);
            // No detenemos el polling por un error de red momentáneo, a menos que sea 404
        }
    }

    const handle3d = async () => {
        if (!disenoClick || !disenoClick.id) {
            if (onError) onError("No se ha seleccionado un diseño válido.");
            return;
        }

        // Configuración inicial
        const id = disenoClick.id;
        disenoIdRef.current = id;
        setIsLoading(true);

        try {
            // 1. Verificar salud del servidor
            const status = await apiClient.get("/ia/health");
            if (status.status !== 200) throw new Error("Servidor IA no disponible");

            // 2. Enviar solicitud de generación
            await apiClient.post("/ia/generate-3d", { disenoId: id });
            
            // 3. Activar el Polling (El useEffect se encargará del resto)
            setIsPolling(true);

            // Timeout de seguridad: Si en 5 minutos no está, cancelar todo
            setTimeout(() => {
                // Solo cancelamos si todavía estamos cargando
                setIsPolling(current => {
                    if (current) {
                        setIsLoading(false);
                        if (onError) onError("Tiempo de espera agotado.");
                        return false;
                    }
                    return current;
                });
            }, 300000); // 5 minutos

        } catch (err) {
            console.error("Error al iniciar generación:", err);
            setIsLoading(false);
            setIsPolling(false);
            if (onError) onError("Error al conectar con el servidor de generación.");
        }
    }

    // Función para cancelar manualmente y salir
    const handleCancel = () => {
        setIsPolling(false);
        setIsLoading(false);
        setModal3d(false);
        setDisenoClick();
    }

    return (
        <div style={{ width: "500px" }}>
            <h2>Generar vista 3D</h2>
            <hr />

            <div className="p-3">
                <div>
                    <h5>Si lo desea, puede generar una vista 3D del diseño creado.</h5>
                    
                    {/* Botón principal */}
                    {!isLoading && (
                        <button 
                            onClick={handle3d} 
                            className="boton-1"
                        >
                            Generar imagen 3D
                        </button>
                    )}
                    
                    {/* UI de Carga */}
                    {isLoading && (
                        <div className="mt-4 mb-4" style={{ textAlign: "center" }}>
                            <div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}} role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <h5 className="mt-3 fw-bold">Generando imagen 3D...</h5>
                            <p className="text-muted">Esto puede tomar unos segundos. La página se recargará al finalizar.</p>
                        </div>
                    )}

                    <p className="mt-3 text-muted" style={{fontSize: "0.9em"}}>
                        <i className="fa fa-info-circle"></i> La imagen es generada por inteligencia artificial. 
                        El proceso es automático.
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    className="boton-2 w-25 mt-3 me-3"
                    onClick={handleCancel}
                    type="button"
                >
                    {isLoading ? "Cancelar" : "Volver"}
                </button>
            </div>
        </div>
    )
}