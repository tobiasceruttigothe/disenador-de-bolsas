import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import Modal from "./ModalConfirmacion.jsx"
import MenuGuardado from "./MenuGuardado.jsx"
import Cookies from "js-cookie";
import axios from "axios";
import "../../index.css"

export default function NuevoDiseno() {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  const [plantillas, setPlantillas] = useState([]);
  const [plantillaElegida, setPlantillaElegida] = useState();
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const id = Cookies.get("usuarioId");
        const res = await axios.get(`http://localhost:9090/api/plantillas/usuario/${id}/habilitadas`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPlantillas(res.data.data);
      } catch (e) {
        console.error("Error al cargar las plantillas", e);
      }
    };
    fetchPlantillas();

  }, []);

  useEffect(() => {
    const cargarPlantilla = async () => {
      if (!plantillaElegida) return;

      try {
        const token = Cookies.get("access_token");
        const res = await axios.get(`http://localhost:9090/api/plantillas/${plantillaElegida.id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const base64 = res.data.data.base64Plantilla;
        const { initCanvas } = await import("../../services/lienzoCreacion.js");

        canvasInstance.current = initCanvas(canvasRef.current, `data:image/png;base64,${base64}`);

      } catch (error) {
        console.error("Error al cargar la plantilla:", error);
      }
    };

    cargarPlantilla();

    return () => canvasInstance.current?.dispose();
  }, [plantillaElegida]);

  const agregarFigura = (funcion, ...args) => {
    import("../../services/lienzoCreacion.js").then(module => {
      module[funcion](canvasInstance.current, ...args);
    });
  };

  const activarModoDibujo = (opciones) => {
    import("../../services/lienzoCreacion.js").then(({ activarModoDibujo: activar }) => {
      activar(canvasInstance.current, opciones);
    });
  };


  const handleGuardarDiseno = () => setModalAbierto(true);

  const confirmarGuardado = async () => {
    setModalAbierto(false);
    try {
      const { guardarDiseno, guardarElementos } = await import("../../services/lienzoCreacion.js");
      const dataURL = guardarDiseno(canvasInstance.current);
      const elementos = guardarElementos(canvasInstance.current, plantillaElegida);
      console.log("Diseño guardado:", { dataURL, elementos });
    } catch (error) {
      console.error("Error al guardar el diseño:", error);
    }
  };

  return (
    <div className="container-fluid fondo">
      <div className="row">
        <div className="col-4 border-end">
          <MenuDiseno
            agregarFoto={(foto) => agregarFigura("agregarFoto", foto)}
            plantillaElegida={plantillaElegida}
            agregarTexto={(texto, color, tamaño, fuente) => agregarFigura("agregarTexto", texto, color, tamaño, fuente)}
            plantillas={plantillas}
            setPlantillaElegida={setPlantillaElegida}
            agregarCuadrado={(color) => agregarFigura("agregarCuadrado", color)}
            agregarRectangulo={(color) => agregarFigura("agregarRectangulo", color)}
            agregarCirculo={(color) => agregarFigura("agregarCirculo", color)}
            agregarEstrella={(color) => agregarFigura("agregarEstrella", color)}
            agregarLinea={(color) => agregarFigura("agregarLinea", color)}
            agregarTriangulo={(color) => agregarFigura("agregarTriangulo", color)}
            activarModoDibujo={activarModoDibujo}
          />
        </div>
        <div className="col-8">
          <Lienzo canvasRef={canvasRef} />
        </div>
      </div>

      <button
        style={{ color: "#fff", backgroundColor: "#016add", border: "none", borderRadius: "5px", padding: "12px 30px", position: "fixed", bottom: "20px", right: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        onClick={handleGuardarDiseno}
      >
        Guardar diseño
      </button>

      <Modal isVisible={modalAbierto} onClose={() => setModalAbierto(false)}>
        <MenuGuardado></MenuGuardado>
      </Modal>
    </div>
  );
}
