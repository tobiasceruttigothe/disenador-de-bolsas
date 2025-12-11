import React, { useState, useEffect } from 'react'
import { apiClient } from '../../config/axios'
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import "../../styles/main.css"

export default function MenuPlantillas({ setModalAbierto, idCliente, userName, setPlantillasUsuario }) {
    const [todasLasPlantillas, setTodasLasPlantillas] = useState([])
    const [plantillasCliente, setPlantillasCliente] = useState([])
    const [imagenes, setImagenes] = useState({});

    // Estados para controlar la carga visual
    const [isSaving, setIsSaving] = useState(false); // Para el botón de guardar

    const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

    // 1. Carga inicial de datos
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resTodas, resCliente] = await Promise.all([
                    apiClient.get(`/plantillas`),
                    apiClient.get(`/plantillas/usuario/${idCliente}/habilitadas`)
                ]);

                setTodasLasPlantillas(resTodas.data.data);
                setPlantillasCliente(resCliente.data.data);
            } catch (e) {
                console.error("Error cargando datos:", e);
                mostrarError("Error al cargar las listas.");
            }
        };
        cargarDatos();
    }, [idCliente]);

    // 2. Carga de imágenes (perezosa)
    useEffect(() => {
        const fetchBase64Images = async () => {
            // No reseteamos 'imagenes' aquí para evitar parpadeos si se actualiza algo más
            for (const p of todasLasPlantillas) {
                // Si ya tenemos la imagen, no la pedimos de nuevo
                if (imagenes[p.id]) continue;

                try {
                    const imgRes = await apiClient.get(`/plantillas/${p.id}`);
                    setImagenes(prev => ({
                        ...prev,
                        [p.id]: imgRes.data.data.base64Plantilla
                    }));
                } catch (e) {
                    console.error(`Error cargando imagen de ${p.nombre}`, e);
                }
            }
        };

        if (todasLasPlantillas.length > 0) fetchBase64Images();
    }, [todasLasPlantillas]); // Quitamos 'imagenes' de dependencias para evitar loop infinito

    const handleClick = async () => {
        setIsSaving(true);
        try {
            const promises = plantillasCliente.map((p) => {
                return apiClient.post(`/plantillas/${p.id}/habilitar-usuario/${idCliente}`, {});
            });

            await Promise.all(promises);
            if (setPlantillasUsuario) {
                setPlantillasUsuario(plantillasCliente);
            }

            mostrarExito("Plantillas actualizadas correctamente.");


            setTimeout(() => {
                setModalAbierto(false);
            }, 1500);

        } catch (e) {
            console.error("Error al guardar", e);
            if (e.response && e.response.status === 403) {
                mostrarError("No tienes permisos.");
            } else {
                mostrarError("Error al guardar cambios.");
            }
            setIsSaving(false); // Solo desactivamos carga si hubo error
        }
    }

    const deshabilitarPlantilla = async (idPlantilla) => {
        // Optimista: No mostramos spinner global, solo actualizamos checkbox
        try {
            await apiClient.delete(`/plantillas/${idPlantilla}/deshabilitar-usuario/${idCliente}`);
        } catch (e) {
            console.error(e);
            mostrarError("Error al desvincular plantilla.");
        }
    };

    return (
        <>
            <div style={{backgroundColor:"#1e1e1e"}}>
                <h3 className="mb-4">Gestionar Plantillas de {userName}</h3>

                <div style={{ maxHeight: '60', overflowY: 'auto', paddingRight: '5px' }}>
                    {todasLasPlantillas.map((plantilla) => (
                        <div
                            key={plantilla.id}
                            className="plantilla-card"
                        >
                            <div className="d-flex gap-3 align-items-center">
                                {/* SECCIÓN IMAGEN CON CARGANDO */}
                                <div
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                        border: '1px solid #dee2e6'
                                    }}
                                >
                                    {imagenes[plantilla.id] ? (
                                        <img
                                            src={`data:image/png;base64,${imagenes[plantilla.id]}`}
                                            alt={plantilla.nombre}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        // SPINNER DE IMAGEN
                                        <div className="spinner-border text-secondary spinner-border-sm" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    )}
                                </div>

                                {/* DATOS DE LA PLANTILLA */}
                                <div>
                                    <h5 className="mb-1 text-primary">{plantilla.nombre}</h5>
                                    <div className="text-muted small">
                                        <span className="me-2">📦 {plantilla.materialNombre}</span>
                                        <span className="me-2">🏷️ {plantilla.tipoBolsaNombre}</span>
                                        <span>📏 {plantilla.ancho}x{plantilla.alto}x{plantilla.profundidad} (cm)</span>
                                    </div>
                                </div>
                            </div>

                            {/* CHECKBOX */}
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    style={{ width: '50px', height: '25px', cursor: 'pointer' }}
                                    checked={plantillasCliente.some(p => p.id === plantilla.id)}
                                    onChange={async () => {
                                        if (plantillasCliente.some(p => p.id === plantilla.id)) {
                                            setPlantillasCliente(plantillasCliente.filter(p => p.id !== plantilla.id));
                                            await deshabilitarPlantilla(plantilla.id);
                                        } else {
                                            setPlantillasCliente([...plantillasCliente, plantilla]);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">
                    <button
                        className="boton-1"
                        onClick={() => setModalAbierto(false)}
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>

                    <button
                        className="boton-2"
                        style={{ backgroundColor: "#016add", borderColor: "#016add" }}
                        onClick={handleClick}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </button>
                </div>

                <Notificacion
                    tipo={notificacion.tipo}
                    mensaje={notificacion.mensaje}
                    visible={notificacion.visible}
                    onClose={ocultarNotificacion}
                    duracion={notificacion.duracion}
                />
            </div>
        </>
    )
}