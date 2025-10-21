import React, {useState} from 'react'
import logo from '../assets/pack designer final.png';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function FormularioCliente() {

      const [estado, setEstado] = useState(null)
      const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleSubmitForm = async (data) => {
      try{
        const token = Cookies.get('access_token')
        const payload = {
          username: data.nombre,
          email: data.mail,          
          razonSocial: "PAPERSRL",
          password: data.contraseña,  
          enabled: true,
          emailVerified: false,
          rol: "DISEÑADOR"
        };
        await axios.post("http://localhost:9090/api/usuarios/create", payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
        reset();
        setEstado("Exito");
    }
    catch(error){
        console.error("Error al agregar el diseñador:", error);
        setEstado("Error");
    }
  }

  return (
    <>
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
          <form onSubmit={handleSubmit(handleSubmitForm)} className="w-100 bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="img-fluid" style={{ width: '80px', height: '80px' }} />
            </div>
            <h2 className="text-center mb-4">Agregar Cliente</h2>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                id="nombre" 
                placeholder="Ingrese un nombre de usuario"
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">Contraseña</label>
              <input
                id="contraseña"
                placeholder="Ingrese una contraseña provisoria"
                type="text"
                className={`form-control ${errors.contraseña ? 'is-invalid' : ''}`}
                {...register("contraseña", { required: "La contraseña es obligatoria" })}
              />
              {errors.contraseña && <div className="invalid-feedback">{errors.contraseña.message}</div>}
            </div>


            <div className="mb-3">
              <label htmlFor="mail" className="form-label">Mail</label>
              <input
                id="mail"
                type="text"
                placeholder="Ingrese un mail"
                className={`form-control ${errors.mail ? 'is-invalid' : ''}`}
                {...register("mail", { required: "El mail es obligatorio" })}
              />
              {errors.mail && <div className="invalid-feedback">{errors.mail.message}</div>}
            </div>
    
            <button
              className="btn w-100 text-white"
              style={{ backgroundColor: '#016add' }}
            >
              Ingresar
            </button>
          </form>

          {estado === "Exito" && (
            <div className="alert alert-success position-absolute bottom-0 start-50 translate-middle-x mb-4" role="alert">
              Diseñador agregado con éxito
            </div>
          )}
          {estado === "Error" && (
            <div className="alert alert-danger position-absolute bottom-0 start-50 translate-middle-x mb-4" role="alert">
              Ocurrió un error al agregar el diseñador
            </div>
          )}
        </div>
    </>
  )
}
