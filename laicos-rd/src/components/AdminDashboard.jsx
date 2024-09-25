// AdminDashboard.js
import React from 'react';
import Cookies from 'js-cookie';

const AdminDashboard = () => {

  const twoFaVerified = Cookies.get('twoFactorVerified');

  console.log(twoFaVerified);
  return (
    <div>
      <h1>Dashboard Admin</h1>
      {/* Contenido del Dashboard Admin */}

     
    </div>
  );
};

export default AdminDashboard;