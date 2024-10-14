import React from 'react';
import '../css/Chat.css';

const SolicitudesPendientes = ({ solicitudesPendientes, aceptarSolicitudAmistad, rechazarSolicitudAmistad }) => (
  <div className="solicitudes-pendientes">
    <h3>Solicitudes de Amistad Pendientes:</h3>
    <ul>
      {solicitudesPendientes.map((solicitud) => (
        <li key={solicitud._id}>
          {solicitud.emisor.nombre} {solicitud.emisor.apellido}
          <button onClick={() => aceptarSolicitudAmistad(solicitud._id)}>Aceptar</button>
          <button onClick={() => rechazarSolicitudAmistad(solicitud._id)}>Rechazar</button>
        </li>
      ))}
    </ul>
  </div>
);

export default SolicitudesPendientes;
