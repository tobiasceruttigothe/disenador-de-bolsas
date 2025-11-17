import React from 'react'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import { FaEdit, FaCheck } from "react-icons/fa";

export default function MenuVer({ setModalVer, disenoClick, setDisenoClick }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [material, setMaterial] = useState("")
    const [tipoBolsa, setTipoBolsa] = useState("")
    const [ancho, setAncho] = useState("-")
    const [alto, setAlto] = useState("-")
    const [profundidad, setProfundidad] = useState("-")

    const [editNombre, setEditNombre] = useState(false);
    const [editDescripcion, setEditDescripcion] = useState(false);

    useEffect(() => {
        reset(disenoClick)
    }, [reset])

    useEffect(() => {
        const fetchPlantilla = async () => {
            try {
                const token = Cookies.get("access_token")
                const res = await axios.get(`http://localhost:9090/api/plantillas/${disenoClick.plantillaId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
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
    }, [reset])
    return (
        <div style={{ width: "1000px" }}>
            <h2>Ver datos del diseño</h2>
            <hr></hr>
            <form onSubmit={handleSubmit((data) => {
                confirmarGuardado(data.nombre, data.descripcion);
                reset();
            })}>
                <br></br>
                <h3>Datos del diseño: </h3>
                <div>
                    <p className="fw-bold" style={{ color: "black" }}>Nombre:</p>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="text"
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            style={{ width: "400px" }}
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                            disabled={!editNombre}
                        />

                        {!editNombre && (
                            <FaEdit
                                size={15}
                                style={{ cursor: "pointer" }}
                                onClick={() => setEditNombre(true)}
                            />
                        )}

                        {editNombre && (
                            <FaCheck
                                size={15}
                                style={{ cursor: "pointer", color: "black" }}
                                onClick={() => setEditNombre(false)}
                            />
                        )}
                    </div>

                    {errors.nombre && (<div className="invalid-feedback">{errors.nombre.message}</div>)}
                </div>

                <br />
                <div>
                    <p className="fw-bold" style={{ color: "black" }}>Descripción:</p>

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
                                onClick={() => setEditDescripcion(true)}
                            />
                        )}

                        {editDescripcion && (
                            <FaCheck
                                size={15}
                                style={{ cursor: "pointer", color: "black" }}
                                onClick={() => setEditDescripcion(false)}
                            />
                        )}
                    </div>

                    {errors.descripcion && <span>{errors.descripcion.message}</span>}
                </div>


                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <p style={{ color: "black", fontWeight: "bold" }}>Fecha de creación: <span style={{ fontWeight: "normal" }}>{disenoClick.fechaCreacion.split("T")[0]}</span></p>
                </div>
                <br></br>
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <h3>Datos de la plantilla: </h3>
                    <p style={{ color: "black", fontWeight: "bold" }}>Nombre: <span style={{ fontWeight: "normal" }}>{disenoClick.plantillaNombre}</span></p>
                    <p style={{ color: "black", fontWeight: "bold" }}>Material: <span style={{ fontWeight: "normal" }}>{material}</span></p>
                    <p style={{ color: "black", fontWeight: "bold" }}>Tipo de bolsa: <span style={{ fontWeight: "normal" }}>{tipoBolsa}</span></p>
                    <p style={{ color: "black", fontWeight: "bold" }}>Ancho: <span style={{ fontWeight: "normal" }}>{ancho}</span></p>
                    <p style={{ color: "black", fontWeight: "bold" }}>Alto: <span style={{ fontWeight: "normal" }}>{alto}</span></p>
                    <p style={{ color: "black", fontWeight: "bold" }}>Profundidad: <span style={{ fontWeight: "normal" }}>{profundidad}</span></p>
                </div>
                <br></br>
                <div>
                    <h3 style={{ color: "black" }}> Vista previa del diseño: </h3>
                    <img style={{ border: "1px solid rgba(200, 204, 195, 0.85)", borderRadius: "5px", maxWidth: "1000px", maxHeight: "750px" }}
                        src={`data:image/png;base64,${disenoClick.base64Preview}`} />
                </div>
                <br />
                <button
                    className="p-2"
                    onClick={()=>{setModalVer(false); setDisenoClick("")}}
                    style={{
                        width: "100px",
                        height: "40px",
                        border: "black",
                        color: "white",
                        borderRadius: "4px",
                        backgroundColor: "#016add",
                        zIndex: 9999,
                    }}
                    type="submit"
                >
                    Volver
                </button>

            </form>
        </div>
    )
}
