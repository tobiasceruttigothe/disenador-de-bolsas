import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import MenuDiseno from "./MenuDiseno";
import Lienzo from "./Lienzo.jsx";
import Modal from "./ModalConfirmacion.jsx"
import MenuGuardado from "./MenuGuardado.jsx"
import MenuSelectorPlantilla from "./MenuSelectorPlantilla.jsx"
import Cookies from "js-cookie";
import { apiClient } from "../../config/axios";
import { API_BASE_URL } from "../../config/api";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import { logTokenInfo } from "../../utils/decodeToken";
import ModalLogos from "./ModalLogos.jsx";
import "../../index.css"

export default function NuevoDiseno() {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  const [plantillas, setPlantillas] = useState([]);
  const [plantillaElegida, setPlantillaElegida] = useState();
  const [modalAbierto, setModalAbierto] = useState(false);

  const [plantillaBool, setPlantillaBool] = useState(false);
  const [logosBool, setLogosBool] = useState(false);
  const [logos, setLogos] = useState([]);

  const navigate = useNavigate()
  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        if (Cookies.get("rol") === "cliente") {
          const id = Cookies.get("usuarioId");
          const res = await apiClient.get(`/plantillas/usuario/${id}/habilitadas`);
          setPlantillas(res.data.data);
        } else {
          const res = await apiClient.get(`/plantillas`);
          setPlantillas(res.data.data);
        }
      } catch (e) {
        console.error("Error al cargar las plantillas", e);
      }
    };
    fetchPlantillas();

  }, []);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const id = Cookies.get("usuarioId");
        if (!id) {
          console.error("No se encontró el ID de usuario");
          return;
        }
        const res = await apiClient.get(`/logos/usuario/${id}`);
        setLogos(res.data.data || []);
      } catch (e) {
        console.error("Error al cargar los logos", e);
      }
    };
    fetchLogos();
  }, []);

  useEffect(() => {
    const cargarPlantilla = async () => {
      if (!plantillaElegida) return;

      try {
        const res = await apiClient.get(`/plantillas/${plantillaElegida.id}`);

        const base64 = res.data.data.base64Plantilla;
        const { initCanvas } = await import("../../services/lienzoCreacion.js");

        canvasInstance.current = initCanvas(canvasRef.current, `data:image/png;base64,${base64}`);

      } catch (error) {
        console.error("Error al cargar la plantilla:", error);
      }
    };

    cargarPlantilla();

    return () => canvasInstance.current?.dispose();
  }, [plantillaElegida]);

  const agregarFigura = (funcion, ...args) => {
    import("../../services/lienzoCreacion.js").then(module => {
      module[funcion](canvasInstance.current, ...args);
    });
  };

  const activarModoDibujo = (opciones) => {
    import("../../services/lienzoCreacion.js").then(({ activarModoDibujo: activar }) => {
      activar(canvasInstance.current, opciones);
    });
  };


  const handleGuardarDiseno = async () => {
    setModalAbierto(true);
    const { deseleccionar } = await import("../../services/lienzoCreacion.js");
    deseleccionar(canvasInstance.current)
  }

  const confirmarGuardado = async (nombre, descripcion) => {
    setModalAbierto(false);
    try {
      // Verificar token antes de guardar
      const tokenInfo = logTokenInfo();
      const token = Cookies.get("access_token");
      const rol = Cookies.get("rol");

      if (!token) {
        mostrarError("Error: No se encontró el token de acceso. Por favor, inicia sesión nuevamente.");
        return;
      }

      if (!tokenInfo || !tokenInfo.roles || !tokenInfo.roles.includes('DISEÑADOR') && !tokenInfo.roles.includes('CLIENTE')) {
        console.warn('⚠️ El usuario no tiene los roles necesarios para crear diseños');
        console.warn('⚠️ Roles en el token:', tokenInfo?.roles);
        console.warn('⚠️ Rol en cookie:', rol);
      }

      const { guardarDiseno, guardarElementos } = await import("../../services/lienzoCreacion.js");
      const dataURL = guardarDiseno(canvasInstance.current);
      const elementos = JSON.stringify(guardarElementos(canvasInstance.current));

      const usuarioId = Cookies.get("usuarioId");
      if (!usuarioId) {
        console.error('❌ usuarioId no encontrado en cookies');
        mostrarError("Error: No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.");
        return;
      }

      if (!plantillaElegida || !plantillaElegida.id) {
        console.error('❌ No se ha seleccionado una plantilla');
        mostrarError("Error: Debes seleccionar una plantilla antes de guardar el diseño.");
        return;
      }

      const payload = {
        usuarioId: usuarioId,
        plantillaId: plantillaElegida.id,
        nombre: nombre,
        descripcion: descripcion,
        base64Diseno: elementos,
        base64Preview: dataURL
      };

      const res = await apiClient.post("/disenos", payload);
      mostrarExito("Diseño guardado correctamente.");
      setTimeout(() => {
        navigate("/disenos");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar el diseño:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);

      if (error.response && error.response.status === 403) {
        logTokenInfo();
        console.error('🔍 Detalles del error 403:');
        console.error('URL:', error.config?.url);
        console.error('Method:', error.config?.method);
        console.error('Base URL:', error.config?.baseURL);
        console.error('URL completa:', error.config?.baseURL + error.config?.url);
        console.error('Headers enviados:', JSON.stringify(error.config?.headers, null, 2));
        console.error('Authorization header:', error.config?.headers?.Authorization ? 'Presente' : 'Ausente');
        if (error.config?.headers?.Authorization) {
          console.error('Token (primeros 50 chars):', error.config.headers.Authorization.substring(0, 50) + '...');
        }
        console.error('Response status:', error.response?.status);
        console.error('Response statusText:', error.response?.statusText);
        console.error('Response data del gateway:', error.response?.data);
        console.error('Response data (stringified):', JSON.stringify(error.response?.data, null, 2));
        console.error('Response data (type):', typeof error.response?.data);
        if (error.response?.data) {
          console.error('Response data keys:', Object.keys(error.response.data));
        }
        console.error('Response headers:', error.response?.headers);
        console.error('Request config completa:', JSON.stringify({
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }, null, 2));

        const rol = Cookies.get('rol');
        const token = Cookies.get('access_token');
        mostrarError(`No tienes permisos para guardar diseños. Tu rol actual es: ${rol || 'no definido'}. Verifica que tu usuario tenga el rol de cliente o diseñador y que el token sea válido. Token presente: ${token ? 'Sí' : 'No'}`);
      } else if (error.response && error.response.status === 401) {
        mostrarError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      } else {
        mostrarError("Error al guardar el diseño. Intente nuevamente.");
      }
    }
  };

  return (
    <div className="container-fluid fondo" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
      <div className="row">
        <div className="col-4 border-end1" >
          <MenuDiseno
            agregarFoto={(foto) => agregarFigura("agregarFoto", foto)}
            plantillaElegida={plantillaElegida}
            agregarTexto={(texto, color, tamaño, fuente) => agregarFigura("agregarTexto", texto, color, tamaño, fuente)}
            agregarCuadrado={(color) => agregarFigura("agregarCuadrado", color)}
            agregarRectangulo={(color) => agregarFigura("agregarRectangulo", color)}
            agregarCirculo={(color) => agregarFigura("agregarCirculo", color)}
            agregarEstrella={(color) => agregarFigura("agregarEstrella", color)}
            agregarLinea={(color) => agregarFigura("agregarLinea", color)}
            agregarTriangulo={(color) => agregarFigura("agregarTriangulo", color)}
            activarModoDibujo={activarModoDibujo}
            setLogosBool={setLogosBool}
            logos={logos}
          />
        </div>
        <div className="col-8" style={{ height: "760px", widht: "100%" }}>
          <Lienzo canvasRef={canvasRef} />
        </div>

      </div>

      <button
        className="fondo-boton"
        style={{width: "150px", height: "50px", position: "fixed", bottom: "20px", right: "200px", fontWeight: "700" }}
        onClick={() => navigate("/disenos")}
      >
        Cancelar
      </button>

      <button
        className="boton-2"
        style={{ width: "150px", height: "50px", position: "fixed", bottom: "20px", right: "25px", fontWeight: "700"  }}
        onClick={handleGuardarDiseno}
      >
        Guardar diseño
      </button>

      <Modal isVisible={modalAbierto} onClose={() => setModalAbierto(false)}>
        <MenuGuardado confirmarGuardado={confirmarGuardado} setModalAbierto={setModalAbierto}></MenuGuardado>
      </Modal>
      <Modal isVisible={!plantillaBool} onClose={() => setPlantillaBool(false)}>
        <MenuSelectorPlantilla plantillas={plantillas} setPlantillaElegida={setPlantillaElegida} setPlantillaBool={setPlantillaBool}></MenuSelectorPlantilla>
      </Modal>
      <Modal isVisible={logosBool} onClose={() => setLogosBool(false)}>
        <ModalLogos setLogosBool={setLogosBool} logos={logos} setLogos={setLogos}></ModalLogos>
      </Modal>

      <Notificacion
        tipo={notificacion.tipo}
        mensaje={notificacion.mensaje}
        visible={notificacion.visible}
        onClose={ocultarNotificacion}
        duracion={notificacion.duracion}
      />
    </div>
  );
}
