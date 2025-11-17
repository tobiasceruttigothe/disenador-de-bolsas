import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import { useForm} from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate} from "react-router-dom"

export default function FormularioAdmin() {
  const [estado, setEstado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const navigate = useNavigate() 
  const handleSubmitForm = async (data) => {
    try {
      setEstado("Cargando");
      setMensaje("Cargando...");

      const token = Cookies.get('access_token');
      const payload = {
        username: data.nombre,
        email: data.mail,
        razonSocial: data.nombreApellido,
        password: "undefined",
        enabled: true,
        emailVerified: false,
        rol: "ADMIN"
      };

      await axios.post("http://localhost:9090/api/usuarios/create", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      reset();
      setEstado("Exito");
      setMensaje("Administrador agregado con éxito");
    } catch (error) {
      console.error("Error al agregar el administrador:", error);

      if (error.response && error.response.status === 409) {
        setMensaje("Nombre de usuario ya registrado");
      } else if (error.response && error.response.status === 502) {
        setMensaje("Mail ya registrado");
      } else {
        setMensaje("Ocurrió un error al agregar el administrador");
      }

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
              disabled={estado === "Cargando"}
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
              disabled={estado === "Cargando"}
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
              disabled={estado === "Cargando"}
            />
            {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
          </div>

          <button
            className="btn w-100 text-white"
            style={{ backgroundColor: '#016add' }}
            disabled={estado === "Cargando"}
          >
            Ingresar
          </button>
        </form>

        {/* Mensaje dinámico */}
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
