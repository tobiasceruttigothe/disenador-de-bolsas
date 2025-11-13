import React from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../assets/pack designer final.png';
import Cookies from 'js-cookie'
import axios from 'axios'
import "../../index.css";

export default function CambiarContraseña() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const id = Cookies.get("usuarioId");
            const token = Cookies.get('access_token');
            const payload = {
                currentPassword : data.actualContraseña,
                newPassword : data.nuevaContraseña 
            }
            console.log(payload)
            const response = await axios.get(`http://localhost:9090/api/auth/change-temporary-password/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error fetching logos:', error);
        }
    };

    const password = watch("nuevaContraseña");

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 fondo">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-100 bg-white p-4 rounded shadow"
                style={{ maxWidth: '400px' }}
            >
                <div className="text-center mb-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className="img-fluid"
                        style={{ width: '80px', height: '80px' }}
                    />
                </div>

                <h2 className="text-center mb-4">Cambiar Contraseña</h2>

                <div className="mb-3">
                    <label htmlFor="actualContraseña" className="form-label">
                        Contraseña actual
                    </label>
                    <input
                        id="actualContraseña"
                        type="password"
                        placeholder="Ingrese su contraseña actual"
                        className={`form-control ${errors.actualContraseña ? 'is-invalid' : ''}`}
                        {...register("actualContraseña", { required: "Este campo es obligatorio" })}
                    />
                    {errors.actualContraseña && (
                        <div className="invalid-feedback">
                            {errors.actualContraseña.message}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="nuevaContraseña" className="form-label">
                        Nueva Contraseña
                    </label>
                    <input
                        id="nuevaContraseña"
                        type="password"
                        placeholder="Ingrese su nueva contraseña"
                        className={`form-control ${errors.nuevaContraseña ? 'is-invalid' : ''}`}
                        {...register("nuevaContraseña", {
                            required: "Este campo es obligatorio",
                            minLength: { value: 8, message: "Debe tener al menos 8 caracteres" }
                        })}
                    />
                    {errors.nuevaContraseña && (
                        <div className="invalid-feedback">
                            {errors.nuevaContraseña.message}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="repetirContraseña" className="form-label">
                        Repita la nueva contraseña
                    </label>
                    <input
                        id="repetirContraseña"
                        type="password"
                        placeholder="Repita su nueva contraseña"
                        className={`form-control ${errors.repetirContraseña ? 'is-invalid' : ''}`}
                        {...register("repetirContraseña", {
                            required: "Este campo es obligatorio",
                            validate: value =>
                                value === password || "Las contraseñas no coinciden"
                        })}
                    />
                    {errors.repetirContraseña && (
                        <div className="invalid-feedback">
                            {errors.repetirContraseña.message}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn w-100 text-white"
                    style={{ backgroundColor: '#016add' }}
                >
                    Restablecer Contraseña
                </button>
            </form>
        </div>
    );
}
