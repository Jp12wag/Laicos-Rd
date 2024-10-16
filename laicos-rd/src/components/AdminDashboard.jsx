import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Modal from 'react-modal';
import Header from './Header';
import Feed from './feed';
import AdministradoresList from './AdministradoresList';
import ActividadesList from './ActividadesList';
import Parroquias from './Parroquia/ParroquiaList';
import Diocesis from './Diocesis/DiocesisList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList, faChartPie, faChartArea, faCog } from '@fortawesome/free-solid-svg-icons';
import SecuritySettings from './SecuritySettings';
import Chat from './Chat';

Modal.setAppElement('#root');

const AdminDashboard = () => {
  
  const userRole = Cookies.get('userRole');
  const [isHovered, setIsHovered] = useState(false);
  const [administradores, setAdministradores] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({
    nombre: '',
    apellido: '',
    email: '',
    sexo: 'Seleccionar',
    celular: '',
    nacimiento: '',
    esMiembro: false,
    password: '',
    rolUsuario: userRole === 'Administrador' ? 'Administrador' : 'clero',
  });

  const [activeComponent, setActiveComponent] = useState('feed');
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');
  const twoFaVerified = Cookies.get('twoFactorVerified');

  useEffect(() => {
    if (!twoFaVerified) {
      navigate('/login');
    } else if (userRole === 'Administrador' || userRole === 'clero') {
      obtenerAdministradores();
    }
  }, [twoFaVerified, navigate, userRole]);

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

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setCurrentAdmin(admin);
    } else {
      setCurrentAdmin({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        sexo: 'Seleccionar',
        celular: '',
        nacimiento: '',
        esMiembro: false,
        rolUsuario: userRole === 'Administrador' ? 'Administrador' : 'clero',
      });
    }
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleDelete = async (adminId) => {
    try {
      await axios.delete(`http://localhost:3001/api/administradores/${adminId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      obtenerAdministradores();
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAdmin({ ...currentAdmin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprobar si el usuario es clero y está intentando crear un administrador
    if (userRole === 'clero' && currentAdmin.rolUsuario === 'Administrador') {
      alert("No tienes permiso para crear administradores.");
      return; // No proceder con el envío
    }

    try {
      if (currentAdmin._id) {
        // Editar administrador existente
        await axios.patch(`http://localhost:3001/api/administradores/${currentAdmin._id}`, currentAdmin, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        // Añadir nuevo administrador
        await axios.post('http://localhost:3001/api/administradores', currentAdmin, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
      obtenerAdministradores();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar administrador:', error);
    }
  };

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return twoFaVerified ? (
    <>
      <Header />
      <div className="admin-dashboard">
      <div className={`sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)} >
         {isHovered && <h2 className='tituloSider'>{userRole}</h2>} 
         {isHovered &&<a href="#" onClick={() => handleComponentChange('feed')}>
            <FontAwesomeIcon icon={faClipboardList} /> Feed
          </a>}
          {isHovered &&<a href="#" onClick={() => handleComponentChange('Actividades')}>
            <FontAwesomeIcon icon={faChartPie} />{isHovered && ' Actividades'}
          </a>}
          {isHovered && <a href="#" onClick={() => handleComponentChange('Chat')}>
            <FontAwesomeIcon icon={faChartPie} /> {isHovered && 'Chat'}
          </a>}
          
          {/* Renderizar opciones de administración solo si el rol es Administrador */}
          {(userRole === 'Administrador'  || userRole === 'clero') && (
            <>
            {isHovered &&   <a href="#" onClick={() => handleComponentChange('Administradores')}>
                <FontAwesomeIcon icon={faUser} /> {isHovered && ' Administrador'}
              </a>}
              {isHovered &&  <a href="#" onClick={() => handleComponentChange('Parroquias')}>
                <FontAwesomeIcon icon={faChartArea} />  {isHovered && ' Parroquias'}
              </a>}
              {isHovered && <a href="#" onClick={() => handleComponentChange('Diocesis')}>
                <FontAwesomeIcon icon={faChartArea} />{isHovered && ' Diocesis'}
              </a>}
            </>
          )}
          
          {/* Siempre mostrar la configuración de seguridad */}
          {isHovered &&<a href="#" onClick={() => handleComponentChange('security')}>
            <FontAwesomeIcon icon={faCog} />{isHovered && ' Seguridad'}
          </a>}
        </div>

        <div className="content">
          {activeComponent === 'feed' && <Feed />}
          {activeComponent === 'Actividades' && <ActividadesList />}
          {activeComponent === 'Administradores' && (userRole === 'Administrador'  || userRole === 'clero') && (
            <AdministradoresList
              administradores={administradores}
              handleOpenModal={handleOpenModal}
              handleDelete={handleDelete}
            />
          )}
          {activeComponent === 'Parroquias' && (userRole === 'Administrador' || userRole === 'clero') && <Parroquias />}
          {activeComponent === 'Diocesis' && (userRole === 'Administrador' || userRole === 'clero') && <Diocesis />}
          {activeComponent === 'security' && <SecuritySettings />}
          {activeComponent === 'Chat' && <Chat />}
        </div>

        {/* Modal para añadir o editar administradores */}
        <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
          <h2>{currentAdmin._id ? 'Editar Administrador' : 'Añadir Administrador'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={currentAdmin.nombre}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Apellido:
              <input
                type="text"
                name="apellido"
                value={currentAdmin.apellido}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={currentAdmin.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Sexo:
              <select
                name="sexo"
                value={currentAdmin.sexo}
                onChange={handleInputChange}
              >
                <option value="Seleccionar">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </label>
            <label>
              Celular:
              <input
                type="tel"
                name="celular"
                value={currentAdmin.celular}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Fecha de Nacimiento:
              <input
                type="date"
                name="nacimiento"
                value={currentAdmin.nacimiento}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Rol de Usuario:
              <select
                name="rolUsuario"
                value={currentAdmin.rolUsuario}
                onChange={handleInputChange}
                
              >
                <option value="miembro">Miembro</option>
                {userRole !== 'clero' && <option value="Administrador">Administrador</option>} {/* Solo mostrar si no es clero */}
                <option value="clero">Clero</option>
              </select>
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                name="password"
                value={currentAdmin.password}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">{currentAdmin._id ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onClick={handleCloseModal}>Cancelar</button>
          </form>
        </Modal>
      </div>
    </>
  ) : null;
};

export default AdminDashboard;
