import React, { useState } from 'react'
import Header from './Header';

export default function SelectorDiseno({ usuarioNombre }) {
  const bolsas = [
    { id: 1, nombre: "Bolsa fondo cuadrado N8", imagen: "https://via.placeholder.com/150/FF0000" },
    { id: 2, nombre: "Bolsa fondo cuadrado N9", imagen: "https://via.placeholder.com/150/0000FF" },
    { id: 3, nombre: "Bolsa fondo cuadrado N10", imagen: "https://via.placeholder.com/150/00FF00" },
  ];

  const [seleccionada, setSeleccionada] = useState(null);

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="mb-3">Selecciona una bolsa</h2>
        <div className="row">
          {bolsas.map((bolsa) => (
            <div key={bolsa.id} className="col-sm-4 mb-3">
              <div
                className={`card ${bolsa.id === seleccionada ? "border-warning" : ""}`}
                onClick={() => setSeleccionada(bolsa.id)}
                style={{ cursor: "pointer" }}
              >
                <img src={bolsa.imagen} className="card-img-top" alt={bolsa.nombre} />
                <div className="card-body text-center">
                  <h5 className="card-title">{bolsa.nombre}</h5>
                  <button className="btn btn-primary btn-sm">Editar diseño</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
