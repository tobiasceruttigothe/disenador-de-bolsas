import { jsPDF } from "jspdf";
import logoSrc from "../assets/papersrl.png"; // tu logo

export function crearPDF(b64, nombre, descripcion, plantilla, material, tipoBolsa, ancho, alto, profundidad) {
    const imgSrc = `data:image/png;base64,${b64}`;
    const pdf = new jsPDF({ unit: "px", format: "a4" });

    const img = new Image();
    const logo = new Image();

    // Esperar a que ambas imágenes se carguen
    let imgLoaded = false;
    let logoLoaded = false;

    const trySavePDF = () => {
        if (!imgLoaded || !logoLoaded) return;
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;

        let y = 50;

        // Título principal
        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(28);
        pdf.text("Diseño Generado", pageWidth / 2, y, { align: "center" });

        // Línea horizontal debajo del título
        y += 15;
        pdf.setLineWidth(1.5);
        pdf.line(50, y, pageWidth - 50, y);

        // Espacio después del título
        y += 35;

        // Sección: Datos del diseño
        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("Datos del diseño", 50, y);
        y += 25;

        pdf.setFontSize(12);
        const leftMargin = 50;
        const labelWidth = 120;
        const valueStart = leftMargin + labelWidth;

        if (nombre) {
            pdf.setFont("Helvetica", "bold");
            pdf.text("Nombre:", leftMargin, y);
            pdf.setFont("Helvetica", "normal");
            pdf.text(nombre, valueStart, y);
            y += 22;
        }

        if (descripcion) {
            pdf.setFont("Helvetica", "bold");
            pdf.text("Descripción:", leftMargin, y);
            pdf.setFont("Helvetica", "normal");
            const lines = pdf.splitTextToSize(descripcion, pageWidth - valueStart - 50);
            lines.forEach((line, index) => {
                pdf.text(line, valueStart, y + (index * 16));
            });
            y += (lines.length * 16) + 6;
        }

        if (plantilla) {
            pdf.setFont("Helvetica", "bold");
            pdf.text("Plantilla:", leftMargin, y);
            pdf.setFont("Helvetica", "normal");
            pdf.text(plantilla, valueStart, y);
            y += 22;
        }

        // Espacio antes de la siguiente sección
        y += 15;

        // Sección: Datos de la plantilla
        if (material || tipoBolsa || ancho !== "-" || alto !== "-" || profundidad !== "-") {
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(18);
            pdf.text("Datos de la plantilla", 50, y);
            y += 25;

            pdf.setFontSize(12);
            
            if (material) {
                pdf.setFont("Helvetica", "bold");
                pdf.text("Material:", leftMargin, y);
                pdf.setFont("Helvetica", "normal");
                pdf.text(material, valueStart, y);
                y += 22;
            }
            
            if (tipoBolsa) {
                pdf.setFont("Helvetica", "bold");
                pdf.text("Tipo de bolsa:", leftMargin, y);
                pdf.setFont("Helvetica", "normal");
                pdf.text(tipoBolsa, valueStart, y);
                y += 22;
            }
            
            if (ancho !== "-") {
                pdf.setFont("Helvetica", "bold");
                pdf.text("Ancho:", leftMargin, y);
                pdf.setFont("Helvetica", "normal");
                pdf.text(`${ancho}`, valueStart, y);
                y += 22;
            }
            
            if (alto !== "-") {
                pdf.setFont("Helvetica", "bold");
                pdf.text("Alto:", leftMargin, y);
                pdf.setFont("Helvetica", "normal");
                pdf.text(`${alto}`, valueStart, y);
                y += 22;
            }
            
            if (profundidad !== "-") {
                pdf.setFont("Helvetica", "bold");
                pdf.text("Profundidad:", leftMargin, y);
                pdf.setFont("Helvetica", "normal");
                pdf.text(`${profundidad}`, valueStart, y);
                y += 22;
            }
        }
        
        // Línea separadora antes de la imagen
        y += 15;
        pdf.setLineWidth(0.8);
        pdf.line(50, y, pageWidth - 50, y);

        y += 20; // espacio extra antes de imagen
        
        // Calcular espacio disponible para la imagen (después de todos los datos)
        const espacioDisponible = pageHeight - y - 100; // 100px para márgenes y logo
        const ratio = Math.min((pageWidth - 100) / imgWidth, espacioDisponible / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        const xImg = (pageWidth - newWidth) / 2;
        
        pdf.addImage(img, "PNG", xImg, y, newWidth, newHeight);

        const logoWidth = 80; // ancho del logo en px
        const logoHeight = 30; // alto del logo en px
        const xLogo = pageWidth - logoWidth - 40; // margen derecho 40px
        const yLogo = pageHeight - logoHeight - 20; // margen inferior 20px
        pdf.addImage(logo, "PNG", xLogo, yLogo, logoWidth, logoHeight);

        pdf.save("diseño.pdf");
    };

    // Configurar handlers de carga de imágenes
    img.onload = () => {
        imgLoaded = true;
        trySavePDF();
    };

    img.onerror = (err) => {
        console.error("Error al cargar la imagen:", err);
    };

    logo.onload = () => {
        logoLoaded = true;
        trySavePDF();
    };

    logo.onerror = (err) => {
        console.error("Error al cargar el logo:", err);
        // Continuar sin logo si falla
        logoLoaded = true;
        trySavePDF();
    };

    // Iniciar carga de imágenes después de configurar los handlers
    img.src = imgSrc;
    logo.src = logoSrc;
}
