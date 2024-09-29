import Header from './Header';
import EditProfile from './Perfil';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserDashboard = () => {
return (
  <div>
    <Header /> {/* Pasamos la función como prop */}
  </div>
);
};
export default UserDashboard;