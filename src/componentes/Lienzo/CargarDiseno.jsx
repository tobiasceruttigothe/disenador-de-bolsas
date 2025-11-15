import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import Modal from "./ModalConfirmacion.jsx"
import MenuGuardado from "./MenuGuardado.jsx"
import Cookies from "js-cookie";
import axios from "axios";
import "../../index.css"
import { cargarDiseno } from "../../services/lienzoCreacion.js"
import { useParams } from "react-router-dom";
import * as fabric from "fabric";

export default function CargarDiseno() {
    const canvasRef = useRef(null);
    const canvasInstance = useRef(null);

    const [plantillaElegida, setPlantillaElegida] = useState();
    const [diseno, setDiseno] = useState()
    const [modalAbierto, setModalAbierto] = useState(false);
    const [base64, setBase64] = useState()

    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        const fetchDiseno = async () => {
            try {
                const token = Cookies.get("access_token");
                const res = await axios.get(`http://localhost:9090/api/disenos/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setDiseno(res.data.data);
                setBase64(JSON.parse(res.data.data.base64Diseno))

            } catch (e) {
                console.error("Error al cargar los diseños", e);
            }
        };
        fetchDiseno();
    }, [id]);

    useEffect(() => {
        const cargar = async () => {
            if (!base64 || !canvasRef.current) return;
            const fondo = base64.backgroundImage.src
            const objetos = base64.objects
            const { initCanvas } = await import("../../services/lienzoCreacion.js");

            canvasInstance.current = initCanvas(canvasRef.current, fondo);

            if (objetos && objetos.length > 0) {
                console.log(objetos)
                const objetosJSON = { version: base64.version, objects: objetos };
                canvasInstance.current.loadFromJSON(objetosJSON, () => {
                    canvasInstance.current.renderAll();
                });
            }
        };
        cargar()
    }, [base64]);




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

    const confirmarGuardado = async (nombre, descripcion) => {
        setModalAbierto(false);
        try {
            const { guardarDiseno, guardarElementos } = await import("../../services/lienzoCreacion.js");
            const dataURL = guardarDiseno(canvasInstance.current);
            const elementos = JSON.stringify(guardarElementos(canvasInstance.current));
            const payload = {
                usuarioId: Cookies.get("usuarioId"),
                plantillaId: plantillaElegida.id,
                nombre: nombre,
                descripcion: descripcion,
                base64Diseno: dataURL,
            };
            console.log(elementos);
            const token = Cookies.get("access_token");
            console.log(payload)
            const res = await axios.post("http://localhost:9090/api/disenos", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(res.data)
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
                <MenuGuardado confirmarGuardado={confirmarGuardado}></MenuGuardado>
            </Modal>
        </div>
    );
}
