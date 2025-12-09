import React from 'react';
import './ModalConfirmacion.css';
import "../styles/main.css"

export default function ModalConfirmacion({ isVisible, onClose, onConfirm, titulo, mensaje, tipo = 'warning' }) {
  if (!isVisible) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
        <div className="modal-confirmacion-header">
          <h3>{titulo || 'Confirmar acción'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-confirmacion-body">
          <p>{mensaje || '¿Estás seguro de realizar esta acción?'}</p>
        </div>
        <div className="modal-confirmacion-footer">
          <button className="boton-1 w-50" onClick={onClose}>
            Cancelar
          </button>
          <button className={`boton-2 w-50`} onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

