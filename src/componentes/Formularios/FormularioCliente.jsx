import React, { useEffect, useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import { debugAuth } from '../../utils/authDebug';
import Cookies from 'js-cookie';

export default function FormularioCliente() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  const [cargando, setCargando] = useState(false);

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
        mostrarError(`No tienes permisos para crear usuarios. Tu rol actual es: ${rol || 'no definido'}. Solo los administradores pueden crear usuarios.`);
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else if (error.response && error.response.status === 409) {
        mostrarError("Nombre de usuario ya registrado");
      } else if (error.response && error.response.status === 502) {
        mostrarError("Mail ya registrado");
      } else {
        mostrarError("Ocurrió un error al agregar el cliente. Intente nuevamente más tarde.");
      }
    } finally {
      setCargando(false);
    }
  };

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
        onClick={() => navigate("/clientes")}
      >
        ←
      </button>
      <div className="d-flex justify-content-center align-items-center vh-100 fondo">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-100 bg-white p-4 rounded shadow"
          style={{ maxWidth: '400px' }}
        >
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ width: '80px', height: '80px' }}
            />
          </div>
          <h2 className="text-center mb-4">Agregar Cliente</h2>

          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre de usuario</label>
            <input
              id="nombre"
              placeholder="Ingrese un nombre de usuario"
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 5, message: "El nombre debe tener al menos 5 caracteres" },
                maxLength: { value: 50, message: "El nombre debe tener menos de 50 caracteres" }
              })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="razonSocial" className="form-label">Razón social</label>
            <input
              id="razonSocial"
              placeholder="Ingrese una razón social"
              type="text"
              className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
              {...register("razonSocial", {
                required: "La razón social es obligatoria",
                maxLength: { value: 100, message: "Debe tener menos de 100 caracteres" }
              })}
            />
            {errors.razonSocial && <div className="invalid-feedback">{errors.razonSocial.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="mail" className="form-label">Mail</label>
            <input
              id="mail"
              type="text"
              placeholder="Ingrese un mail"
              className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
              {...register("mail", {
                required: "El mail es obligatorio",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ingrese un mail válido" },
                maxLength: { value: 100, message: "Debe tener menos de 100 caracteres" }
              })}
            />
            {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
          </div>

          <button
            className="btn w-100 text-white"
            style={{ backgroundColor: '#016add' }}
            type="submit"
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Ingresar"}
          </button>
        </form>

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
