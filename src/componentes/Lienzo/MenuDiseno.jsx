import { useState } from "react";
import MenuImagen from "./MenuImagen";
import MenuTexto from "./MenuTexto";
import MenuIA from "./MenuIA";
import MenuFormas from "./MenuFormas";
import MenuLogos from "./MenuLogos";
import MenuPincel from "./MenuPincel"

export default function MenuDiseno({ agregarFoto, agregarTexto, plantillaElegida, agregarCuadrado, agregarRectangulo, agregarCirculo, agregarEstrella, agregarLinea,
          agregarTriangulo, activarModoDibujo}) {
  const [opcion, setOpcion] = useState("imagen");


  return (
    <div className="border rounded p-3 mt-3">
      <h3>Menú de Diseño</h3>
      <hr />
      <div className="d-flex">
        <div
          className="d-flex flex-column border p-3 mt-2 ml-1 bg-light"
          style={{
            width: "108px",
            height: "650px",
            border: "1px solid #00000013",
            borderRight: "1px solid #00000013",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
          }}
        >
          <button className={`btn text-start mb-2 ${opcion === "imagen" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setOpcion("imagen")}> Imagen </button>
          <button className={`btn text-start mb-2 ${opcion === "texto" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setOpcion("texto")}> Texto </button>
          <button className={`btn text-start mb-2 ${opcion === "pincel" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setOpcion("pincel")}> Pincel </button>
          <button className={`btn text-start mb-2 ${opcion === "ia" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setOpcion("ia")}> IA </button>
          <button className={`btn text-start mb-2 ${opcion === "formas" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setOpcion("formas")}> Formas </button>
          <button className={`btn text-start  ${opcion === "logo" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setOpcion("logo")}> Logos </button>
        </div>

        <div className="flex-grow-1" style={{
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}>
          {opcion === "imagen" && <MenuImagen agregarFoto={agregarFoto} />}
          {opcion === "texto" && <MenuTexto agregarTexto={agregarTexto} />}
          {opcion === "pincel" && <MenuPincel activarModoDibujo={activarModoDibujo}/>}
          {opcion === "ia" && <MenuIA></MenuIA>}
          {opcion === "formas" && <MenuFormas agregarCuadrado={agregarCuadrado} agregarRectangulo={agregarRectangulo} agregarCirculo={agregarCirculo} 
                                    agregarEstrella={agregarEstrella} agregarLinea={agregarLinea} agregarTriangulo={agregarTriangulo}></MenuFormas>}
          {opcion === "logo" && <MenuLogos></MenuLogos>}
        </div>
      </div>
    </div>

  );
}
