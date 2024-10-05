// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import Header from './Header';
import Feed from './feed'; 
import '../css/Sidebar.css';

Modal.setAppElement('#root');

const AdminDashboard = () => {
  const [administradores, setAdministradores] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    sexo: 'Seleccionar',
    celular: '',
    nacimiento: '', // Mantén el formato de fecha correcto
    esMiembro: false,
    rolUsuario: 'miembro',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');
  const twoFaVerified = Cookies.get('twoFactorVerified');

  useEffect(() => {
    if (!twoFaVerified) {
      navigate('/login');
    } else {
      obtenerAdministradores();
    }
  }, [twoFaVerified, navigate]);

  const obtenerAdministradores = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/administradores', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setAdministradores(response.data);
    } catch (error) {
      console.error('Error al obtener los administradores:', error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/administradores/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        Swal.fire('Eliminado', 'El administrador ha sido eliminado.', 'success');
        obtenerAdministradores();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el administrador.', 'error');
      }
    }
  };

  const handleOpenModal = (admin = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    sexo: 'Seleccionar',
    celular: '',
    nacimiento: '',
    esMiembro: false,
  }) => {
    setCurrentAdmin(admin);
    setIsEditing(!!admin._id);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setCurrentAdmin({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      sexo: 'Seleccionar',
      celular: '',
      nacimiento: '',
      esMiembro: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convierte la fecha de nacimiento a ISO antes de enviar
      const adminData = {
        ...currentAdmin,
        nacimiento: currentAdmin.nacimiento ? new Date(currentAdmin.nacimiento).toISOString() : null, // Asegúrate de que esté en formato ISO
      };
      
      if (isEditing) {
        await axios.patch(`http://localhost:3001/api/administradores/${currentAdmin._id}`, adminData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        Swal.fire('Editado', 'El administrador ha sido editado.', 'success');
        obtenerAdministradores();
      } else {
        await axios.post('http://localhost:3001/api/administradores', adminData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        Swal.fire('Creado', 'El administrador ha sido creado.', 'success');
      }
      handleCloseModal();
      obtenerAdministradores();
      setLoading(false);
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el administrador.', 'error');
      setLoading(false);
    }
  };

  return twoFaVerified ? (
    <>
      <Header />
      <div className="admin-dashboard">
        <div className="sidebar">
          <h2>Administración</h2>
          <a href="#" onClick={() => handleOpenModal()}>Registrar Administrador</a>
          <a href="#" onClick={<Feed/>}>Feed</a>
          <a href="#">Ver Reportes</a>
          <a href="#">Estadísticas</a>
         
        </div>

        <div className="content" style={{ marginLeft: '250px', padding: '20px' }}>
          <h1>Lista de Administradores</h1>
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
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} contentLabel="Formulario de administrador">
          <h2>{isEditing ? 'Editar Administrador' : 'Agregar Administrador'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nombre</label>
              <input
                type="text"
                value={currentAdmin.nombre}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Apellido</label>
              <input
                type="text"
                value={currentAdmin.apellido}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, apellido: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={currentAdmin.email}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, email: e.target.value })}
                required
              />
            </div>
            {!isEditing && (
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={currentAdmin.password}
                  onChange={(e) => setCurrentAdmin({ ...currentAdmin, password: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label>Género</label>
              <select
                value={currentAdmin.sexo}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, sexo: e.target.value })}
                required
              >
                <option value="Seleccionar" disabled>Seleccionar</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>
            <div>
              <label>Teléfono</label>
              <input
                type="tel"
                value={currentAdmin.celular}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, celular: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                value={currentAdmin.nacimiento.split('T')[0]} // Asegúrate de que solo se muestre la parte de la fecha
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, nacimiento: e.target.value })}
                required
              />
            </div>
            <div>
              <input
                type="checkbox"
                checked={currentAdmin.esMiembro}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, esMiembro: e.target.checked })}
              />
              <label>¿Es miembro de la iglesia?</label>
            </div>
            <div>
              <label>Rol</label>
              <select
                value={currentAdmin.rolUsuario}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, rolUsuario: e.target.value })}
                required
              >
                <option value="miembro">Miembro</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear'}
            </button>
            <button type="button" onClick={handleCloseModal}>Cancelar</button>
          </form>
        </Modal>
      </div>
    </>
  ) : (
    <div>
      <h2>No estás autorizado para ver esta página. Por favor, verifica tu autenticación de dos factores.</h2>
    </div>
  );
};

export default AdminDashboard;
