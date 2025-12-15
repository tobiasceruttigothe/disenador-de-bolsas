import { useState } from "react";
import MenuImagen from "./MenuImagen";
import MenuTexto from "./MenuTexto";
import MenuFormas from "./MenuFormas";
import MenuLogos from "./MenuLogos";
import MenuPincel from "./MenuPincel";
import MenuInformacion from "./MenuInformacion";

export default function MenuDiseno({
  logos,
  setLogosBool,
  agregarFoto,
  agregarTexto,
  plantillaElegida,
  agregarCuadrado,
  agregarRectangulo,
  agregarCirculo,
  agregarEstrella,
  agregarLinea,
  agregarTriangulo,
  activarModoDibujo
}) {
  const [opcion, setOpcion] = useState("imagen");

  return (
    <div
      className="card-diseño shadow-sm mt-3 d-flex flex-column"
      style={{
        height: "77vh",        // 🔥 ALTURA REAL
        maxHeight: "800px",
        overflow: "hidden"
      }}
    >
      {/* HEADER FIJO */}
      <div className="card-header card-menu py-3 flex-shrink-0">
        <h5 className="mb-0 fw-bold text-primary">Menú de Diseño</h5>
      </div>

      {/* CUERPO */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* SIDEBAR FIJO */}
        <div
          className="d-flex flex-column card-opciones flex-shrink-0"
          style={{
            width: "100px",
            padding: "10px",
            overflowY: "auto"
          }}
        >
          <NavButton active={opcion === "imagen"} onClick={() => setOpcion("imagen")} icon="fa-image" label="Imagen" />
          <NavButton active={opcion === "texto"} onClick={() => setOpcion("texto")} icon="fa-font" label="Texto" />
          <NavButton active={opcion === "pincel"} onClick={() => setOpcion("pincel")} icon="fa-paint-brush" label="Pincel" />
          <NavButton active={opcion === "formas"} onClick={() => setOpcion("formas")} icon="fa-shapes" label="Formas" />
          <NavButton active={opcion === "logo"} onClick={() => setOpcion("logo")} icon="fa-icons" label="Logos" />
          <NavButton active={opcion === "info"} onClick={() => setOpcion("info")} icon="fa-info-circle" label="Info" />
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-grow-1 overflow-auto">
          {opcion === "imagen" && <MenuImagen agregarFoto={agregarFoto} />}
          {opcion === "texto" && <MenuTexto agregarTexto={agregarTexto} />}
          {opcion === "pincel" && <MenuPincel activarModoDibujo={activarModoDibujo} />}
          {opcion === "formas" && (
            <MenuFormas
              agregarCuadrado={agregarCuadrado}
              agregarRectangulo={agregarRectangulo}
              agregarCirculo={agregarCirculo}
              agregarEstrella={agregarEstrella}
              agregarLinea={agregarLinea}
              agregarTriangulo={agregarTriangulo}
            />
          )}
          {opcion === "logo" && (
            <MenuLogos
              logos={logos}
              agregarFoto={agregarFoto}
              setLogosBool={setLogosBool}
            />
          )}
          {opcion === "info" && (
            <MenuInformacion plantilla={plantillaElegida} />
          )}
        </div>
      </div>
    </div>
  );
}

/* BOTÓN DEL SIDEBAR */
function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      className={`btn w-100 mb-2 d-flex flex-column align-items-center justify-content-center py-2
        ${active ? "btn-primary" : "btn-outline-secondary border-0"}`}
      onClick={onClick}
      style={{
        fontSize: "0.85rem",
        height: "70px",
        transition: "all 0.2s"
      }}
    >
      <i className={`fa ${icon} fs-5 mb-1`} />
      {label}
    </button>
  );
}
