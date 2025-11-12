import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
          newPassword: password
        })
      });
      
      const data = await response.text();
      
      if (response.ok) {
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data);
      }
    } catch (err) {
      console.error('Error activando cuenta:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>¡Cuenta activada correctamente!</h2>
          <p style={styles.successText}>
            Ya podés iniciar sesión con tu nueva contraseña.
          </p>
          <p style={styles.redirectText}>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Formulario de activación
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Activá tu cuenta</h2>
        <p style={styles.subtitle}>
          Establecé tu contraseña para comenzar a usar la plataforma
        </p>
        
        <form onSubmit={handleActivate} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nueva contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              style={styles.input}
              disabled={loading}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar contraseña:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repetir contraseña"
              style={styles.input}
              disabled={loading}
            />
          </div>
          
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Activando...' : 'Activar cuenta'}
          </button>
        </form>
        
        <div style={styles.resendLink}>
          ¿El link expiró?{' '}
          <button
            onClick={() => navigate('/resend-activation')}
            style={styles.linkButton}
          >
            Solicitar nuevo link
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos inline básicos (podés reemplazarlos con tus propios estilos)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '450px',
    width: '100%'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '10px'
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed'
  },
  error: {
    padding: '12px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '4px',
    fontSize: '14px',
    border: '1px solid #ef5350'
  },
  resendLink: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px'
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '60px 40px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center'
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '15px'
  },
  successText: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '10px'
  },
  redirectText: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  }
};