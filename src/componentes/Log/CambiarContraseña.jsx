import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import "../../index.css";
import {useNavigate} from 'react-router-dom'

export default function CambiarConstraseña() {
  const [mail, setMail] = useState("");
  const [exito, setExito] = useState(null); 

  const navigate = useNavigate()

  const reset = () => setMail("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/forgot-password", { email: mail });
      setExito(true);
      reset();
    } catch (error) {
      console.error("Error al enviar el mail:", error);
      setExito(false);
    }
  };

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
            style={{
                position: "fixed", top: "85px", left: "20px",
                margin: "20px",
                width: "70px", height: "40px",
                padding: "10px",
                backgroundColor: "white",
                color: "#016add",
                border: "1px solid #016add",
                borderRadius: "7px"
            }}

            onClick={() => navigate("/perfil")}
        >
            ←
        </button>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
        <form
          onSubmit={handleSubmit}
          className="w-100 bg-white p-4 rounded shadow"
          style={{ maxWidth: '400px' }}
        >
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ width: '80px', height: '80px' }}
            />
          </div>

          <h2 className="text-center mb-4">Cambiar contraseña</h2>
          <hr></hr>

          <div className="mb-3">
            <p> Para cambiar su contraseña, se le enviará un mail con instrucciones a seguir.</p>
            <input
              id="mail"
              type="email"
              placeholder="Ingrese su mail"
              className="form-control"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={mail === ""}
            className="btn w-100 text-white"
            style={{ backgroundColor: '#016add' }}
          >
            Enviar
          </button>
        </form>
      </div>

      {exito === true && (
        <div
          className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          Se ha enviado un correo para restablecer su contraseña.
        </div>
      )}

      {exito === false && (
        <div
          className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          No se pudo enviar el correo. Intente nuevamente.
        </div>
      )}
    </>
  );
}
