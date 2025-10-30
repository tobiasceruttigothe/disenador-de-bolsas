import React from 'react';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null; // No renderiza nada si no está visible

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px',
          maxWidth: '80%',
          maxHeight: '90vh',      
          overflowY: 'auto', 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;