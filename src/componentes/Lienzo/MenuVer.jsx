import React from 'react'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { apiClient } from '../../config/axios'
import { FaEdit, FaCheck } from "react-icons/fa";

export default function MenuVer({ setModalVer, disenoClick, setDisenoClick }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: "onChange",
    });
    const [material, setMaterial] = useState("")
    const [tipoBolsa, setTipoBolsa] = useState("")
    const [ancho, setAncho] = useState("-")
    const [alto, setAlto] = useState("-")
    const [profundidad, setProfundidad] = useState("-")

    const [editNombre, setEditNombre] = useState(false);
    const [editDescripcion, setEditDescripcion] = useState(false);

    useEffect(() => {
        reset(disenoClick);
    }, [disenoClick, reset]);


    useEffect(() => {
        if (!disenoClick || !disenoClick.plantillaId) return;
        const fetchPlantilla = async () => {
            try {
                const res = await apiClient.get(`/plantillas/${disenoClick.plantillaId}`);
                setMaterial(res.data.data.material.nombre);
                setTipoBolsa(res.data.data.tipoBolsa.nombre)
                setAncho(res.data.data.ancho)
                setAlto(res.data.data.alto)
                setProfundidad(res.data.data.profundidad)
            }
            catch (error) {
                console.log("Ocurrió un error", error)
            }
        }
        fetchPlantilla()
    }, [disenoClick])

    const handleEditNombre = async (data) => {
        setEditNombre(false);
        try {
            const res = await apiClient.patch(`/disenos/${disenoClick.id}/nombre`,
                data.nombre,
                {
                    headers: {
                        "Content-Type": "text/plain",
                    }
                })
            disenoClick.nombre = res.data.data.nombre
            reset(disenoClick)
        } catch (error) {
            console.log("Ocurrió un error", error)
        }
    }

    const handleEditDesc = async (data) => {
        setEditDescripcion(false);
        try {
            const res = await apiClient.patch(`/disenos/${disenoClick.id}/descripcion`,
                data.descripcion,
                {
                    headers: {
                        "Content-Type": "text/plain",
                    }
                })
            disenoClick.descripcion = res.data.data.descripcion
            reset(disenoClick)
        } catch (error) {
            console.log("Ocurrió un error", error)
        }
    }

    const handleCerrarModal = async () => {

        if (editNombre) {
            await handleSubmit(handleEditNombre)();
        }

        if (editDescripcion) {
            await handleSubmit(handleEditDesc)();
        }

        setModalVer(false);
        setDisenoClick("");
    };


    return (
        <div style={{ width: "1000px" }}>
            <h2>Ver datos del diseño</h2>
            <hr></hr>
            <form
                onSubmit={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();

                        if (editNombre) {
                            handleSubmit(handleEditNombre)();
                            return;
                        }

                        if (editDescripcion) {
                            handleSubmit(handleEditDesc)();
                            return;
                        }
                    }
                }}
            >

                <br></br>
                <h3>Datos del diseño: </h3>
                <div>
                    <p className="fw-bold">Nombre:</p>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="text"
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            style={{ width: "400px" }}
                            {...register("nombre", {
                                required: "El nombre es obligatorio",
                                minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
                                maxLength: { value: 50, message: "El nombre no debe exceder los 50 caracteres" }
                            })}
                            disabled={!editNombre}
                        />

                        {!editNombre && (
                            <FaEdit
                                size={15}
                                style={{ cursor: "pointer" }}
                                onClick={() => { setEditNombre(true); setEditDescripcion(false); }}
                            />
                        )}

                        {editNombre && (
                            <FaCheck
                                size={15}
                                style={{ cursor: "pointer"}}
                                onClick={handleSubmit(handleEditNombre)}
                            />
                        )}
                    </div>

                    {/* ERROR ABAJO, FUERA DEL FLEX */}
                    {errors.nombre && (
                        <div className="invalid-feedback" style={{ display: "block" }}>
                            {errors.nombre.message}
                        </div>
                    )}
                </div>

                    <br />
                    <div>
                        <p className="fw-bold">Descripción:</p>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                                type="text"
                                className="form-control"
                                style={{ width: "400px" }}
                                {...register("descripcion")}
                                disabled={!editDescripcion}
                            />

                            {!editDescripcion && (
                                <FaEdit
                                    size={15}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => { setEditDescripcion(true); setEditNombre(false); }}
                                />
                            )}

                            {editDescripcion && (
                                <FaCheck
                                    size={15}
                                    style={{ cursor: "pointer"}}
                                    onClick={handleSubmit(handleEditDesc)}
                                />
                            )}
                        </div>

                        {errors.descripcion && <span>{errors.descripcion.message}</span>}
                    </div>


                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <p style={{fontWeight: "bold" }}>Fecha de creación: <span style={{ fontWeight: "normal" }}>{disenoClick.fechaCreacion.split("T")[0]}</span></p>
                    </div>
                    <br></br>
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <h3>Datos de la plantilla: </h3>
                        <p style={{fontWeight: "bold" }}>Nombre: <span style={{ fontWeight: "normal" }}>{disenoClick.plantillaNombre}</span></p>
                        <p style={{fontWeight: "bold" }}>Material: <span style={{ fontWeight: "normal" }}>{material}</span></p>
                        <p style={{fontWeight: "bold" }}>Tipo de bolsa: <span style={{ fontWeight: "normal" }}>{tipoBolsa}</span></p>
                        <p style={{fontWeight: "bold" }}>Ancho: <span style={{ fontWeight: "normal" }}>{ancho}</span></p>
                        <p style={{fontWeight: "bold" }}>Alto: <span style={{ fontWeight: "normal" }}>{alto}</span></p>
                        <p style={{fontWeight: "bold" }}>Profundidad: <span style={{ fontWeight: "normal" }}>{profundidad}</span></p>
                    </div>
                    <br></br>
                    <div>
                        <h3 style={{ color: "black" }}> Vista previa del diseño: </h3>
                        <img className="borde" style={{ borderRadius: "16px", maxWidth: "1000px", maxHeight: "750px" }}
                            src={`data:image/png;base64,${disenoClick.base64Preview}`} />
                    </div>
                    <br />
                    <button
                        className={`${errors.nombre ? 'btn' : 'boton-2'}`}
                        onClick={() => { handleCerrarModal() }}
                        style={{
                            width: "100px",
                            height: "40px",
                            border: "black",
                            color: "white",
                            borderRadius: "4px",
                            backgroundColor: "#016add",
                            zIndex: 9999,
                        }}
                        disabled={errors.nombre}
                    >
                        Volver
                    </button>

            </form>
        </div>
    )
}
