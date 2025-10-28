import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function TablaPlantillas() {
  const navigate = useNavigate();
  const [plantillas, setPlantillas] = useState([]);
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [estado, setEstado] = useState(undefined);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchPlantillas();
  }, []);

  useEffect(() => {
    // Filtra las plantillas en tiempo real
    setPlantillasFiltradas(
      plantillas.filter((p) =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, plantillas]);

  const fetchPlantillas = async () => {
    const token = Cookies.get("access_token");
    try {
      const res = await axios.get("http://localhost:9090/api/plantillas", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setPlantillas(res.data.data || []);
    } catch (e) {
      setEstado("errorCarga");
    }
  };

  const verPlantilla = async(id) => {
    const token = Cookies.get("access_token");
    try {
      const res = await axios.get(`http://localhost:9090/api/plantillas/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })
      const plantilla = res.data.data.base64Plantilla;
      const ventana = window.open();
      ventana.document.write(`
        <div style="text-align: center; margin-top: 20px;">
        <title>Vista de Plantilla</title>
        <h1>Vista previa de Plantilla</h1>
        <img src="data:image/png;base64,${plantilla}" alt="Plantilla" />
        </div>`);
    } catch (error) {
      setEstado("errorImagen");
      console.error("Error al cargar la plantilla:", error);
    }
  };
    const eliminar = async (id, nombre) => {
      if (window.confirm(`¿Seguro que desea eliminar la plantilla ${nombre}?`)) {
        const token = Cookies.get("access_token");
        try {
          await axios.delete(`http://localhost:9090/api/plantillas/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          setEstado("eliminado");
          setPlantillas((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
          setEstado("errorCarga");
        }
      }
    };

    const irAOtroComponente = () => {
      navigate("/productos/plantillas/nuevo");
    };

    const modificar = (nombre) => {
      alert(`Modificar plantilla: ${nombre}`);
    };

    return (
      <div className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <h2>Consultar plantillas</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre de la plantilla..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nueva plantilla
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Nombre material</th>
                    <th>Nombre Tipo de Bolsa</th>
                    <th>Ancho(cm)</th>
                    <th>Alto(cm)</th>
                    <th>Profundidad(cm)</th>
                    <th>Acciones(cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {plantillasFiltradas.length > 0 ? (
                    plantillasFiltradas.map((p, index) => (
                      <tr key={index}>
                        <td>{p.nombre}</td>
                        <td>{p.materialNombre}</td>
                        <td>{p.tipoBolsaNombre}</td>
                        <td>{p.ancho}</td>
                        <td>{p.alto}</td>
                        <td>{p.profundidad}</td>
                        <td>
                          {/* Botón Modificar */}
                          <button
                            className="btn m-1"
                            style={{
                              border: "2px solid #016add",
                              backgroundColor: "transparent",
                              color: "#016add",
                              fontWeight: "500",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#016add";
                              e.currentTarget.style.color = "#fff";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#016add";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => modificar(p.nombre)}
                          >
                            Modificar
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            className="btn m-1"
                            style={{
                              backgroundColor: "#016add",
                              color: "#fff",
                              border: "2px solid #016add",
                              fontWeight: "500",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#014bb5";
                              e.currentTarget.style.borderColor = "#014bb5";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#016add";
                              e.currentTarget.style.borderColor = "#016add";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => eliminar(p.id, p.nombre)}
                          >
                            Eliminar
                          </button>
                          <button
                            className="btn m-1"
                            style={{
                              border: "2px solid #016add",
                              backgroundColor: "transparent",
                              color: "#016add",
                              fontWeight: "500",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#016add";
                              e.currentTarget.style.color = "#fff";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#016add";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onClick={() => verPlantilla(p.id)}
                          >
                            Ver Plantilla
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No hay plantillas para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ALERTAS */}
        {estado === "eliminado" && (
          <div
            className="alert alert-success position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            Plantilla eliminada exitosamente.
          </div>
        )}
        {estado === "errorEliminar" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudo eliminar la plantilla.
          </div>
        )}
        {estado === "errorCarga" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudieron cargar las plantillas. Intente nuevamente más tarde.
          </div>
        )}

        {estado === "errorImagen" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudo cargar la imagen de la plantilla.
          </div>
        )}
      </div>
    );
  }
