import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";

export default function FormularioDiseñador() {
  const [estado, setEstado] = useState(null); // "Cargando", "Exito", "Error" o null
  const [mensaje, setMensaje] = useState(""); 
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleSubmitForm = async (data) => {
    const token = Cookies.get('access_token');
    const payload = {
      username: data.nombre,
      email: data.mail,
      razonSocial: "PAPERSRL",
      password: data.contraseña,
      enabled: true,
      emailVerified: false,
      rol: "DISEÑADOR"
    };

    try {
      setEstado("Cargando");
      setMensaje("Cargando...");

      await axios.post("http://localhost:9090/api/usuarios/create", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      reset();
      setEstado("Exito");
      setMensaje("Diseñador agregado con éxito");
    } catch (error) {
      console.error("Error al agregar el diseñador:", error);

      if (error.response && error.response.status === 409) {
        setMensaje("Nombre de usuario ya registrado");
      } else if (error.response && error.response.status === 502) {
        setMensaje("Mail ya registrado");
      } else {
        setMensaje("Ocurrió un error al agregar el diseñador");
      }

      setEstado("Error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
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
        <h2 className="text-center mb-4">Agregar Diseñador</h2>

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
              minLength: { value: 5, message: "Debe tener al menos 5 caracteres" },
              maxLength: { value: 50, message: "Debe tener menos de 50 caracteres" }
            })}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label">Contraseña</label>
          <input
            id="contraseña"
            placeholder="Ingrese una contraseña provisoria"
            type="text"
            className={`form-control ${errors.contraseña ? 'is-invalid' : ''}`}
            {...register("contraseña", {
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
              maxLength: { value: 50, message: "Debe tener menos de 50 caracteres" }
            })}
          />
          {errors.contraseña && <div className="invalid-feedback">{errors.contraseña.message}</div>}
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
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Ingrese un mail válido" },
              maxLength: { value: 100, message: "Debe tener menos de 100 caracteres" }
            })}
          />
          {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
        </div>

        <button
          className="btn w-100 text-white"
          style={{ backgroundColor: '#016add' }}
          disabled={estado === "Cargando"}
        >
          {estado === "Cargando" ? "Enviando..." : "Ingresar"}
        </button>
      </form>

      {/* Alertas dinámicas */}
      {estado && (
        <div
          className={`alert ${
            estado === "Exito"
              ? "alert-success"
              : estado === "Error"
              ? "alert-danger"
              : "alert-info"
          } position-absolute bottom-0 start-50 translate-middle-x mb-4`}
          role="alert"
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}
