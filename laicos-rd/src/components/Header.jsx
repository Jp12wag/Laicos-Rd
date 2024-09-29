import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';
import { FaBell, FaSearch, FaCaretDown, FaUser, FaCog } from 'react-icons/fa';
import Cookies from 'js-cookie';


const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const clearCookies = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('twoFactorVerified');
    Cookies.remove('adminData'); // Limpiar el nombre del administrador si es necesario
  };


  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState); // Función flecha con prevState
    console.log("Menu state:", !showMenu);
  };
  //clearCookies(); // Limpiar cookies si no están verificadas
  const handleLogout = () => {
    clearCookies(); // Limpia las cookies
    navigate('/login'); // Redirige al usuario al formulario de inicio de sesión
  };

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container')) {
        setShowMenu(false);
      }
    };
   
    const adminData = Cookies.get('adminData');
  
    console.log("Datos del admin en cookies:", adminData);
    if (adminData) {
      try {
        const adminDataFromCookies = JSON.parse(Cookies.get('adminData'));
        setUser(adminDataFromCookies); // Actualiza el estado del usuario
      } catch (error) {
        console.error("Error al parsear adminData:", error);
      }
    } else {
      // Manejo cuando no hay datos de usuario disponibles
      console.log("No se encontró el adminData en las cookies.");
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header>
      <nav>
        <ul>
          <li><FaBell className="nav-icon" title="Notificaciones" /></li>
          <li><FaSearch className="nav-icon" title="Buscar" /></li>
          <li>
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
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
        {/* Mensaje de saludo y círculo de imagen de perfil */}

      </nav>
    </header>
  );
};

export default Header;
