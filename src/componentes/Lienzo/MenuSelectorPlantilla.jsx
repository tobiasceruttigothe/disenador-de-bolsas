import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

export default function MenuSelectorPlantilla({ plantillas, setPlantillaElegida, setPlantillaBool }) {
    const navigate = useNavigate()
    const [plantillaSeleccionada, setPlantillaSeleccionada] = React.useState(null);
    const [imagenBase64, setImagenBase64] = React.useState(null);
    const [cargando, setCargando] = React.useState(false);

    const handleClick = () => {
        if (!plantillaSeleccionada) {
            alert("Por favor, seleccione una plantilla antes de confirmar.");
            return;
        }
        setPlantillaElegida(plantillaSeleccionada);
        setPlantillaBool(true);
    };

    const cargarImagen = async (plantillaId) => {
        try {
            setCargando(true);
            const token = Cookies.get("access_token");
            const res = await axios.get(`http://localhost:9090/api/plantillas/${plantillaId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const base64 = res.data.data.base64Plantilla;
            setImagenBase64(base64);
        } catch (error) {
            console.error("Error al cargar la imagen de la plantilla:", error);
            setImagenBase64(null);
        } finally {
            setCargando(false);
        }
    };

    React.useEffect(() => {
        if (plantillaSeleccionada) {
            cargarImagen(plantillaSeleccionada.id);
        } else {
            setImagenBase64(null);
        }
    }, [plantillaSeleccionada]);

    return (
        <div style={{
            padding: "20px",
            width: "400px",
            height: "450px",
            backgroundColor: "white",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column"
        }}>

            {/* CONTENIDO SUPERIOR */}
            <div style={{ flex: "1 1 auto" }}>
                <h2>Seleccione una plantilla</h2>

                {plantillas.length > 0 ? (
                    <>
                        <select
                            className="form-select mb-3"
                            defaultValue=""
                            onChange={(e) => {
                                const seleccionada = plantillas.find(p => p.id === parseInt(e.target.value));
                                setPlantillaSeleccionada(seleccionada);
                            }}
                        >
                            <option value="" disabled>Seleccione una plantilla</option>
                            {plantillas.map((plantilla) => (
                                <option key={plantilla.id} value={plantilla.id}>
                                    {plantilla.nombre}
                                </option>
                            ))}
                        </select>

                        <p>Vista previa:</p>

                        <div style={{
                            border: "1px solid #00000013",
                            width: "100%",
                            height: "150px",
                            overflow: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {cargando ? (
                                <p>Cargando imagen...</p>
                            ) : imagenBase64 ? (
                                <img
                                    src={`data:image/png;base64,${imagenBase64}`}
                                    alt="Vista previa de la plantilla"
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                />
                            ) : (
                                <p>Seleccione una plantilla para ver la vista previa.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <p className="p-3 border rounded m-3">
                            No hay plantillas disponibles. Contáctese con un Diseñador.
                        </p>
                    </>
                )}
            </div>

            {/* BOTONES ABAJO A LA DERECHA */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px"
            }}>
                <button
                    className="btn m-1"
                    style={{
                        border: "2px solid #016add",
                        backgroundColor: "transparent",
                        color: "#016add",
                        fontWeight: "500",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#016add";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#016add";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    onClick={() => navigate("/disenos")}
                >
                    Volver a Mis Diseños
                </button>
                {plantillas.length > 0 && (
                    <button
                        className={`btn m-1 ${!plantillaSeleccionada ? "disabled" : ""} `}
                        style={{
                            backgroundColor: "#016add",
                            color: "#fff",
                            border: "2px solid #016add",
                            fontWeight: "500",
                            padding: "0.375rem 0.75rem",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
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
                        Confirmar selección
                    </button>
                )}

            </div>
        </div>
    );
}
