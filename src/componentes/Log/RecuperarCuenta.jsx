import React, { useState } from 'react'
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import "../../index.css";

export default function RecuperarCuenta() {
  const [mail, setMail] = useState("")
  const [exito, setExito] = useState(undefined)

  const reset = () => {
    setMail("")
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9090/api/auth/forgot-password", { email: mail })
      setExito(true)
      reset()
    }
    catch (error) {
      alert("Error al enviar el mail:", error);
      setExito(false)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
        <form className="w-100 bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" className="img-fluid" style={{ width: '80px', height: '80px' }} />
          </div>
          <h2 className="text-center mb-4">Recuperar Cuenta</h2>
          <div className="mb-3">
            <label htmlFor="mail" className="form-label"></label>
            <input
              id="mail"
              type="text"
              placeholder="Ingrese su mail"
              className={`form-control`}
              onChange={(e) => setMail(e.target.value)}
            />
          </div>
          <button
            className={`btn w-100 text-white ${mail === "" ? "disabled" : ""}`}
            style={{ backgroundColor: '#016add' }}
            onClick={handleSubmit}
          >
            Enviar
          </button>
        </form>
      </div>
      {exito && (
        <div
          className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          Se ha enviado un correo para restablecer su contraseña.
        </div>
      )}

      {!exito && (
        <div
          className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          No se pudo enviar el correo. Intente nuevamente.
        </div>
      )}

    </>
  )
}
