import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, KEYCLOAK_TOKEN_URL } from './api.js';

// Instancia de axios para el backend API
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log solo para peticiones importantes o cuando hay problemas
      if (config.url?.includes('/disenos') || config.url?.includes('/usuarios/create')) {
        console.log('🔐 Token agregado a la petición:', config.url);
        console.log('🔐 Header Authorization presente:', !!config.headers.Authorization);
        console.log('🔐 Token (primeros 50 chars):', token.substring(0, 50) + '...');
      }
    } else {
      console.error('❌ No se encontró token en cookies para la petición:', config.url);
      console.error('❌ Cookies disponibles:', document.cookie);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores 401 (token expirado)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      // Si el token expiró o no es válido (401), redirigir al login
      // 403 (Forbidden) se maneja en los componentes individuales
      if (status === 401) {
        // Limpiar cookies y redirigir al login
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('rol');
        Cookies.remove('nombre');
        Cookies.remove('mail');
        Cookies.remove('usuarioId');
        Cookies.remove('razonSocial');
        
        // Solo redirigir si estamos en el navegador
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      console.error('❌ No se recibió respuesta del servidor:', error.config?.url);
      console.error('Request:', error.request);
    } else {
      // Error al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Exportar también la URL de Keycloak para uso directo
export { KEYCLOAK_TOKEN_URL };

