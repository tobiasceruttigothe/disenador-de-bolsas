import { Navbar, Container } from 'react-bootstrap';
import logo from '../../assets/pack designer blanco.png';

export default function HeaderSimple() {
  return (
    <header
      style={{
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }}
    >
      <Navbar
        expand="lg"
        className="shadow-sm position-relative"
        style={{
          background: '#016bddff',
          padding: '0.8rem 1.2rem'
        }}
      >
        {/* Botón alineado al borde izquierdo */}
        <button
          className="btn position-absolute start-0 ms-3"
          style={{
            padding: '7px',
            borderRadius: '5px',
            backgroundColor: '#016aba',
            color: 'white',
            fontWeight: 'bold'
          }}
          onClick={() => (window.location.href = 'https://www.papersrl.com.ar')}
        >
          Volver a Paper SRL
        </button>

        {/* Contenedor centrado */}
        <Container className="d-flex justify-content-center align-items-center">
          <img
            src={logo}
            alt="Logo"
            width="45"
            height="45"
            className="me-2"
          />
          <h4 className="m-0 text-white fw-bold">Pack Designer</h4>
        </Container>
      </Navbar>
    </header>
  );
}
