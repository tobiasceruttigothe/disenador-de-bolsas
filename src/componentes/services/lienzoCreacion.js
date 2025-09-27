import * as fabric from "fabric";
import cara from "/caraejemplo.jpeg"

export function initCanvas(canvasElement, imageUrl) {
    const imgElement = new Image();
    imgElement.src = imageUrl;
    
    if (!canvasElement) return;

    const canvas = new fabric.Canvas(canvasElement, {
        width: imgElement.width,
        height: imgElement.height,
    });

    const text = new fabric.Textbox("Hola!", { left: 50, top: 50, fill: "red" });
    canvas.add(text);

    const imagen = new Image();
    imagen.src = cara
    imagen.onload = () => {
        const img = new fabric.Image(imagen, {
            left: 0,
            top: 0})
        canvas.add(img)}

    
    imgElement.onload = () => {
        const img = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
        });
        canvas.backgroundImage = img;
        canvas.requestRenderAll();
    };

    return canvas;
}
