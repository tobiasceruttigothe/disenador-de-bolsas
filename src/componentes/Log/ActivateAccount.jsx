import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../Header&Footer/HeaderLog'; // header semántico y fijo
import logo from '../../assets/pack designer final.png';
import '../../styles/log.css';

export default function ActivateAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleActivate = async (e) => {
    e.preventDefault();

    // Validaciones del frontend
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:9090/api/auth/activate-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data || 'No se pudo activar la cuenta');
      }
    } catch (err) {
      console.error('Error activando cuenta:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main style={{ paddingTop: '76px', minHeight: 'calc(100vh - 76px)' }} className="d-flex justify-content-center align-items-center bg-light fondo">
        {success ? (
          <div className="w-100 bg-white p-4 rounded shadow text-center" style={{ maxWidth: '400px' }}>
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>✅</div>
            <h2 style={{ color: '#27ae60' }}>¡Cuenta activada correctamente!</h2>
            <p>Ya podés iniciar sesión con tu nueva contraseña.</p>
            <p style={{ fontStyle: 'italic', color: '#666' }}>Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="w-100 bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="img-fluid" style={{ width: '80px', height: '80px' }} />
            </div>

            <div className="mb-3">
              <input
                id="newPassword"
                type="password"
                placeholder="Nueva contraseña (mínimo 8 caracteres)"
                className={`form-control ${error && error.includes('contraseña') ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                className={`form-control ${error && error.includes('coinciden') ? 'is-invalid' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#016add' }} disabled={loading}>
              {loading ? 'Activando...' : 'Activar cuenta'}
            </button>

            <div className="mt-3 text-center" style={{ fontSize: '14px', color: '#666' }}>
              ¿El link expiró?{' '}
              <Link to="/resend-activation" className="" style={{ color: '#016add', textDecoration: 'underline' }}>
                Solicitar nuevo link
              </Link>
            </div>
          </form>
        )}
      </main>

      {error === 'error' && (
        <div className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4" role="alert" style={{ zIndex: 9999 }}>
          Ocurrió un error, intente nuevamente.
        </div>
      )}
    </>
  );
}
