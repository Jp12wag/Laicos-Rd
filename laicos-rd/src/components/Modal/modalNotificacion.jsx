import React from 'react';
import '../../css/Modal.css'; // Asegúrate de crear este archivo CSS para estilos.

const Modal = ({ isOpen, onClose, notifications, solicitudesPendientes, aceptarSolicitudAmistad, rechazarSolicitudAmistad }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada.

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
          {solicitudesPendientes.length === 0 ? (
            <li>No hay solicitudes pendientes.</li>
          ) : (
            solicitudesPendientes.map((solicitud) => (
              <li key={solicitud._id}>
                {solicitud.emisor.nombre} {solicitud.emisor.apellido}
                <button onClick={() => aceptarSolicitudAmistad(solicitud._id)}>Aceptar</button>
                <button onClick={() => rechazarSolicitudAmistad(solicitud._id)}>Rechazar</button>
              </li>
            ))
          )}
        </ul>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
