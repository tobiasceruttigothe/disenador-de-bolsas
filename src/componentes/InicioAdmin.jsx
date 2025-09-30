import React from 'react'
import Header from './Header'
import logo from '../assets/pack designer final.png';
import { Link } from 'react-router-dom';

export default function InicioAdmin() {
  return (
    <>
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light fondo">
          <form className="w-100 bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
                      <img src={logo} alt="Logo" className="img-fluid" style={{ width: '80px', height: '80px' }} />
                    </div>
            <Link to={"/formularioCliente"}>
                <button
              type="submit"
              className="btn w-100 text-white mb-2"
              style={{ backgroundColor: '#016add' }}
                >
                Agregar cliente
                </button>
            </Link>
            <Link to={"/selectorDiseno"}>
            <button
              type="submit"
              className="btn w-100 text-white mb-2"
              style={{ backgroundColor: '#016add' }}
            >
              Editar datos cliente
            </button>
            </Link>
          </form>
        </div>
    </>
)
}
