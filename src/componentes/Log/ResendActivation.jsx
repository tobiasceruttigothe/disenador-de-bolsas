import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios'; // Usamos apiClient

// Estilos
import '../../styles/log.css'; 
import "../../index.css";
import "../../styles/main.css";

export default function ResendActivation() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const primaryColor = "#016add";

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // Usamos apiClient para mantener consistencia
      const response = await apiClient.post('/auth/resend-activation', { email });
      
      // Si el backend devuelve texto plano o un objeto, nos adaptamos
      setMessage(response.data || "Enlace enviado. Revisa tu correo.");
      setEmail('');
      
    } catch (err) {
      console.error('Error reenviando activación:', err);
      const msg = err.response?.data || 'Error de conexión con el servidor.';
      setMessage(typeof msg === 'string' ? msg : 'Error al procesar la solicitud.');
      setIsError(true);
    } finally {
      setLoading(false);
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
            <h3 className="fw-bold text-dark mb-2">Reenviar Activación</h3>
            <p className="text-muted small px-2">
              Si tu link expiró, ingresá tu email para recibir uno nuevo.
            </p>
          </div>

          <form onSubmit={handleResend}>
            
            {/* Input Email */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-muted small fw-bold text-uppercase">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 ps-3 text-muted">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="form-control form-control-lg bg-light border-0"
                  style={{ fontSize: '0.95rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Botón Enviar */}
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Enviando...
                  </>
                ) : (
                  "Enviar Nuevo Link"
                )}
              </button>
            </div>

          </form>
        </div>

        {/* ALERTAS FLOTANTES */}
        {message && (
          <div
            className={`alert ${
              isError ? "alert-danger" : "alert-success"
            } position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill animate-fade-in-up`}
            style={{ zIndex: 1050 }}
            role="alert"
          >
            {isError ? <i className="fa fa-exclamation-triangle me-2"></i> : <i className="fa fa-check-circle me-2"></i>}
            {message}
          </div>
        )}

      </div>
    </>
  );
}