import React from 'react'
import Header from './Header'
import logo from '../assets/pack designer final.png';
import { useForm } from 'react-hook-form';

export default function FormularioCliente() {

      const { register, handleSubmit, formState: { errors }, reset } = useForm();
    

  return (
    <>
    <Header></Header>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <form className="w-100 bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="img-fluid" style={{ width: '80px', height: '80px' }} />
            </div>
    
            <div className="mb-3">
              <label htmlFor="mail" className="form-label">IdCliente</label>
              <input
                id="idCliente"
                type="text"
                className={`form-control ${errors.idcliente ? 'is-invalid' : ''}`}
                {...register("idCliente")}
              />
              {errors.idcliente && <div className="invalid-feedback">{errors.idCliente.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="mail" className="form-label">Razon social</label>
              <input
                id="razonSocial"
                type="text"
                className={`form-control ${errors.razonSocial ? 'is-invalid' : ''}`}
                {...register("razonSocial", { required: "La razon social es obligatoria" })}
              />
              {errors.razonSocial && <div className="invalid-feedback">{errors.razonSocial.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="mail" className="form-label">Mail</label>
              <input
                id="mail"
                type="text"
                placeholder="agustinperez@gmail.com"
                className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
                {...register("mail", { required: "El mail es obligatorio" })}
              />
              {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
            </div>
    
            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">Contraseña</label>
              <input
                id="contraseña"
                type="password"
                placeholder="*******"
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
  )
}
