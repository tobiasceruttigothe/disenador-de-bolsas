import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TablaClientes({ setEstado, setModo }) {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([
    { nombre: "Carlos Gómez", mail: "carlos@gmail.com" },
    { nombre: "Ana Pérez", mail: "ana@correo.com" },
    { nombre: "Luis Fernández", mail: "luis@empresa.com" },
  ]);

  const [filtro, setFiltro] = useState("");

  const handleFiltrar = () => {
    if (filtro.trim() === "") return;
    const filtrados = clientes.filter((c) =>
      c.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    setClientes(filtrados);
  };

  const modificar = (nombre) => {
    setEstado("M");
    setModo("M");
    alert(`Modificar cliente: ${nombre}`);
  };

  const eliminar = (nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar a ${nombre}?`)) {
      setClientes(clientes.filter((c) => c.nombre !== nombre));
    }
  };

  const irAOtroComponente = () => {
    navigate("/formularioCliente");
  };

  return (
    <>
      <div className="container-fluid min-vh-100 py-4 bg-light fondo">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            {/* FILTRO */}
            <div className="mb-4">
              <label htmlFor="nombreFiltro" className="form-label">
                Ingrese nombre para buscar
              </label>
              <input
                type="text"
                className="form-control mb-2"
                id="nombreFiltro"
                placeholder="Ej: Carlos"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary me-2" onClick={handleFiltrar}>
                Buscar
              </button>
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo cliente
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Mail</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c, index) => (
                    <tr key={index}>
                      <td>{c.nombre}</td>
                      <td>{c.mail}</td>
                      <td>
                        <button
                          className="btn btn-warning m-1"
                          onClick={() => modificar(c.nombre)}
                        >
                          Modificar
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => eliminar(c.nombre)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
