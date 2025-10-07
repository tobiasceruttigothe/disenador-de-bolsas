import React from 'react'
import { useForm } from 'react-hook-form';
import logo from '../../assets/pack designer final.png';
import { login } from "../../services/login";
import "../../styles/log.css";

export default function Log({ setLogeado, setTipoUsuario, setNombre, setMail }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleBack = () => {
    window.location.href = "https://www.papersrl.com.ar";
  }

  const onSubmit = async (user) => {
    try {
      const data = await login(user);
      setTipoUsuario(data.rol);
      setNombre(data.nombre);
      setMail(data.mail);
      setLogeado(true);
      reset();

    } catch (error) {
      alert(`Ha ocurrido un error ${error}`);
      reset();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
        <header className='log-header'>
          <button onClick={handleBack} className='log-back-button'>
            Volver a Paper
          </button>
          <h1 className='log-title'>Pack Designer</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="w-100 bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" className="img-fluid" style={{ width: '80px', height: '80px' }} />
          </div>

          <div className="mb-3">
            <input
              id="mail"
              type="text"
              placeholder="Ingresa tu mail"
              className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
              {...register("mail", { required: "El mail es obligatorio" })}
            />
            {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
          </div>

          <div className="mb-3">
            <input
              id="contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              className={`form-control ${errors.contraseña ? 'is-invalid' : ''}`}
              {...register("contraseña", { required: "La contraseña es obligatoria" })}
            />
            {errors.contraseña && <div className="invalid-feedback">{errors.contraseña.message}</div>}
          </div>

          <a href="/recuperar-contraseña" style={{ display: "inline-block", marginBottom: '7px' }} className="log-forgot-link">
            Olvidé mi contraseña
          </a>
          <br/>
          <a href="/crear-cuenta" style={{ display: "inline-block", marginBottom: '7px' }} className="log-signup-link">
            Crear una cuenta nueva
          </a>

          <button
            type="submit"
            className="btn w-100 text-white"
            style={{ backgroundColor: '#016add' }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </>
  );
}