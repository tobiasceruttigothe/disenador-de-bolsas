import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";

import Log from "./componentes/Log/Log";
import Inicio from "./componentes/Inicios/Inicio";
import NuevoDiseno from "./componentes/Lienzo/NuevoDiseno";
import SelectorDiseno from "./componentes/Lienzo/SelectorDiseno";
import FormularioCliente from "./componentes/Formularios/FormularioCliente.jsx";
import FormularioDisenador from "./componentes/Formularios/FormularioDisenador.jsx";
import FormularioAdmin from "./componentes/Formularios/FormularioAdmin.jsx";
import FormularioPlantilla from "./componentes/Formularios/FormularioPlantilla.jsx";

import TablaClientes from "./componentes/Tablas/TablaClientes";
import TablaDisenadores from "./componentes/Tablas/TablaDisenadores";
import TablaAdmins from "./componentes/Tablas/TablaAdmins";
import TablaProductos from "./componentes/Tablas/TablaProductos";
import TablaPlantillas from "./componentes/Tablas/TablaPlantillas.jsx";
import ConsultaCliente from "./componentes/Tablas/ConsultaClientes.jsx";
import AdministrarPlantillas from "./componentes/Tablas/AdministrarPlantillas.jsx";

import RecuperarCuenta from "./componentes/Log/RecuperarCuenta";
import VerificarMail from "./componentes/Log/VerificarMail";
import ResetPassword from "./componentes/Log/ResetPassword";

import Header from "./componentes/Header&Footer/Header.jsx";
import Footer from "./componentes/Header&Footer/Footer.jsx";

function App() {

  const [tipoUsuario, setTipoUsuario] = useState(() => Cookies.get("rol") || null);
  const [nombre, setNombre] = useState(() => Cookies.get("nombre") || "");
  const [mail, setMail] = useState(() => Cookies.get("mail") || "");
  const [logeado, setLogeado] = useState(() => !!Cookies.get("access_token"));

  function RutaPrivada({ logeado, children }) {
    return logeado ? children : <Navigate to="/login" />;
  }

  function RutaPrivadaConRol({ logeado, tipoUsuario, rolesPermitidos = [], children }) {
    if (!logeado) return <Navigate to="/login" />;

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(tipoUsuario)) {
      return <Navigate to="/inicio" replace />;
    }

    return children;
  }

  return (
    <BrowserRouter>
      {logeado && (
        <Header
          nombre={nombre}
          setNombre={setNombre}
          setLogeado={setLogeado}
          tipoUsuario={tipoUsuario}
        />
      )}

      <Routes>

        <Route path="/" element={logeado ? <Navigate to="/inicio" /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            logeado ? (
              <Navigate to="/" />
            ) : (
              <Log
                setLogeado={setLogeado}
                setTipoUsuario={setTipoUsuario}
                setNombre={setNombre}
                setMail={setMail}
              />
            )
          }
        />

        {/* --- Rutas Privadas --- */}
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
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["disenador", "cliente"]}>
              <NuevoDiseno />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/selectorDiseno"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["cliente", "disenador"]}>
              <SelectorDiseno />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/clientes/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <FormularioCliente />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/disenadores/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <FormularioDisenador />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/admins/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <FormularioAdmin />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/clientes"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaClientes />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/disenadores"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaDisenadores />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/admins"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaAdmins />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/productos"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaProductos />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/verClientes"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["disenador"]}>
              <ConsultaCliente />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/verClientes/plantillas"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["disenador"]}>
              <AdministrarPlantillas />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/productos/plantillas"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaPlantillas />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/productos/plantillas/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <FormularioPlantilla />
            </RutaPrivadaConRol>
          }
        />
        {/* --- Recuperación de cuenta y verificación --- */}
        <Route path="/recuperar-contraseña" element={<RecuperarCuenta />} />
        <Route path="/verify-email" element={<VerificarMail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* --- Ruta por defecto --- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {logeado && <Footer />}
    </BrowserRouter>
  );
}

export default App;
