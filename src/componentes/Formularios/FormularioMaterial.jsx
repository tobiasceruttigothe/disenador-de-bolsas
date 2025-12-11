import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';

// Importa estilos
import "../../index.css"; 
import "../../styles/main.css";

export default function FormularioMateriales() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  const [estado, setEstado] = useState(""); // "", "Cargando", "Exito", "Error"
  const primaryColor = "#016add";

  const handleSubmitForm = async (data) => {
    const payload = {
      nombre: data.nombre
    };

    try {
      setEstado("Cargando");

      await apiClient.post("/materiales", payload);
      reset();

      mostrarExito("Material agregado con éxito");
      setEstado("Exito");

      setTimeout(() => {
        navigate("/productos/materiales");
      }, 1500);

    } catch (error) {
      console.error(error);
      mostrarError("Ocurrió un error al agregar el material");
      setEstado("Error");
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER (FIJO) --- */}
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
          borderRadius: "7px",
          zIndex: 1000
        }}
        onClick={() => navigate("/productos/materiales")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL CON FONDO --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>
        
        <div 
          className="form-card"
          style={{ width: "100%", maxWidth: "450px" }}
        >
          
          {/* Cabecera */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "100px", height: "100px" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '70px', height: '70px', objectFit: 'contain' }} 
              />
            </div>
            <h3 className="fw-bold text-dark mb-1">Nuevo Material</h3>
            <p className="text-muted small">Registra un nuevo tipo de material para las bolsas</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            
            {/* Input Nombre */}
            <div className="mb-4">
              <label htmlFor="nombre" className="form-label text-muted small fw-bold text-uppercase">Nombre del Material</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Papel Kraft, Cartulina..."
                className={`form-control form-control-lg bg-light border-0 ${errors.nombre ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  minLength: { value: 3, message: "Mínimo 3 caracteres" }
                })}
              />
              {errors.nombre && <div className="invalid-feedback ps-2">{errors.nombre.message}</div>}
            </div>

            {/* Botón Guardar */}
            <div className="d-grid mt-5">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={estado === "Cargando"}
              >
                {estado === "Cargando" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Material"
                )}
              </button>
            </div>

          </form>
        </div>

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