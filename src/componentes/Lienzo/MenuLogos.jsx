import React from 'react'
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { apiClient } from '../../config/axios';

export default function MenuLogos({ agregarFoto }) {
  const [logos, setLogos] = useState([])

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const id = Cookies.get("usuarioId");
        if (!id) {
          console.error("No se encontró el ID de usuario");
          return;
        }
        const res = await apiClient.get(`/logos/usuario/${id}`);
        setLogos(res.data.data);
      } catch (e) {
        console.error("Error al cargar los logos", e);
      }
    };
    fetchLogos();
  }, []);

  const handler = (imagen) => {
    const dataUrl = `data:image/png;base64,${imagen}`;
    agregarFoto(dataUrl);
  };

  return (
    <div>
      <div className=" p-3 mt-2 bg-light" style={{
        height: "650px",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        border: "1px solid #00000013",
        borderleft: "none"
      }}>
        <h2 className="mx-2 mb-3">Agregar logos de la empresa</h2>
        <hr></hr>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "15px",
          justifyItems: "center",
          alignItems: "center",
          marginTop: "15px"
        }}>
          {logos.map((l, index) => (
            <button
              key={index}
              onClick={() => { handler(l.base64Logo) }}
              style={{
                width: "210px",
                height: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#000000ff",
                border: "1px solid #016add ",
                backgroundColor: "#016bdd42",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              <img src={`data:image/png;base64,${l.base64Logo}`} alt={l.nombre} style={{ width: "70px", height: "70px", marginBottom: "2px" }} />
              {l.nombre}
            </button>
          ))}
        </div>


      </div>
    </div>
  )
}
