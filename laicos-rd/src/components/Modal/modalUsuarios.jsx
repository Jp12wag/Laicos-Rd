// UsuariosModal.js
import React from 'react';
import '../../css/Modal.css';
import Modal from 'react-modal';


const ModalUsuarios = ({ mostrarModal, cerrarModal, usuarios, esAmigo, solicitudEnviada, enviarSolicitudAmistad }) => {
  return (
  
        <div className="modal-overlay">
      <div className="modal-content">
      <Modal onClose={cerrarModal}>
        <h3>Usuarios</h3>
        {usuarios.map((usuario) => (
          <div key={usuario._id} className="usuario-modal">
            <span>{usuario.nombre}</span>
            {esAmigo(usuario._id) ? (
              <button disabled>Amigo</button>
            ) : solicitudEnviada(usuario._id) ? (
              <button disabled>Solicitud enviada</button>
            ) : (
              <button onClick={() => enviarSolicitudAmistad(usuario._id)}>Enviar solicitud</button>
            )}
          </div>
        ))}
        <button onClick={cerrarModal}>Cerrar</button>
      </Modal>
      </div>
      </div>
  );
};

export default  ModalUsuarios;
