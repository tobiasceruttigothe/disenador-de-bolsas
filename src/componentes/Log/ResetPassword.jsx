import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../config/axios';
import logo from '../../assets/pack designer final.png';

// Estilos
import "../../index.css";
import "../../styles/main.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [contraseñaReset, setContraseñaReset] = useState("");
  const [contraseñaReset2, setContraseñaReset2] = useState("");
  const [estado, setEstado] = useState(null); // null, "Cargando", "Exito", "Error", "NoCoinciden"
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const primaryColor = "#016add";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contraseñaReset !== contraseñaReset2) {
      setEstado("NoCoinciden");
      return;
    }

    if (contraseñaReset.length < 8) {
      // Podrías agregar un estado para validación de longitud si quieres
      return; 
    }

    try {
      setEstado("Cargando");
      
      // Asegúrate de enviar el token y la nueva contraseña
      // (En tu código original enviabas { email: mail }, pero para resetear password con token suele ser { token, newPassword })
      // Ajusta el payload según tu backend. Asumo que es algo así:
      await apiClient.post("/auth/reset-password", { token, newPassword: contraseñaReset });

      setEstado("Exito");
      setTimeout(() => navigate("/login"), 3000);

    } catch (error) {
      console.error("Error al restablecer:", error);
      setEstado("Error");
    }
  };

  return (
    <>
      {/* Botón Volver al Login (Fijo) */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/login")}
      >
        ←
      </button>

      {/* Contenedor Principal */}
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
            <h3 className="fw-bold text-dark mb-2">Nueva Contraseña</h3>
            <p className="text-muted small">Crea una contraseña segura para tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label text-muted small fw-bold text-uppercase">Nueva Contraseña</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="form-control form-control-lg bg-light border-0"
                style={{ fontSize: '0.95rem' }}
                value={contraseñaReset}
                onChange={(e) => setContraseñaReset(e.target.value)}
                required
                minLength={8}
                disabled={estado === "Cargando"}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword2" className="form-label text-muted small fw-bold text-uppercase">Confirmar Contraseña</label>
              <input
                id="newPassword2"
                type="password"
                placeholder="Repite la contraseña"
                className="form-control form-control-lg bg-light border-0"
                style={{ fontSize: '0.95rem' }}
                value={contraseñaReset2}
                onChange={(e) => setContraseñaReset2(e.target.value)}
                required
                disabled={estado === "Cargando"}
              />
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={estado === "Cargando"}
              >
                {estado === "Cargando" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Restableciendo...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Alertas Flotantes */}
        {estado === "Exito" && (
          <div className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up" style={{ zIndex: 1050 }}>
            <i className="fa fa-check-circle me-2"></i> ¡Contraseña actualizada! Redirigiendo...
          </div>
        )}

        {estado === "Error" && (
          <div className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up" style={{ zIndex: 1050 }}>
            <i className="fa fa-exclamation-triangle me-2"></i> El enlace es inválido o ha expirado.
          </div>
        )}

        {estado === "NoCoinciden" && (
          <div className="alert alert-warning position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up" style={{ zIndex: 1050 }}>
            <i className="fa fa-exclamation-circle me-2"></i> Las contraseñas no coinciden.
          </div>
        )}

      </div>
    </>
  );
}