import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Configuración y Componentes
import { apiClient } from '../../config/axios';
import { useNotificacion } from '../../hooks/useNotificacion';
import Notificacion from '../Notificaciones/Notificacion';
import logo from '../../assets/pack designer final.png';

// Estilos
import "../../index.css";
import "../../styles/main.css";

export default function FormularioPlantilla() {
  const [submitAttempted, setSubmitAttempted] = useState(false);  
  const [base64Plantilla, setBase64Plantilla] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  const [materiales, setMateriales] = useState([]);
  const [tiposBolsa, setTiposBolsa] = useState([]);
  const [estado, setEstado] = useState(""); // "", "Cargando", "Exito", "Error"

  const primaryColor = "#016add";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMat, resTipo] = await Promise.all([
          apiClient.get("/materiales"),
          apiClient.get("/tipos-bolsa")
        ]);
        setMateriales(resMat.data.data);
        setTiposBolsa(resTipo.data.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        mostrarError("Error al cargar las opciones del formulario.");
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) return; // evitamos romper

      const base64 = reader.result.toString().split(",")[1];
      setBase64Plantilla(base64);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (data) => {
    if (!base64Plantilla) {
      mostrarError("Debe seleccionar un archivo de imagen para la plantilla.");
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

      mostrarExito("Plantilla agregada con éxito.");
      reset();
      setBase64Plantilla("");
      setEstado("Exito");

      setTimeout(() => {
        navigate("/productos/plantillas");
      }, 1500);

    } catch (error) {
      mostrarError("Ocurrió un error al agregar la plantilla.");
      setEstado("Error");
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER (FIJO) --- */}
      <button
        className="boton-atras d-flex align-items-center justify-content-center"
        onClick={() => navigate("/productos/plantillas")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="min-vh-100 fondo d-flex justify-content-center align-items-center py-5" style={{ marginTop: "60px" }}>

        <div className="form-card" style={{ maxWidth: '900px' }}>

          {/* Cabecera */}
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ width: '70px', height: '70px', objectFit: 'contain' }}
              />
            </div>
            <h3 className="fw-bold text-dark">Nueva Plantilla</h3>
            <p className="text-muted">Ingresa los detalles técnicos para registrar la plantilla base</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="row g-4">

              {/* COLUMNA IZQUIERDA: Datos Generales */}
              <div className="col-12 col-md-6">

                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold text-uppercase">Nombre de la Plantilla</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg bg-light border-0 ${errors.nombre ? 'is-invalid' : ''}`}
                    placeholder="Ej: Bolsa Kraft Mediana"
                    style={{ fontSize: '0.95rem' }}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                      minLength: { value: 3, message: "Mínimo 3 caracteres" }
                    })}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                </div>

                {/* Material (Select) */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold text-uppercase">Material</label>
                  <select
                    className={`form-select form-select-lg bg-light border-0 ${errors.materialId ? 'is-invalid' : ''}`}
                    style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    {...register("materialId", { required: "Selecciona un material" })}
                  >
                    <option value="">Seleccionar material...</option>
                    {materiales.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                  {errors.materialId && <div className="invalid-feedback">{errors.materialId.message}</div>}
                </div>

                {/* Tipo de Bolsa (Select) */}
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold text-uppercase">Tipo de Producto</label>
                  <select
                    className={`form-select form-select-lg bg-light border-0 ${errors.tipoBolsaId ? 'is-invalid' : ''}`}
                    style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    {...register("tipoBolsaId", { required: "Selecciona un tipo" })}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {tiposBolsa.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                  {errors.tipoBolsaId && <div className="invalid-feedback">{errors.tipoBolsaId.message}</div>}
                </div>

              </div>

              {/* COLUMNA DERECHA: Archivo y Medidas */}
              <div className="col-12 col-md-6">

                {/* Archivo */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold text-uppercase">Imagen de Plantilla</label>
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    className="form-control form-control-lg archivo-input"
                    style={{ fontSize: '0.9rem' }}
                    onChange={handleFileChange}
                  />
                  <div className="form-text small text-muted">
                    Formatos soportados: JPG, JPEG, PNG. (Máx: 10MB)
                  </div>
                  {submitAttempted && !base64Plantilla && <div className="form-text text-danger small mt-1">La imagen es obligatoria</div>}
                </div>

                <label className="form-label text-muted small fw-bold text-uppercase d-block mb-2">Dimensiones (cm)</label>
                <div className="row g-2">
                  <div className="col-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ancho"
                      className={`form-control bg-light border-0 text-center ${errors.ancho ? 'is-invalid' : ''}`}
                      {...register("ancho", { required: true, min: 0 })}
                    />
                    <div className="text-center small text-muted mt-1">Ancho</div>
                  </div>
                  <div className="col-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Alto"
                      className={`form-control bg-light border-0 text-center ${errors.alto ? 'is-invalid' : ''}`}
                      {...register("alto", { required: true, min: 0 })}
                    />
                    <div className="text-center small text-muted mt-1">Alto</div>
                  </div>
                  <div className="col-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Prof."
                      className={`form-control bg-light border-0 text-center ${errors.profundidad ? 'is-invalid' : ''}`}
                      {...register("profundidad", { required: true, min: 0 })}
                    />
                    <div className="text-center small text-muted mt-1">Profundidad</div>
                  </div>
                </div>
                {(errors.ancho || errors.alto || errors.profundidad) && (
                  <div className="text-danger small mt-2">Todas las dimensiones son obligatorias.</div>
                )}

              </div>
            </div>

            <hr className="my-4 text-muted opacity-25" />

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                onClick={() => setSubmitAttempted(true)}
                disabled={estado === "Cargando"}
              >
                {estado === "Cargando" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  "Registrar Plantilla"
                )}
              </button>
            </div>

          </form>
        </div>

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