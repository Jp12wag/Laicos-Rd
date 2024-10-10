import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';
import { FaBell, FaSearch, FaCaretDown, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import Modal from '../components/Modal/modalNotificacion'; // Asegúrate de importar el componente Modal

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const userId = Cookies.get('IdUser');
  const authToken = Cookies.get('authToken');
  const userRole = Cookies.get('userRole');
  const [notificaciones, setShowNotificaciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const clearCookies = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('twoFactorVerified');
    Cookies.remove('IdUser');
    Cookies.remove('isTwoFaEnabled');
  };
  const handleClickOutside = (event) => {
    if (!event.target.closest('.profile-container')) {
      setShowMenu(false);
    }
    if (!event.target.closest('.notification-container')) {
      setShowModal(false); // Cierra el modal si se hace clic fuera de él
    }
  };
  // Función para obtener notificaciones
  const obtenerNotificaciones = async () => {
    if (!authToken) return;

    try {
      const response = await axios.get(`http://localhost:3001/api/notificaciones/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setShowNotificaciones(response.data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, [authToken]);

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };
  const toggleNotificaciones = () => {
    setShowModal((prevState) => !prevState); // Abre o cierra el modal
    console.log(notificaciones); // Para verificar las notificaciones
  };

  const handleLogout = async () => {
    clearCookies();
    navigate('/login');
    try {
      await axios.post('http://localhost:3001/api/administradores/logout', {}, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      });

      clearCookies();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const obtenerUsuario = async () => {
    if (!authToken) {
      console.log("Token no encontrado. Redirigiendo al login...");
      navigate('/login');
      return;
    }

    if (!userId) return; // Asegúrate de que userId esté definido

    try {
      const response = await axios.get(`http://localhost:3001/api/administradores/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });

      if (response.data) {
        setUser(response.data);
      } else {
        console.log("No se encontraron datos de usuario.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useEffect(() => {
    if (!authToken || !userRole) {
      navigate('/login'); // Redirige al login si no hay token o rol
    } else {
      obtenerUsuario();
    }
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container')) {
        setShowMenu(false);
      }
    };
    const checkAuthToken = setInterval(() => {
      const token = Cookies.get('authToken');
      if (!token) {
        navigate('/login');
      }
    }, 60000); // Verifica cada 60 segundosz

    return () => clearInterval(checkAuthToken);

  }, [userId]);

  return (
    <header>
      <nav>
        <ul>
          <li className="notification-container">
            <FaBell className="nav-icon" title="Notificaciones" onClick={toggleNotificaciones} />
            {notificaciones.length > 0 && (
              <span className="notification-badge">{notificaciones.length}</span>
            )}
          </li>
          <li><FaSearch className="nav-icon" title="Buscar" /></li>
          <li className="profile-container">
            <FaUser className="profile-pic" onClick={toggleMenu} />
            <FaCaretDown className="arrow-icon" onClick={toggleMenu} />
            {showMenu && (
              <ul className="dropdown-menu">
                {user.nombre && user.apellido ? (
                  <li className="greeting-container">
                    <div className="profile-image">
                      {user.foto ? (
                        <img src={user.foto} alt={user.nombre} />
                      ) : (
                        <span>{user.nombre.charAt(0)}{user.apellido.charAt(0)}</span>
                      )}
                    </div>
                    <div className="greeting">
                      <p>Hola, {user.nombre} {user.apellido}</p>
                      <p>{user.email}</p>
                    </div>
                  </li>
                ) : (
                  <li>No se encontraron datos de usuario.</li>
                )}
                <li>
                  <button onClick={() => navigate("/Perfil")} className="dropdown-button">
                    <FaCog /> Mi Perfil
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout} className="dropdown-button">
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <Modal isOpen={showModal} onClose={toggleNotificaciones} notifications={notificaciones} />
    </header>
  );
};

export default Header;
