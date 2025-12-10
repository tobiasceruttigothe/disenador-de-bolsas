import React, { useState } from 'react';
import logo from '../../assets/pack designer final.png';
import { apiClient } from '../../config/axios';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Asegúrate de importar estilos
import "../../index.css"; 
import "../../styles/main.css";

export default function FormularioLogos() {
  const [estado, setEstado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [base64Logo, setBase64Logo] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const primaryColor = "#016add";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setBase64Logo(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (data) => {
    if (!base64Logo) {
      setMensaje("Debe seleccionar un archivo de imagen");
      setEstado("Error");
      return;
    }

    const payload = {
      usuarioId: Cookies.get("usuarioId"),
      nombre: data.nombre,
      base64Logo: base64Logo,
    };

    try {
      setEstado("Cargando");
      setMensaje("Guardando logo...");

      await apiClient.post("/logos", payload);

      reset();
      setBase64Logo("");
      setEstado("Exito");
      setMensaje("Logo agregado con éxito");
      
      // Opcional: Volver automáticamente después de un tiempo
      // setTimeout(() => navigate("/logos"), 1500);

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setMensaje("La imagen excede los 5Mb");
      } else {
        setMensaje("Ocurrió un error al agregar el logo");
      }
      setEstado("Error");
    }
  };

  return (
    <>
      {/* --- BOTÓN VOLVER (FIJO) --- */}
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
          borderRadius: "7px",
          zIndex: 1000
        }}
        onClick={() => navigate("/logos")}
      >
        ←
      </button>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 fondo" style={{ paddingTop: "60px" }}>
        
        <div 
          className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          
          {/* Cabecera */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: "80px", height: "80px" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid" 
                style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
              />
            </div>
            <h3 className="fw-bold text-dark mb-1">Agregar Logo</h3>
            <p className="text-muted small">Sube una imagen para usar en tus diseños</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            
            {/* Input Nombre */}
            <div className="mb-4">
              <label htmlFor="nombre" className="form-label text-muted small fw-bold text-uppercase">Nombre del Logo</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Logo Empresa 2024"
                className={`form-control form-control-lg bg-light border-0 ${errors.nombre ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.95rem' }}
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" }
                })}
              />
              {errors.nombre && <div className="invalid-feedback ps-2">{errors.nombre.message}</div>}
            </div>

            {/* Input Archivo */}
            <div className="mb-4">
              <label htmlFor="base64Logo" className="form-label text-muted small fw-bold text-uppercase">Archivo de Imagen</label>
              <input
                id="base64Logo"
                type="file"
                accept=".jpg,.png,.jpeg,.svg"
                className={`form-control form-control-lg bg-light border-0 ${!base64Logo && estado === "Error" ? 'is-invalid' : ''}`}
                style={{ fontSize: '0.9rem' }}
                onChange={handleFileChange}
              />
              <div className="form-text small mt-1 text-muted">Formatos: JPG, PNG, SVG (Máx 5MB)</div>
              {!base64Logo && estado === "Error" && (
                <div className="text-danger small mt-1">Debe seleccionar un archivo</div>
              )}
            </div>

            {/* Vista Previa */}
            {base64Logo && (
              <div className="mb-4 text-center p-3 border rounded bg-light">
                <p className="text-muted small fw-bold mb-2">VISTA PREVIA</p>
                <img
                  src={`data:image/*;base64,${base64Logo}`}
                  alt="Vista previa"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: '150px', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Botón Guardar */}
            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-lg rounded-pill fw-bold shadow-sm text-white"
                style={{ backgroundColor: primaryColor, border: `1px solid ${primaryColor}` }}
                disabled={estado === "Cargando"}
              >
                {estado === "Cargando" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Subiendo...
                  </>
                ) : (
                  "Guardar Logo"
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Alertas */}
        {estado && (
          <div
            className={`alert ${
              estado === "Exito" ? "alert-success" : 
              estado === "Error" ? "alert-danger" : "alert-primary"
            } position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-sm fw-bold px-4 rounded-pill`}
            style={{ zIndex: 1050 }}
            role="alert"
          >
            {estado === "Exito" && <i className="fa fa-check-circle me-2"></i>}
            {estado === "Error" && <i className="fa fa-exclamation-triangle me-2"></i>}
            {mensaje}
          </div>
        )}

      </div>
    </>
  );
}