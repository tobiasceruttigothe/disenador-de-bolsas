import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../assets/pack designer final.png';
import { login } from '../../services/login';
import Header from '../Header&Footer/HeaderLog'; // <-- usar el Header semántico y fijo
import { Link } from 'react-router-dom';
import '../../styles/log.css';

export default function Log({ setLogeado, setTipoUsuario, setNombre, setMail }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [error, setError] = useState(undefined);


  const onSubmit = async (user) => {
    try {
      const data = await login(user);
      setTipoUsuario(data.rol);
      setNombre(data.nombre);
      setMail(data.mail);
      setLogeado(true);
      reset();
    } catch (err) {
      setError('error');
      reset();
    }
  };

  return (
    <>
  <Header />

  <div 
    className="fondo d-flex flex-column align-items-center"
    style={{
      paddingTop: "76px", // compensar solo el header
      minHeight: "100vh"
    }}
  >

    <div
      className=" bg-white d-flex flex-column align-items-center justify-content-center"
      style={{
        textAlign: "center",
        padding: "30px 20px",
        width: "1000px",
        maxWidth: "90%",
        marginBottom: "50px",
        marginTop:"70px"
      }}
    >
      <h2> Bienvenidos a Pack Designer de Paper SRL. </h2>
      <h4>Para acceder a su cuenta, ingrese su mail o nombre de usuario y contraseña.</h4>
      <p style={{ fontSize: "1rem", color: "#666" }}>
        En caso de no tener una cuenta asociada, contactese con la empresa: +54 (351) 490-9041
      </p>
    </div>

    {/* FORMULARIO */}
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded shadow"
      style={{
        width: "550px",
        maxWidth: "90%"
      }}
    >
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Logo"
          className="img-fluid"
          style={{ width: "80px", height: "80px" }}
        />
      </div>

      <h2 className="text-center m-4">Iniciá sesión</h2>
      <hr />

      <div className="mb-4">
        <input
          id="mail"
          type="text"
          placeholder="Ingresa tu mail"
          className={`form-control ${errors.mail ? "is-invalid" : ""}`}
          {...register("mail", { required: "El mail es obligatorio" })}
        />
        {errors.mail && (
          <div className="invalid-feedback">{errors.mail.message}</div>
        )}
      </div>

      <div className="mb-3">
        <input
          id="contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          className={`form-control ${errors.contraseña ? "is-invalid" : ""}`}
          {...register("contraseña", { required: "La contraseña es obligatoria" })}
        />
        {errors.contraseña && (
          <div className="invalid-feedback">{errors.contraseña.message}</div>
        )}
      </div>

      <Link
        to="/recuperar-contraseña"
        className="log-forgot-link"
        style={{ display: "inline-block", marginBottom: "7px" }}
      >
        Olvidé mi contraseña
      </Link>

      <button
        type="submit"
        className="btn w-100 text-white"
        style={{ backgroundColor: "#016add" }}
      >
        Ingresar
      </button>
    </form>

    {/* ERROR */}
    {error === "error" && (
      <div
        className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
        role="alert"
        style={{ zIndex: 9999 }}
      >
        El usuario o la contraseña es incorrecto, intente nuevamente.
      </div>
    )}
  </div>
</>

  );
}
