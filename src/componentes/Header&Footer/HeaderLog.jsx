import { Navbar, Container } from 'react-bootstrap';
import logo from '../../assets/pack designer blanco.png';

export default function HeaderSimple() {
  return (
    <header style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0 }}>
      <Navbar
        expand="lg"
        className="shadow"
        style={{
          background: "linear-gradient(90deg, #016add 0%, #015bbd 100%)",
          padding: '0.8rem 0'
        }}
      >
        <Container fluid className="px-3 px-md-4 d-flex justify-content-between align-items-center">
          
          {/* BOTÓN VOLVER (Izquierda) */}
          <div style={{ width: '140px' }}> {/* Ancho fijo para equilibrar el centro */}
            <button
              className="btn btn-sm text-white fw-bold px-3 py-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap' // Asegura que el texto no se rompa en dos líneas
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              onClick={() => (window.location.href = 'https://www.papersrl.com.ar')}
            >
              Volver a Paper
            </button>
          </div>

          {/* LOGO (Centro) */}
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={logo}
              alt="Pack Designer Logo"
              width="45"
              height="45"
              className="me-2"
              style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }}
            />
            <h4 className="m-0 text-white fw-bold d-none d-sm-block" style={{ letterSpacing: '0.5px' }}>
              Pack Designer
            </h4>
          </div>

          {/* ESPACIO VACÍO (Derecha) */}
          {/* Mantiene el logo centrado matemáticamente */}
          <div style={{ width: '140px' }}></div>

        </Container>
      </Navbar>
    </header>
  );
}