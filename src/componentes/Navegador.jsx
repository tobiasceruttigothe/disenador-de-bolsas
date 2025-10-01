import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Cookies from 'js-cookie';
import logo from '../assets/pack designer final.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Navegador() {
  const navigate = useNavigate();
  //const usuarioCorreo = Cookies.getItem('usuarioCorreo') || "usuario@ejemplo.com";

  const cerrarSesion = (e) => {
    e.preventDefault(); // prevenir comportamiento por defecto del link
    Cookies.removeItem('usuarioCorreo');
    Cookies.removeItem('access_token');
    Cookies.removeItem('refresh_token');
    navigate('/login'); // navegar programáticamente
  };

  return (
    <Navbar className="px-3 mi-navbar" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        {/* IZQUIERDA: Acciones */}
        <Nav className="d-flex align-items-center me-auto">
          <NavDropdown
            title={<span style={{ fontSize: '24px', cursor: 'pointer' }}>&#9776;</span>}
            id="nav-dropdown"
          >
            <NavDropdown.Item as={Link} to="/nuevoDiseno">Nuevo diseño</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          </NavDropdown>
        </Nav>

        {/* DERECHA: Usuario + Logo + Cerrar sesión */}
        <Nav className="d-flex align-items-center ms-auto">
          <Navbar.Brand className="d-flex align-items-center">
            <img
              alt="Logo"
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-top me-2"
            />
            {/*usuarioCorreo*/}
          </Navbar.Brand>

          <NavDropdown align="end" title="" id="user-dropdown" className="d-flex align-items-center">
            <NavDropdown.Item onClick={cerrarSesion}>Cerrar sesión</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
