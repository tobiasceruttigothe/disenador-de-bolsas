import React, { useState, useEffect } from 'react';
import logo from '../../assets/pack designer final.png';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";

export default function FormularioCliente() {
  const [estado, setEstado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [base64Plantilla, setBase64Plantilla] = useState(""); // guardamos el archivo convertido

  const { register, handleSubmit, formState: { errors }, reset } = useForm();


  const [materiales, setMateriales] = useState([]);
  const [tiposBolsa, setTiposBolsa] = useState([]);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get("http://localhost:9090/api/materiales", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        setMateriales(response.data.data);
      } catch (error) {
        console.error("Error al obtener los materiales:", error);
      }
    };
    const fetchTiposBolsa = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get("http://localhost:9090/api/tipos-bolsa", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        setTiposBolsa(response.data.data);
      } catch (error) {
        console.error("Error al obtener los tipos de bolsa:", error);
      }
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
    const token = Cookies.get('access_token');

    if (!base64Plantilla) {
      setMensaje("Debe seleccionar un archivo de plantilla");
      setEstado("Error");
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
      setMensaje("Cargando...");

      await axios.post("http://localhost:9090/api/plantillas", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      reset();
      setBase64Plantilla("");
      setEstado("Exito");
      setMensaje("Plantilla agregada con éxito");
    } catch (error) {
      console.error("Error al agregar la plantilla:", error);
      setMensaje("Ocurrió un error al agregar la plantilla");
      setEstado("Error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 fondo">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="w-100 bg-white p-4 rounded shadow"
        style={{ maxWidth: '450px' }}
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

        {/* Nombre */}
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre de la plantilla</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ingrese un nombre de plantilla"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
        </div>



        <div className="mb-3">
          <label htmlFor="materialId" className="form-label">Material</label>
          {materiales.length > 0 ? (
            materiales.map((material) => (
              <div key={material.id} className="form-check">
                <input
                  id={`material-${material.id}`}
                  type="radio"
                  value={material.id}
                  className={`form-check-input ${errors.materialId ? 'is-invalid' : ''}`}
                  {...register("materialId", { required: "El material es obligatorio" })}
                />
                <label htmlFor={`material-${material.id}`} className="form-check-label">
                  {material.nombre}
                </label>
              </div>
            ))
          ) : (<p>Cargando materiales...</p>)}
          {errors.materialId && <div className="invalid-feedback">{errors.materialId.message}</div>}
        </div>

        {/* Tipo de Bolsa ID */}
        <div className="mb-3">
          <label htmlFor="tipoBolsaId" className="form-label">Tipo de Bolsa</label>
          {tiposBolsa.length > 0 ? (
            tiposBolsa.map((tipo) => (
              <div key={tipo.id} className="form-check">
                <input
                  id={`tipoBolsa-${tipo.id}`}
                  type="radio"
                  value={tipo.id}
                  className={`form-check-input ${errors.tipoBolsaId ? 'is-invalid' : ''}`}
                  {...register("tipoBolsaId", { required: "El tipo de bolsa es obligatorio" })}
                />
                <label htmlFor={`tipoBolsa-${tipo.id}`} className="form-check-label">
                  {tipo.nombre}
                </label>
              </div>
            ))
          ) : (<p>Cargando tipos de bolsa...</p>)}
          {errors.tipoBolsaId && <div className="invalid-feedback">{errors.tipoBolsaId.message}</div>}
        </div>
        {/* Archivo -> Base64 */}
        <div className="mb-3">
          <label htmlFor="base64Plantilla" className="form-label">Archivo de Plantilla (Máximo 10Mb)</label>
          <input
            id="base64Plantilla"
            type="file"
            accept=".jpg,.png,.pdf,.svg"
            className={`form-control ${!base64Plantilla && estado === "Error" ? 'is-invalid' : ''}`}
            onChange={handleFileChange}
          />
          {!base64Plantilla && estado === "Error" && (
            <div className="invalid-feedback">Debe seleccionar un archivo</div>
          )}
        </div>

        {/* Ancho */}
        <div className="mb-3">
          <label htmlFor="ancho" className="form-label">Ancho (cm)</label>
          <input
            id="ancho"
            type="number"
            step="0.01"
            placeholder="Ingrese el ancho"
            className={`form-control ${errors.ancho ? 'is-invalid' : ''}`}
            {...register("ancho", {
              required: "El ancho es obligatorio",
              min: { value: 0, message: "Debe ser positivo" }
            })}
          />
          {errors.ancho && <div className="invalid-feedback">{errors.ancho.message}</div>}
        </div>

        {/* Alto */}
        <div className="mb-3">
          <label htmlFor="alto" className="form-label">Alto (cm)</label>
          <input
            id="alto"
            type="number"
            step="0.01"
            placeholder="Ingrese el alto"
            className={`form-control ${errors.alto ? 'is-invalid' : ''}`}
            {...register("alto", {
              required: "El alto es obligatorio",
              min: { value: 0, message: "Debe ser positivo" }
            })}
          />
          {errors.alto && <div className="invalid-feedback">{errors.alto.message}</div>}
        </div>

        {/* Profundidad */}
        <div className="mb-3">
          <label htmlFor="profundidad" className="form-label">Profundidad (cm)</label>
          <input
            id="profundidad"
            type="number"
            step="0.01"
            placeholder="Ingrese la profundidad"
            className={`form-control ${errors.profundidad ? 'is-invalid' : ''}`}
            {...register("profundidad", {
              required: "La profundidad es obligatoria",
              min: { value: 0, message: "Debe ser positivo" }
            })}
          />
          {errors.profundidad && <div className="invalid-feedback">{errors.profundidad.message}</div>}
        </div>

        <button
          className="btn w-100 text-white"
          style={{ backgroundColor: '#016add' }}
          disabled={estado === "Cargando"}
        >
          {estado === "Cargando" ? "Enviando..." : "Ingresar"}
        </button>
      </form>

      {/* Alertas dinámicas */}
      {estado && (
        <div
          className={`alert ${estado === "Exito"
            ? "alert-success"
            : estado === "Error"
              ? "alert-danger"
              : "alert-info"
            } position-absolute bottom-0 start-50 translate-middle-x mb-4`}
          role="alert"
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}




