import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../Header&Footer/HeaderLog';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios'; // Usamos apiClient para consistencia

// Estilos
import '../../styles/log.css'; // Asegúrate de que .fondo esté aquí o en index.css
import "../../index.css";

export default function ActivateAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Guardará el mensaje de error
  const [success, setSuccess] = useState(false);

  const primaryColor = "#016add";

  const handleActivate = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Usamos apiClient en lugar de fetch para mantener consistencia
      await apiClient.post('/auth/activate-account', {
        token: token,
        newPassword: password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('Error activando cuenta:', err);
      // Intentamos leer el mensaje del backend, si no, mensaje genérico
      const msg = err.response?.data || 'No se pudo activar la cuenta. El token puede haber expirado.';
      setError(typeof msg === 'string' ? msg : 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* Contenedor Principal con Fondo */}
      <div 
        className="d-flex justify-content-center align-items-center min-vh-100 fondo" 
        style={{ paddingTop: '76px' }}
      >
        
        <div 
          className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white"
          style={{ width: "100%", maxWidth: "450px" }}
        >
          
          {/* --- ESTADO DE ÉXITO --- */}
          {success ? (
            <div className="text-center py-4 animate-scale-in">
              <div className="mb-3">
                <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h3 className="fw-bold text-dark mb-3">¡Cuenta Activada!</h3>
              <p className="text-muted mb-4">
                Tu contraseña ha sido establecida correctamente.
              </p>
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
              <span className="text-primary small fw-bold">Redirigiendo al login...</span>
            </div>
          ) : (
            /* --- FORMULARIO DE ACTIVACIÓN --- */
            <>
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: "80px", height: "80px" }}>
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="img-fluid" 
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                  />
                </div>
                <h3 className="fw-bold text-dark mb-1">Activar Cuenta</h3>
                <p className="text-muted small">Configura tu contraseña para comenzar</p>
              </div>

              <form onSubmit={handleActivate}>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label text-muted small fw-bold text-uppercase">Nueva Contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className={`form-control form-control-lg bg-light border-0 ${error && error.includes('contraseña') ? 'is-invalid' : ''}`}
                    style={{ fontSize: '0.95rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label text-muted small fw-bold text-uppercase">Confirmar Contraseña</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    className={`form-control form-control-lg bg-light border-0 ${error && error.includes('coinciden') ? 'is-invalid' : ''}`}
                    style={{ fontSize: '0.95rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                    style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Activando...
                      </>
                    ) : (
                      "Activar Cuenta"
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-muted small mb-1">¿El link expiró o no funciona?</p>
                  <Link 
                    to="/resend-activation" 
                    className="text-decoration-none fw-bold" 
                    style={{ color: primaryColor }}
                  >
                    Solicitar nuevo link
                  </Link>
                </div>

              </form>
            </>
          )}
        </div>

        {/* ALERTA DE ERROR FLOTANTE */}
        {error && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow fw-bold px-4 rounded-pill animate-fade-in-up"
            role="alert"
            style={{ zIndex: 1050 }}
          >
            <i className="fa fa-exclamation-triangle me-2"></i> {error}
          </div>
        )}

      </div>
    </>
  );
}