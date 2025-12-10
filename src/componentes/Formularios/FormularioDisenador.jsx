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
    const payload = {
      username: data.nombre,
      email: data.mail,
      razonSocial: data.nombreApellido,
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
      if (error.response && error.response.status === 403) {
        const rol = Cookies.get('rol');
        mostrarError(`No tienes permisos para crear usuarios. Tu rol actual es: ${rol || 'no definido'}.`);
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Inicia sesión nuevamente.");
      } else if (error.response && error.response.status === 409) {
        mostrarError("Nombre de usuario ya registrado");
      } else if (error.response && error.response.status === 502) {
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
        onClick={() => navigate("/disenadores")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL CON FONDO --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>
        
        <div 
          className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          
          {/* Cabecera */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: "80px", height: "80px" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
              />
            </div>
            <h3 className="fw-bold text-dark mb-1">Nuevo Diseñador</h3>
            <p className="text-muted small">Registrar un nuevo miembro del equipo de diseño</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            
            {/* Usuario */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label text-muted small fw-bold text-uppercase">Nombre de usuario</label>
              <input
                id="nombre"
                placeholder="Ej: disenador123"
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
            <div className="mb-3">
              <label htmlFor="nombreApellido" className="form-label text-muted small fw-bold text-uppercase">Nombre y Apellido</label>
              <input
                id="nombreApellido"
                placeholder="Ej: Juan Pérez"
                type="text"
                className={`form-control form-control-lg bg-light border-0 ${errors.nombreApellido ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("nombreApellido", {
                  required: "El nombre y apellido es obligatorio",
                })}
              />
              {errors.nombreApellido && <div className="invalid-feedback ps-2">{errors.nombreApellido.message}</div>}
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