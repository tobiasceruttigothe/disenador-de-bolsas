import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TablaDisenadores({ setEstado, setModo }) {
  const navigate = useNavigate();

  const [disenadores, setDisenadores] = useState([
    { nombre: "Camila Torres", mail: "camila@studio.com" },
    { nombre: "Julian Rivas", mail: "julian@creativos.com" },
    { nombre: "Lucia Blanco", mail: "lucia@designhub.com" },
  ]);

  const [filtro, setFiltro] = useState("");

  const handleFiltrar = () => {
    if (filtro.trim() === "") return;
    const filtrados = disenadores.filter((d) =>
      d.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    setDisenadores(filtrados);
  };

  const modificar = (nombre) => {
    setEstado("M");
    setModo("M");
    alert(`Modificar diseñador: ${nombre}`);
  };

  const eliminar = (nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar a ${nombre}?`)) {
      setDisenadores(disenadores.filter((d) => d.nombre !== nombre));
    }
  };

  const irAOtroComponente = () => {
    navigate("/formularioDisenador");
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
                placeholder="Ej: Camila"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary me-2" onClick={handleFiltrar}>
                Buscar
              </button>
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo diseñador
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
                  {disenadores.map((d, index) => (
                    <tr key={index}>
                      <td>{d.nombre}</td>
                      <td>{d.mail}</td>
                      <td>
                        <button
                          className="btn btn-warning m-1"
                          onClick={() => modificar(d.nombre)}
                        >
                          Modificar
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => eliminar(d.nombre)}
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
