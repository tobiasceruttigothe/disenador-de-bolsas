// Configuración de URLs de API
// En desarrollo, usa rutas relativas que serán proxy por Vite
// En producción (Docker), usa rutas relativas que serán proxy por Nginx

// URL base del backend API
export const API_BASE_URL = '/api';

// URL base de Keycloak
export const KEYCLOAK_BASE_URL = '/keycloak';

// URL completa de Keycloak token endpoint
export const KEYCLOAK_TOKEN_URL = `${KEYCLOAK_BASE_URL}/realms/tesina/protocol/openid-connect/token`;

