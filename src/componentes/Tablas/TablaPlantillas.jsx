import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../config/axios";
import { useNotificacion } from "../../hooks/useNotificacion";
import Notificacion from "../Notificaciones/Notificacion";
import ModalConfirmacion from "../ModalConfirmacion";

export default function TablaPlantillas() {
  const navigate = useNavigate();

  const { notificacion, mostrarExito, mostrarError, ocultarNotificacion } = useNotificacion();
  const [plantillas, setPlantillas] = useState([]);
  const [plantillasFiltradas, setPlantillasFiltradas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalEliminar, setModalEliminar] = useState({ visible: false, id: null, nombre: null });

  const primaryColor = "#016add";

  useEffect(() => { fetchPlantillas(); }, []);

  useEffect(() => {
    setPlantillasFiltradas(plantillas.filter((p) => p?.nombre.toLowerCase().includes(filtro.toLowerCase())));
  }, [filtro, plantillas]);

  const fetchPlantillas = async () => {
    try {
      const res = await apiClient.get("/plantillas");
      setPlantillas(res.data.data || []);
    } catch (e) {
      console.error("Error al cargar plantillas:", e);
      mostrarError("No se pudieron cargar las plantillas.");
    }
  };

  const handleEliminarClick = (id, nombre) => { setModalEliminar({ visible: true, id, nombre }); };

  const handleVerPlantilla = async (id) => {
    try {
      const res = await apiClient.get("plantillas/" + id);
      const base64 = res.data.data.base64Plantilla;

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: "image/png" });

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

    } catch (e) {
      console.error("Error al cargar la plantilla:", e);
      mostrarError("No se pudo cargar la plantilla.");
    }
  }
  const confirmarEliminar = async () => {
    const { id } = modalEliminar;
    if (!id) return;
    try {
      await apiClient.delete(`/plantillas/${id}`);
      mostrarExito("Plantilla eliminada exitosamente.");
      setPlantillas((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar plantilla:", error);
      mostrarError("Error al eliminar la plantilla.");
    }
    setModalEliminar({ visible: false, id: null, nombre: null });
  };

  const irAOtroComponente = () => { navigate("/productos/plantillas/nuevo"); };

  return (
    <>
      <button
        className="align-items-center d-flex justify-content-center"
        style={{
          position: "fixed", top: "9vh", left: "3vw", width: "70px", height: "40px",
          padding: "10px", backgroundColor: "white", color: "#016add",
          border: "1px solid #016add", borderRadius: "7px", zIndex: 1000
        }}
        onClick={() => navigate("/productos")}
      >
        ←
      </button>

      <div className="min-vh-100 fondo" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-white py-4 px-4 border-bottom-0">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h2 className="fw-bold text-dark mb-1">Plantillas</h2>
                      <p className="text-muted mb-0">Gestión de plantillas base</p>
                    </div>
                    <button
                      className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
                      style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                      onClick={irAOtroComponente}
                    >
                      <i className="fa fa-plus me-2"></i> Nueva
                    </button>
                  </div>
                  <div className="position-relative">
                    <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg ps-5 bg-light border-0"
                      placeholder="Buscar plantilla..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      style={{ fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 ps-4 text-muted small fw-bold text-uppercase">Nombre</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase">Material</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase">Tipo</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase text-center">Ancho</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase text-center">Alto</th>
                          <th className="py-3 text-muted small fw-bold text-uppercase text-center">Prof.</th>
                          <th className="py-3 pe-4 text-end text-muted small fw-bold text-uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plantillasFiltradas.length > 0 ? (
                          plantillasFiltradas.map((p, index) => (
                            <tr key={index}>
                              <td className="ps-4 fw-bold text-dark">{p.nombre}</td>
                              <td>{p.materialNombre}</td>
                              <td>{p.tipoBolsaNombre}</td>
                              <td className="text-center">{p.ancho} cm</td>
                              <td className="text-center">{p.alto} cm</td>
                              <td className="text-center">{p.profundidad} cm</td>
                              <td className="pe-4 text-end">
                                <button
                                  className="btn btn-sm fw-bold me-1"
                                  onClick={() => handleVerPlantilla(p.id)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#016add";
                                    e.currentTarget.style.color = "white";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "#016add";
                                  }}
                                  style={{
                                    border: "1px solid #016add",
                                    color: "#016add",
                                    backgroundColor: "transparent"
                                  }}
                                >
                                  <i className="fa fa-eye"></i>
                                </button>

                                <button
                                  className="btn btn-sm fw-bold"
                                  onClick={() => handleEliminarClick(p.id, p.nombre)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#dc3545";
                                    e.currentTarget.style.color = "white";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "#dc3545";
                                  }}
                                  style={{
                                    border: "1px solid #dc3545",
                                    color: "#dc3545",
                                    backgroundColor: "transparent"
                                  }}
                                >
                                  <i className="fa fa-trash-alt"></i>
                                </button>


                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="7" className="text-center py-5 text-muted">No se encontraron plantillas.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 py-3 text-center">
                  <small className="text-muted">Total: {plantillasFiltradas.length} plantillas</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notificacion tipo={notificacion.tipo} mensaje={notificacion.mensaje} visible={notificacion.visible} onClose={ocultarNotificacion} />
        <ModalConfirmacion isVisible={modalEliminar.visible} onClose={() => setModalEliminar({ visible: false, id: null, nombre: null })} onConfirm={confirmarEliminar} titulo="Eliminar Plantilla" mensaje={`¿Estás seguro que deseas eliminar la plantilla "${modalEliminar.nombre}"?`} tipo="danger" />
      </div>
    </>
  );
}