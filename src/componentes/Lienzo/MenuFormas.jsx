import React, { useState } from 'react';
import estrellaIcon from "../../assets/formas/estrellaForma.webp"
import lineaIcon from "../../assets/formas/rectaForma.webp"
import rectanguloIcon from "../../assets/formas/rectanguloForma.svg"
import circuloIcon from "../../assets/formas/circuloForma.png"
import trianguloIcon from "../../assets/formas/trianguloForma.webp"
import cuadradoIcon from "../../assets/formas/cuadradoForma.webp"

export default function MenuForma({ agregarCuadrado, agregarCirculo, agregarTriangulo, agregarRectangulo, agregarEstrella, agregarLinea }) {
  const [color, setColor] = useState("#000000");

  const formas = [
    { name: "Cuadrado", icon: cuadradoIcon, handler: () => agregarCuadrado(color) },
    { name: "Círculo", icon: circuloIcon, handler: () => agregarCirculo(color) },
    { name: "Triángulo", icon: trianguloIcon, handler: () => agregarTriangulo(color) },
    { name: "Rectángulo", icon: rectanguloIcon, handler: () => agregarRectangulo(color) },
    { name: "Estrella", icon: estrellaIcon, handler: () => agregarEstrella(color) },
    { name: "Línea", icon: lineaIcon, handler: () => agregarLinea(color) },
  ];

  return (
    <div className="p-3 mt-2 bg-light" style={{
      height: "650px",
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
      border: "1px solid #00000013",
      borderLeft: "none"
    }}>
      <h2 className="mb-3 mx-2">Agregar Formas</h2>
      <hr/>
      <p className="mb-2 mx-2">Selecciona el color</p>
      <input type="color" onChange={(e) => setColor(e.target.value)} className="mb-3 mx-2" />
      <hr/>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // 2 columnas
        gridTemplateRows: "repeat(3, 1fr)",    // 3 filas
        gap: "15px",
        justifyItems: "center",
        alignItems: "center",
        marginTop: "15px"
      }}>
        {formas.map((f, index) => (
          <button
            key={index}
            onClick={f.handler}
            style={{
              width: "210px",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#000000ff",
              border: "1px solid #016add ",
              backgroundColor: "#016bdd42",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <img src={f.icon} alt={f.name} style={{ width: "70px", height: "70px", marginBottom: "2px" }} />
            {f.name}
          </button>
        ))}
      </div>
    </div>
  )
}
