import { jsPDF } from "jspdf";
import logoSrc from "../assets/papersrl.png"; // tu logo

export function crearPDF(b64, nombre, descripcion, plantilla) {
    const imgSrc = `data:image/png;base64,${b64}`;
    const pdf = new jsPDF({ unit: "px", format: "a4" });

    const img = new Image();
    img.src = imgSrc;

    const logo = new Image();
    logo.src = logoSrc;

    img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;

        const ratio = Math.min((pageWidth - 60) / imgWidth, (pageHeight - 300) / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        const xImg = (pageWidth - newWidth) / 2;

        let y = 40;

        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(26);
        pdf.text("Diseño Generado", pageWidth / 2, y, { align: "center" });

        // Línea horizontal
        y += 10;
        pdf.setLineWidth(1);
        pdf.line(40, y, pageWidth - 40, y);

        y += 30;
        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(14);
        if (nombre) {
            pdf.text("Nombre:", 40, y);
            pdf.setFont("Helvetica", "normal");
            pdf.text(nombre, 100, y);
            y += 20;
        }

        if (descripcion) {
            pdf.setFont("Helvetica", "bold");
            pdf.text("Descripción:", 40, y);
            pdf.setFont("Helvetica", "normal");
            const lines = pdf.splitTextToSize(descripcion, pageWidth - 120); // margen derecho 40px
            lines.forEach(line => {
                pdf.text(line, 100, y);
                y += 18;
            });
        }

        if (plantilla) {
            pdf.setFont("Helvetica", "bold");
            pdf.text("Plantilla:", 40, y);
            pdf.setFont("Helvetica", "normal");
            pdf.text(plantilla, 100, y);
            y += 20;
        }
        y += 10;
        pdf.setLineWidth(0.5);
        pdf.line(40, y, pageWidth - 40, y);

        y += 20; // espacio extra antes de imagen
        pdf.addImage(img, "PNG", xImg, y, newWidth, newHeight);

        const logoWidth = 80; // ancho del logo en px
        const logoHeight = 30; // alto del logo en px
        const xLogo = pageWidth - logoWidth - 40; // margen derecho 40px
        const yLogo = pageHeight - logoHeight - 20; // margen inferior 20px
        pdf.addImage(logo, "PNG", xLogo, yLogo, logoWidth, logoHeight);

        pdf.save("diseño.pdf");
    };
}
