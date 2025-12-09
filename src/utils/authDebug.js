// Utilidad para debug de autenticación
import Cookies from 'js-cookie';

export function debugAuth() {
  const token = Cookies.get('access_token');
  const rol = Cookies.get('rol');
  const nombre = Cookies.get('nombre');
  const usuarioId = Cookies.get('usuarioId');
  
  return {
    hasToken: !!token,
    rol,
    nombre,
    usuarioId
  };
}

// Función para verificar si el usuario tiene un rol específico
export function hasRole(requiredRole) {
  const rol = Cookies.get('rol');
  return rol === requiredRole;
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
  return !!Cookies.get('access_token');
}

