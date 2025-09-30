import React from 'react'
import { useForm } from 'react-hook-form';
import logo from '../assets/pack designer final.png';
import Header from './Header';
import { login } from '../services/login.js';

export default function Log({setLogeado, setTipoUsuario}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async(user) => {
    try {
      //const data = await login(user);
      //console.log("TOKENS", data)
      //setLogeado(true);
      //reset();
      if (user.mail === "gaspi" && user.contraseña === "1234") {
      setLogeado(true);
      setTipoUsuario("cliente");
      reset();
      }
    } catch (error) {
      alert(`Ha ocurrido un error ${error}`);
      reset();
    }
  };
  
  return (
    <>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
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