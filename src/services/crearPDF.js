import { jsPDF } from "jspdf";
import logoSrc from "../assets/papersrl.png";

export function crearPDF(b64, nombre, descripcion, plantilla, material, tipoBolsa, ancho, alto, profundidad) {
    const imgSrc = `data:image/png;base64,${b64}`;
    // Usamos 'pt' para mayor precisión tipográfica, A4
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    const img = new Image();
    const logo = new Image();

    let imgLoaded = false;
    let logoLoaded = false;

    // Colores corporativos (Puedes ajustar estos valores RGB a los de tu marca)
    const PRIMARY_COLOR = [41, 128, 185]; // Azul profesional
    const SECONDARY_COLOR = [240, 240, 240]; // Gris muy claro para fondos
    const TEXT_COLOR = [60, 60, 60]; // Gris oscuro para texto
    const LABEL_COLOR = [120, 120, 120]; // Gris para etiquetas

    const trySavePDF = () => {
        if (!imgLoaded || !logoLoaded) return;

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;

        // --- 1. ENCABEZADO ---
        // Franja de color superior
        pdf.setFillColor(...PRIMARY_COLOR);
        pdf.rect(0, 0, pageWidth, 80, 'F');

        // Título del documento (Blanco)
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor(255, 255, 255);
        pdf.text("Ficha Técnica de Diseño", margin, 50);

        // Logo (Sobre la franja azul, alineado a la derecha)
        // Ajustamos el logo para que entre en el header
        const logoWidth = 100;
        const logoRatio = logo.height / logo.width;
        const logoHeight = logoWidth * logoRatio;
        pdf.addImage(logo, "PNG", pageWidth - margin - logoWidth, 40 - (logoHeight / 2), logoWidth, logoHeight);

        // --- 2. CONTENEDOR DE DATOS (Fondo gris suave) ---
        let y = 110;
        
        // Dibujar fondo para la sección de datos
        pdf.setFillColor(...SECONDARY_COLOR);
        // Rectángulo redondeado simulado (o normal)
        pdf.rect(margin, y, pageWidth - (margin * 2), 160, 'F');

        // Configuraciones de texto para datos
        const col1X = margin + 20;
        const col2X = pageWidth / 2 + 20;
        let yText = y + 30;

        // Función auxiliar para dibujar pares Etiqueta: Valor
        const drawField = (label, value, x, currentY) => {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(...LABEL_COLOR);
            pdf.text(label.toUpperCase(), x, currentY);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);
            pdf.setTextColor(...TEXT_COLOR);
            // Si el valor no existe o es guión, poner "N/A"
            const valStr = (value && value !== "-") ? String(value) : "N/A";
            pdf.text(valStr, x, currentY + 12);
            
            return 35; // Espacio para el siguiente campo
        };

        // --- COLUMNA IZQUIERDA: Info General ---
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(...PRIMARY_COLOR);
        pdf.text("Información General", col1X, yText - 10);

        let yLeft = yText + 10;
        yLeft += drawField("Nombre del Proyecto", nombre, col1X, yLeft);
        yLeft += drawField("Plantilla Base", plantilla, col1X, yLeft);
        
        // Descripción (Manejo de texto largo)
        if (descripcion) {
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(...LABEL_COLOR);
            pdf.text("DESCRIPCIÓN", col1X, yLeft);
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10); // Un poco más chica para que entre
            pdf.setTextColor(...TEXT_COLOR);
            const descLines = pdf.splitTextToSize(descripcion, (pageWidth / 2) - margin - 40);
            pdf.text(descLines, col1X, yLeft + 12);
        }

        // --- COLUMNA DERECHA: Especificaciones ---
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(...PRIMARY_COLOR);
        pdf.text("Especificaciones Técnicas", col2X, yText - 10);

        let yRight = yText + 10;
        yRight += drawField("Material", material, col2X, yRight);
        yRight += drawField("Tipo de Bolsa", tipoBolsa, col2X, yRight);
        
        // Dimensiones en una sola línea para ahorrar espacio
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(...LABEL_COLOR);
        pdf.text("DIMENSIONES (An x Al x Pr)", col2X, yRight);
        
        pdf.setFont("helvetica", "bold"); // Destacar las medidas
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const medidas = `${ancho || '-'} x ${alto || '-'} x ${profundidad || '-'} cm`;
        pdf.text(medidas, col2X, yRight + 12);


        // --- 3. VISTA PREVIA DEL DISEÑO ---
        y = 300; // Posición debajo del cuadro gris

        // Título de la sección imagen
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(...TEXT_COLOR);
        pdf.text("VISTA PREVIA DEL DISEÑO", margin, y);
        
        // Línea separadora fina
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, y + 5, pageWidth - margin, y + 5);

        y += 20;

        // Calcular ratio de imagen para centrar y maximizar
        const maxImgHeight = pageHeight - y - 60; // Dejar 60px para footer
        const maxImgWidth = pageWidth - (margin * 2);
        
        const imgRatio = Math.min(maxImgWidth / img.width, maxImgHeight / img.height);
        const finalWidth = img.width * imgRatio;
        const finalHeight = img.height * imgRatio;
        const centerX = (pageWidth - finalWidth) / 2;

        // Borde alrededor de la imagen (simula un marco)
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(1);
        pdf.rect(centerX - 1, y - 1, finalWidth + 2, finalHeight + 2); // Borde fino
        
        // Imagen
        pdf.addImage(img, "PNG", centerX, y, finalWidth, finalHeight);

        // --- 4. PIE DE PÁGINA ---
        const today = new Date().toLocaleDateString();
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Generado el ${today} | Paper S.R.L - Sistema de Diseño`, pageWidth / 2, pageHeight - 20, { align: "center" });

        // Guardar
        const cleanName = nombre ? nombre.replace(/\s+/g, '_') : 'diseno';
        pdf.save(`${cleanName}_ficha_tecnica.pdf`);
    };

    // Manejo de carga asíncrona (igual que antes, pero crítico)
    img.onload = () => { imgLoaded = true; trySavePDF(); };
    logo.onload = () => { logoLoaded = true; trySavePDF(); };
    img.onerror = () => { console.error("Error img"); };
    logo.onerror = () => { logoLoaded = true; trySavePDF(); }; // Si falla logo, imprime igual

    img.src = imgSrc;
    logo.src = logoSrc;
}