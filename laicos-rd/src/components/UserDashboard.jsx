import React from 'react';
import Header from './Header';
import '../css/UserDashboard.css';
import Feed from './feed'; 


const UserDashboard = () => {
  
  return (
   
    <>
       <Header />
      <div className="user-dashboard">
        <h1>Estas en el miembro</h1>
        <Feed /> {/* Añade el componente Feed aquí */}
      </div>
    </>
  );
};

export default UserDashboard;
