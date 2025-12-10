import React, { useEffect, useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import { debugAuth } from '../../utils/authDebug';
import Cookies from 'js-cookie';

// Estilos
import "../../index.css"; 
import "../../styles/main.css";

export default function FormularioCliente() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [cargando, setCargando] = useState(false);
  const primaryColor = "#016add";

  useEffect(() => {
    debugAuth();
    const rol = Cookies.get('rol');
    if (rol !== 'admin') {
      mostrarError('Solo los administradores pueden crear usuarios.');
    }
  }, []);

  const handleSubmitForm = async (data) => {
    const payload = {
      username: data.nombre,
      email: data.mail,
      razonSocial: data.razonSocial,
      password: "undefined",
      enabled: true,
      emailVerified: false,
      rol: "CLIENTE"
    };

    try {
      setCargando(true);
      await apiClient.post("/usuarios/create", payload);
      
      reset();
      mostrarExito("Cliente agregado con éxito");
      
      setTimeout(() => {
        navigate("/clientes");
      }, 1500);

    } catch (error) {
      if (error.response && error.response.status === 403) {
        const rol = Cookies.get('rol');
        mostrarError(`No tienes permisos. Tu rol es: ${rol || 'no definido'}.`);
      } else if (error.response && error.response.status === 401) {
        mostrarError("Sesión expirada.");
      } else if (error.response && error.response.status === 409) {
        mostrarError("Usuario ya registrado");
      } else if (error.response && error.response.status === 502) {
        mostrarError("Mail ya registrado");
      } else {
        mostrarError("Error inesperado.");
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
        onClick={() => navigate("/clientes")}
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
            <h3 className="fw-bold text-dark mb-1">Nuevo Cliente</h3>
            <p className="text-muted small">Registrar un nuevo cliente en el sistema</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            
            {/* Usuario */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label text-muted small fw-bold text-uppercase">Nombre de usuario</label>
              <input
                id="nombre"
                placeholder="Ej: cliente123"
                type="text"
                className={`form-control form-control-lg bg-light border-0 ${errors.nombre ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 50, message: "Máximo 50 caracteres" }
                })}
              />
              {errors.nombre && <div className="invalid-feedback ps-2">{errors.nombre.message}</div>}
            </div>

            {/* Razón Social */}
            <div className="mb-3">
              <label htmlFor="razonSocial" className="form-label text-muted small fw-bold text-uppercase">Razón Social</label>
              <input
                id="razonSocial"
                placeholder="Ej: Empresa S.A."
                type="text"
                className={`form-control form-control-lg bg-light border-0 ${errors.razonSocial ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("razonSocial", {
                  required: "La razón social es obligatoria",
                  maxLength: { value: 100, message: "Máximo 100 caracteres" }
                })}
              />
              {errors.razonSocial && <div className="invalid-feedback ps-2">{errors.razonSocial.message}</div>}
            </div>

            {/* Mail */}
            <div className="mb-4">
              <label htmlFor="mail" className="form-label text-muted small fw-bold text-uppercase">Correo Electrónico</label>
              <input
                id="mail"
                type="text"
                placeholder="contacto@cliente.com"
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
                  "Registrar Cliente"
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