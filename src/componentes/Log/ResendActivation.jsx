import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header&Footer/HeaderLog';
import logo from '../../assets/pack designer final.png';
import '../../styles/log.css';

export default function ResendActivation() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/auth/resend-activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      setMessage(data);
      setIsError(!response.ok);

      if (response.ok) setEmail('');
    } catch (err) {
      console.error('Error reenviando activación:', err);
      setMessage('Error de conexión con el servidor');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main
        style={{ paddingTop: '76px', minHeight: 'calc(100vh - 76px)' }}
        className="d-flex justify-content-center align-items-center bg-light fondo"
      >
        <form
          onSubmit={handleResend}
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

          <h5 className="text-center mb-3">Solicitar nuevo link de activación</h5>
          <p className="text-center text-muted" style={{ fontSize: '14px' }}>
            Si tu link expiró, ingresá tu email para recibir uno nuevo.
          </p>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Ingresa tu mail"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn w-100 text-white"
            style={{ backgroundColor: '#016add' }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar nuevo link'}
          </button>

          <div className="mt-3 text-center">
            <Link to="/login" style={{ color: '#016add', textDecoration: 'underline' }}>
              ← Volver al login
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}