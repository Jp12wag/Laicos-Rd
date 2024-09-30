import React, { useState, useEffect } from 'react';
import Header from './Header';
import ShareThought from './ShareThought';
import ThoughtsFeed from './ThoughtsFeed';
import Chat from './Chat';
import Notifications from './Notifications';
import Cookies from 'js-cookie';
import '../css/UserDashboard.css';

const UserDashboard = () => {
  const [thoughts, setThoughts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulación de carga de datos de pensamientos y notificaciones
    const adminData = Cookies.get('adminData');
    if (adminData) {
      // Aquí puedes cargar los pensamientos y notificaciones desde la API
      setThoughts(['Pensamiento 1', 'Pensamiento 2']); // Cargar desde API
      setNotifications(['Notificación 1', 'Notificación 2']); // Cargar desde API
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="user-dashboard">
        <h1>Bienvenido al Dashboard de Usuario</h1>
        <ShareThought setThoughts={setThoughts} />
        <ThoughtsFeed thoughts={thoughts} />
        <Chat />
        <Notifications notifications={notifications} />
      </div>
    </div>
  );
};

export default UserDashboard;
