import React, { useState, useEffect } from 'react';
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";

export default function FormularioLogos() {
    const [estado, setEstado] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [base64Logo, setBase64Logo] = useState("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {

    }, []);
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
        const token = Cookies.get('access_token');

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

        console.log(payload);
        try {
            setEstado("Cargando");
            setMensaje("Cargando...");

            await axios.post("http://localhost:9090/api/logos", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            reset();
            setBase64Logo("");
            setEstado("Exito");
            setMensaje("Logo agregado con éxito");
        } catch (error) {
            if (error.response && error.status === 422) {
                setMensaje("La imagen excede los 5Mb");
                setEstado("Error");
                return;
            }
            console.error("Error al agregar el logo:", error);
            setMensaje("Ocurrió un error al agregar el logo");
            setEstado("Error");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 fondo">
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="w-100 bg-white p-4 rounded shadow"
                style={{ maxWidth: '450px' }}
            >
                <div className="text-center mb-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ width: '80px', height: '80px' }}
                    />
                </div>
                <h2 className="text-center mb-4">Agregar logo</h2>

                {/* Nombre */}
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Ingrese un nombre del logo"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        {...register("nombre", { required: "El nombre es obligatorio" })}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                </div>

                {/* Archivo -> Base64 */}
                <div className="mb-3">
                    <label htmlFor="base64Logo" className="form-label">Archivo del logo (Maximo 5Mb)</label>
                    <input
                        id="base64Logo"
                        type="file"
                        accept=".jpg,.png,.pdf,.svg"
                        className={`form-control ${!base64Logo && estado === "Error" ? 'is-invalid' : ''}`}
                        onChange={handleFileChange}
                    />
                    {!base64Logo && estado === "Error" && (
                        <div className="invalid-feedback">Debe seleccionar un archivo</div>
                    )}
                </div>
                {base64Logo && (
                    <>
                        <p>Vista previa del logo: </p>
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
                <button
                    className="btn w-100 text-white"
                    style={{ backgroundColor: '#016add' }}
                    disabled={estado === "Cargando"}
                >
                    {estado === "Cargando" ? "Enviando..." : "Ingresar"}
                </button>
            </form>

            {/* Alertas dinámicas */}
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




