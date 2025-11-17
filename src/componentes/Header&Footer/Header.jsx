import React, { useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Cookies from 'js-cookie';
import logo from '../../assets/pack designer blanco.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';


export default function Navegador({ nombre, setNombre, setLogeado, tipoUsuario }) {
  const navigate = useNavigate()

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
    setLogeado(false);
  };

  const renderMenuItems = () => {
    switch (tipoUsuario) {
      case "cliente":
        return (
          <>
            <NavDropdown.Item as={Link} to="/">Inicio</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/disenos">Mis diseños</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/nuevoDiseno">Nuevo diseño</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/logos">Mis logos</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          </>
        );
      case "disenador":
        return (
          <>
            <NavDropdown.Item as={Link} to="/">Inicio</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/verClientes">Clientes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/nuevoDiseno">Nuevo diseño</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          </>
        );
      case "admin":
        return (
          <>
            <NavDropdown.Item as={Link} to="/">Inicio</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/disenadores">Diseñadores</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/clientes">Clientes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admins">Adm. gerenciales</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/productos">Productos</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
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
      className="shadow-sm"
      style={{
        background: "#016bddff",
        padding: "0.8rem 1.2rem"
      }}
    >
      <Container className="d-flex justify-content-between align-items-center">

        <Nav className="d-flex align-items-center me-auto">
          <NavDropdown
            title={<FiMenu size={26} color="white" />}
            id="nav-dropdown"
            menuVariant="white"
          >
            {renderMenuItems()}
          </NavDropdown>
        </Nav>

        <div style={{
          cursor: "pointer",
        }} onClick={() => navigate("/inicio")} className="text-center flex-grow-1 d-flex align-items-center justify-content-center">
          <img
            src={logo}
            alt="Logo"
            width="45"
            height="45"
            className="me-2"
          />
          <h4 className="m-0 text-white fw-bold">
            {nombre ? `Bienvenido, ${nombre}` : "Pack Designer"}
          </h4>
        </div>

        <Nav className="d-flex align-items-center ms-auto">
          <NavDropdown
            align="end"
            title={<FiUser size={24} color="white" />}
            id="user-dropdown"
            menuVariant="white"
          >
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={cerrarSesion} className="text-danger">
              <FiLogOut className="me-2" /> Cerrar sesión
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

      </Container>
    </Navbar>
  );
}
