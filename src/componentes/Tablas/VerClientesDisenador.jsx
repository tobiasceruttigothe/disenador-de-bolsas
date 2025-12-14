import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";

import "../../index.css";
import "../../styles/main.css";

export default function TablaClientes() {
    const navigate = useNavigate();
    const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [filtro, setFiltro] = useState("");

    const [disenadorNombre, setDisenadorNombre] = useState("")

    const { idDisenador } = useParams();

    useEffect(() => {
        fetchClientes();
        fetchNombreDisenador(idDisenador)
    }, []);

    useEffect(() => {
        setClientesFiltrados(
            clientes.filter((c) =>
                c?.username.toLowerCase().includes(filtro.toLowerCase())
            )
        );
    }, [filtro, clientes]);

    const fetchClientes = async () => {
        try {
            const res = await apiClient.get("/usuarios/clientes-asignados?disenadorId=" + idDisenador);
            setClientes(res.data);
        } catch (e) {
            console.error("Error al cargar clientes:", e);
            mostrarError("No se pudieron cargar los clientes.");
        }
    };

    const fetchNombreDisenador = async(idDisenador) =>{
        try {
            const res = await apiClient.get("/usuarios/list/users/disenadores");
            setDisenadorNombre((res.data.find(d => d.id === idDisenador))?.razonSocial || "")
        } catch (e) {
            console.error("Error al cargar diseñador:", e);
        }
    }

    return (
        <>
            <button
                className="boton-atras d-flex align-items-center justify-content-center"
                onClick={() => navigate("/seguimiento")} // Redirige a /inicio con el panel de usuarios abierto
            >
                ←
            </button>

            <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            <div className="tabla-card shadow-lg rounded-4 overflow-hidden">
                                <div className="card-header bg-white py-4 px-4 px-md-5 border-bottom-0">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h3 className="fw-bold text-dark mb-1">Clientes asignados</h3>
                                            <p className="text-muted mb-0">{`Ver clientes del diseñador ${disenadorNombre}`}</p>
                                        </div>
                                    </div>

                                    <div className="position-relative">
                                        <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg ps-5 bg-light border-0"
                                            placeholder="Buscar cliente por usuario..."
                                            value={filtro}
                                            onChange={(e) => setFiltro(e.target.value)}
                                            style={{ fontSize: '0.95rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="py-3 ps-5 text-muted small fw-bold text-uppercase">Usuario</th>
                                                    <th className="py-3 text-muted small fw-bold text-uppercase">Email</th>
                                                    <th className="py-3 text-muted small fw-bold text-uppercase">Razón Social</th>
                                                    <th className="py-3 pe-5 text-end text-muted small fw-bold text-uppercase">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clientesFiltrados.length > 0 ? (
                                                    clientesFiltrados.map((c, index) => (
                                                        <tr key={index}>
                                                            <td className="ps-5 fw-bold text-dark">{c.username}</td>
                                                            <td className="text-muted">{c.email}</td>
                                                            <td className="text-muted">{c.razonSocial || "-"}</td>
                                                            <td className="pe-5 text-end">
                                                                <button className="btn btn-sm fw-bold"
                                                                onClick={()=>{navigate("/disenos/cliente/"+c.id)}}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.backgroundColor = "#016add";
                                                                        e.currentTarget.style.color = "white";
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                                        e.currentTarget.style.color = "#016add";
                                                                    }}
                                                                    style={{
                                                                        border: "1px solid #016add",
                                                                        color: "#016add",
                                                                        backgroundColor: "transparent"
                                                                    }}>
                                                                    <i className="fa fa-eye"></i>
                                                                    Ver diseños
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="4" className="text-center py-5 text-muted">No se encontraron clientes asignados.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card-footer bg-white border-top-0 py-3 text-center">
                                    <small className="text-muted">Total: {clientesFiltrados.length} clientes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Notificacion tipo={notificacion.tipo} mensaje={notificacion.mensaje} visible={notificacion.visible} onClose={ocultarNotificacion} />
            </div>
        </>
    );
}