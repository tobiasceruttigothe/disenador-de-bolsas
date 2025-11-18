import React from 'react'
import { useState, useRef } from "react";

export default function MenuImagen({ agregarFoto }) {
    const [imagen, setImagen] = useState(null);

    const inputImgRef = useRef(null)

    const handleAddImagen = (e) => {
        if (!imagen) return;
        e.target.value = null;
        agregarFoto(imagen);
        setImagen(null);
        if (inputImgRef.current) inputImgRef.current.value = null;
    }

    const onChangeImagen = (e) => {
        let file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImagen(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-3 mt-2 bg-light" style={{ height: "650px",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            border: "1px solid #00000013",
            borderleft: "none"
         }}>
            <h2 className="mb-3 mx-2">Agregar Imagen</h2>
            <div className="input-group m-1">
                <input id="inputArchivo" accept='.jpg, .jpeg, .png' type="file" className="form-control" style={{ display: "none" }} onChange={onChangeImagen} ref={inputImgRef} />
                <label htmlFor="inputArchivo" className="btn" style={{border: "2px solid rgb(0,0,0,0.3)", borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px"}}> Elegir Imagen</label>
                <button className={`btn btn-secondary  ${imagen ? "" : "disabled"}`} onClick={handleAddImagen}>Agregar Imagen</button>
            </div>
            <hr></hr>
            {imagen &&
                <div className="mt-5">
                    <p>Vista previa de la imagen: </p>
                    <img src={imagen} style={{ maxWidth: "100%", maxHeight: "400px", marginTop: "10px", border: "2px ridge rgba(0, 0, 0, 0.1)", borderRadius: "8px" }} />
                </div>
            }
        </div>
    );
}
