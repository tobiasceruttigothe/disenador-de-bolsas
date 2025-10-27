import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';

export default function MenuPlantillas({ idCliente, userName }) {
    const [todasLasPlantillas, setTodasLasPlantillas] = useState(["jaskdkas"])
    useEffect(() => {
        const fetchTodasLasPlantillas = async () => {
            try {
                const token = Cookies.get("access_token");
                const pl = await axios.get("http://localhost:9090/api/plantillas", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setTodasLasPlantillas(pl.data);
            } catch (e) {
                console.log("Error al cargar todas las plantillas");
            }
        }

        fetchTodasLasPlantillas();
    }, [])

    const handleClick = () => {
    }
    return (
        <div>
            <h2>Agregar Plantillas a {userName} </h2>

            {todasLasPlantillas.length > 0 ? (todasLasPlantillas.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <input type="checkbox" id={`plantilla-${p.id}`} name={`plantilla-${p.id}`} value={p.id} style={{ marginRight: "10px" }} />
                </div>
            ))) : (
                <p>No hay plantillas disponibles.</p>
            )}


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
                onClick={handleClick()}
            >
                Guardar selección
            </button>
        </div>
    )
}
