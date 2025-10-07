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
import AltaCuenta from './componentes/Log/AltaCuenta'

import Cookies from 'js-cookie'

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(null)
  const [logeado, setLogeado] = useState(false)
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");

  useEffect(() => {
    const rol = Cookies.get('rol');
    const nombreCookie = Cookies.get('nombre');
    const mailCookie = Cookies.get('mail');
    const token = Cookies.get('access_token');

    if (token) {
      setLogeado(true);
      setTipoUsuario(rol);
      setNombre(nombreCookie);
      setMail(mailCookie);
    }
  }, []);

  function RutaPrivada({ logeado, children }) {
    return logeado ? children : <Navigate to="/login" />;
  }

  return (
    <BrowserRouter>
      {logeado && <Header nombre={nombre} mail={mail} setLogeado={setLogeado} tipoUsuario={tipoUsuario}/>}
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
          path="/formularioCliente"
          element={
            <RutaPrivada logeado={logeado}>
              <FormularioCliente />
            </RutaPrivada>
          }
        />

        <Route
          path="/recuperar-contraseña"
          element={
            <RecuperarCuenta/>
          }
        />

        <Route
          path="/crear-cuenta"
          element={
            <AltaCuenta />
          }
        />
      </Routes>
      {logeado && <Footer />}
    </BrowserRouter>
  )
}

export default App
