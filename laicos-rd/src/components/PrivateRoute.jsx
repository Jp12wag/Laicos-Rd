import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    // Simulando la verificación de autenticación
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simula una carga de 1 segundo

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Mostrar un mensaje de carga mientras verificas
  }

  return authToken ? children : <Navigate to="/Login" />;
};

export default PrivateRoute;
