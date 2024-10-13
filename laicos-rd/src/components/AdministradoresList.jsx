import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../css/AdministradoresList.css'; // Asegúrate de tener este archivo CSS
import Swal from 'sweetalert2'; // Importar SweetAlert2
import Cookies from 'js-cookie';

const AdministradoresList = ({ administradores, handleOpenModal, handleDelete }) => {
  const userRole = Cookies.get('userRole'); // Obtener el rol del usuario actual

  // Función para manejar la eliminación con confirmación
  const confirmDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      handleDelete(id); // Llama a la función de eliminación si se confirma
      Swal.fire({
        title: '¡Eliminado!',
        text: 'El administrador ha sido eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className='conteneedor-administradores'>
      <h1 className='administradores-titulo'>Lista de Administradores</h1>
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
                  {userRole === 'Administrador' && ( // Mostrar botón de editar solo si el rol es 'miembro'
                    <button
                      className="action-button"
                      onClick={() => handleOpenModal(admin)}
                      aria-label={`Editar ${admin.nombre}`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                  {(userRole === 'clero' && admin.rolUsuario === 'miembro' || userRole === 'Administrador' ) && ( // Permitir eliminar solo si es miembro
                    <button
                      className="action-button delete-button"
                      onClick={() => confirmDelete(admin._id)}
                      aria-label={`Eliminar ${admin.nombre}`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdministradoresList;
