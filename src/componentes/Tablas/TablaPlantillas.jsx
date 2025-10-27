import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function TablaPlantillas({ setEstado, setModo }) {

  //agregar errores!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await axios.get("http://localhost:8080/productos", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setProductos(res.data);
        setProductosFiltrados(res.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    setProductosFiltrados(
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  }, [filtro, productos]);

  const handleClick = () => {
    navigate("/productos/plantillas/nuevo");
  }

  const modificar = (nombre) => {
    setEstado("M");
    setModo("M");
    alert(`Modificar producto: ${nombre}`);
  };

  const eliminar = (nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar el producto ${nombre}?`)) {
      setProductos((prev) => prev.filter((p) => p.nombre !== nombre));
      setProductosFiltrados((prev) => prev.filter((p) => p.nombre !== nombre));
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-4 bg-light fondo">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h2>Consultar plantillas</h2>
          <hr />
          <div className="mb-4">
            <input
              type="text"
              className="form-control mb-2"
              id="nombreFiltro"
              placeholder="Ingrese nombre de la plantilla..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <button className="btn btn-primary me-2" onClick={handleClick}>
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
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((p, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
