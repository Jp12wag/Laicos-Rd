import React from 'react';
import '../../css/Modal.css'; // Asegúrate de crear este archivo CSS para estilos.

const Modal = ({ isOpen, onClose, notifications }) => {
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
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
