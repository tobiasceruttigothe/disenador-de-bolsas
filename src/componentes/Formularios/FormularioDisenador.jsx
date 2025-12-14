import React, { useState, useEffect } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import { logTokenInfo } from '../../utils/decodeToken';

// Estilos
import "../../index.css"; 
import "../../styles/main.css";

export default function FormularioDiseñador() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const primaryColor = "#016add";

  useEffect(() => {
    logTokenInfo();
    const rol = Cookies.get('rol');
    if (rol !== 'admin') {
      mostrarError('Solo los administradores pueden crear usuarios.');
    }
  }, []);

  const handleSubmitForm = async (data) => {
    setCargando(true);

    // Concatenamos nombre y apellido para enviarlo como 'razonSocial'
    const nombreCompleto = `${data.nombreReal} ${data.apellido}`;

    const payload = {
      username: data.username, // Nombre de usuario para login
      email: data.mail,
      razonSocial: nombreCompleto, // Nombre real del empleado
      password: "undefined",
      enabled: true,
      emailVerified: false,
      rol: "DISEÑADOR"
    };

    try {
      await apiClient.post("/usuarios/create", payload);
      reset();
      mostrarExito("Diseñador agregado con éxito");
      setTimeout(() => {
        navigate("/disenadores");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 403) {
        const rol = Cookies.get('rol');
        mostrarError(`No tienes permisos para crear usuarios. Tu rol es: ${rol || 'no definido'}.`);
      } else if (error.response?.status === 401) {
        mostrarError("Tu sesión ha expirado. Inicia sesión nuevamente.");
      } else if (error.response?.status === 409) {
        mostrarError("Nombre de usuario ya registrado");
      } else if (error.response?.status === 502) {
        mostrarError("Mail ya registrado");
      } else {
        mostrarError("Error inesperado. Intente más tarde.");
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
        onClick={() => navigate("/disenadores")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>
        
        <div 
          className="form-card"
          style={{ width: "100%", maxWidth: "600px" }} // Aumenté el ancho un poco
        >
          
          {/* Cabecera */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '70px', height: '70px', objectFit: 'contain' }} 
              />
            </div>
            <h3 className="fw-bold text-dark mb-1">Nuevo Diseñador</h3>
            <p className="text-muted small">Registrar un nuevo miembro del equipo de diseño</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            
            {/* Nombre de Usuario (Login) */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label text-muted small fw-bold text-uppercase">Nombre de usuario (Login)</label>
              <input
                id="username"
                placeholder="Ej: disenador123"
                type="text"
                className={`form-control form-control-lg bg-light border-0 ${errors.username ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("username", {
                  required: "El nombre de usuario es obligatorio",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 50, message: "Máximo 50 caracteres" }
                })}
              />
              {errors.username && <div className="invalid-feedback ps-2">{errors.username.message}</div>}
            </div>

            {/* Fila: Nombre y Apellido */}
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
                placeholder="ejemplo@papersrl.com"
                className={`form-control form-control-lg bg-light border-0 ${errors.mail ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("mail", {
                  required: "El mail es obligatorio",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ingrese un mail válido" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" }
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
                  "Registrar Diseñador"
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