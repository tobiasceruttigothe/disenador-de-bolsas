import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../../styles/main.css"

export default function TablaMateriales() {
  const navigate = useNavigate();
  const [materiales, setMateriales] = useState([]);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  const [estado, setEstado] = useState(undefined);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchMateriales();
  }, []);

  useEffect(() => {
    // Filtra en tiempo real al cambiar el filtro o la lista de materiales
    setMaterialesFiltrados(
      materiales.filter((m) =>
        m?.nombre.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, materiales]);

  const fetchMateriales = async () => {
    const token = Cookies.get("access_token");
    try {
      const res = await axios.get("http://localhost:9090/api/materiales", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setMateriales(res.data.data || []);
    } catch (e) {
      setEstado("errorCarga");
    }
  };

  const eliminar = async (id, nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar el material ${nombre}?`)) {
      const token = Cookies.get("access_token");
      try {
        await axios.delete(
          `http://localhost:9090/api/materiales/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        setEstado("eliminado");
        setMateriales((prev) => prev.filter((m) => m.nombre !== nombre));
      } catch (error) {
        setEstado("errorEliminar");
      }
    }
  };

  const irAOtroComponente = () => {
    navigate("/productos/materiales/nuevo");
  };


  return (
    <>
      <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={()=>navigate("/productos")}
      >
        ←
      </button>

      <div style={{marginTop:"85px"}} className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <h2>Consultar materiales</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre del material..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo material
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {materialesFiltrados.length > 0 ? (
                    materialesFiltrados.map((m, index) => (
                      <tr key={index}>
                        <td>{m.nombre}</td>
                        <td style={{ width: "100px", textAlign: "center" }}>
                          <button
                            className="boton-2"
                            onClick={() => eliminar(m.id, m.nombre)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No hay materiales para mostrar
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
            Material eliminado exitosamente.
          </div>
        )}
        {estado === "errorEliminar" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            Material no pudo ser eliminado.
          </div>
        )}
        {estado === "errorCarga" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudieron cargar los materiales. Intente nuevamente más tarde.
          </div>
        )}
      </div>
    </>
  );
}
