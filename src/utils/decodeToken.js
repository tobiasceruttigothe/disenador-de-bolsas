// Utilidad para decodificar y verificar el token JWT
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

export function getTokenInfo() {
  try {
    const token = Cookies.get('access_token');
    if (!token) {
      return null;
    }
    
    const decoded = jwt_decode(token);
    const roles = decoded.realm_access?.roles || [];
    
    return {
      token,
      decoded,
      roles,
      username: decoded.preferred_username,
      email: decoded.email,
      userId: decoded.sub,
      exp: decoded.exp,
      isExpired: decoded.exp * 1000 < Date.now()
    };
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

export function hasRole(requiredRole) {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) return false;
  
  // Mapear roles de Keycloak a roles de la aplicación
  const roleMap = {
    'ADMIN': 'admin',
    'CLIENTE': 'cliente',
    'DISEÑADOR': 'disenador'
  };
  
  // Verificar si el rol requerido está en los roles del token
  const upperRequired = requiredRole.toUpperCase();
  return tokenInfo.roles.includes(upperRequired) || 
         tokenInfo.roles.includes(requiredRole);
}

export function logTokenInfo() {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    console.error('❌ No se pudo obtener información del token');
    return;
  }
  
  console.group('🔐 Información del Token');
  console.log('Username:', tokenInfo.username);
  console.log('Email:', tokenInfo.email);
  console.log('Roles en el token:', tokenInfo.roles);
  console.log('Expira:', new Date(tokenInfo.exp * 1000).toLocaleString());
  console.log('¿Está expirado?', tokenInfo.isExpired);
  console.log('Rol en cookie:', Cookies.get('rol'));
  console.groupEnd();
  
  return tokenInfo;
}

