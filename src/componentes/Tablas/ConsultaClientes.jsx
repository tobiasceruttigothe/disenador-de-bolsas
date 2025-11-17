import axios from "axios"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

export default function ConsultaClientes() {
  const [clientes, setClientes] = useState([])
  const [estado, setEstado] = useState(undefined)

  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);


  const fetchClientes = async () => {
    const token = Cookies.get("access_token");
    try {
      const cl = await axios.get("http://localhost:9090/api/usuarios/list/users/clients", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setClientes(cl.data);
    } catch (e) {
      setEstado("errorCarga")
    }
  };

  const handleClick = (id) => () => {
    navigate(`/disenos/cliente/${id}`)
  }

  const [filtro, setFiltro] = useState("");

  const handleFiltrar = () => {
    if (filtro.trim() === "") return;
    const filtrados = clientes.filter((c) =>
      c?.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    setClientes(filtrados);
  };

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
            <h2 className="mb-4">Consulta de Clientes</h2>
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
              <button className="btn btn-primary me-2" onClick={handleFiltrar}>
                Buscar
              </button>
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
                  {clientes.length > 0 ? (
                    clientes.map((c, index) => (
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

        {estado == "errorCarga" && (
          <div
            className="alert alert-danger position-fixed bottom-0 start-50 translate-middle-x mb-4"
            role="alert"
            style={{ zIndex: 9999 }}
          >
            No se pudieron cargar los clientes. Intente nuevamente más tarde
          </div>
        )}
      </div>
    </>
  );
}
