import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { apiClient } from '../../config/axios'
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';

export default function MenuPlantillas({ setModalAbierto, idCliente, userName, setPlantillasUsuario }) {
    const [todasLasPlantillas, setTodasLasPlantillas] = useState([])
    const [plantillasCliente, setPlantillasCliente] = useState([])
    const [imagenes, setImagenes] = useState({});
    const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

    useEffect(() => {
        const fetchTodasLasPlantillas = async () => {
            try {
                const pl = await apiClient.get(`/plantillas`);
                setTodasLasPlantillas(pl.data.data);
            } catch (e) {
                console.log(e);
            }
        }

        const fetchPlantillasCliente = async () => {
            try {
                const plCliente = await apiClient.get(`/plantillas/usuario/${idCliente}/habilitadas`);
                setPlantillasCliente(plCliente.data.data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchPlantillasCliente();
        fetchTodasLasPlantillas();
    }, [])

    const handleClick = async () => {
        try {
            const promises = plantillasCliente.map((p) => {
                return apiClient.post(`/plantillas/${p.id}/habilitar-usuario/${idCliente}`, {});
            });
            
            await Promise.all(promises);
            setPlantillasUsuario(plantillasCliente);
            mostrarExito("Plantillas habilitadas correctamente.");
            setModalAbierto(false);
        } catch (e) {
            console.error("Error al agregar las plantillas al cliente", e);
            if (e.response && e.response.status === 403) {
                mostrarError("No tienes permisos para habilitar plantillas. Verifica tu sesión.");
            } else {
                mostrarError("Error al guardar las plantillas. Intente nuevamente.");
            }
        }
    }

    useEffect(() => {
        const fetchBase64Images = async () => {
            const nuevasImagenes = {};
            for (const p of todasLasPlantillas) {
                try {
                    const imgRes = await apiClient.get(`/plantillas/${p.id}`);
                    nuevasImagenes[p.id] = imgRes.data.data.base64Plantilla;
                } catch (e) {
                    console.error(`Error cargando imagen de ${p.nombre}`, e);
                }
            }
            setImagenes(nuevasImagenes);
        };

        if (todasLasPlantillas.length > 0) fetchBase64Images();
    }, [todasLasPlantillas]);


    const deshabilitarPlantilla = async (idPlantilla) => {
        try {
            await apiClient.delete(`/plantillas/${idPlantilla}/deshabilitar-usuario/${idCliente}`);
            mostrarExito("Plantilla deshabilitada correctamente.");
        } catch (e) {
            console.error(`Error al deshabilitar la plantilla ${idPlantilla}`, e);
            if (e.response && e.response.status === 403) {
                mostrarError("No tienes permisos para deshabilitar plantillas.");
            } else {
                mostrarError("Error al deshabilitar la plantilla.");
            }
        }
    };

    return (
        <div>
            <h2>Agregar Plantillas a {userName} </h2>

            {todasLasPlantillas.map((plantilla) => (
                <div
                    key={plantilla.id}
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        margin: '10px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div>
                        <p><strong>Nombre:</strong> {plantilla.nombre}</p>
                        <p><strong>Material:</strong> {plantilla.materialNombre}</p>
                        <p><strong>Tipo Bolsa:</strong> {plantilla.tipoBolsaNombre}</p>
                        <p><strong>Ancho:</strong> {plantilla.ancho}</p>
                        <p><strong>Alto:</strong> {plantilla.alto}</p>
                        <p><strong>Profundidad:</strong> {plantilla.profundidad}</p>

                        {imagenes[plantilla.id] ? (
                            <img
                                src={`data:image/png;base64,${imagenes[plantilla.id]}`}
                                alt={plantilla.nombre}
                                style={{ width: '150px', marginTop: '8px' }}
                            />
                        ) : (
                            <p>Cargando imagen...</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="checkbox"
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

            <button
                className="btn m-1"
                style={{
                    backgroundColor: "#016add",
                    color: "#fff",
                    border: "2px solid #016add",
                    fontWeight: "500",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#014bb5";
                    e.currentTarget.style.borderColor = "#014bb5";
                    e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#016add";
                    e.currentTarget.style.borderColor = "#016add";
                    e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handleClick}
            >
                Guardar selección
            </button>
            
            <Notificacion
                tipo={notificacion.tipo}
                mensaje={notificacion.mensaje}
                visible={notificacion.visible}
                onClose={ocultarNotificacion}
                duracion={notificacion.duracion}
            />
        </div>
    )
}
