import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import Modal from "../Lienzo/ModalConfirmacion.jsx"
import MenuPlantillas from './MenuPlantillas.jsx';
import "../../index.css";

export default function AdministrarPlantillas() {
  const [plantillasUsuario, setPlantillasUsuario] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const username = params.get('user');
  const id = params.get('id');

  const handleClick = () => setModalAbierto(true);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await axios.get(
          `http://localhost:9090/api/plantillas/usuario/${id}/habilitadas`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        setPlantillasUsuario(res.data.data);
      } catch (e) {
        console.log("Error al cargar las plantillas del cliente", e);
      }
    };
    if (id) fetchPlantillas();
  }, [id]);

  return (
    <div className="container-fluid min-vh-100 py-4 fondo">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2 className="mb-4">Administrar Plantillas de {username}</h2>

          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre de la Plantilla</th>
                  <th>Foto</th>
                </tr>
              </thead>
              <tbody>
                {plantillasUsuario.length > 0 ? (
                  plantillasUsuario.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>
                        <img
                          src={`data:image/png;base64,${p.base64Plantilla}`}
                          alt={p.nombre}
                          style={{ width: '100px' }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      No hay plantillas asignadas a este cliente.
                    </td>
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
              transition: "all 0.3s ease",
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
            onClick={handleClick}
          >
            Agregar Plantillas
          </button>

          <Modal isVisible={modalAbierto} onClose={() => setModalAbierto(false)}>
            <MenuPlantillas
              setModalAbierto={setModalAbierto}
              idCliente={id}
              userName={username}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
