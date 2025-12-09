import React, { useState, useEffect } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';

export default function FormularioCliente() {
  const [base64Plantilla, setBase64Plantilla] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  const [materiales, setMateriales] = useState([]);
  const [tiposBolsa, setTiposBolsa] = useState([]);

  const [estado, setEstado] = useState("");

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await apiClient.get("/materiales");
        setMateriales(response.data.data);
      } catch (error) { }
    };

    const fetchTiposBolsa = async () => {
      try {
        const response = await apiClient.get("/tipos-bolsa");
        setTiposBolsa(response.data.data);
      } catch (error) { }
    };

    fetchMateriales();
    fetchTiposBolsa();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setBase64Plantilla(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (data) => {
    if (!base64Plantilla) {
      mostrarError("Debe seleccionar un archivo de plantilla");
      return;
    }

    const payload = {
      nombre: data.nombre,
      materialId: parseInt(data.materialId),
      tipoBolsaId: parseInt(data.tipoBolsaId),
      base64Plantilla: base64Plantilla,
      ancho: parseFloat(data.ancho),
      alto: parseFloat(data.alto),
      profundidad: parseFloat(data.profundidad)
    };

    try {
      setEstado("Cargando");

      await apiClient.post("/plantillas", payload);

      reset();
      setBase64Plantilla("");
      mostrarExito("Plantilla agregada con éxito");

      setTimeout(() => {
        navigate("/productos/plantillas");
      }, 1500);

      setEstado("");
    } catch (error) {
      mostrarError("Ocurrió un error al agregar la plantilla");
      setEstado("");
    }
  };

  return (
    <>
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed",
          top: "9vh",
          left: "3vw",
          width: "70px",
          height: "40px",
          padding: "10px",
          backgroundColor: "white",
          color: "#016add",
          border: "1px solid #016add",
          borderRadius: "7px"
        }}
        onClick={() => navigate("/productos/plantillas")}
      >
        ←
      </button>

      <div className="d-flex justify-content-center align-items-center vh-100 fondo">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-100 bg-white p-4 rounded shadow"
          style={{ maxWidth: '1000px' }}
        >
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ width: '80px', height: '80px' }}
            />
          </div>

          <h2 className="text-center mb-4">Agregar plantilla</h2>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre de la plantilla</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ingrese un nombre de plantilla"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 3, message: "Debe tener al menos 3 caracteres." }
                  })}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Material</label>
                {materiales.length > 0 ? materiales.map(m => (
                  <div key={m.id} className="form-check">
                    <input
                      id={`material-${m.id}`}
                      type="radio"
                      value={m.id}
                      className={`form-check-input ${errors.materialId ? 'is-invalid' : ''}`}
                      {...register("materialId", { required: "El material es obligatorio" })}
                    />
                    <label htmlFor={`material-${m.id}`} className="form-check-label">
                      {m.nombre}
                    </label>
                  </div>
                )) : <p>Cargando materiales...</p>}
                {errors.materialId && <div className="invalid-feedback">{errors.materialId.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="base64Plantilla" className="form-label">Archivo de Plantilla</label>
                <input
                  id="base64Plantilla"
                  type="file"
                  accept=".jpg,.png, .jpeg"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de Bolsa</label>
                {tiposBolsa.length > 0 ? tiposBolsa.map(t => (
                  <div key={t.id} className="form-check">
                    <input
                      id={`tipoBolsa-${t.id}`}
                      type="radio"
                      value={t.id}
                      className={`form-check-input ${errors.tipoBolsaId ? 'is-invalid' : ''}`}
                      {...register("tipoBolsaId", { required: "El tipo de bolsa es obligatorio" })}
                    />
                    <label htmlFor={`tipoBolsa-${t.id}`} className="form-check-label">
                      {t.nombre}
                    </label>
                  </div>
                )) : <p>Cargando tipos de bolsa...</p>}
                {errors.tipoBolsaId && <div className="invalid-feedback">{errors.tipoBolsaId.message}</div>}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="ancho" className="form-label">Ancho (cm)</label>
              <input
                id="ancho"
                type="number"
                step="0.01"
                placeholder="Ingrese el ancho"
                className={`form-control ${errors.ancho ? 'is-invalid' : ''}`}
                {...register("ancho", { required: "El ancho es obligatorio", min: 0 })}
              />
              {errors.ancho && <div className="invalid-feedback">{errors.ancho.message}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="alto" className="form-label">Alto (cm)</label>
              <input
                id="alto"
                type="number"
                step="0.01"
                placeholder="Ingrese el alto"
                className={`form-control ${errors.alto ? 'is-invalid' : ''}`}
                {...register("alto", { required: "El alto es obligatorio", min: 0 })}
              />
              {errors.alto && <div className="invalid-feedback">{errors.alto.message}</div>}
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="profundidad" className="form-label">Profundidad (cm)</label>
              <input
                id="profundidad"
                type="number"
                step="0.01"
                placeholder="Ingrese la profundidad"
                className={`form-control ${errors.profundidad ? 'is-invalid' : ''}`}
                {...register("profundidad", { required: "La profundidad es obligatoria", min: 0 })}
              />
              {errors.profundidad && <div className="invalid-feedback">{errors.profundidad.message}</div>}
            </div>
          </div>

          <button
            className="btn w-100 text-white mt-3"
            style={{ backgroundColor: '#016add' }}
            type="submit"
            disabled={estado === "Cargando"}
          >
            {estado === "Cargando" ? "Cargando..." : "Ingresar"}
          </button>

        </form>

        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          visible={notificacion.visible}
          onClose={ocultarNotificacion}
          duracion={notificacion.duracion}
        />
      </div>
    </>
  );
}
