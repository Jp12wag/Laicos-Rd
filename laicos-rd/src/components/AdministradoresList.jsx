// AdministradoresList.js
import React from 'react';

const AdministradoresList = ({ administradores, handleOpenModal, handleDelete }) => {
  return (
    <>
      <h1>Lista de Administradores</h1>
      <button onClick={() => handleOpenModal()}>Añadir</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {administradores.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.nombre} {admin.apellido}</td>
              <td>{admin.email}</td>
              <td>{admin.rolUsuario}</td>
              <td>
                <button onClick={() => handleOpenModal(admin)}>Editar</button>
                <button onClick={() => handleDelete(admin._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdministradoresList;
