import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';

export default function FormularioMateriales() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  const handleSubmitForm = async (data) => {
    const token = Cookies.get('access_token');

    const payload = {
      nombre: data.nombre
    };

    try {
      await apiClient.post("/materiales", payload);
      reset();
      mostrarExito("Material agregado con éxito");
      setTimeout(() => {
        navigate("/productos/materiales");
      }, 1500);
    } catch (error) {
      console.error("Error al agregar el material:", error);
      mostrarError("Ocurrió un error al agregar el material");
    }
  };

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/productos/materiales")}
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
          <h2 className="text-center mb-4">Agregar material</h2>

          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre del material</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ingrese el nombre del material"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                maxLength: { value: 100, message: "Debe tener menos de 100 caracteres" },
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres"}
              })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
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
