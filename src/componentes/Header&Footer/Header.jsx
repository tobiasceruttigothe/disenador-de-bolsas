import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Cookies from 'js-cookie';
import logo from '../../assets/pack designer blanco.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

export default function Navegador({ nombre, setNombre, setLogeado, tipoUsuario }) {
  const navigate = useNavigate();

  // 🔥 Dark mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setNombre(Cookies.get('nombre') || "");
  }, [nombre]);

  const cerrarSesion = (e) => {
    e.preventDefault();
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('rol');
    Cookies.remove('nombre');
    Cookies.remove('mail');
    document.body.classList.toggle("dark", false);
    setLogeado(false);

  };

  const MenuItem = ({ to, label }) => (
    <NavDropdown.Item 
      as={Link} 
      to={to} 
      className="py-2 px-3"
      style={{ fontSize: '0.95rem', color: '#495057' }}
    >
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
            <NavDropdown.Divider />
            <MenuItem to="/perfil" label="Mi Perfil" />
          </>
        );
      case "disenador":
        return (
          <>
            <MenuItem to="/" label="Inicio" />
            <MenuItem to="/verClientes" label="Ver Clientes" />
            <MenuItem to="/nuevoDiseno" label="Nuevo diseño" />
            <NavDropdown.Divider />
            <MenuItem to="/perfil" label="Mi Perfil" />
          </>
        );
      case "admin":
        return (
          <>
            <MenuItem to="/" label="Inicio" />
            <MenuItem to="/disenadores" label="Diseñadores" />
            <MenuItem to="/clientes" label="Clientes" />
            <MenuItem to="/admins" label="Administradores" />
            <MenuItem to="/productos" label="Productos" />
            <NavDropdown.Divider />
            <MenuItem to="/perfil" label="Mi Perfil" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="shadow"
      style={{
        background: darkMode
          ? "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(90deg, #016add 0%, #015bbd 100%)",
        padding: "0.6rem 0",
        zIndex: 1030
      }}
    >
      <Container fluid className="px-4">

        {/* IZQUIERDA: Menú */}
        <Nav className="me-auto">
          <NavDropdown
            title={<FiMenu size={28} color="white" />}
            id="nav-dropdown"
            menuVariant="light"
            className="no-arrow-dropdown"
            style={{ marginLeft: '-10px' }}
          >
            <div className="px-3 py-2 text-muted small fw-bold text-uppercase bg-light border-bottom mb-2">
              Navegación
            </div>
            {renderMenuItems()}
          </NavDropdown>
        </Nav>

        {/* CENTRO: Logo */}
        <div 
          className="position-absolute start-50 translate-middle-x d-flex align-items-center"
          style={{ cursor: "pointer" }} 
          onClick={() => navigate("/inicio")}
        >
          <img
            src={logo}
            alt="Pack Designer Logo"
            height="40"
            className="me-2"
            style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }}
          />
          <h5 style={{color:"white"}} className="m-0 fw-bold d-none d-sm-block">
            Pack Designer
          </h5>
        </div>

        {/* DERECHA: Perfil + DarkMode */}
        <Nav className="ms-auto align-items-center">

          {/* Switch Dark Mode */}
          <label className="me-3 d-flex align-items-center" style={{ cursor: "pointer", color: "white" }}>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              style={{ marginRight: "6px" }}
            />
            <span className="small">Oscuro</span>
          </label>

          <span className="text-white me-2 d-none d-md-block small opacity-75">
            {nombre || "Usuario"}
          </span>

          <NavDropdown
            align="end"
            title={
              <div className="d-flex align-items-center bg-white bg-opacity-25 rounded-circle p-2 hover-effect">
                <FiUser size={20} color="white" />
              </div>
            }
            id="user-dropdown"
            menuVariant="light"
          >
            <div className="px-4 py-2 text-center border-bottom mb-2">
              <strong className="d-block text-primary">{nombre}</strong>
              <small className="text-uppercase" style={{fontSize: '0.7rem', color: "black"}}>{tipoUsuario == "admin" ? "adm. gerencial" : tipoUsuario}</small>
            </div>

            <MenuItem to="/perfil" label="Mi Perfil" />

            <NavDropdown.Divider />

            <NavDropdown.Item onClick={cerrarSesion} className="text-danger py-2 px-3 fw-bold">
              <FiLogOut className="me-2" /> Salir
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

      </Container>

      <style>{`
        .dropdown-toggle::after { display: none !important; }
        .hover-effect:hover { background-color: rgba(255,255,255,0.4) !important; transition: 0.3s; }
        .dropdown-menu { border: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden; margin-top: 12px; }
      `}</style>
    </Navbar>
  );
}
