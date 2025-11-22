import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'

export default function FormularioMateriales() {
  const [estado, setEstado] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const navigate = useNavigate()

  const handleSubmitForm = async (data) => {
    const token = Cookies.get('access_token');

    const payload = {
      nombre: data.nombre
    };

    try {
      setEstado("Cargando");
      setMensaje("Cargando...");

      await axios.post("http://localhost:9090/api/materiales", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      reset();
      setEstado("Exito");
      setMensaje("Material agregado con éxito");
    } catch (error) {
      console.error("Error al agregar el material:", error);
      setMensaje("Ocurrió un error al agregar el material");
      setEstado("Error");
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
            disabled={estado === "Cargando"}
          >
            {estado === "Cargando" ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {/* Alertas dinámicas */}
        {estado && (
          <div
            className={`alert ${estado === "Exito"
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
    </>
  );
}
