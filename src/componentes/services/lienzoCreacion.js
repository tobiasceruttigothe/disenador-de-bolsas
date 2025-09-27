import * as fabric  from "fabric";

export function initCanvas(canvasElement, imageUrl) {
  const canvas = new fabric.Canvas(canvasElement, { width: 800, height: 600 });

  const imgElement = new Image();
  imgElement.src = imageUrl;
  imgElement.onload = () => {
    const bg = new fabric.Image(imgElement, { selectable: false, evented: false });
    canvas.setDimensions({
        width: imgElement.width,
        height: imgElement.height
    })
    canvas.backgroundImage = bg 
    canvas.renderAll.bind(canvas);
  };

  return canvas;
}

export function agregarFoto(canvas, url) {
  if (!canvas) return;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const fImg = new fabric.Image(img, { left: 50, top: 50, scaleX: 0.5, scaleY: 0.5 });
    canvas.add(fImg);
  };
}

export function agregarTexto(canvas, texto, color = "black", tamaño = 20, fuente = "Arial") {
  if (!canvas) return;
  const t = new fabric.Textbox(texto, { left: 100, top: 100, fill: color, fontSize: tamaño, fontFamily: fuente });
  canvas.add(t);
}
