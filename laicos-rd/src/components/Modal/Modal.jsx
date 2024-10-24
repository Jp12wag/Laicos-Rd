// Modal.js
import React from 'react';
import '../../css/Modal.css'; // Asegúrate de tener un CSS para el modal

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Si no está abierto, no renderiza nada

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>Cerrar</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
