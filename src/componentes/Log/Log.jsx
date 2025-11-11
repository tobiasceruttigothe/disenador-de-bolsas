import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../assets/pack designer final.png';
import { login } from '../../services/login';
import Header from '../Header&Footer/HeaderLog'; // <-- usar el Header semántico y fijo
import { Link } from 'react-router-dom';
import '../../styles/log.css';

export default function Log({ setLogeado, setTipoUsuario, setNombre, setMail }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [error, setError] = useState(undefined);


  const onSubmit = async (user) => {
    try {
      const data = await login(user);
      setTipoUsuario(data.rol);
      setNombre(data.nombre);
      setMail(data.mail);
      setLogeado(true);
      reset();
    } catch (err) {
      setError('error');
      reset();
    }
  };

  return (
    <>
      <Header />

      <main
        
        style={{ paddingTop: '76px', minHeight: 'calc(100vh - 76px)' }}
        className="d-flex justify-content-center align-items-center bg-light fondo"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
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

          <div className="mb-3">
            <input
              id="mail"
              type="text"
              placeholder="Ingresa tu mail"
              className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
              {...register('mail', { required: 'El mail es obligatorio' })}
            />
            {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
          </div>

          <div className="mb-3">
            <input
              id="contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              className={`form-control ${errors.contraseña ? 'is-invalid' : ''}`}
              {...register('contraseña', { required: 'La contraseña es obligatoria' })}
            />
            {errors.contraseña && (
              <div className="invalid-feedback">{errors.contraseña.message}</div>
            )}
          </div>

          <Link to="/recuperar-contraseña" className="log-forgot-link" style={{ display: 'inline-block', marginBottom: '7px' }}>
            Olvidé mi contraseña
          </Link>
          <br />

          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#016add' }}>
            Ingresar
          </button>

        </form>
      </main>

      {error === 'error' && (
        <div
          className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          El usuario o la contraseña es incorrecto, intente nuevamente.
        </div>
      )}
    </>
  );
}
