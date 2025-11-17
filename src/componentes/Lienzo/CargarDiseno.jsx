import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import "../../index.css"
import { useParams, useNavigate } from "react-router-dom";


export default function CargarDiseno() {
    const canvasRef = useRef(null);
    const canvasInstance = useRef(null);

    const [plantillaElegida, setPlantillaElegida] = useState();
    const [diseno, setDiseno] = useState()
    const [base64, setBase64] = useState()
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")

    const { id } = useParams();

    const navigate = useNavigate()

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
                setNombre(res.data.data.nombre)
                setDescripcion(res.data.data.descripcion)
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
            if (canvasInstance.current) {
                canvasInstance.current.dispose();
            }
            const fondo = base64.backgroundImage.src
            const objetos = base64.objects
            const { cargarCanvas } = await import("../../services/lienzoCreacion.js");

            canvasInstance.current = await cargarCanvas(canvasRef.current, fondo, objetos);
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


    const handleGuardarDiseno = async () => {
        try {
            const { guardarDiseno, guardarElementos } = await import("../../services/lienzoCreacion.js");
            const dataURL = guardarDiseno(canvasInstance.current);
            const elementos = JSON.stringify(guardarElementos(canvasInstance.current));
            const payload = {
                nombre: nombre,
                descripcion: descripcion,
                base64Diseno: elementos,
                base64Preview: dataURL
            };
            const token = Cookies.get("access_token");
            console.log(payload)
            const res = await axios.put(`http://localhost:9090/api/disenos/${id}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            alert("Diseño actualizado correctamente.")
            navigate("/disenos")
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
                style={{ backgroundColor: "white", color: "#016add", border: "2px solid #016add", borderRadius: "7px", padding: "12px 30px", position: "fixed", bottom: "20px", right: "200px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                onClick={()=>navigate(-1)}
            >
                Cancelar
            </button>

            <button
                style={{ color: "#fff", border: "2px solid #016add", backgroundColor: "#016add", borderRadius: "5px", padding: "12px 30px", position: "fixed", bottom: "20px", right: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                onClick={handleGuardarDiseno}
            >
                Guardar diseño
            </button>
        </div>
    );
}
