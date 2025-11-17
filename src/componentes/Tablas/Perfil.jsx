import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

export default function Perfil() {
    const [nombre, setNombre] = useState('');
    const [rol, setRol] = useState('');
    const [email, setEmail] = useState('');
    const [razonSocial, setRazonSocial] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setNombre(Cookies.get("nombre"));
        setRol(Cookies.get("rol"));
        setEmail(Cookies.get("mail"));
        setRazonSocial(Cookies.get("razonSocial"));
    }, []);

    const handleContraseña = () => navigate('/cambiarContraseña');

    return (
        <>
            <button
                className="align-items-center d-flex justify-content-center"
                style={{
                    position:"fixed", top:"85px", left:"20px",
                    margin: "20px",
                    width: "70px", height: "40px",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "#016add",
                    border: "1px solid #016add",
                    borderRadius: "7px"
                }}
                onClick={() => navigate("/inicio")}
            >
                ←
            </button>

            <div style={{marginTop:"85px"}} className="container-fluid vh-100 py-4 bg-light fondo">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 border rounded p-4 shadow bg-white">

                        <h2>Mi Perfil</h2>
                        <hr />

                        <div className="mb-4">
                            <label className="form-label">
                                <strong>Nombre de usuario:</strong>
                            </label>
                            <p>{nombre}</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <strong>Rol:</strong>
                            </label>
                            <p>{rol}</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <strong>Email:</strong>
                            </label>
                            <p>{email}</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <strong>
                                    {rol === "cliente"
                                        ? "Razón Social:"
                                        : "Nombre y apellido del empleado:"}
                                </strong>
                            </label>
                            <p>{razonSocial}</p>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">
                                <strong>Contraseña:</strong>
                            </label>
                            <p>
                                ********{" "}
                                <button className="btn btn-sm mb-2" onClick={handleContraseña}>
                                    Cambiar Contraseña
                                </button>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
