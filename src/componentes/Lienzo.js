import * as fabric from "fabric";

export function initCanvas(canvasElement, imageUrl) {
    if (!canvasElement) return;

    const canvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 700,
    });

    // Texto de ejemplo
    const text = new fabric.Textbox("Hola!", { left: 50, top: 50, fill: "red" });
    canvas.add(text);

    // Imagen
    const imgElement = new Image();
    imgElement.src = imageUrl; // puede ser ruta desde public o import desde src/assets
    imgElement.onload = () => {
        const img = new fabric.Image(imgElement, {
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
        });
        canvas.add(img);
    };

    return canvas; // opcional, por si querés manipularlo afue
}