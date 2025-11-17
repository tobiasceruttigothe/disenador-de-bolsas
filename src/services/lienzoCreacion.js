import * as fabric from "fabric";

let clickOutsideListener = null;


export function initCanvas(canvasElement, imageUrl) {
  const canvas = new fabric.Canvas(canvasElement, { width: 800, height: 600 });

  const imgElement = new Image();
  imgElement.src = imageUrl;
  imgElement.onload = () => {
    const bg = new fabric.Image(imgElement, { selectable: false, evented: false });
    canvas.setDimensions({
      width: imgElement.width,
      height: imgElement.height
    });
    canvas.backgroundImage = bg;
    canvas.renderAll();
  };



  document.addEventListener("keydown", (e) => {
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
  });

  return canvas;
}

// --- Funciones agregar objetos ---
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
  const t = new fabric.Textbox(texto, {
    left: 100, top: 100, fill: color, fontSize: tamaño, fontFamily: fuente
  });
  canvas.add(t);
}

// --- Guardar y cargar ---
export function guardarDiseno(canvas) {
  if (!canvas) return null;
  const base64 = canvas.toDataURL({ format: 'png', quality: 0.8 });
  return base64.split(',')[1];
}

export function guardarElementos(canvas) {
  if (!canvas) return null;
  const json = canvas.toJSON();
  return json;
}

export async function cargarCanvas(canvasElement, fondo, objetos) {

  const canvas = new fabric.Canvas(canvasElement, { width: 800, height: 600 });

  const imgElement = new Image();
  imgElement.src = fondo;
  imgElement.onload = () => {
    const bg = new fabric.Image(imgElement, { selectable: false, evented: false });
    canvas.setDimensions({
      width: imgElement.width,
      height: imgElement.height
    });
    canvas.backgroundImage = bg;
    canvas.renderAll();
  };

  for (const obj of objetos) {
    if (obj.type == "Image") {
      const img = new Image();
      img.src = obj.src;
      img.onload = () => {
        const fImg = new fabric.Image(img, {
          left: obj.left, top: obj.top, scaleX: obj.scaleX, scaleY: obj.scaleY,
          angle: obj.angle, flipX: obj.flipX, flipY: obj.flipY, height: obj.height, width: obj.width
        });
        canvas.add(fImg);
      };
    }
    if (obj.type == "Textbox") {
      const t = new fabric.Textbox(obj.text, {
        left: obj.left,
        top: obj.top,
        fill: obj.fill,
        fontSize: obj.fontSize,
        fontFamily: obj.fontFamily,
        fontWeight: obj.fontWeight || 'normal',
        fontStyle: obj.fontStyle || 'normal',
        textAlign: obj.textAlign || 'left',
        lineHeight: obj.lineHeight || 1.16,
        textDecoration: obj.textDecoration || '',
        opacity: obj.opacity ?? 1,
        width: obj.width,
        height: obj.height,
        angle: obj.angle,
        flipX: obj.flipX,
        flipY: obj.flipY,
        selectable: obj.selectable ?? true,
        evented: obj.evented ?? true,
        scaleX: 1,
        scaleY: 1
      });


      canvas.add(t);
    }
    if (obj.type == "Path") {
      const fPath = new fabric.Path(obj.path, {
        left: obj.left,
        top: obj.top,
        fill: obj.fill,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth,
        strokeLineCap: obj.strokeLineCap,
        strokeLineJoin: obj.strokeLineJoin,
        strokeMiterLimit: obj.strokeMiterLimit,
        strokeUniform: obj.strokeUniform,
        opacity: obj.opacity,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle,
        visible: obj.visible
      });
      canvas.add(fPath);
    }

    if (obj.type == "Rect") {
      const forma = new fabric.Rect({
        left: obj.left, top: obj.top, fill: obj.fill,
        width: obj.width, height: obj.height, angle: obj.angle,
        flipX: obj.flipX, flipY: obj.flipY
      })
      canvas.add(forma)
    }

    if (obj.type == "Circle") {
      const forma = new fabric.Circle({
        left: obj.left, top: obj.top, fill: obj.fill,
        width: obj.width, height: obj.height, angle: obj.angle,
        flipX: obj.flipX, flipY: obj.flipY
      })
      canvas.add(forma)
    }

    if (obj.type == "Triangle") {
      const forma = new fabric.Triangle({
        left: obj.left, top: obj.top, fill: obj.fill,
        width: obj.width, height: obj.height, angle: obj.angle,
        flipX: obj.flipX, flipY: obj.flipY
      })
      canvas.add(forma)
    }

    if (obj.type === "Line") {
      const forma = new fabric.Line(
        [obj.x1, obj.y1, obj.x2, obj.y2],
        {
          left: obj.left,
          top: obj.top,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          opacity: obj.opacity,
          angle: obj.angle,
          flipX: obj.flipX,
          flipY: obj.flipY,
          visible: obj.visible
        }
      );
      canvas.add(forma);
    }

    if (obj.type === "Polygon") {
      const poly = new fabric.Polygon(
        obj.points,
        {
          left: obj.left,
          top: obj.top,
          fill: obj.fill,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          opacity: obj.opacity,
          angle: obj.angle,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          flipX: obj.flipX,
          flipY: obj.flipY,
          visible: obj.visible,
          strokeLineJoin: obj.strokeLineJoin,
          strokeMiterLimit: obj.strokeMiterLimit
        }
      );
      canvas.add(poly);
    }
  }


  document.addEventListener("keydown", (e) => {
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
  });

  return canvas;
}

export function deseleccionar(canvas) {
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

// --- Figuras ---
export function agregarCuadrado(canvas, color) {
  if (!canvas) return;
  const rect = new fabric.Rect({ left: 100, top: 100, fill: color, width: 100, height: 100, selectable: true, hasControls: true, lockScalingFlip: true });
  canvas.add(rect);
}

export function agregarRectangulo(canvas, color) {
  if (!canvas) return;
  const rect = new fabric.Rect({ left: 100, top: 100, fill: color, width: 250, height: 100, selectable: true, hasControls: true, lockScalingFlip: true });
  canvas.add(rect);
}

export function agregarCirculo(canvas, color) {
  if (!canvas) return;
  const circle = new fabric.Circle({ left: 100, top: 100, fill: color, radius: 50, selectable: true, hasControls: true, lockScalingFlip: true });
  canvas.add(circle);
}

export function agregarTriangulo(canvas, color) {
  if (!canvas) return;
  const triangle = new fabric.Triangle({ left: 100, top: 100, fill: color, width: 100, height: 100, selectable: true, hasControls: true, lockScalingFlip: true });
  canvas.add(triangle);
}

export function agregarLinea(canvas, color) {
  if (!canvas) return;
  const line = new fabric.Line([50, 100, 200, 100], { left: 100, top: 100, stroke: color, strokeWidth: 5, selectable: true, hasControls: true, lockScalingFlip: true });
  canvas.add(line);
}

export function agregarEstrella(canvas, color) {
  if (!canvas) return;
  const star = new fabric.Polygon([
    { x: 100, y: 0 }, { x: 120, y: 70 }, { x: 190, y: 70 },
    { x: 130, y: 110 }, { x: 150, y: 180 }, { x: 100, y: 140 },
    { x: 50, y: 180 }, { x: 70, y: 110 }, { x: 10, y: 70 }, { x: 80, y: 70 }
  ], { left: 100, top: 100, fill: color, selectable: true, hasControls: true, lockScalingFlip: true });
  canvas.add(star);
}

// --- Modo dibujo ---
export function activarModoDibujo(canvas, options = {}) {
  if (!canvas) return;

  const brushType = options.brush || "PencilBrush";

  const brushesMap = {
    PencilBrush: fabric.PencilBrush,
    CircleBrush: fabric.CircleBrush,
    SprayBrush: fabric.SprayBrush,
    PatternBrush: fabric.PatternBrush,
    SquareBrush: fabric.SquareBrush
  };

  const BrushClass = brushesMap[brushType] || fabric.PencilBrush;
  const brushInstance = new BrushClass(canvas);

  brushInstance.color = options.color || "#000000";
  brushInstance.width = options.width || 5;
  brushInstance.shadow = new fabric.Shadow({
    blur: options.shadowBlur || 0,
    offsetX: options.shadowOffsetX || 0,
    offsetY: options.shadowOffsetY || 0,
    affectStroke: true,
    color: options.shadowColor || "#000000"
  });

  canvas.freeDrawingBrush = brushInstance;
  canvas.isDrawingMode = true;

  // Desactivar dibujo si hace click fuera del canvas
  if (!clickOutsideListener) {
    clickOutsideListener = (e) => {
      const canvasEl = canvas.upperCanvasEl;
      if (!canvasEl.contains(e.target)) {
        canvas.isDrawingMode = false;
        document.removeEventListener("mousedown", clickOutsideListener);
        clickOutsideListener = null;
      }
    };
    document.addEventListener("mousedown", clickOutsideListener);
  }
}

export function desactivarModoDibujo(canvas) {
  if (!canvas) return;
  canvas.isDrawingMode = false;

  if (clickOutsideListener) {
    document.removeEventListener("mousedown", clickOutsideListener);
    clickOutsideListener = null;
  }
}
