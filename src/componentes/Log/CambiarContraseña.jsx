import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/pack designer final.png';
import "../../index.css";

export default function CambiarContraseña() {
    const navigate = useNavigate();
    const [contraseñaActual, setContraseñaActual] = useState("");
    const [contraseñaReset, setContraseñaReset] = useState("");
    const [contraseñaReset2, setContraseñaReset2] = useState("");
    const [exito, setExito] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (contraseñaReset !== contraseñaReset2) {
            setExito("noCoinciden");
            return;
        }

        try {
            await axios.post("http://localhost:9090/api/auth/reset-password", {
                token: token,
                newPassword: contraseñaReset
            });

            setExito("true");
            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Status:", error.response.status);
            } else {
                console.error("Error:", error.message);
            }
            setExito("false");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 fondo">
                <form
                    onSubmit={handleSubmit}
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
                        <label htmlFor="oldPassword" className="form-label">
                            Contraseña actual
                        </label>
                        <input
                            id="oldPassword"
                            type="password"
                            placeholder="Ingrese su contraseña actual"
                            className="form-control"
                            value={contraseñaActual}
                            onChange={(e) => setContraseñaActual(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                            Nueva Contraseña
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Ingrese su nueva contraseña"
                            className="form-control"
                            value={contraseñaReset}
                            onChange={(e) => setContraseñaReset(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="newPassword2" className="form-label">
                            Repita la nueva contraseña
                        </label>
                        <input
                            id="newPassword2"
                            type="password"
                            placeholder="Repita su nueva contraseña"
                            className="form-control"
                            value={contraseñaReset2}
                            onChange={(e) => setContraseñaReset2(e.target.value)}
                            required
                        />
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

            {exito === "true" && (
                <div
                    className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4"
                    role="alert"
                    style={{ zIndex: 9999 }}
                >
                    Contraseña restablecida correctamente. Redirigiendo al login...
                </div>
            )}

            {exito === "false" && (
                <div
                    className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
                    role="alert"
                    style={{ zIndex: 9999 }}
                >
                    No se pudo restablecer la contraseña. El token puede ser inválido o haber expirado.
                </div>
            )}

            {exito === "noCoinciden" && (
                <div
                    className="alert alert-warning position-fixed bottom-0 start-50 translate-middle-x mb-4"
                    role="alert"
                    style={{ zIndex: 9999 }}
                >
                    Las contraseñas no coinciden. Por favor, revisá e intentá nuevamente.
                </div>
            )}
        </>
    );
}
