import React from 'react'
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { apiClient } from '../../config/axios';

export default function MenuLogos({ agregarFoto }) {
  const [logos, setLogos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const id = Cookies.get("usuarioId");
        if (!id) {
          console.error("No se encontró el ID de usuario");
          setError("No se encontró el ID de usuario");
          setIsLoading(false)
          return;
        }
        const res = await apiClient.get(`/logos/usuario/${id}`);
        setLogos(res.data.data || []);
      } catch (e) {
        console.error("Error al cargar los logos", e);
        setError("Error al cargar los logos. Intente nuevamente.");
      } finally {
        setIsLoading(false)
      }
    };
    fetchLogos();
  }, []);

  const handler = (imagen) => {
    const dataUrl = `data:image/png;base64,${imagen}`;
    agregarFoto(dataUrl);
  };

  return (
    <div className="p-3 mt-2 bg-light" style={{
      minHeight: "650px",
      height: "650px",
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
      border: "1px solid #00000013",
      borderLeft: "none",
      overflowY: "auto",
      backgroundColor: "#f8f9fa"
    }}>
      <h2 className="mx-2 mb-3">Agregar logos de la empresa</h2>
      <hr></hr>
      
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : logos.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px", flexDirection: "column" }}>
          <p style={{ color: "#666", fontSize: "16px", marginBottom: "10px" }}>No tienes logos guardados</p>
          <p style={{ color: "#999", fontSize: "14px" }}>Ve a la sección de logos para agregar uno nuevo</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
          justifyItems: "center",
          alignItems: "start",
          marginTop: "15px",
          paddingBottom: "20px"
        }}>
          {logos.map((l, index) => (
            <button
              key={l.id || index}
              onClick={() => { handler(l.base64Logo) }}
              style={{
                width: "210px",
                minHeight: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#000000ff",
                border: "1px solid #016add",
                backgroundColor: "#016bdd42",
                borderRadius: "8px",
                cursor: "pointer",
                padding: "10px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#016bdd66"
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#016bdd42"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <img 
                src={`data:image/png;base64,${l.base64Logo}`} 
                alt={l.nombre || `Logo ${index + 1}`} 
                style={{ 
                  width: "70px", 
                  height: "70px", 
                  marginBottom: "8px",
                  objectFit: "contain"
                }} 
              />
              <span style={{ fontSize: "12px", textAlign: "center", wordBreak: "break-word" }}>
                {l.nombre || `Logo ${index + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
