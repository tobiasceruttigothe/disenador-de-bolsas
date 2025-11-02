import React, {useEffect} from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Cookies from 'js-cookie';
import logo from '../../assets/pack designer final.png';
import { Link } from 'react-router-dom';

export default function Navegador({nombre, setNombre, setLogeado, tipoUsuario}) {

  useEffect(() => {
    setNombre(Cookies.get('nombre') || "");
  }
  , [nombre]);
  const cerrarSesion = (e) => {
    e.preventDefault();
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('rol');
    Cookies.remove('nombre');
    Cookies.remove('mail');
    setLogeado(false);
  };

  return (
    <Navbar className="px-3 mi-navbar" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        {/* IZQUIERDA: Acciones */}
        <Nav className="d-flex align-items-center me-auto">
          {tipoUsuario == "cliente" && (<NavDropdown
            title={<span style={{ fontSize: '24px', cursor: 'pointer' }}>&#9776;</span>}
            id="nav-dropdown"
          >
            <NavDropdown.Item as={Link} to="/">Inicio</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/nuevoDiseno">Nuevo diseño</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/disenos">Mis diseños</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          </NavDropdown>)}
          {tipoUsuario == "disenador" && (<NavDropdown
            title={<span style={{ fontSize: '24px', cursor: 'pointer' }}>&#9776;</span>}
            id="nav-dropdown"
          >
            <NavDropdown.Item as={Link} to="/">Inicio</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/verClientes">Consultar Clientes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/nuevoDiseno">Nuevo Diseño</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          </NavDropdown>)}
          {tipoUsuario == "admin" && (<NavDropdown
            title={<span style={{ fontSize: '24px', cursor: 'pointer' }}>&#9776;</span>}
            id="nav-dropdown"
          >
            <NavDropdown.Item as={Link} to="/">Inicio</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/disenadores">Administrar diseñadores</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/clientes">Administrar clientes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admins">Administrar administradores gerenciales</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/productos">Administrar productos</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/perfil">Perfil</NavDropdown.Item>
          </NavDropdown>)}
        </Nav>

        {nombre && <h2>Bienvenido {nombre} </h2>}

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
