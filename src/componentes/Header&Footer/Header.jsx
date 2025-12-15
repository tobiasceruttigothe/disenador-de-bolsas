import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Cookies from 'js-cookie';
import logo from '../../assets/pack designer blanco.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import DarkModeSwitch from './DarkModeSwitch';

export default function Navegador({ nombre, setNombre, setLogeado, tipoUsuario }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setNombre(Cookies.get('nombre') || "");
  }, []);

  const cerrarSesion = (e) => {
    e.preventDefault();
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('rol');
    Cookies.remove('nombre');
    Cookies.remove('mail');
    document.body.classList.remove("dark");
    setLogeado(false);
  };

  const MenuItem = ({ to, label }) => (
    <NavDropdown.Item as={Link} to={to} className="py-2 px-3">
      {label}
    </NavDropdown.Item>
  );

  const renderMenuItems = () => {
    switch (tipoUsuario) {
      case "cliente":
        return (
          <>
            <MenuItem to="/" label="Inicio" />
            <MenuItem to="/disenos" label="Mis diseños" />
            <MenuItem to="/nuevoDiseno" label="Nuevo diseño" />
            <MenuItem to="/logos" label="Mis logos" />
            <div className="borde-arriba" />
            <MenuItem to="/perfil" label="Mi Perfil" />

          </>
        );
      case "disenador":
        return (
          <>
            <MenuItem to="/" label="Inicio" />
            <MenuItem to="/verClientes" label="Ver Clientes" />
            <MenuItem to="/nuevoDiseno" label="Nuevo diseño" />
            <div className="borde-arriba" />
            <MenuItem to="/perfil" label="Mi Perfil" />
          </>
        );
      case "admin":
        return (
          <>
            <MenuItem to="/" label="Inicio" />
            <MenuItem to="/disenadores" label="Diseñadores" />
            <MenuItem to="/clientes" label="Clientes" />
            <MenuItem to="/gerentes" label="Gerentes" />
            <MenuItem to="/productos" label="Productos" />
            <div className="borde-arriba" />
            <MenuItem to="/perfil" label="Mi Perfil" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Navbar
      fixed="top"
      className="shadow"
      style={{
        background: darkMode
          ? "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(90deg, #016add 0%, #015bbd 100%)",
        zIndex: 1030
      }}
    >
      <Container fluid className="px-4 d-flex align-items-center">

        {/* IZQUIERDA */}
        <Nav className="flex-grow-1">
          <NavDropdown
            title={<FiMenu size={26} color="white" />}
            id="menu-dropdown"
            className="no-arrow-dropdown"
          >
            <div className="px-3 py-2 text-muted small fw-bold text-uppercase">
              Navegación
            </div>
            <div className="borde-arriba" />
            {renderMenuItems()}
          </NavDropdown>
          <div className="d-flex align-items-center" style={{ position: "absolute", top: "-2px", left: "100px" }}>
            <DarkModeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </Nav>

        {/* CENTRO */}
        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/inicio")}
        >
          <img src={logo} alt="Logo" height="38" className="me-2" />
          <h5 className="text-white m-0 fw-bold d-none d-sm-block">
            Pack Designer
          </h5>
        </div>

        {/* DERECHA */}
        <Nav className="flex-grow-1 d-flex justify-content-end align-items-center gap-3">

          <span className="text-white small opacity-75 d-none d-md-block">
            {nombre || "Usuario"}
          </span>

          <NavDropdown
            align="end"
            title={
              <div className="bg-white bg-opacity-25 rounded-circle p-2">
                <FiUser size={25} color="white" />
              </div>
            }
            id="user-dropdown"
          >
            <div className="px-4 py-2 text-center header-dropdown">
              <strong className="d-block text-primary">{nombre}</strong>
              <small className="text-muted text-uppercase">
                {tipoUsuario === "admin" ? "Gerente" : tipoUsuario}
              </small>
            </div>

            <MenuItem to="/perfil" label="Mi Perfil" />
            <div className="borde-arriba" />

            <NavDropdown.Item
              onClick={cerrarSesion}
              className="text-danger fw-bold"
            >
              <FiLogOut className="me-2" />
              Salir
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>


      </Container>

      <style>{`
        .dropdown-toggle::after { display: none !important; }
        .dropdown-menu {
          border: 0;
          box-shadow: 0 10px 30px rgba(0,0,0,.15);
          border-radius: 12px;
          margin-top: 10px;
        }
      `}</style>
    </Navbar>
  );
}
