import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import Modal from "../Lienzo/ModalConfirmacion.jsx"
import MenuPlantillas from './MenuPlantillas.jsx';
import "../../index.css";

export default function AdministrarPlantillas({nombre}) {
    const [plantillasUsuario, setPlantillasUsuario] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');
    const id = params.get('id');

    const handleClick = (id) => () => {
        console.log("Agregar plantilla al cliente con ID:", id);
        setModalAbierto(true)
    }
    useEffect(() => {
        const fetchPlantillas = async (id) => {
            try {
                const token = Cookies.get("access_token");

                plantillas = await axios.get(`http://localhost:9090/api/plantillas/usuario/${id}/habilitadas`, {
                    headers: {
                      "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    },
                  });
                  setPlantillasUsuario(plantillas.data.data || []);
            } catch (e) {
                console.log("Error al cargar las plantillas del cliente", e);
            }
        }
        const id = params.get('id');
        fetchPlantillas(id);
    }, [])

    return (
        <>
            <div className="container-fluid min-vh-100 py-4 fondo">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <h2 className="mb-4">Administrar Plantillas del Cliente</h2>
                        <div className="table-responsive mb-4">
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre de la Plantilla</th>
                                        <th>Foto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plantillasUsuario.length > 0 ? (plantillasUsuario.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.nombre}</td>
                                            <td>
                                                <img src={p.fotoURL} alt={p.nombre} style={{ width: '100px' }} />
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">No hay plantillas asignadas a este cliente.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="btn m-1"
                            style={{
                                backgroundColor: "#016add",
                                color: "#fff",
                                border: "2px solid #016add",
                                fontWeight: "500",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#014bb5";
                                e.currentTarget.style.borderColor = "#014bb5";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#016add";
                                e.currentTarget.style.borderColor = "#016add";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={handleClick(id)}
                        >
                            Agregar Plantillas
                        </button>
                        <Modal isVisible={modalAbierto} onClose={() => setModalAbierto(false)}>
                            <MenuPlantillas idCliente={id} userName={username}></MenuPlantillas>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}
