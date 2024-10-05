import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/AdministradoresList.css'; // Asegúrate de tener este archivo CSS

const AdministradoresList = ({ administradores, handleOpenModal, handleDelete }) => {
  return (
    <>
      <h1>Lista de Administradores</h1>
      <button className="add-button" onClick={() => handleOpenModal()}>
        Añadir Administrador
      </button>
      <table className="administradores-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {administradores.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">No hay administradores disponibles</td>
            </tr>
          ) : (
            administradores.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.nombre} {admin.apellido}</td>
                <td>{admin.email}</td>
                <td>{admin.rolUsuario}</td>
                <td>
                  <button className="action-button" onClick={() => handleOpenModal(admin)} aria-label={`Editar ${admin.nombre}`}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="action-button delete-button" onClick={() => handleDelete(admin._id)} aria-label={`Eliminar ${admin.nombre}`}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default AdministradoresList;
