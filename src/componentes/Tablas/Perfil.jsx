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
        setNombre(Cookies.get("nombre") || "Usuario");
        setRol(Cookies.get("rol") || "Invitado");
        setEmail(Cookies.get("mail") || "sin-email@papera.com");
        setRazonSocial(Cookies.get("razonSocial") || "N/A");
    }, []);

    const handleContraseña = () => navigate('/cambiarContraseña');

    // Obtener inicial para el avatar
    const getInicial = () => {
        if (razonSocial && razonSocial !== "N/A") return razonSocial.charAt(0).toUpperCase();
        if (nombre) return nombre.charAt(0).toUpperCase();
        return "U";
    };

    // Color corporativo
    const primaryColor = "#016add";

    return (
        <>
            <button
                className="align-items-center d-flex justify-content-center"
                style={{
                    position: "fixed", top: "9vh", left: "3vw", width: "70px", height: "40px",
                    padding: "10px", backgroundColor: "white", color: "#016add",
                    border: "1px solid #016add", borderRadius: "7px", zIndex: 1000
                }}
                onClick={() => navigate("/productos")}
            >
                ←
            </button>

            {/* --- DISEÑO DE PERFIL PROFESIONAL --- */}
            <div className="min-vh-100 fondo pb-5" style={{ paddingTop: "150px" }}>

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">

                            {/* Tarjeta de Perfil */}
                            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">

                                {/* Cabecera con color corporativo */}
                                <div
                                    className="card-header text-center py-5 position-relative"
                                    style={{
                                        backgroundColor: primaryColor,
                                        color: 'white',
                                        borderBottom: '5px solid rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {/* Avatar Circular */}
                                    <div
                                        className="d-flex justify-content-center align-items-center mx-auto shadow"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            backgroundColor: "white",
                                            color: primaryColor,
                                            borderRadius: "50%",
                                            fontSize: "2.5rem",
                                            fontWeight: "bold",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        {getInicial()}
                                    </div>

                                    <h3 className="fw-bold mb-0 text-uppercase">
                                        {rol === "cliente" ? razonSocial : nombre}
                                    </h3>
                                    <span className="badge bg-white text-primary mt-2 px-3 rounded-pill text-uppercase">
                                        {rol}
                                    </span>
                                </div>

                                {/* Cuerpo de la tarjeta */}
                                <div className="card-body p-4 p-md-5">
                                    <h5 className="text-muted mb-4 border-bottom pb-2">Información de la Cuenta</h5>

                                    <div className="row g-3">
                                        {/* Nombre de Usuario */}
                                        <div className="col-12 col-md-6">
                                            <div className="p-3 bg-light rounded-3 h-100 border-start border-4 border-primary">
                                                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Usuario</small>
                                                <p className="mb-0 fw-bold text-dark fs-5">{nombre}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="col-12 col-md-6">
                                            <div className="p-3 bg-light rounded-3 h-100 border-start border-4 border-primary">
                                                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Email</small>
                                                <p className="mb-0 fw-bold text-dark text-break">{email}</p>
                                            </div>
                                        </div>

                                        {/* Dato condicional (Razón social o Nombre empleado) */}
                                        <div className="col-12">
                                            <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                                                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                                                    {rol === "cliente" ? "Razón Social / Empresa" : "Nombre del Empleado"}
                                                </small>
                                                <p className="mb-0 fw-bold text-dark fs-5">
                                                    {razonSocial}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección de Seguridad */}
                                    <div className="mt-5">
                                        <h5 className="text-muted mb-3 border-bottom pb-2">Seguridad</h5>
                                        <div className="d-flex justify-content-between align-items-center bg-white border rounded p-3">
                                            <div>
                                                <p className="mb-0 fw-bold text-dark">Contraseña</p>
                                                <small className="text-muted">••••••••</small>
                                            </div>
                                            <button
                                                className="btn btn-outline-primary rounded-pill px-4"
                                                onClick={handleContraseña}
                                                style={{ borderColor: primaryColor, color: primaryColor }}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = primaryColor;
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = primaryColor;
                                                }}
                                            >
                                                Cambiar
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                {/* Footer decorativo */}
                                <div className="card-footer text-center bg-light py-3 border-0">
                                    <small className="text-muted">Paper SRL - Perfil de Usuario</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}