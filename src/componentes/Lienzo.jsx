import React, { useRef, useEffect } from "react";
import { initCanvas } from "./lienzoCreacion.js";
import plantillaprueba from "/plantillaprueba.png";

export default function Lienzo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = initCanvas(canvasRef.current, plantillaprueba);
    let isMounted = true

    return () => {
      isMounted = false; 
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
}
