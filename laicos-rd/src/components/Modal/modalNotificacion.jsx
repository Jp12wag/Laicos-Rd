import React, { useEffect } from 'react';
import '../../css/Modal.css'; // Asegúrate de crear este archivo CSS para estilos.
import Cookies from 'js-cookie';
const Modal = ({ isOpen, onClose, notifications, solicitudesPendientes }) => {

  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada.

  const authToken = Cookies.get('authToken');


  const aceptarSolicitudAmistad = async (solicitudId) => {

    try {
      const respuesta = await fetch('http://localhost:3001/api/solicitud/aceptar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ solicitudId }),
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        alert(data.message);
        solicitudesPendientes()
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al aceptar la solicitud de amistad:', error);
    }
  };

  const rechazarSolicitudAmistad = async (solicitudId) => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/solicitud/rechazar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}}`,
        },
        body: JSON.stringify({ solicitudId }),
      });
      const data = await respuesta.json();
      alert(data.message);
      solicitudesPendientes()
    } catch (error) {
      console.error('Error al rechazar la solicitud de amistad:', error);
    }
  };
 


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Notificaciones</h2>
        <ul>
          {notifications.length === 0 ? (
            <li>No hay notificaciones.</li>
          ) : (
            notifications.map((notificacion) => (
              <li key={notificacion.id}>{notificacion.mensaje}</li>
            ))
          )}
        </ul>

        <h2>Solicitudes de Amistad Pendientes</h2>
        <ul>
          {Array.isArray(solicitudesPendientes) && solicitudesPendientes.map((solicitud) => (
            <li key={solicitud._id}>
              {solicitud.emisor.nombre} {solicitud.emisor.apellido}
              <button onClick={() => aceptarSolicitudAmistad(solicitud._id)}>Aceptar</button>
              <button onClick={() => rechazarSolicitudAmistad(solicitud._id)}>Rechazar</button>
            </li>
          ))}
        </ul>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
