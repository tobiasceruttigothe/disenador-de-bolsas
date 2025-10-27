import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function TablaClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [estado, setEstado] = useState(undefined);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    // Filtra en tiempo real al cambiar el filtro o la lista de clientes
    setClientesFiltrados(
      clientes.filter((c) =>
        c.username.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, clientes]);

  const fetchClientes = async () => {
    const token = Cookies.get("access_token");
    try {
      const res = await axios.get(
        "http://localhost:9090/api/usuarios/list/users/clients",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setClientes(res.data);
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
        setClientes((prev) => prev.filter((c) => c.username !== nombre));
      } catch (error) {
        setEstado("errorEliminar");
      }
    }
  };

  const irAOtroComponente = () => {
    navigate("/clientes/nuevo");
  };

  const modificar = (username) => {
    alert(`Modificar cliente: ${username}`);
  };

  return (
    <div className="container-fluid min-vh-100 py-4 bg-light fondo">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2>Consultar clientes</h2>
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
            <button className="btn btn-primary" onClick={irAOtroComponente}>
              Nuevo cliente
            </button>
          </div>

          {/* TABLA */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Mail</th>
                  <th>Razón Social</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((c, index) => (
                    <tr key={index}>
                      <td>{c.username}</td>
                      <td>{c.email}</td>
                      <td>{c.razonSocial}</td>
                      <td>
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
                          onClick={() => modificar(c.username)}
                        >
                          Modificar
                        </button>

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
                          onClick={() => eliminar(c.username)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay clientes para mostrar
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
          Cliente eliminado exitosamente.
        </div>
      )}
      {estado === "errorEliminar" && (
        <div
          className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          Cliente no pudo ser eliminado.
        </div>
      )}
      {estado === "errorCarga" && (
        <div
          className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
          role="alert"
          style={{ zIndex: 9999 }}
        >
          No se pudieron cargar los clientes. Intente nuevamente más tarde.
        </div>
      )}
    </div>
  );
}
