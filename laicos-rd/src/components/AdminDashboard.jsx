import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Modal from 'react-modal';
import Header from './Header';
import Feed from './feed';
import AdministradoresList from './AdministradoresList'; // Importa el nuevo componente
import ActividadesList from './ActividadesList'; // Importa el nuevo componente
import Parroquias from './Parroquia/ParroquiaList'
import Diocesis from './Diocesis/DiocesisList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList, faChartPie, faChartArea } from '@fortawesome/free-solid-svg-icons';
import { FiBarChart } from 'react-icons/fi';

Modal.setAppElement('#root');

const AdminDashboard = () => {
  const userRole = Cookies.get('userRole'); // Obtiene el rol del usuario desde las cookies
  const [administradores, setAdministradores] = useState([]);
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

  const [activeComponent, setActiveComponent] = useState('feed'); // Por defecto en 'feed'
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');
  const twoFaVerified = Cookies.get('twoFactorVerified');

  useEffect(() => {
    if (!twoFaVerified) {
      navigate('/login');
    } else if (userRole === 'Administrador') { // Solo obtiene administradores si es administrador
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

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return twoFaVerified ? (
    <>
      <Header />
      <div className="admin-dashboard">
        <div className="sidebar">
          <h2>Administración</h2>
          {/* Opción de Feed y Actividades siempre visibles */}
          <a href="#" onClick={() => handleComponentChange('feed')}>
            <FontAwesomeIcon icon={faClipboardList} /> Feed
          </a>
          <a href="#" onClick={() => handleComponentChange('Actividades')}>
            <FontAwesomeIcon icon={faChartPie} /> Actividades
          </a>

          {/* Los siguientes campos solo aparecerán si el usuario es administrador */}
          {userRole === 'Administrador' && (
            <>
              <a href="#" onClick={() => handleComponentChange('Administradores')}>
                <FontAwesomeIcon icon={faUser} /> Administrador
              </a>
              <a href="#" onClick={() => handleComponentChange('Parroquias')}>
                <FontAwesomeIcon icon={faChartArea} /> Parroquias
              </a>
              <a href="#" onClick={() => handleComponentChange('Diocesis')}>
                <FontAwesomeIcon icon={FiBarChart} /> Diocesis
              </a>
            </>
          )}
        </div>

        <div className="content">
          {activeComponent === 'feed' && <Feed />}
          {activeComponent === 'Actividades' && <ActividadesList />}
          {activeComponent === 'Administradores' && userRole === 'Administrador' && (
            <AdministradoresList
              administradores={administradores}
            />
          )}
          {activeComponent === 'Parroquias' && userRole === 'Administrador' && <Parroquias />}
          {activeComponent === 'Diocesis' && userRole === 'Administrador' && <Diocesis/>}
        </div>
      </div>
    </>
  ) : (
    <div>
      <h2>No estás autorizado para ver esta página. Por favor, verifica tu autenticación de dos factores.</h2>
    </div>
  );
};

export default AdminDashboard;