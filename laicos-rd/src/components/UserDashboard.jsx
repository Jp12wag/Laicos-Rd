import React, { useState } from 'react';
import Header from './Header';
import '../css/UserDashboard.css';
import Feed from './feed'; 
import ActividadesList from './ActividadesList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faChartPie } from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('feed'); // Estado para controlar el componente activo

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };


  return (
    <>
      <Header />
      <div className="user-dashboard">
        <div className="sidebar">
          <h2>Miembro</h2>
          <a href="/feed" onClick={() => handleComponentChange('feed')}>
            <FontAwesomeIcon icon={faClipboardList} /> Feed
          </a>
          <a href="#" onClick={() => handleComponentChange('Actividades')}>
            <FontAwesomeIcon icon={faChartPie} /> Actividades
          </a>

        </div>

        <div className="content">
        {activeComponent === 'feed' && <Feed />}
        {activeComponent === 'Actividades' && <ActividadesList />}
         
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
