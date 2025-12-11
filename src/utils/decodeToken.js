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
  
  return tokenInfo;
}

