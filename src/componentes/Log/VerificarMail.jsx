import React, {useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

export default function VerificarMail() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            axios.post(`http://localhost:8080/api/auth/verify-email?token=${token}`)
                .then(response => {
                    navigate('/login');
                })
                .catch(error => {
                    console.error('Error al verificar el correo electrónico:', error);
                    navigate('/');
                });
        } else {
            navigate('/');
        }
    }, [navigate, location]);

  return (
    <>
    </>
  )
}
