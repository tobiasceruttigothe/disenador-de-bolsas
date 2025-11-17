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
    setPlantillasFiltradas(
      plantillas.filter((p) =>
        p?.nombre.toLowerCase().includes(filtro.toLowerCase())
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

  const verPlantilla = async (id) => {
    const token = Cookies.get("access_token");

    try {
      const res = await axios.get(
        `http://localhost:9090/api/plantillas/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        }
      );

      const base64 = res.data.data.base64Plantilla;

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: "image/png" });

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

    } catch (error) {
      console.error("Error al cargar la plantilla:", error);
      setEstado("errorImagen");
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

  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/productos")}
      >
        ←
      </button>
      <div style={{marginTop:"85px"}} className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div style={{width:"973px"}} className="col-12 col-md-8 col-lg-6">
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
            <div style={{width:"1000px"}} className="table-responsive mb-4">
              <table style={{width:"950px"}} className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Nombre material</th>
                    <th>Nombre Tipo de Bolsa</th>
                    <th>Ancho(cm)</th>
                    <th>Alto(cm)</th>
                    <th>Profundidad(cm)</th>
                    <th></th>
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
                            onClick={() => verPlantilla(p.id)}
                          >
                            Ver Plantilla
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
                            onClick={() => eliminar(p.id, p.nombre)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
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
    </>
  );
}
