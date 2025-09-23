import * as fabric from "fabric";

export function initCanvas(canvasElement, imageUrl) {
    if (!canvasElement) return;

    const canvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 500,
    });

    // Texto de ejemplo
    const text = new fabric.Textbox("Hola!", { left: 50, top: 50, fill: "red" });
    canvas.add(text);

    // Imagen de fondo
    const imgElement = new Image();
    imgElement.src = imageUrl;
    imgElement.onload = () => {
        const img = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
        });
        canvas.backgroundImage = img;
        canvas.requestRenderAll();;
    };

    return canvas;
}
