import React from 'react'
import { useState, useRef } from "react";

export default function MenuIA() {
    const [texto, setTexto] = useState(null);
    const inputTextRef = useRef(null)


    const onChangeTexto = (e) => {
        setTexto(e.target.value);
    }

    const handleIntegracionIA = async() => {
        try{
        //await axios.get(`http://localhost:5000/generar-imagen?texto=${texto}`)
        //algo para mostrar que esta en proceso
        setTexto("")
        if (inputTextRef.current) inputTextRef.current.value = null;
        }
        catch(error){
            alert("Error al conectar con la API de IA")
        }
    }
  return (
      <div className=" p-3 mt-2 bg-light" style={{ height: "650px",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            border: "1px solid #00000013",
            borderleft: "none"
         }}>
            <h2 className="mx-2 mb-3">Agregar Imagenes con Inteligencia Artificial</h2>
            <div className="input-group m-1">
                <input type="text" onChange={onChangeTexto} style={{display: "flex",border: "2px solid rgb(0,0,0,0.3)", borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px"}} placeholder="Escribe el texto aquí..." ref={inputTextRef} />
                <button className={`btn btn-secondary ${texto ? "" : "disabled"}`} onClick={handleIntegracionIA}>Agregar Texto</button>
            </div>

            <hr></hr>
         </div>

  )
}
