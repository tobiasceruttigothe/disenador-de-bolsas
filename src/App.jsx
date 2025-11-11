import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";

import Log from "./componentes/Log/Log";
import Inicio from "./componentes/Inicios/Inicio";
import NuevoDiseno from "./componentes/Lienzo/NuevoDiseno";
import SelectorDiseno from "./componentes/Lienzo/SelectorDiseno";
import CargarDiseno from "./componentes/Lienzo/CargarDiseno.jsx";

import FormularioCliente from "./componentes/Formularios/FormularioCliente.jsx";
import FormularioDisenador from "./componentes/Formularios/FormularioDisenador.jsx";
import FormularioAdmin from "./componentes/Formularios/FormularioAdmin.jsx";
import FormularioPlantilla from "./componentes/Formularios/FormularioPlantilla.jsx";
import FormularioMaterial from "./componentes/Formularios/FormularioMaterial.jsx";
import FormularioTipoBolsa from "./componentes/Formularios/FormularioTipoBolsa.jsx";
import FormularioLogos from "./componentes/Formularios/FormularioLogos.jsx";

import TablaClientes from "./componentes/Tablas/TablaClientes";
import TablaDisenadores from "./componentes/Tablas/TablaDisenadores";
import TablaAdmins from "./componentes/Tablas/TablaAdmins";
import TablaProductos from "./componentes/Tablas/TablaProductos";
import TablaPlantillas from "./componentes/Tablas/TablaPlantillas.jsx";
import TablaMateriales from "./componentes/Tablas/TablaMateriales.jsx";
import TablaTiposBolsa from "./componentes/Tablas/TablaTiposBolsa.jsx";
import TablaLogos from "./componentes/Tablas/TablaLogos.jsx";
import Perfil from "./componentes/Tablas/Perfil.jsx";

import ConsultaCliente from "./componentes/Tablas/ConsultaClientes.jsx";
import AdministrarPlantillas from "./componentes/Tablas/AdministrarPlantillas.jsx";

import RecuperarCuenta from "./componentes/Log/RecuperarCuenta";
import VerificarMail from "./componentes/Log/VerificarMail";
import ResetPassword from "./componentes/Log/ResetPassword";
import CambiarContraseña from "./componentes/Log/CambiarContraseña";

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

        <Route
          path="/productos/materiales/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <FormularioMaterial />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/productos/tiposbolsa/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <FormularioTipoBolsa />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/productos/tiposbolsa"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaTiposBolsa />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/productos/materiales"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["admin"]}>
              <TablaMateriales />
            </RutaPrivadaConRol>
          }
        />

        <Route 
          path="/disenos"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["cliente"]}>
              <SelectorDiseno />
            </RutaPrivadaConRol>
          }
        />

        <Route 
          path="/disenos/:id"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["cliente"]}>
              <CargarDiseno/>
            </RutaPrivadaConRol>
          }
        />
        
        <Route 
          path= "/logos"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["cliente"]}>
              <TablaLogos />
            </RutaPrivadaConRol>
          }
        />

        <Route
         path="/logos/nuevo"
          element={
            <RutaPrivadaConRol logeado={logeado} tipoUsuario={tipoUsuario} rolesPermitidos={["cliente"]}>
              <FormularioLogos />
            </RutaPrivadaConRol>
          }
        />

        <Route
          path="/perfil"
          element={
            <RutaPrivada logeado={logeado}>
              <Perfil />
            </RutaPrivada>
          }
        />

        <Route path="/cambiarContraseña" element={
          <RutaPrivada logeado={logeado}>
            <CambiarContraseña cambiarContraseña={true} mail={mail} />
          </RutaPrivada>
        } />

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
