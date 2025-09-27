import React, { useRef, useEffect } from "react";
import { initCanvas, agregarFoto, agregarTexto } from "./services/lienzoCreacion.js";
import plantillaprueba from "/plantillaprueba.png";
import caraejemplo from "/caraejemplo.jpeg";

export default function Lienzo() {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    canvasInstance.current = initCanvas(canvasRef.current, plantillaprueba);
    return () => canvasInstance.current?.dispose();
  }, []);

  const handleAgregarFoto = () => {
    agregarFoto(canvasInstance.current, caraejemplo);
  };

  const handleAgregarTexto = () => {
    agregarTexto(canvasInstance.current, "Hola mundo!", "blue", 30, "Arial");
  };

  return (
    <div>
      <button onClick={handleAgregarFoto}>Agregar Foto</button>
      <button onClick={handleAgregarTexto}>Agregar Texto</button>
      <canvas ref={canvasRef} />
    </div>
  );
}
