import { useState, useCallback } from 'react';

export const useNotificacion = () => {
  const [notificacion, setNotificacion] = useState({
    visible: false,
    tipo: 'info',
    mensaje: ''
  });

  const mostrarNotificacion = useCallback((tipo, mensaje, duracion = 5000) => {
    setNotificacion({
      visible: true,
      tipo,
      mensaje,
      duracion
    });
  }, []);

  const ocultarNotificacion = useCallback(() => {
    setNotificacion(prev => ({ ...prev, visible: false }));
  }, []);

  const mostrarExito = useCallback((mensaje, duracion) => {
    mostrarNotificacion('success', mensaje, duracion);
  }, [mostrarNotificacion]);

  const mostrarError = useCallback((mensaje, duracion) => {
    mostrarNotificacion('error', mensaje, duracion);
  }, [mostrarNotificacion]);

  const mostrarAdvertencia = useCallback((mensaje, duracion) => {
    mostrarNotificacion('warning', mensaje, duracion);
  }, [mostrarNotificacion]);

  const mostrarInfo = useCallback((mensaje, duracion) => {
    mostrarNotificacion('info', mensaje, duracion);
  }, [mostrarNotificacion]);

  return {
    notificacion,
    mostrarExito,
    mostrarError,
    mostrarAdvertencia,
    mostrarInfo,
    ocultarNotificacion
  };
};

