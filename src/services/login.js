import axios from "axios";
import Cookies from 'js-cookie';

export async function login(user) {
    try {
        const link = "http://localhost:8080/realms/tesina/protocol/openid-connect/token";
        const params = new URLSearchParams();
        params.append('client_id', 'backend-service');
        params.append('client_secret', 'siZIjoNYryGmXBPAhafsYMTyW0WtnU6z'); 
        params.append('grant_type', 'password');
        params.append('username', user.mail);
        params.append('password', user.contraseña);

        const {data} = await axios.post(link, params, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        console.log("TOKENS", data)

        Cookies.set('access_token', data.access_token, {expires:1});
        Cookies.set('refresh_token', data.refresh_token, {expires:7});

        return data;
    } 

    catch (error) {
        alert(`Ha ocurrido un error ${error}`);
        throw error;
        }}