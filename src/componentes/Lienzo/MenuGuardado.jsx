import React from 'react'
import { useForm } from 'react-hook-form';

export default function MenuGuardado({confirmarGuardado}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  return (
    <div>
      <h2>Guardar Diseño</h2>
      <hr />
      <form onSubmit={handleSubmit((data) => {
        confirmarGuardado(data.nombre, data.descripcion);
        reset();
      })}>
        <div>
          <p>Nombre:</p>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && (<div className="invalid-feedback">{errors.nombre.message}</div>)}
        </div>
        <br />
        <div>
          <p>Descripción:</p>
          <input type="text"
          className="form-control"
          style={{height: "80px", width: "300px"}}
            {...register("descripcion")}
          />
          {errors.descripcion && <span>{errors.descripcion.message}</span>}
        </div>
        <br />
        <button className="p-2" style={{width: "300px", height: "40px", border:"black", color: "white", borderRadius: "4px", backgroundColor: "#016add"}} type="submit">
          Guardar diseño</button>
      </form>
    </div>
  )
}
