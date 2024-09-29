import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
  const authToken = Cookies.get('authToken'); // Verifica si hay un token de autenticación en las cookies
  const twoFactorVerified = Cookies.get('twoFactorVerified');
  const adminData = Cookies.get('adminData');

  // Si no hay token o 2FA no está verificado, redirige al login
  if (!authToken || twoFactorVerified !== 'true')  {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderiza los componentes hijos (rutas protegidas)
  return children;
};

export default PrivateRoute;
