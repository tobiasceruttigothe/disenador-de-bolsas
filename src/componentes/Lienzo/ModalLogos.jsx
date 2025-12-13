import React, { useState, useEffect } from 'react';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import "../../styles/main.css";

export default function ModalLogos({ setLogosBool, logos, setLogos }) {
    const [estado, setEstado] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [base64Logo, setBase64Logo] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        setEstado(null)
    }, [base64Logo]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            setBase64Logo(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitForm = async (data) => {

        if (!base64Logo) {
            setMensaje("Debe seleccionar un archivo de plantilla");
            setEstado("Error");
            return;
        }

        const payload = {
            usuarioId: Cookies.get("usuarioId"),
            nombre: data.nombre,
            base64Logo: base64Logo,
        };

        try {
            setEstado("Cargando");
            setMensaje("Cargando...");

            await apiClient.post("/logos", payload);

            const newLogo = {
                id: Date.now(),
                nombre: data.nombre,
                base64Logo: base64Logo
            };

            setLogos([...logos, newLogo]);

            reset();
            setBase64Logo("");
            setEstado("Exito");
            setMensaje("Logo agregado con éxito");

            setLogosBool(false);
        } catch (error) {
            if (error.response && error.status === 422) {
                setMensaje("La imagen excede los 5Mb");
                setEstado("Error");
                return;
            }
            setMensaje("Ocurrió un error al agregar el logo");
            setEstado("Error");
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                maxHeight: "90vh",
                overflowY: "auto"
            }}
        >
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="w-100"
                style={{ maxWidth: '450px' }}
            >
                <h2 className="text-center mb-4">Agregar logo</h2>

                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        accept='.jpg, .jpeg, .png' 
                        placeholder="Ingrese un nombre del logo"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        {...register("nombre", {
                            required: "El nombre es obligatorio",
                            minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
                        })}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="base64Logo" className="form-label">Archivo del logo (Máximo 5Mb)</label>
                    <input
                        id="base64Logo"
                        type="file"
                        accept=".jpg,.png,.pdf,.svg"
                        className={`form-control archivo-input ${!base64Logo && estado === "Error" ? 'is-invalid' : ''}`}
                        onChange={handleFileChange}
                    />
                    {!base64Logo && estado === "Error" && (
                        <div className="invalid-feedback">Debe seleccionar un archivo</div>
                    )}
                    <div className="form-text small text-muted">
                        Formatos soportados: JPG, JPEG, PNG.
                    </div>
                </div>

                {base64Logo && (
                    <>
                        <p>Vista previa del logo:</p>
                        <div className="mb-3">
                            <img
                                src={`data:image/*;base64,${base64Logo}`}
                                alt="Vista previa del logo"
                                className="img-fluid"
                                style={{ maxHeight: '200px' }}
                            />
                        </div>
                    </>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button
                        className="boton-2 w-50"
                        type="button"
                        onClick={() => setLogosBool(false)}
                        disabled={estado === "Cargando"}
                    >
                        Cancelar
                    </button>
                    <button
                        className="boton-1 w-50"
                        disabled={estado === "Cargando"}
                        type="submit"
                    >
                        {estado === "Cargando" ? "Enviando..." : "Agregar Logo"}
                    </button>
                </div>
            </form>

            {estado && (
                <div
                    className={`alert ${estado === "Exito"
                        ? "alert-success"
                        : estado === "Error"
                            ? "alert-danger"
                            : "alert-info"
                        } position-absolute bottom-0 start-50 translate-middle-x mb-4`}
                    role="alert"
                >
                    {mensaje}
                </div>
            )}
        </div>
    );
}
