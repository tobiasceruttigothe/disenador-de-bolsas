import React from 'react';
import { useNavigate } from 'react-router-dom';
import InicioAdmin from './InicioAdmin';
import InicioDisenador from './InicioDisenador';
import InicioCliente from './InicioCliente';
// Asegúrate de importar el logo para la pantalla de carga
import logo from '../../assets/pack designer final.png'; 

export default function Inicio({ tipoUsuario }) {
    const navigate = useNavigate();
    const primaryColor = "#016add";

    // 1. ESTADO DE CARGA (Diseño Corporativo)
    // Se muestra mientras se verifica la sesión
    if (!tipoUsuario) {
        return (
            <div className="min-vh-100 bg-light d-flex flex-column justify-content-center align-items-center">
                <div className="mb-4 animate-fade-in">
                    <img 
                        src={logo} 
                        alt="Paper SRL Logo" 
                        style={{ height: '80px', objectFit: 'contain' }}
                    />
                </div>
                <div 
                    className="spinner-border" 
                    style={{ color: primaryColor, width: "3rem", height: "3rem" }} 
                    role="status"
                >
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted small fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>
                    Iniciando Sistema...
                </p>
            </div>
        );
    }

    // 2. ENRUTAMIENTO SEGÚN ROL
    switch (tipoUsuario) {
        case 'admin':
            return <InicioAdmin />;
        case 'cliente':
            return <InicioCliente />;
        case 'disenador':
            return <InicioDisenador />;
        
        // 3. ESTADO DE ERROR (Rol desconocido o sesión inválida)
        default:
            return (
                <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center p-4">
                    <div className="card border-0 shadow-lg text-center p-5 rounded-4" style={{ maxWidth: '500px' }}>
                        <div className="mb-4 text-warning">
                            <i className="fa fa-exclamation-triangle fa-4x"></i>
                        </div>
                        
                        <h3 className="fw-bold text-dark mb-2">Acceso no identificado</h3>
                        
                        <p className="text-muted mb-4">
                            No pudimos determinar tu perfil de usuario (<strong>{tipoUsuario || 'Desconocido'}</strong>). 
                            Por favor, inicia sesión nuevamente para refrescar tus credenciales.
                        </p>

                        <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm"
                            style={{ 
                                backgroundColor: primaryColor, 
                                borderColor: primaryColor,
                                transition: "all 0.3s"
                            }}
                        >
                            <i className="fa fa-sign-in-alt me-2"></i> Ir al Login
                        </button>
                    </div>
                </div>
            );
    }
}