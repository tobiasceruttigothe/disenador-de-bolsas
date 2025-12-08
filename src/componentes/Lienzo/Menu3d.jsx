import React, { useState, useEffect, useRef } from 'react'
import { apiClient } from '../../config/axios'
import "../../styles/main.css"

export default function Menu3d({ setModal3d, disenoClick, setDisenoClick, onSuccess, onError, onUpdateDisenos }) {
    const [isLoading, setIsLoading] = useState(false)
    const pollingIntervalRef = useRef(null)
    const timeoutRef = useRef(null)
    const disenoIdRef = useRef(null)

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const verificarImagen3d = async () => {
        if (!disenoIdRef.current) return false
        
        try {
            const res = await apiClient.get(`/disenos/${disenoIdRef.current}`)
            const diseno = res.data.data
            
            console.log("🔍 Verificando diseño:", disenoIdRef.current)
            console.log("📦 Datos del diseño:", diseno)
            console.log("🖼️ imagen3d:", diseno.imagen3d)
            console.log("🖼️ tipo:", typeof diseno.imagen3d)
            
            // Verificar si la imagen 3D está lista (verificar múltiples formas)
            const tieneImagen3d = diseno.imagen3d && 
                                  diseno.imagen3d !== null && 
                                  diseno.imagen3d !== undefined && 
                                  String(diseno.imagen3d).trim() !== '' &&
                                  diseno.imagen3d !== 'null' &&
                                  diseno.imagen3d.length > 10 // Debe tener al menos algo de contenido
            
            if (tieneImagen3d) {
                console.log("✅✅✅ IMAGEN 3D ENCONTRADA! ✅✅✅")
                
                // Detener todo el polling INMEDIATAMENTE
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current)
                    pollingIntervalRef.current = null
                }
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                }
                
                setIsLoading(false)
                
                // Cerrar modal PRIMERO
                setModal3d(false)
                setDisenoClick()
                
                // Mostrar notificación INMEDIATAMENTE
                if (onSuccess) {
                    console.log("📢 Llamando onSuccess...")
                    onSuccess("Imagen 3D generada correctamente.")
                } else {
                    console.error("❌ onSuccess no está definido!")
                }
                
                // Actualizar lista de diseños INMEDIATAMENTE
                if (onUpdateDisenos) {
                    console.log("🔄 Llamando onUpdateDisenos...")
                    onUpdateDisenos()
                } else {
                    console.error("❌ onUpdateDisenos no está definido!")
                }
                
                return true
            } else {
                console.log("⏳ Aún no está lista, continuando polling...")
            }
            return false
        } catch (err) {
            console.error("❌ Error al verificar:", err)
            return false
        }
    }

    const handle3d = async () => {
        if (!disenoClick || !disenoClick.id) {
            if (onError) onError("No se ha seleccionado un diseño válido.")
            return
        }

        const id = disenoClick.id
        disenoIdRef.current = id

        // Limpiar cualquier proceso anterior
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }

        setIsLoading(true)

        try {
            // Verificar salud del servidor
            const status = await apiClient.get("/ia/health")
            if (status.status !== 200) {
                throw new Error("El servidor externo no está en funcionamiento.")
            }

            // Enviar solicitud de generación
            await apiClient.post("/ia/generate-3d", { disenoId: id })

            // Primera verificación después de 1 segundo
            setTimeout(() => {
                verificarImagen3d()
            }, 1000)

            // Iniciar polling cada 1 segundo (más rápido)
            pollingIntervalRef.current = setInterval(() => {
                verificarImagen3d()
            }, 1000)

            // Timeout de seguridad - 5 minutos
            timeoutRef.current = setTimeout(() => {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current)
                    pollingIntervalRef.current = null
                }
                setIsLoading(false)
                if (onError) {
                    onError("El tiempo de espera se agotó. La imagen puede estar generándose aún.")
                }
            }, 300000)

        } catch (err) {
            console.error("Error:", err)
            setIsLoading(false)
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                pollingIntervalRef.current = null
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
            if (onError) {
                onError("Ha ocurrido un error con la generación de la imagen. Intente de nuevo luego")
            }
        }
    }

    return (
        <div style={{ width: "500px" }}>
            <h2>Generar vista 3D</h2>
            <hr />

            <div className="p-3">
                <div>
                    <h5>Si lo desea, puede generar una vista 3D del diseño creado.</h5>
                    <button 
                        onClick={handle3d} 
                        className="boton-1"
                        disabled={isLoading}
                    >
                        {isLoading ? "Generando..." : "Generar imagen 3D"}
                    </button>
                    
                    {isLoading && (
                        <div className="mt-3" style={{ textAlign: "center" }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Generando imagen 3D, por favor espere...</p>
                        </div>
                    )}

                    <p className="mt-3">
                        <i className="fa fa-info-circle fa-xs"></i> La imagen es generada por un servidor externo. 
                        Puede cometer errores. Paper SRL se desentiende del resultado conseguido.
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    className="boton-2 w-25 mt-3 me-3"
                    onClick={() => { 
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current)
                            pollingIntervalRef.current = null
                        }
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                            timeoutRef.current = null
                        }
                        setIsLoading(false)
                        setModal3d(false)
                        setDisenoClick()
                    }}
                    type="button"
                    disabled={isLoading}
                >
                    Volver
                </button>
            </div>
        </div>
    )
}
