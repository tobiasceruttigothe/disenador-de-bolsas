import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";

export default function ConsultaClientes() {
  const [clientes, setClientes] = useState([])
  const [clientesFiltrados, setClientesFiltrados] = useState([])
  const [filtro, setFiltro] = useState("")
  const navigate = useNavigate();
  const { notificacion, mostrarError, ocultarNotificacion } = useNotificacion();

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    // Filtra en tiempo real al cambiar el filtro o la lista de clientes
    if (filtro.trim() === "") {
      setClientesFiltrados(clientes);
    } else {
      setClientesFiltrados(
        clientes.filter((c) =>
          c?.username?.toLowerCase().includes(filtro.toLowerCase())
        )
      );
    }
  }, [filtro, clientes]);

  const fetchClientes = async () => {
    try {
      const res = await apiClient.get("/usuarios/list/users/clients");
      setClientes(res.data);
    } catch (e) {
      console.error("Error al cargar clientes:", e);
      mostrarError("No se pudieron cargar los clientes. Intente nuevamente más tarde.");
    }
  };

  const handleClick = (id) => () => {
    navigate(`/disenos/cliente/${id}`)
  }

  const plantillas = (nombre, id) => {
    navigate(`/verClientes/plantillas?id=${id}&user=${nombre}`);
  };

  return (
    <>
          <button className="align-items-center d-flex justify-content-center"
        style={{position:"fixed", top:"85px", left:"20px",
          margin: "20px", width: "70px", height: "40px", padding: "10px",
          backgroundColor: "white", color: "#016add", border: "1px solid #016add", borderRadius: "7px"
        }}
        onClick={() => navigate("/inicio")}
      >
        ←
      </button>
      <div style={{marginTop:"85px"}} className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h2 className="mb-4">Consultar Clientes</h2>
            <hr></hr>
            <div className="mb-4">
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ingrese el nombre de usuario del cliente..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover" style={{ tableLayout: 'auto' }}>
                <thead className="table-light">
                  <tr>
                    <th>Nombre de Usuario</th>
                    <th>Mail</th>
                    <th>Razon Social</th>
                    <th style={{ width: "440px", whiteSpace: "nowrap" }}></th>
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
                              backgroundColor: "#016add",
                              color: "#fff",
                              border: "2px solid #016add",
                              fontWeight: "500",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.3s ease"
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
                            onClick={handleClick(c.id)}
                          >
                            Ver diseños del cliente
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
                              transition: "all 0.3s ease"
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
                            onClick={() => plantillas(c.username, c.id)}
                          >
                            Administrar sus plantillas
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
