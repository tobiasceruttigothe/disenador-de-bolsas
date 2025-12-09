import React, { useEffect } from 'react';
import './Notificacion.css';

const Notificacion = ({ tipo, mensaje, visible, onClose, duracion = 5000 }) => {
  useEffect(() => {
    if (visible && duracion > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [visible, duracion, onClose]);

  if (!visible) return null;

  const iconos = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const colores = {
    success: '#016add',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  return (
    <div 
      className={`notificacion notificacion-${tipo} ${visible ? 'notificacion-visible' : ''}`}
      style={{ '--color-notificacion': colores[tipo] }}
    >
      <div className="notificacion-icono">
        {iconos[tipo]}
      </div>
      <div className="notificacion-contenido">
        <p className="notificacion-mensaje">{mensaje}</p>
      </div>
      <button 
        className="notificacion-cerrar"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
      <div className="notificacion-progreso" style={{ animationDuration: `${duracion}ms` }}></div>
    </div>
  );
};

export default Notificacion;

