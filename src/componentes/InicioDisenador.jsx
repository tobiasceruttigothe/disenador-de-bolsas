import React, { useState, useEffect } from 'react';
import '../styles/InicioDisenador.css';
import "../index.css"

const clientesSimulados = [
    { id: 1, nombre: "Patu Pancho" },
    { id: 2, nombre: "Homies" },
];

export default function InicioDisenador() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        setClientes(clientesSimulados);
    }, []);

    const verDiseños = (id) => { console.log("Ver diseños de", id); };
    const editarGeneracion = (id) => { console.log("Editar generación de", id); };

    return (
        <div className='fondo'>
          
            <ul className="cliente-list">
              <h2 style={{ marginBottom: "15px", fontFamily: "'PT Sans', sans-serif" }}>Tabla de clientes</h2>
                {clientes.map(cliente => (
                    <li key={cliente.id} className="cliente-item">
                        <span>{cliente.nombre}</span>
                        <div>
                            <button className="cliente-button" onClick={() => verDiseños(cliente.id)}>
                                Ver Diseños
                            </button>
                            <button className="cliente-button" onClick={() => editarGeneracion(cliente.id)}>
                                Editar generación de diseños
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
