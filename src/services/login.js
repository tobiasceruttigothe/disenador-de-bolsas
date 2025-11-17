import axios from "axios";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";


export async function login(user) {
    try {
        const link = "http://localhost:8080/realms/tesina/protocol/openid-connect/token";
        const params = new URLSearchParams();
        params.append('client_id', 'backend-service');
        params.append('client_secret', 'qL9zabLf/LtV48DrZsG6ivGm9/5C8TedHqawXXisvUA='); 
        params.append('grant_type', 'password');
        params.append('username', user.mail.trim());
        params.append('password', user.contraseña);

        const {data} = await axios.post(link, params, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const payload = jwt_decode(data.access_token);
        const roles = payload.realm_access.roles;

        let role = "cliente";
        if (roles.includes("ADMIN")) {
            role = "admin"}
            else if (roles.includes("CLIENTE")) {
                role = "cliente"} 
            else if (roles.includes("DISEÑADOR")) {
                role = "disenador"}
        Cookies.set('access_token', data.access_token, { expires: 1 });
        Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
        Cookies.set('rol', role, { expires: 1 });
        Cookies.set('nombre', payload.preferred_username, { expires: 1 });
        Cookies.set('mail', payload.email, { expires: 1 });
        Cookies.set('usuarioId', payload.sub, { expires: 7 })
        Cookies.set('razonSocial', payload.razonSocial, { expires: 7 });

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            rol: role,
            mail: payload.preferred_username,
            nombre: payload.name
        }
    } 

    catch (error) {
        throw error;
        }}