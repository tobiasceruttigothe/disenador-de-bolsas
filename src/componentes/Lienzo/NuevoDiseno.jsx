import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import plantillaprueba from "../../assets/plantillaprueba.png";
import Modal from "./ModalConfirmacion.jsx"
import MenuGuardado from "./MenuGuardado.jsx"
import "../../index.css"

export default function NuevoDiseno() {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  const [plantillas, setPlantillas] = useState([]);
  const [plantillaElegida, setPlantillaElegida] = useState(plantillaprueba);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    setPlantillas([
      { nombre: "Plantilla 1", valor: "plantilla1" },
      { nombre: "Plantilla 2", valor: "plantilla2" },
      { nombre: "Plantilla 3", valor: "plantilla3" },
    ]);
  }, []);

  useEffect(() => {
    import("../../services/lienzoCreacion.js").then(({ initCanvas }) => {
      canvasInstance.current = initCanvas(canvasRef.current, plantillaElegida);
    });
    return () => canvasInstance.current?.dispose();
  }, [plantillaElegida]);

  const agregarFigura = (funcion, ...args) => {
    import("../../services/lienzoCreacion.js").then(module => {
      module[funcion](canvasInstance.current, ...args);
    });
  };

  const activarModoDibujo = (opciones) => {
    import("../../services/lienzoCreacion.js").then(({ activarModoDibujo: activar }) => {
      activar(canvasInstance.current, opciones);
    });
  };


  const handleGuardarDiseno = () => setModalAbierto(true);

  const confirmarGuardado = async () => {
    setModalAbierto(false);
    try {
      const { guardarDiseno, guardarElementos } = await import("../../services/lienzoCreacion.js");
      const dataURL = guardarDiseno(canvasInstance.current);
      const elementos = guardarElementos(canvasInstance.current, plantillaElegida);
      console.log("Diseño guardado:", { dataURL, elementos });
    } catch (error) {
      console.error("Error al guardar el diseño:", error);
    }
  };

  return (
    <div className="container-fluid fondo">
      <div className="row">
        <div className="col-4 border-end">
          <MenuDiseno
            agregarFoto={(foto) => agregarFigura("agregarFoto", foto)}
            plantillaElegida={plantillaElegida}
            agregarTexto={(texto, color, tamaño, fuente) => agregarFigura("agregarTexto", texto, color, tamaño, fuente)}
            plantillas={plantillas}
            setPlantillaElegida={setPlantillaElegida}
            agregarCuadrado={(color) => agregarFigura("agregarCuadrado", color)}
            agregarRectangulo={(color) => agregarFigura("agregarRectangulo", color)}
            agregarCirculo={(color) => agregarFigura("agregarCirculo", color)}
            agregarEstrella={(color) => agregarFigura("agregarEstrella", color)}
            agregarLinea={(color) => agregarFigura("agregarLinea", color)}
            agregarTriangulo={(color) => agregarFigura("agregarTriangulo", color)}
            activarModoDibujo={activarModoDibujo}
          />
        </div>
        <div className="col-8">
          <Lienzo canvasRef={canvasRef} />
        </div>
      </div>

      <button
        style={{ color: "#fff", backgroundColor: "#016add", border: "none", borderRadius: "5px", padding: "12px 30px", position: "fixed", bottom: "20px", right: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        onClick={handleGuardarDiseno}
      >
        Guardar diseño
      </button>

      <Modal isVisible={modalAbierto} onClose={() => setModalAbierto(false)}>
        <MenuGuardado></MenuGuardado>
      </Modal>
    </div>
  );
}
