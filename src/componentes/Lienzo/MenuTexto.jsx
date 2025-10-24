import React from 'react'
import { useState, useRef } from "react";

export default function MenuTexto({ agregarTexto }) {
    const [texto, setTexto] = useState(null);
    const [color, setColor] = useState("black");
    const [fuente, setFuente] = useState("Arial");
    const [tamaño, setTamaño] = useState(30);

    const inputTextRef = useRef(null)

    const fuentes = ["Arial", "Verdana", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Palatino", "Garamond", "Comic Sans MS", "Impact", "Lucida Sans Unicode", "Tahoma", "Trebuchet MS", "Arial Black", "Brush Script MT"];

    const handleAgregarTexto = () => {
        agregarTexto(texto, color, tamaño, fuente);
        setTexto(null)
        if (inputTextRef.current) inputTextRef.current.value = null;
    };
    const onChangeTexto = (e) => {
        setTexto(e.target.value);
    }

    return (
        <div className=" p-3 mt-2 bg-light" style={{ height: "650px",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            border: "1px solid #00000013",
            borderleft: "none"
         }}>
            <h2 className="mx-2 mb-3">Agregar Texto</h2>
            <div className="input-group m-1">
                <input type="text" onChange={onChangeTexto} style={{display: "flex",border: "2px solid rgb(0,0,0,0.3)", borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px"}} placeholder="Escribe el texto aquí..." ref={inputTextRef} />
                <button className={`btn btn-secondary ${texto ? "" : "disabled"}`} onClick={handleAgregarTexto}>Agregar Texto</button>
            </div>

            <hr></hr>

            <div>
                <p className="m-1">Selecciona el color</p>
                <input type="color" onChange={(e) => { setColor(e.target.value) }}></input>
            </div>

            <hr></hr>

            <div>
                <label className="m-1">Selecciona la fuente</label>
                <div className="input-group m-1">
                    <select onChange={(e) => setFuente(e.target.value)} className="form-select">
                        {fuentes.map((f, index) => (
                            <option key={index} style={{ fontFamily: f }} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
            </div>

            <hr></hr>

            <div>
                <label>Selecciona el tamaño de la fuente</label>
                <br></br>
                <input type="range" className="form-range" min="10" max="100" step="1" defaultValue={30} onChange={(e) => setTamaño(e.target.value)}></input>
                <p>Tamaño actual: {tamaño}</p>
            </div>
            <div className="" style={{
                border: "1px solid rgba(0, 0, 0, 0.1)", display: "flex", justifyContent: "center", 
                alignItems: "center", height: "200px", borderRadius: "8px", padding: "10px", textAlign: "center", backgroundColor: "rgba(190, 190, 190, 0.1)"
            }}>
                <p style={{
                    fontSize: `${tamaño}px`,
                    marginLeft: "5px",
                    fontFamily: fuente,
                    color: color
                }}>Tu texto</p>
            </div>

        </div>
    )
}
