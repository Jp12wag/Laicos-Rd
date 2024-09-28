// AdminDashboard.js
import React from 'react';
import Cookies from 'js-cookie';
import Header from './Header';

const AdminDashboard = () => {

  const twoFaVerified = Cookies.get('twoFactorVerified');

  console.log(twoFaVerified);
  return (
   
    <div>
      <Header />
      <main>
        <h1>Welcome to my website</h1>
        <p>This is the content of the page.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;