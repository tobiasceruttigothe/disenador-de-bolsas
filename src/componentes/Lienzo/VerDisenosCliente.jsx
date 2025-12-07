import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '../../config/axios';
import { Link } from 'react-router-dom';
import bolsa from '../../assets/pack designer final.png';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import ModalConfirmacion from '../ModalConfirmacion';
import "../../index.css"
import "../../styles/main.css"
import { useNavigate, useParams } from 'react-router-dom';

import MenuVer from "./MenuVer"
import MenuDescargar from "./MenuDescargar"
import Modal from "./ModalConfirmacion"

export default function VerDisenosCliente({ }) {
    const [disenos, setDisenos] = useState([])
    const [disenoClick, setDisenoClick] = useState("")
    const [usuario, setUsuario] = useState(" ")

    const navigate = useNavigate();
    const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

    const [modalVer, setModalVer] = useState(false)
    const [modalDescargar, setModalDescargar] = useState(false)
    const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null })

    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        const fetchDisenos = async () => {
            try {
                const res = await apiClient.get(`/disenos/usuario/${id}`);
                setDisenos(res.data.data);

                const users = await apiClient.get(`/usuarios/list/users/clients`);
                const encontrado = users.data.find(u => u.id === id);
                setUsuario(encontrado || { username: "Usuario desconocido" });
            } catch (e) {
                console.error("Error al cargar los diseños", e);
                mostrarError("Error al cargar los diseños. Intente nuevamente.");
            }
        };
        fetchDisenos();
    }, [id]);


    const handleClick = (diseno) => {
        navigate(`/disenos/${diseno.id}`);
    }

    const handleVer = (diseno) => {
        setDisenoClick(diseno)
        setModalVer(true)
    }

    const handleDescargar = (diseno) => {
        setDisenoClick(diseno)
        setModalDescargar(true)
    }

    const handleGenerar = (diseno) => {

    }

    const handleDuplicar = async (diseno) => {
        try {
            const dataURL = diseno.base64Preview;
            const elementos = diseno.base64Diseno;
            const payload = {
                usuarioId: Cookies.get("usuarioId"),
                plantillaId: diseno.plantillaId,
                nombre: `Duplicado de ${diseno.nombre}`,
                descripcion: diseno.descripcion,
                base64Diseno: elementos,
                base64Preview: dataURL
            };
            const res = await apiClient.post("/disenos", payload);
            mostrarExito("Diseño guardado correctamente.");
        } catch (error) {
            console.error("Error al guardar el diseño:", error);
            mostrarError("Error al guardar el diseño. Intente nuevamente.");
        }
    };

const handleEliminarClick = (id) => {
    setModalEliminar({ visible: true, id });
};

const confirmarEliminar = async () => {
    const id = modalEliminar.id;
    try {
        await apiClient.delete(`/disenos/${id}`);
        mostrarExito("Diseño eliminado exitosamente.");
        setDisenos((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
        console.error("Error al eliminar diseño:", e);
        mostrarError("Surgió un error al eliminar el diseño.");
    }
    setModalEliminar({ visible: false, id: null });
};

return (
    <>
        <button className="align-items-center d-flex justify-content-center"
            style={{
                position: "fixed", top: "85px", left: "20px",
                margin: "20px",
                width: "70px", height: "40px",
                padding: "10px",
                backgroundColor: "white",
                color: "#016add",
                border: "1px solid #016add",
                borderRadius: "7px"
            }}

            onClick={() => navigate("/verClientes")}
        >
            ←
        </button>

        <div style={{ marginTop: "85px" }} className='fondo'>
            <div className="container">
                <h2 className="my-3">Diseños de {usuario.username}</h2>
                <div className="row">
                    {disenos.length > 0 ? (disenos.map((diseno) => (
                        <div
                            key={diseno.id}
                            className={`col-md-4 mb-4`}
                        >

                            <div className="card h-100">
                                <img onClick={() => handleClick(diseno)} src={`data:image/png;base64, ${diseno.base64Preview}`} className="card-img-top" alt={diseno.nombre} />
                                <hr />
                                <div className="card-body">
                                    <h5 className="card-title">{diseno.nombre}</h5>
                                    <p className="card-text">{diseno.descripcion ? diseno.descripcion : <>&nbsp;</>}</p>
                                    <div className="d-flex gap-2">
                                        <button className="boton-2" onClick={() => handleClick(diseno)}>Editar diseño</button>
                                        <button className="boton-1" onClick={() => handleEliminarClick(diseno.id)}>Eliminar diseño</button>
                                        <div className="dropdown">
                                            <button
                                                className="btn"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                ⋮
                                            </button>

                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" onClick={() => handleVer(diseno)}>Ver mi diseño</button></li>
                                                <li><button className="dropdown-item" onClick={() => handleDescargar(diseno)}>Descargar</button></li>
                                                <li><button className="dropdown-item" onClick={() => handleGenerar(diseno)}>Generar vista 3D</button></li>
                                                <li><button className="dropdown-item" onClick={() => handleDuplicar(diseno)}>Generar duplicado</button></li>
                                            </ul>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                    ))) : (
                        <p>No tienes diseños guardados. ¡Creá uno nuevo!</p>
                    )}
                    <hr />
                    <div
                        key={"nuevoDiseno"}
                        className={`col-md-4 mb-4`}
                    >
                        <Link to={`/nuevoDiseno`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card h-100">
                                <img src={bolsa} className="card-img-top" alt={"nuevo diseño"} />
                                <hr />
                                <div className="card-body">
                                    <h5 className="card-title">Nuevo diseño</h5>
                                    <p className="card-text">Crear nuevo diseño</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <Modal isVisible={modalVer} onClose={() => { setModalVer(false); setDisenoClick() }}>
                <MenuVer setModalVer={setModalVer} disenoClick={disenoClick} setDisenoClick={setDisenoClick}></MenuVer>
            </Modal>
            <Modal isVisible={modalDescargar} onClose={() => { setModalDescargar(false); setDisenoClick() }}>
                <MenuDescargar setModalDescargar={setModalDescargar} disenoClick={disenoClick} setDisenoClick={setDisenoClick}></MenuDescargar>
            </Modal>
            
            <Notificacion
                tipo={notificacion.tipo}
                mensaje={notificacion.mensaje}
                visible={notificacion.visible}
                onClose={ocultarNotificacion}
                duracion={notificacion.duracion}
            />
        </div>
    </>
);
}
