import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useNavigate } from 'react-router-dom';

// Estilos
import "../../index.css";
import "../../styles/main.css";

export default function RecuperarCuenta() {
  const [mail, setMail] = useState("");
  const [estado, setEstado] = useState(null); // null, "Cargando", "Exito", "Error"
  const navigate = useNavigate();
  const primaryColor = "#016add";

  const reset = () => setMail("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado("Cargando");
    try {
      await apiClient.post("/auth/forgot-password", { email: mail });
      setEstado("Exito");
      reset();
    } catch (error) {
      console.error("Error al enviar el mail:", error);
      setEstado("Error");
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER (FIJO) --- */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/login")}
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
            <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: "90px", height: "90px" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '55px', height: '55px', objectFit: 'contain' }} 
              />
            </div>
            <h3 className="fw-bold text-dark mb-2">Recuperar Cuenta</h3>
            <p className="text-muted small px-3">
              Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Input Mail */}
            <div className="mb-4">
              <label htmlFor="mail" className="form-label text-muted small fw-bold text-uppercase">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 ps-3 text-muted">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  id="mail"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="form-control form-control-lg bg-light border-0"
                  style={{ fontSize: '0.95rem' }}
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                  disabled={estado === "Cargando"}
                />
              </div>
            </div>

            {/* Botón Enviar */}
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={!mail || estado === "Cargando"}
              >
                {estado === "Cargando" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  "Enviar Enlace"
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted small">¿Ya tienes cuenta? </span>
              <span 
                onClick={() => navigate("/login")} 
                className="fw-bold text-decoration-none" 
                style={{ color: primaryColor, cursor: "pointer" }}
              >
                Iniciar Sesión
              </span>
            </div>

          </form>
        </div>

        {/* Alertas Flotantes */}
        {estado === "Exito" && (
          <div
            className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up"
            style={{ zIndex: 9999 }}
            role="alert"
          >
            <i className="fa fa-check-circle me-2"></i> Se ha enviado un correo de recuperación.
          </div>
        )}

        {estado === "Error" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up"
            style={{ zIndex: 9999 }}
            role="alert"
          >
            <i className="fa fa-exclamation-triangle me-2"></i> No se pudo enviar el correo. Intente nuevamente.
          </div>
        )}

      </div>
    </>
  );
}