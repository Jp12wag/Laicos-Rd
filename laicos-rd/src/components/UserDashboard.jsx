import React, { useState } from 'react';
import Header from './Header';
import '../css/UserDashboard.css';
import Feed from './feed'; 

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
          <a href="#" onClick={() => handleComponentChange('feed')}>Feed</a>

        </div>

        <div className="content" style={{ marginLeft: '250px', padding: '20px' }}>
          {activeComponent === 'feed' && <Feed />}
         
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
