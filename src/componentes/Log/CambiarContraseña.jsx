import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useNavigate } from 'react-router-dom';

// Estilos
import "../../index.css";
import "../../styles/main.css";

export default function CambiarContraseña() {
  const [mail, setMail] = useState("");
  const [estado, setEstado] = useState(null); // null, "Cargando", "Exito", "Error"
  const [mensaje, setMensaje] = useState("");
  
  const navigate = useNavigate();
  const primaryColor = "#016add";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setEstado("Cargando");
      
      // Enviar solicitud
      await apiClient.post("/auth/forgot-password", { email: mail });
      
      setEstado("Exito");
      setMensaje("Se ha enviado un correo con las instrucciones.");
      setMail(""); // Limpiar input

    } catch (error) {
      console.error("Error al enviar el mail:", error);
      setEstado("Error");
      // Mensaje un poco más descriptivo si el backend lo devuelve, sino genérico
      setMensaje("No se pudo enviar el correo. Verifique el mail e intente nuevamente.");
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER (FIJO) --- */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/perfil")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>
        
        <div 
          className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white"
          style={{ width: "100%", maxWidth: "450px" }}
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
            <h3 className="fw-bold text-dark mb-2">Restablecer Contraseña</h3>
            <p className="text-muted small">
              Ingresa tu correo electrónico y te enviaremos un enlace para cambiar tu contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="mb-4">
              <label htmlFor="mail" className="form-label text-muted small fw-bold text-uppercase">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 ps-3 text-muted"><i className="fa fa-envelope"></i></span>
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

          </form>
        </div>

        {/* Alertas Flotantes */}
        {estado === "Exito" && (
          <div
            className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up"
            style={{ zIndex: 9999 }}
            role="alert"
          >
            <i className="fa fa-check-circle me-2"></i> {mensaje}
          </div>
        )}

        {estado === "Error" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up"
            style={{ zIndex: 9999 }}
            role="alert"
          >
            <i className="fa fa-exclamation-triangle me-2"></i> {mensaje}
          </div>
        )}

      </div>
    </>
  );
}