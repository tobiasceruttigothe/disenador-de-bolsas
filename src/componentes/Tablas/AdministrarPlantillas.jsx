import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import Modal from "../Lienzo/ModalConfirmacion.jsx"
import ModalPlantillas from './ModalPlantillas.jsx';
import "../../index.css";

export default function AdministrarPlantillas() {
  const [plantillasUsuario, setPlantillasUsuario] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [imagenesBase64, setImagenesBase64] = useState({});

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

        const plantillas = res.data.data;
        setPlantillasUsuario(plantillas);

        const imagenes = {};
        for (const p of plantillas) {
          const img = await buscarImagenBase64(p.id);
          imagenes[p.id] = img;
        }
        setImagenesBase64(imagenes);

      } catch (e) {
        console.log("Error al cargar las plantillas del cliente", e);
      }
    };

    if (id) fetchPlantillas();
  }, [id]);

  const buscarImagenBase64 = async (p) => {
    try {
      const token = Cookies.get("access_token");
      const res = await axios.get(`http://localhost:9090/api/plantillas/${p}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return res.data.data.base64Plantilla
    } catch (e) {
      console.log("Error al cargar la imagen de la plantilla", e);
      return "";
    }
  }
  return (
    <div className="container-fluid min-vh-100 py-4 fondo">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2 className="mb-4">Administrar Plantillas de {username}</h2>

          <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover">
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
                      <td style={{
                        verticalAlign: 'middle',
                        fontSize: '20px',
                        fontWeight: '500',
                        textAlign: 'center',
                        padding: '12px',
                      }}>{p.nombre}</td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {imagenesBase64[p.id] ? (
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
                        ) : (
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
  );
}
