import * as fabric from "fabric";

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

  document.addEventListener("keydown", (e) => {
    // Borrar objetos
    if (e.key === "Delete" || e.key === "Backspace") {
      const activeObjects = canvas.getActiveObjects();
      if (!activeObjects || activeObjects.length === 0) return;
      let borro = false;
      activeObjects.forEach(obj => {
        const esTexto = obj.type === "textbox" || obj.type === "text" || obj.type === "i-text";
        const editandoTexto = esTexto && obj.isEditing;
        if (!editandoTexto) {
          borro = true;
          canvas.remove(obj);
        }
      });
      if (borro) {
        e.preventDefault();
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    }
  })
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

export function agregarTexto(canvas, texto, color, tamaño, fuente) {
  if (!canvas) return;
  const t = new fabric.Textbox(texto, { left: 100, top: 100, fill: color, fontSize: tamaño, fontFamily: fuente });
  canvas.add(t);
}

export function guardarDiseno(canvas) {
  if (!canvas) return null;
  const base64 = canvas.toDataURL({
    format: 'png',
    quality: 0.8
  });
  return base64.split(',')[1];
}

export function guardarElementos(canvas, templateId) {
  if (!canvas) return null;
  const canvasJson = canvas.toJSON();
  canvasJson.templateId = templateId;
  return canvasJson;
}

export function cargarDiseno(canvas, json) {
  if (!canvas || !json) return;
  const templateId = json.templateId;
  const backgroundUrl = `/plantillas/${templateId}.png`;
  fabric.Image.fromURL(backgroundUrl, img => {
    canvas.backgroundImage = img;
    canvas.loadFromJSON(canvasJson, () => canvas.renderAll());
  });
}
