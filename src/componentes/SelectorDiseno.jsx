import React, { useState } from 'react';
import Header from './Header';
import pollo from "../assets/chickenCorner.jpg";
import cafe from "../assets/cafeteria.jpg";
import chipi from "../assets/chipiKopos.jpg";
import plusIcon from "../assets/pack designer final.png"; // ícono para la nueva bolsa
import { Link } from 'react-router-dom';

export default function SelectorDiseno({ usuarioNombre }) {
  const bolsas = [
    { id: 1, nombre: "Chicken Corner", imagen: pollo },
    { id: 2, nombre: "Bolsa fondo cuadrado N9", imagen: cafe },
    { id: 3, nombre: "Bolsa fondo cuadrado N10", imagen: chipi },
    { id: 4, nombre: "Crear nueva", imagen: plusIcon } // Bolsa vacía
  ];

  const [seleccionada, setSeleccionada] = useState(null);

  const handleClick = (bolsa) => {
    setSeleccionada(bolsa.id);

  };

  return (
    <>
      <div className='fondo'>
        <div className="container">
          <h2 className="mb-3">Selecciona una bolsa</h2>
          <div className="row">
            {bolsas.map((bolsa) => (
              <div key={bolsa.id} className="col-sm-4 mb-3">
                <div
                  className={`card card-bolsa ${bolsa.id === seleccionada ? "border-warning" : ""}`}
                  onClick={() => handleClick(bolsa)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={bolsa.imagen} className="card-img-top" alt={bolsa.nombre} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{bolsa.nombre}</h5>
                    {bolsa.nombre !== "Crear nueva" && (
                      <button className="btn btn-primary btn-sm">Editar diseño</button>
                    )}
                    {bolsa.nombre === "Crear nueva" && (
                      <Link to={"/nuevoDiseno"}>
                      <button className="btn btn-primary btn-sm" >Nuevo diseño</button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
