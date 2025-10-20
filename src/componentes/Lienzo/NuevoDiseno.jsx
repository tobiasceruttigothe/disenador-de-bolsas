import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import plantillaprueba from "../../assets/plantillaprueba.png";
import Cookies from "js-cookie";
import "../../index.css"

export default function NuevoDiseno() {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  const [plantillas, setPlantillas] = useState([]);;
  const [plantillaElegida, setPlantillaElegida] = useState(plantillaprueba); //cambiar dsp por la elegida

  //setPlantillas(await axios.get("url de las plantillas"))
  useEffect(() => {
    setPlantillas([
      { nombre: "Plantilla 1", valor: "plantilla1" },
      { nombre: "Plantilla 2", valor: "plantilla2" },
      { nombre: "Plantilla 3", valor: "plantilla3" },
    ]);
  }, []);

  useEffect(() => {
    import("../../services/lienzoCreacion.js").then(({ initCanvas }) => {
      canvasInstance.current = initCanvas(canvasRef.current, plantillaElegida)
    });
    return () => canvasInstance.current?.dispose();
  }, [plantillaElegida]);

  const agregarFoto = (foto) => {
    import("../../services/lienzoCreacion.js").then(({ agregarFoto }) => {
      agregarFoto(canvasInstance.current, foto);
    });
  };

  const agregarRectangulo = (color) => {
    import("../../services/lienzoCreacion.js").then(({ agregarRectangulo }) => {
      agregarRectangulo(canvasInstance.current, color);
    });
  };

  const agregarCirculo = (color) => {
    import("../../services/lienzoCreacion.js").then(({ agregarCirculo }) => {
      agregarCirculo(canvasInstance.current, color);
    });
  };

  const agregarCuadrado = (color) => {
    import("../../services/lienzoCreacion.js").then(({ agregarCuadrado }) => {
      agregarCuadrado(canvasInstance.current, color);
    });
  };

  const agregarTriangulo = (color) => {
    import("../../services/lienzoCreacion.js").then(({ agregarTriangulo }) => {
      agregarTriangulo(canvasInstance.current, color);
    });
  };

  const agregarLinea = (color) => {
    import("../../services/lienzoCreacion.js").then(({ agregarLinea }) => {
      agregarLinea(canvasInstance.current, color);
    } );
  };

  const agregarEstrella = (color) => {
    import("../../services/lienzoCreacion.js").then(({ agregarEstrella }) => {
      agregarEstrella(canvasInstance.current, color);
    });
  };

  const agregarTexto = (texto, color, tamaño, fuente) => {
    import("../../services/lienzoCreacion.js").then(({ agregarTexto }) => {
      agregarTexto(canvasInstance.current, texto, color, tamaño, fuente);
    });
  };

  const handleGuardarDiseno = () => {
    import("../../services/lienzoCreacion.js").then(({ guardarDiseno, guardarElementos }) => {
      try {
        const dataURL = guardarDiseno(canvasInstance.current)
        const elementos = guardarElementos(canvasInstance.current, plantillaElegida);
        const usuarioId = Cookies.get("usuarioId");
        const fechaActual = new Date().toISOString();
        const diseno = {
          usuarioId: usuarioId,
          fechaCreacion: fechaActual,
          imagen: dataURL,
          elementos: elementos
        };
        console.log("Diseño guardado:", diseno);

        } catch (error) {
          console.error("Error al guardar el diseño:", error)
          };
    });
  };
  return (
    <div className="container-fluid fondo">
      <div className="row">
        <div className="col-4 border-end">
          <MenuDiseno agregarFoto={agregarFoto} plantillaElegida={plantillaElegida} agregarTexto={agregarTexto} plantillas={plantillas} setPlantillaElegida={setPlantillaElegida} 
          agregarCuadrado={agregarCuadrado} agregarRectangulo={agregarRectangulo} agregarCirculo={agregarCirculo} agregarEstrella={agregarEstrella} agregarLinea={agregarLinea}
          agregarTriangulo={agregarTriangulo}/>
        </div>
        <div className="col-8">
          <Lienzo canvasRef={canvasRef} />
        </div>
      </div>
      <button style={{color: "#fff", backgroundColor: "#016add", border: "none", borderRadius: "5px", padding: "12px 30px", position: "fixed", bottom: "20px", right: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}} 
      onClick={handleGuardarDiseno}>Guardar diseño</button>
    </div>
  );
}
