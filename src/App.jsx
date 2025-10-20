import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Log from './componentes/Log/Log'
import Inicio from './componentes/Inicio'
import NuevoDiseno from './componentes/Lienzo/NuevoDiseno'
import SelectorDiseno from './componentes/SelectorDiseno'
import FormularioCliente from './componentes/FormularioCliente'
import Header from './componentes/Header'
import Footer from './componentes/Footer'
import RecuperarCuenta from './componentes/Log/RecuperarCuenta'
import VerificarMail from './componentes/Log/VerificarMail'
import FormularioDisenador from './componentes/FormularioDisenador'

import Cookies from 'js-cookie'
import TablaDisenadores from './componentes/TablaDisenadores'
import TablaClientes from './componentes/TablaClientes'
import TablaProductos from './componentes/TablaProductos'

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(() => Cookies.get('rol') || null)
  const [nombre, setNombre] = useState(() => Cookies.get('nombre') || "")
  const [mail, setMail] = useState(() => Cookies.get('mail') || "")
  const [logeado, setLogeado] = useState(() => !!Cookies.get('access_token'))


  function RutaPrivada({ logeado, children }) {
    return logeado ? children : <Navigate to="/login" />;
  }

  return (
    <BrowserRouter>

      {logeado && <Header nombre={nombre} setNombre={setNombre} setLogeado={setLogeado} tipoUsuario={tipoUsuario} />}
      <Routes>
        <Route path="/" element={logeado ? <Navigate to="/inicio" /> : <Navigate to="/login" />} />
        <Route path="/login" element={logeado ? <Navigate to="/" /> : <Log setLogeado={setLogeado} setTipoUsuario={setTipoUsuario} setNombre={setNombre} setMail={setMail} />} />

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
          path="/tablaClientes"
          element={
            <RutaPrivada logeado={logeado}>
              <TablaClientes />
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

        <Route
          path="/tablaDisenadores"
          element={
            <RutaPrivada logeado={logeado}>
              <TablaDisenadores />
            </RutaPrivada>
          }
        />

        <Route
          path="/formularioDisenador"
          element={
            <RutaPrivada logeado={logeado}>
              <FormularioDisenador />
            </RutaPrivada>
          }
        />

        <Route
          path="/tablaProductos"
          element={
            <RutaPrivada logeado={logeado}>
              <TablaProductos />
            </RutaPrivada>
          }
        />

        <Route
          path="/recuperar-contraseña"
          element={
            <RecuperarCuenta />
          }
        />

        <Route
          path="/verify-email"
          element={<VerificarMail />}
        />
      </Routes>

      {logeado && <Footer />}
    </BrowserRouter>
  )
}

export default App
