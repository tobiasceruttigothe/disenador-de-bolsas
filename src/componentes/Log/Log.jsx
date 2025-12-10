import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import logo from '../../assets/pack designer final.png';
import { login } from '../../services/login';
import Header from '../Header&Footer/HeaderLog';

// Estilos
import '../../styles/log.css'; // Asegúrate de tener la clase .fondo aquí o en index.css

export default function Log({ setLogeado, setTipoUsuario, setNombre, setMail }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const primaryColor = "#016add";

  const onSubmit = async (user) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const data = await login(user);
      setTipoUsuario(data.rol);
      setNombre(data.nombre);
      setMail(data.mail);
      setLogeado(true);
      reset();
    } catch (err) {
      setError('error');
      setIsLoading(false);
      reset();
    }
  };

  return (
    <>
      <Header />

      {/* Contenedor Principal con Fondo de Círculos */}
      <div className="min-vh-100 fondo d-flex flex-column align-items-center justify-content-center" style={{ paddingTop: "80px" }}>

        {/* Título de Bienvenida */}
        <div className="text-center mb-4 px-3 animate-fade-in-down">
          <h2 className="fw-bold text-dark">
            Bienvenido a <span style={{ color: primaryColor }}>Pack Designer</span>
          </h2>
          <p className="text-muted lead">La plataforma de diseño de Paper SRL</p>
        </div>

        {/* Tarjeta de Login */}
        <div 
          className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white w-100 animate-scale-in"
          style={{ maxWidth: '450px' }}
        >
          {/* Logo Centrado */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: "90px", height: "90px" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '55px', height: '55px', objectFit: 'contain' }} 
              />
            </div>
            <h4 className="fw-bold text-dark">Iniciar Sesión</h4>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input Usuario/Mail */}
            <div className="mb-3">
              <label htmlFor="mail" className="form-label text-muted small fw-bold text-uppercase">Usuario o Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-user"></i></span>
                <input
                  id="mail"
                  type="text"
                  placeholder="ejemplo@papersrl.com"
                  className={`form-control bg-light border-start-0 ps-0 ${errors.mail ? "is-invalid" : ""}`}
                  {...register("mail", { required: "El mail es obligatorio" })}
                />
              </div>
              {errors.mail && <div className="text-danger small mt-1">{errors.mail.message}</div>}
            </div>

            {/* Input Contraseña */}
            <div className="mb-2">
              <label htmlFor="contraseña" className="form-label text-muted small fw-bold text-uppercase">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-lock"></i></span>
                <input
                  id="contraseña"
                  type="password"
                  placeholder="••••••••"
                  className={`form-control bg-light border-start-0 ps-0 ${errors.contraseña ? "is-invalid" : ""}`}
                  {...register("contraseña", { required: "La contraseña es obligatoria" })}
                />
              </div>
              {errors.contraseña && <div className="text-danger small mt-1">{errors.contraseña.message}</div>}
            </div>

            {/* Olvidé mi contraseña */}
            <div className="text-end mb-4">
              <Link 
                to="/recuperar-contraseña" 
                className="text-decoration-none small fw-bold"
                style={{ color: primaryColor }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              className="btn btn-lg w-100 text-white fw-bold rounded-pill shadow-sm"
              style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>

          </form>

          {/* Footer de contacto */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="small text-muted mb-1">¿No tienes cuenta?</p>
            <p className="small fw-bold text-dark mb-0">
              <i className="fa fa-phone me-1"></i> En caso de no tener una cuenta asociada, contáctese con la empresa: +54 (351) 490-9041
            </p>
          </div>

        </div>

        {/* Alerta de Error Flotante */}
        {error === "error" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow fw-bold px-4 rounded-pill animate-fade-in-up"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            <i className="fa fa-exclamation-circle me-2"></i> Usuario o contraseña incorrectos.
          </div>
        )}

      </div>
    </>
  );
}