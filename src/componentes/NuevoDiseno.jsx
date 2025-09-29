import React, { useRef, useEffect } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo";
import plantillaprueba from "/plantillaprueba.png";
import caraejemplo from "/caraejemplo.jpeg";

export default function NuevoDiseno() {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    import("../services/lienzoCreacion.js").then(({ initCanvas }) => {
      canvasInstance.current = initCanvas(canvasRef.current, plantillaprueba);
    });
    return () => canvasInstance.current?.dispose();
  }, []);

  const agregarFoto = (foto) => {
    import("../services/lienzoCreacion.js").then(({ agregarFoto}) => {
      agregarFoto(canvasInstance.current, foto);
    });
  };

  const agregarTexto = (texto, color, tamaño, fuente) => {
    import("../services/lienzoCreacion.js").then(({ agregarTexto }) => {
      agregarTexto(canvasInstance.current, texto, color, tamaño, fuente);
    });
  };

  return (
    <div className="container-fluid bg-light">
      <div className="row">
        <div className="col-3 border-end">
          <MenuDiseno agregarFoto={agregarFoto} agregarTexto={agregarTexto} />
        </div>
        <div className="col-9">
          <Lienzo canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}
