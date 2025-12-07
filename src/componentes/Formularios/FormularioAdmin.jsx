import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm} from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate} from "react-router-dom";
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';

export default function FormularioAdmin() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion(); 
  const handleSubmitForm = async (data) => {
    try {
      const payload = {
        username: data.nombre,
        email: data.mail,
        razonSocial: data.nombreApellido,
        password: "undefined",
        enabled: true,
        emailVerified: false,
        rol: "ADMIN"
      };

      // Verificar rol antes de enviar
      const rol = Cookies.get('rol');
      console.log('🔐 Rol del usuario:', rol);
      console.log('📤 Enviando petición para crear administrador:', payload);

      await apiClient.post("/usuarios/create", payload);
      reset();
      mostrarExito("Administrador agregado con éxito");
      setTimeout(() => {
        navigate("/admins");
      }, 1500);
    } catch (error) {
      console.error("Error al agregar el administrador:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      console.error("Headers enviados:", error.config?.headers);
      
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
        mostrarError("Ocurrió un error al agregar el administrador. Intente nuevamente más tarde.");
      }
    }
  };

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/admins")}
      >
        ←
      </button>

      <div className="d-flex justify-content-center align-items-center fondo">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className=" bg-white p-3 rounded shadow"
          style={{ width: '500px' }}
        >
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ width: '80px', height: '80px' }}
            />
          </div>
          <h2 className="text-center mb-4">Agregar Administradores Gerenciales</h2>

          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre de usuario</label>
            <input
              id="nombre"
              placeholder="Ingrese un nombre de usuario"
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 5,
                  message: "El nombre de usuario debe tener al menos 5 caracteres"
                },
                maxLength: {
                  value: 50,
                  message: "El nombre de usuario debe tener menos de 50 caracteres"
                }
              })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre y apellido del empleado</label>
            <input
              id="nombre"
              placeholder="Ingrese el nombre y apellido del empleado"
              type="text"
              className={`form-control ${errors.nombreApellido ? 'is-invalid' : ''}`}
              {...register("nombreApellido", {
                required: "El nombre y apellido del empleado es obligatorio",
              })}
            />
            {errors.nombreApellido && <div className="invalid-feedback">{errors.nombreApellido.message}</div>}
          </div>

          {/* Mail */}
          <div className="mb-3">
            <label htmlFor="mail" className="form-label">Mail</label>
            <input
              id="mail"
              type="text"
              placeholder="Ingrese un mail"
              className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
              {...register("mail", {
                required: "El mail es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingrese un mail válido"
                },
                maxLength: {
                  value: 100,
                  message: "El mail debe tener menos de 100 caracteres"
                }
              })}
            />
            {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
          </div>

          <button
            className="btn w-100 text-white"
            style={{ backgroundColor: '#016add' }}
            type="submit"
          >
            Ingresar
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
