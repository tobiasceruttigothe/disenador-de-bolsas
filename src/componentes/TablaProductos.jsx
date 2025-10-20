import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TablaProductos({ setEstado, setModo }) {
  const navigate = useNavigate();

  // Lista inicial hardcodeada de productos
  const [productos, setProductos] = useState([
    { nombre: "Mouse Logitech M220", mail: "ventas@logitech.com" },
    { nombre: "Teclado Mecánico Redragon", mail: "contacto@redragon.com" },
    { nombre: "Monitor Samsung 24''", mail: "soporte@samsung.com" },
  ]);

  const [filtro, setFiltro] = useState("");

  // Filtrar productos por nombre
  const handleFiltrar = () => {
    if (filtro.trim() === "") return;
    const filtrados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
    setProductos(filtrados);
  };

  // Simular modificación (invoca estado externo)
  const modificar = (nombre) => {
    setEstado("M");
    setModo("M");
    alert(`Modificar producto: ${nombre}`);
  };

  // Eliminar producto
  const eliminar = (nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar el producto ${nombre}?`)) {
      setProductos(productos.filter((p) => p.nombre !== nombre));
    }
  };

  // Redirigir al formulario de productos
  const irAOtroComponente = () => {
    navigate("/formularioProducto");
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
                placeholder="Ej: Mouse Logitech"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <button className="btn btn-primary me-2" onClick={handleFiltrar}>
                Buscar
              </button>
              <button className="btn btn-primary" onClick={irAOtroComponente}>
                Nuevo producto
              </button>
            </div>

            {/* TABLA */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Mail proveedor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, index) => (
                    <tr key={index}>
                      <td>{p.nombre}</td>
                      <td>{p.mail}</td>
                      <td>
                        <button
                          className="btn btn-warning m-1"
                          onClick={() => modificar(p.nombre)}
                        >
                          Modificar
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => eliminar(p.nombre)}
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
