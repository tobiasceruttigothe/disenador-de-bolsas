import React, { useRef, useEffect, useState } from "react";
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import Cookies from "js-cookie";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import "../../index.css"
import { useParams, useNavigate } from "react-router-dom";
import ModalLogos from "./ModalLogos.jsx";
import Modal from "./ModalConfirmacion.jsx"



export default function CargarDiseno() {
    const canvasRef = useRef(null);
    const canvasInstance = useRef(null);

    const [plantillaElegida, setPlantillaElegida] = useState();
    const [diseno, setDiseno] = useState()
    const [base64, setBase64] = useState()
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")

    const [logosBool, setLogosBool] = useState(false);
    const [logos, setLogos] = useState([]);

    const { id } = useParams();

    const navigate = useNavigate()
    const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

    useEffect(() => {
        if (!id) return;
        const fetchDiseno = async () => {
            try {
                const res = await apiClient.get(`/disenos/${id}`);
                setPlantillaElegida(res.data.data.plantillaId);
                setDiseno(res.data.data);
                setNombre(res.data.data.nombre)
                setDescripcion(res.data.data.descripcion)
                setBase64(JSON.parse(res.data.data.base64Diseno))
            } catch (e) {
                console.error("Error al cargar los diseños", e);
                mostrarError("Error al cargar el diseño. Intente nuevamente.");
            }
        };
        fetchDiseno();
    }, [id]);

    useEffect(() => {
        const fetchLogos = async () => {
            try {
                const id = Cookies.get("usuarioId");
                if (!id) {
                    console.error("No se encontró el ID de usuario");
                    return;
                }
                const res = await apiClient.get(`/logos/usuario/${id}`);
                setLogos(res.data.data || []);
            } catch (e) {
                console.error("Error al cargar los logos", e);
            }
        };
        fetchLogos();
    }, []);

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
            const res = await apiClient.put(`/disenos/${id}`, payload);
            mostrarExito("Diseño actualizado correctamente.");
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error("Error al guardar el diseño:", error);
            if (error.response && error.response.status === 403) {
                mostrarError("No tienes permisos para actualizar diseños. Verifica tu sesión.");
            } else if (error.response && error.response.status === 401) {
                mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            } else {
                mostrarError("Error al actualizar el diseño. Intente nuevamente.");
            }
        }
    };

    return (
        <div className="container-fluid fondo" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
            <div className="row">
                <div className="col-4 border-end1">
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
                        setLogosBool={setLogosBool}
                        logos={logos}
                    />
                </div>
                <div className="col-8" style={{ height: "760px", widht: "100%" }}>
                    <Lienzo canvasRef={canvasRef} />
                </div>
            </div>

            <button
                className="fondo-boton"
                style={{ width: "150px", height: "50px", position: "fixed", bottom: "20px", right: "200px", fontWeight: "700" }}
                onClick={() => navigate("/disenos")}
            >
                Cancelar
            </button>

            <button
                className="boton-2"
                style={{ width: "150px", height: "50px", position: "fixed", bottom: "20px", right: "25px", fontWeight: "700" }}
                onClick={handleGuardarDiseno}
            >
                Guardar diseño
            </button>

            <Modal isVisible={logosBool} onClose={() => setLogosBool(false)}>
                <ModalLogos setLogosBool={setLogosBool} logos={logos} setLogos={setLogos}></ModalLogos>
            </Modal>

            <Notificacion
                tipo={notificacion.tipo}
                mensaje={notificacion.mensaje}
                visible={notificacion.visible}
                onClose={ocultarNotificacion}
                duracion={notificacion.duracion}
            />
        </div>
    );
}
