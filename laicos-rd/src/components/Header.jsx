import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';
import { FaBell, FaSearch, FaCaretDown, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const userId = Cookies.get('IdUser');

  const clearCookies = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('twoFactorVerified');
    Cookies.remove('IdUser');
  };

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  const handleLogout = async () => {
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
    if (!userId) return; // Asegúrate de que userId esté definido

    try {
      const authToken = Cookies.get('authToken');
      const response = await axios.get(`http://localhost:3001/api/administradores/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
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
    obtenerUsuario(); // Llamar a la función al montar el componente

    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userId]); // Solo depende de userId

  return (
    <header>
      <nav>
        <ul>
          <li><FaBell className="nav-icon" title="Notificaciones" /></li>
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
                  <button onClick={() => navigate("/perfil")} className="dropdown-button">
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
    </header>
  );
};

export default Header;
