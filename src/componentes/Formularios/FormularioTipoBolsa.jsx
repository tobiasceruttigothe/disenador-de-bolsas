import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import { useNotificacion } from '../../hooks/useNotificacion';

import Notificacion from '../Notificaciones/Notificacion';
import { useNavigate } from 'react-router-dom';

// Asegúrate de importar tus estilos globales
import "../../index.css";
import "../../styles/main.css";

export default function FormularioTipoBolsa() {
  const [cargando, setCargando] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const navigate = useNavigate();
  const primaryColor = "#016add";

  const handleSubmitForm = async (data) => {
    const payload = { nombre: data.nombre };

    try {
      setCargando(true);
      await apiClient.post("/tipos-bolsa", payload);
      mostrarExito("Tipo de producto agregado con éxito.");
      reset();
    } catch (error) {
      console.error("Error al agregar tipo de producto:", error);
      mostrarError("Ocurrió un error al agregar el tipo de bolsa.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER ORIGINAL (FIJO) --- */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/productos/tiposbolsa")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL CON FONDO --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>

        <div
          className="form-card"
          style={{ width: "100%", maxWidth: "450px" }}
        >

          {/* Cabecera de la Tarjeta */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "100px", height: "100px" }}>
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ width: '70px', height: '70px', objectFit: 'contain' }}
              />
            </div>
            <h3 className="fw-bold text-dark mb-1">Nuevo Tipo de Producto</h3>
            <p className="text-muted small">Ingresa los datos para registrar la categoría</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>

            {/* Input Nombre */}
            <div className="mb-4">
              <label htmlFor="nombre" className="form-label text-muted small fw-bold text-uppercase">Nombre del Tipo</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Con Asa, Fondo Americano..."
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

            {/* Botón Submit */}
            <div className="d-grid mt-5">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Tipo"
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