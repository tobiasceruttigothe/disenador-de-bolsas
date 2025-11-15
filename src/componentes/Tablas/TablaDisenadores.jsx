import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function TablaDisenadores() {
  const navigate = useNavigate();
  const [disenadores, setDisenadores] = useState([]);
  const [disenadoresFiltrados, setDisenadoresFiltrados] = useState([]);
  const [estado, setEstado] = useState(undefined);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchDisenadores();
  }, []);

  useEffect(() => {
    // Filtra en tiempo real al cambiar el filtro o la lista de diseñadores
    setDisenadoresFiltrados(
      disenadores.filter((d) =>
        d?.username.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, disenadores]);

  const fetchDisenadores = async () => {
    const token = Cookies.get("access_token");
    try {
      const res = await axios.get(
        "http://localhost:9090/api/usuarios/list/users/disenadores",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setDisenadores(res.data);
    } catch (e) {
      setEstado("errorCarga");
    }
  };

  const eliminar = async (nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar a ${nombre}?`)) {
      const token = Cookies.get("access_token");
      try {
        await axios.delete(
          `http://localhost:9090/api/usuarios/eliminate/${nombre}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        setEstado("eliminado");
        setDisenadores((prev) => prev.filter((d) => d.username !== nombre));
      } catch (error) {
        setEstado("errorEliminar");
      }
    }
  };

  const irAOtroComponente = () => {
    navigate("/disenadores/nuevo");
  };

  return (
    <>
      <div className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h2>Consultar diseñadores</h2>
            <hr />
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese nombre de usuario para buscar..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary me-2" onClick={irAOtroComponente}>
                Nuevo diseñador
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'auto' }}>
                <thead className="table-light">
                  <tr>
                    <th>Nombre de Usuario</th>
                    <th>Mail</th>
                    <th>Nombre y Apellido</th>
                    <th style={{ width: "110px", whiteSpace: "nowrap" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {disenadoresFiltrados.length > 0 ? (
                    disenadoresFiltrados.map((d, index) => (
                      <tr key={index}>
                        <td>{d.username}</td>
                        <td>{d.email}</td>
                        <td>{d.razonSocial}</td>
                        <td style={{ width: "110px", whiteSpace: "nowrap" }}>

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
                            onClick={() => eliminar(d.username)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No hay diseñadores para mostrar
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
            Diseñador eliminado exitosamente.
          </div>
        )}
        {estado === "errorEliminar" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudo eliminar el diseñador.
          </div>
        )}
        {estado === "errorCarga" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudieron cargar los diseñadores. Intente nuevamente más tarde.
          </div>
        )}
      </div>
    </>
  );
}
