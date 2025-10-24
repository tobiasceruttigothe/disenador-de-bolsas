import React, { useState } from "react";

export default function MenuPincel({ activarModoDibujo }) {
    const [color, setColor] = useState("#000000");
    const [grosor, setGrosor] = useState(5);
    const [pincel, setPincel] = useState("PencilBrush");

    const handleActivar = () => {
        activarModoDibujo({
            color,
            width: grosor,
            brush: pincel,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "#000000"
        });
    };

    return (
        <div
            className="p-3 mt-2 bg-light"
            style={{
                height: "650px",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                border: "1px solid #00000013",
                borderLeft: "none",
            }}
        >
            <h2 className="mx-2 mb-3">Agregar dibujos</h2>

            {/* Selección de color */}
            <div>
                <p className="m-1">Selecciona el color</p>
                <input type="color" onChange={(e) => { setColor(e.target.value) }}></input>

            </div>

            <hr />

            {/* Selección de grosor */}
            <div className="mb-3">
                <label className="m-1">Grosor del pincel</label>
                <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="50"
                    step="1"
                    value={grosor}
                    onChange={(e) => setGrosor(parseInt(e.target.value, 10))}
                />
                <p>Tamaño actual: {grosor}</p>
            </div>

            <hr />

            {/* Selección de tipo de pincel */}
            <div className="mb-3">
                <label className="m-1">Tipo de pincel</label>
                <select
                    value={pincel}
                    onChange={(e) => setPincel(e.target.value)}
                    className="form-select"
                >
                    <option value="PencilBrush">Lápiz</option>
                    <option value="CircleBrush">Círculo</option>
                    <option value="SprayBrush">Spray</option>
                    <option value="PatternBrush">Patrón</option>
                    <option value="SquareBrush">Cuadrado</option>
                </select>
            </div>

            <hr />

            {/* Botones */}
            <div className="d-flex justify-content-between">
                <button className="btn" onClick={handleActivar} style={{ flexGrow: 1, color: "#000000ff",
              border: "1px solid #016add ",
              backgroundColor: "#016bdd42",
              borderRadius: "8px",
              cursor: "pointer" }}>
                    Activar dibujo
                </button>
            </div>

            <div
                style={{
                    marginTop: "20px",
                    height: "150px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    backgroundColor: "rgba(190,190,190,0.1)",
                }}
            >
                <div
                    style={{
                        width: grosor,
                        height: grosor,
                        borderRadius: "50%",
                        backgroundColor: color,
                    }}
                />
            </div>
            <p style={{fontSize: "14px", color: "#555"}}>El pincel se activa al hacer click en "Activar dibujo", y se desactiva al hacer click fuera del canvas.</p>
        </div>
    );
}
