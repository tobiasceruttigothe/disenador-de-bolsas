import React from 'react'
import { useForm } from 'react-hook-form';

export default function MenuGuardado({ confirmarGuardado, setModalAbierto }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();


  return (
    <div style={{ padding: "20px", width: "350px" }}>
      <h2>Guardar Diseño</h2>
      <hr />
      <form onSubmit={handleSubmit((data) => {
        confirmarGuardado(data.nombre, data.descripcion);
        reset();
      })}>
        {/* Nombre */}
        <div className="mb-3">
          <label>Nombre del diseño *</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            {...register("nombre", {
              required: "El nombre es obligatorio",
              minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
            })}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label>Descripción</label>
          <textarea
            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
            style={{
              height: "80px",
              width: "100%",
              resize: "none"
            }}
            {...register("descripcion")}
          />
          {errors.descripcion && <div className="invalid-feedback">{errors.descripcion.message}</div>}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            onClick={() => setModalAbierto(false)}
            className="boton-1 w-50 p-2"
            type="button"
          >
            Volver
          </button>
          <button
            className="boton-2 w-50 p-2"
            type="submit"
          >
            Guardar diseño
          </button>
        </div>

      </form>
    </div>
  )
}
