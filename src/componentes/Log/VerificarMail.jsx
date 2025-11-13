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
            navigate(`/activate-account?token=${token}`);
        } else {
            navigate('/');
        }
    }, [navigate, location]);

  return (
    <>
    </>
  )
}
