// AdminDashboard.js
import React from 'react';
import Cookies from 'js-cookie';
import Header from './Header';

const AdminDashboard = () => {

  const twoFaVerified = Cookies.get('twoFactorVerified');

  return (

    <div>
      <Header />
      <main>
        <h1>Hola soy un admin</h1>
      </main>
    </div>
  );
};

export default AdminDashboard;