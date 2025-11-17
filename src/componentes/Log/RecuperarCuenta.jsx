import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import "../../index.css";

export default function RecuperarCuenta() {
  const [mail, setMail] = useState("");
  const [exito, setExito] = useState(null);
  const navigate = useNavigate()

  const reset = () => setMail("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9090/api/auth/forgot-password", { email: mail });
      setExito(true);
      reset();
    } catch (error) {
      console.error("Error al enviar el mail:", error);
      setExito(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center fondo">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow"
          style={{
            width: "550px",
          }}
        >
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ width: '80px', height: '80px' }}
            />
          </div>

          <h2 className="text-center mb-4">Recuperar Cuenta</h2>
          <hr></hr>
          <p className="my-4" style={{color: "black"}}>Para recuperar su cuenta, se le enviará un correo al mail que proporcione. Siga 
            las instrucciones para restablecer la contraseña. 
          </p>
          <div className="mb-3">
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
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn"
              style={{ borderColor: '#016add', color: "#016add", flex: 1 }}
              onClick={() => navigate("/login")}
            >
              ←
            </button>

            <button
              type="submit"
              disabled={mail === ""}
              className="btn text-white"
              style={{ backgroundColor: '#016add', flex: 5 }}
            >
              Enviar
            </button>
          </div>

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
