// Utilidad para debug de autenticación
import Cookies from 'js-cookie';

export function debugAuth() {
  const token = Cookies.get('access_token');
  const rol = Cookies.get('rol');
  const nombre = Cookies.get('nombre');
  const usuarioId = Cookies.get('usuarioId');
  
  console.group('🔐 Estado de Autenticación');
  console.log('Token:', token ? `✅ Presente (${token.substring(0, 20)}...)` : '❌ Ausente');
  console.log('Rol:', rol || '❌ No definido');
  console.log('Nombre:', nombre || '❌ No definido');
  console.log('Usuario ID:', usuarioId || '❌ No definido');
  console.log('Todas las cookies:', document.cookie);
  console.groupEnd();
  
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

