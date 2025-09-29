import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Log from './componentes/Log'
import Inicio from './componentes/Inicio'
import NuevoDiseno from './componentes/NuevoDiseno'
import SelectorDiseno from './componentes/SelectorDiseno'
import FormularioCliente from './componentes/FormularioCliente'
import Header from './componentes/Header'
import Footer from './componentes/Footer'

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(null)
  const [logeado, setLogeado] = useState(false)

  function RutaPrivada({ logeado, children }) {
    return logeado ? children : <Navigate to="/login" />;
  }


  return (
    <BrowserRouter>
      {logeado && <Header />}
      <Routes>
        <Route path="/" element={logeado ? <Navigate to="/inicio" /> : <Navigate to="/login" />} />
        <Route path="/login" element={logeado ? <Navigate to="/" /> : <Log setLogeado={setLogeado} setTipoUsuario={setTipoUsuario} />} />

        <Route
          path="/inicio"
          element={
            <RutaPrivada logeado={logeado}>
              <Inicio tipoUsuario={tipoUsuario} />
            </RutaPrivada>
          }
        />

        <Route
          path="/nuevoDiseno"
          element={
            <RutaPrivada logeado={logeado}>
              <NuevoDiseno />
            </RutaPrivada>
          }
        />

        <Route
          path="/selectorDiseno"
          element={
            <RutaPrivada logeado={logeado}>
              <SelectorDiseno />
            </RutaPrivada>
          }
        />

        <Route
          path="/formularioCliente"
          element={
            <RutaPrivada logeado={logeado}>
              <FormularioCliente />
            </RutaPrivada>
          }
        />
      </Routes>
      {logeado && <Footer />}
    </BrowserRouter>
  )
}

export default App
