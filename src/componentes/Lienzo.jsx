import React, { useRef, useEffect } from "react";
import * as fabric  from "fabric";
import plantillaprueba from "/plantillaprueba.png";

export default function Lienzo() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);


  useEffect(() => {
    if (fabricCanvas.current) {
      fabricCanvas.current.dispose();
      fabricCanvas.current = null;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1000,
      height: 600,
    });
    fabricCanvas.current = canvas;
    const minion = "/minion.jpeg"

    const rect = new fabric.Textbox("paperSRL", {
      left: 100,
      top: 100,
      fill: "red",
      width: 80,
      height: 80,
    });
    canvas.add(rect);

    // Agregar una imagen
   fabric.Image.fromURL(minion, (img) => {
    img.set({
      left: 200,
      top: 200,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    canvas.add(img);
  });


    return () => {
      canvas.dispose();
      fabricCanvas.current = null;
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: 1000,
        height: 600,
        border: "2px solid #016abaa6",
        borderRadius: "3px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${plantillaprueba})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
}
