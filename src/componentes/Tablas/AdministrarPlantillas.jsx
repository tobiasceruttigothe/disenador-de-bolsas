import React, { useEffect, useState } from 'react'
import { apiClient } from '../../config/axios';
import Cookies from 'js-cookie';
import Modal from "../Lienzo/ModalConfirmacion.jsx"
import ModalPlantillas from './ModalPlantillas.jsx';
import { useNavigate } from "react-router-dom"
import "../../index.css";

export default function AdministrarPlantillas() {
  const [plantillasUsuario, setPlantillasUsuario] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imagenesBase64, setImagenesBase64] = useState({});
  const [loadingImagenes, setLoadingImagenes] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const username = params.get('user');
  const id = params.get('id');

  const navigate = useNavigate()
  const handleClick = () => setModalAbierto(true);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const res = await apiClient.get(`/plantillas/usuario/${id}/habilitadas`);
        const plantillas = res.data.data;
        setPlantillasUsuario(plantillas);

        // Esperamos todas las imágenes antes de actualizar el estado final
        const imagenes = {};
        await Promise.all(
          plantillas.map(async p => {
            imagenes[p.id] = await buscarImagenBase64(p.id);
          })
        );

        setImagenesBase64(imagenes);
        setLoadingImagenes(false);

      } catch (e) {
        console.error("Error al cargar las plantillas del cliente", e);
        setLoadingImagenes(false);
      }
    };

    if (id) fetchPlantillas();
  }, [id]);

  const buscarImagenBase64 = async (p) => {
    try {
      const res = await apiClient.get(`/plantillas/${p}`);
      return res.data.data.base64Plantilla;
    } catch (e) {
      console.error("Error al cargar la imagen de la plantilla", e);
      return "";
    }
  }

  return (
    <>
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed",
          top: "9vh",
          left: "3vw",
          width: "70px",
          height: "40px",
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
      <div style={{ marginTop: "85px" }} className="container-fluid min-vh-100 py-4 fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h2 className="mb-4">Administrar Plantillas de {username}</h2>

            <div className="table-responsive mb-4">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre de la Plantilla</th>
                    <th>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {plantillasUsuario.length > 0 ? (
                    plantillasUsuario.map((p) => (
                      <tr key={p.id}>
                        <td style={{
                          verticalAlign: 'middle',
                          fontSize: '20px',
                          fontWeight: '500'
                        }}>
                          {p.nombre}
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          {loadingImagenes ? (
                            <div
                              style={{
                                width: "100px",
                                height: "100px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f2f2f2",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                color: "#666",
                                fontSize: "14px",
                                fontStyle: "italic",
                                margin: "10px auto",
                              }}
                            >
                              Cargando...
                            </div>
                          ) : (
                            <img
                              src={`data:image/png;base64,${imagenesBase64[p.id]}`}
                              alt={p.nombre}
                              style={{
                                width: '100px',
                                height: 'auto',
                                display: "block",
                                margin: "10px auto",
                                objectFit: "contain",
                                borderRadius: "8px",
                                padding: "4px",
                              }}
                            />
                          )}
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
              <ModalPlantillas
                setModalAbierto={setModalAbierto}
                idCliente={id}
                userName={username}
                setPlantillasUsuario={setPlantillasUsuario}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
