import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import plantillaprueba from "../../assets/plantillaprueba.png";

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

  const agregarTexto = (texto, color, tamaño, fuente) => {
    import("../../services/lienzoCreacion.js").then(({ agregarTexto }) => {
      agregarTexto(canvasInstance.current, texto, color, tamaño, fuente);
    });
  };

  return (
    <div className="container-fluid bg-light">
      <div className="row">
        <div className="col-4 border-end">
          <MenuDiseno agregarFoto={agregarFoto} plantillaElegida={plantillaElegida} agregarTexto={agregarTexto} plantillas={plantillas} setPlantillaElegida={setPlantillaElegida} />
        </div>
        <div className="col-8">
          <Lienzo canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
