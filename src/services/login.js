import axios from "axios";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import { KEYCLOAK_TOKEN_URL } from '../config/api.js';

export async function login(user) {
    try {
        const link = KEYCLOAK_TOKEN_URL; 
        const params = new URLSearchParams();
        
        // CAMBIO 1: Usar el nuevo cliente público
        params.append('client_id', 'frontend-service'); 

        params.append('grant_type', 'password');
        params.append('username', user.mail.trim());
        params.append('password', user.contraseña);

        const {data} = await axios.post(link, params, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        // ... (El resto del código se mantiene igual)
        const payload = jwt_decode(data.access_token);
        const roles = payload.realm_access.roles;

        let role = "cliente";
        if (roles.includes("ADMIN")) {
            role = "admin"}
            else if (roles.includes("CLIENTE")) {
                role = "cliente"} 
            else if (roles.includes("DISEÑADOR")) {
                role = "disenador"}

        const cookieOptions = { 
          expires: 1
        };
        
        Cookies.set('access_token', data.access_token, cookieOptions);
        Cookies.set('refresh_token', data.refresh_token, { ...cookieOptions, expires: 7 });
        Cookies.set('rol', role, cookieOptions);
        Cookies.set('nombre', payload.preferred_username, cookieOptions);
        Cookies.set('mail', payload.email, cookieOptions);
        Cookies.set('usuarioId', payload.sub, { ...cookieOptions, expires: 7 });
        
        if (payload.razonSocial) {
          Cookies.set('razonSocial', payload.razonSocial, { ...cookieOptions, expires: 7 });
        }
        
        console.log('✅ Cookies guardadas después del login');

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            rol: role,
            mail: payload.preferred_username,
            nombre: payload.name
        }
    } 

    catch (error) {
        throw error;
    }
}