import React, { useState, useRef } from "react";

export default function MenuDiseno({ agregarFoto, agregarTexto }) {

  const [texto, setTexto] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [color, setColor] = useState("black");
  const [fuente, setFuente] = useState("Arial");
  const [tamaño, setTamaño] = useState(30);

  const inputImgRef = useRef(null)
  const inputTextRef = useRef(null)

  const fuentes = ["Arial", "Verdana", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Palatino", "Garamond", "Comic Sans MS", "Impact", "Lucida Sans Unicode", "Tahoma", "Trebuchet MS", "Arial Black", "Brush Script MT"];

  const handleAgregarTexto = () => {
    agregarTexto(texto, color, tamaño, fuente);
    setTexto(null)
    if (inputTextRef.current) inputTextRef.current.value = null;
  };

  const handleAddImagen = (e) => {
    if (!imagen) return;
    e.target.value = null;
    agregarFoto(imagen);
    setImagen(null);
    if (inputImgRef.current) inputImgRef.current.value = null;
  }

  const onChangeTexto = (e) => {
    setTexto(e.target.value);
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
    <div className="border rounded p-3 mt-3">
      <h3>Menú de Diseño</h3>
      <hr />
      <div className="border p-3">
        <div class="input-group m-1">
          <input type="file" className="form-control" onChange={onChangeImagen} ref={inputImgRef} />
          <button className={`btn btn-secondary  ${imagen ? "" : "disabled"}`} onClick={handleAddImagen}>Agregar Imagen</button>
        </div>
      </div>

      <div className="border p-3 mt-2">
        <div class="input-group m-1">
          <input type="text" onChange={onChangeTexto} className="input-group-text" placeholder="Escribe el texto aquí..." ref={inputTextRef} />
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
          <input type="range" className="form-range" min="10" max="150" step="1" defaultValue={30} onChange={(e) => setTamaño(e.target.value)}></input>
          <p>Tamaño actual:</p>
          <p style={{ fontSize: `${tamaño}px`, marginLeft: "5px" }}>{tamaño}</p>
        </div>

      </div>
    </div>
  );
}
