import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';

// Estilos
import "../../index.css";
import "../../styles/main.css";

export default function FormularioAdmin() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [cargando, setCargando] = useState(false);
  const primaryColor = "#016add";

  const handleSubmitForm = async (data) => {
    try {
      setCargando(true);

      const nombreCompleto = `${data.nombreReal} ${data.apellido}`;

      const payload = {
        username: data.nombre,
        email: data.mail,
        razonSocial: nombreCompleto,
        password: "undefined",
        enabled: true,
        emailVerified: false,
        rol: "ADMIN"
      };

      await apiClient.post("/usuarios/create", payload);
      reset();
      mostrarExito("Administrador agregado con éxito");

      setTimeout(() => {
        navigate("/gerentes");
      }, 1500);

    } catch (error) {
      if (error.response && error.response.status === 403) {
        const rol = Cookies.get('rol');
        mostrarError(`No tienes permisos para crear usuarios. Tu rol actual es: ${rol || 'no definido'}.`);
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (error.response && error.response.status === 409) {
        mostrarError("Nombre de usuario ya registrado");
      } else if (error.response && error.response.status === 502) {
        mostrarError("Mail ya registrado");
      } else {
        mostrarError("Error inesperado. Intente nuevamente más tarde.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER (FIJO) --- */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/gerentes")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL CON FONDO --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>

        <div
          className="form-card"
          style={{ width: "100%", maxWidth: "500px" }}
        >

          {/* Cabecera */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "80px", height: "80px" }}>
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ width: '70px', height: '70px', objectFit: 'contain' }}
              />
            </div>
            <h3 className="fw-bold text-dark mb-1">Nuevo Gerente</h3>
            <p className="text-muted small">Registrar un nuevo usuario con permisos gerenciales</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>

            {/* Usuario */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label text-muted small fw-bold text-uppercase">Nombre de usuario</label>
              <input
                id="nombre"
                placeholder="Ej: admin_gerente"
                type="text"
                className={`form-control form-control-lg bg-light border-0 ${errors.nombre ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 5, message: "Debe tener al menos 5 caracteres" },
                  maxLength: { value: 50, message: "Debe tener menos de 50 caracteres" }
                })}
              />
              {errors.nombre && <div className="invalid-feedback ps-2">{errors.nombre.message}</div>}
            </div>

            {/* Nombre y Apellido */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="nombreReal" className="form-label text-muted small fw-bold text-uppercase">Nombre</label>
                <input
                  id="nombreReal"
                  placeholder="Ej: Juan"
                  type="text"
                  className={`form-control form-control-lg bg-light border-0 ${errors.nombreReal ? 'is-invalid' : ''}`}
                  style={{ fontSize: '0.95rem' }}
                  {...register("nombreReal", { required: "El nombre es obligatorio" })}
                />
                {errors.nombreReal && <div className="invalid-feedback ps-2">{errors.nombreReal.message}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="apellido" className="form-label text-muted small fw-bold text-uppercase">Apellido</label>
                <input
                  id="apellido"
                  placeholder="Ej: Pérez"
                  type="text"
                  className={`form-control form-control-lg bg-light border-0 ${errors.apellido ? 'is-invalid' : ''}`}
                  style={{ fontSize: '0.95rem' }}
                  {...register("apellido", { required: "El apellido es obligatorio" })}
                />
                {errors.apellido && <div className="invalid-feedback ps-2">{errors.apellido.message}</div>}
              </div>
            </div>

            {/* Mail */}
            <div className="mb-4">
              <label htmlFor="mail" className="form-label text-muted small fw-bold text-uppercase">Correo Electrónico</label>
              <input
                id="mail"
                type="text"
                placeholder="admin@papersrl.com"
                className={`form-control form-control-lg bg-light border-0 ${errors.mail ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("mail", {
                  required: "El mail es obligatorio",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ingrese un mail válido" },
                  maxLength: { value: 100, message: "Debe tener menos de 100 caracteres" }
                })}
              />
              {errors.mail && <div className="invalid-feedback ps-2">{errors.mail.message}</div>}
            </div>

            {/* Botón */}
            <div className="d-grid mt-4">
              <button
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={cargando}
                type="submit"
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  "Registrar Gerente"
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