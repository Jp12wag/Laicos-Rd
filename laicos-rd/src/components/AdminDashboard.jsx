// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import Header from './Header';
import Feed from './feed';
import AdministradoresList from './AdministradoresList'; // Importa el nuevo componente
import ActividadesList from './ActividadesList'; // Importa el nuevo componente
import ArchdioceseList from './Archdioceses/ArchdioceseList';
import Parroquias from './Parroquia/ParroquiaList'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList, faChartPie, faChartArea } from '@fortawesome/free-solid-svg-icons';


Modal.setAppElement('#root');

const AdminDashboard = () => {
  const userRole = Cookies.get('userRole');
  const [administradores, setAdministradores] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    sexo: 'Seleccionar',
    celular: '',
    nacimiento: '',
    esMiembro: false,
    rolUsuario: 'miembro',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');
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
      const adminData = {
        ...currentAdmin,
        nacimiento: currentAdmin.nacimiento ? new Date(currentAdmin.nacimiento).toISOString() : null,
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

      } else {
        await axios.post('http://localhost:3001/api/administradores', adminData);
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

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return twoFaVerified ? (
    <>
      <Header />
      <div className="admin-dashboard">
        <div className="sidebar">
          <h2>Administración</h2>
          <a href="#" onClick={() => handleComponentChange('Administradores')}>
            <FontAwesomeIcon icon={faUser} /> Administrador
          </a>
          <a href="#" onClick={() => handleComponentChange('feed')}>
            <FontAwesomeIcon icon={faClipboardList} /> Feed
          </a>
          <a href="#" onClick={() => handleComponentChange('Actividades')}>
            <FontAwesomeIcon icon={faChartPie} /> Actividades
          </a>
          <a href="#" onClick={() => handleComponentChange('Arquidiocesis')}>
            <FontAwesomeIcon icon={faChartPie} />Arquidiocesis
          </a>
          <a href="#" onClick={() => handleComponentChange('Parroquias')}>
            <FontAwesomeIcon icon={faChartArea} />Parroquias
          </a>
        </div>

        <div className="content">
          {activeComponent === 'Administradores' && (
            <AdministradoresList
              administradores={administradores}
              handleOpenModal={handleOpenModal}
              handleDelete={handleDelete}
            />
          )}
          {activeComponent === 'feed' && <Feed />}
          {activeComponent === 'Actividades' && <ActividadesList />}
          {activeComponent === 'Arquidiocesis' && <ArchdioceseList />}
          {activeComponent === 'Parroquias' && <Parroquias />}
          {/* Puedes agregar más condiciones para otros componentes */}
        </div>


        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Formulario de administrador"
          style={{
            content: {
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80%',
              overflow: 'auto',
              zIndex: 1000, // Asegúrate de que el modal tenga un z-index alto
            },
            overlay: {
              zIndex: 999, // Asegúrate de que el overlay tenga un z-index más bajo
            },
          }}
        >
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
                value={currentAdmin.nacimiento}
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
