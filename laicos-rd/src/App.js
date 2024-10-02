import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import Perfil from './components/Perfil';
import Cookies from 'js-cookie';
import PrivateRoute from './components/PrivateRoute';
import MemberData from './components/MemberData';

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    const role = Cookies.get('userRole');

    const memberStatus = Cookies.get('isMember') === 'true';

    // Establecer el estado basado en la existencia de las cookies
    if (authToken) {
      setUserRole(role); // Almacena el rol del usuario
      setIsMember(memberStatus); // Establecer isMember
    }

  }, [isMember]); // Solo se ejecuta al montar el componente

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Reset" element={<RequestResetPassword />} />
        <Route path="/Reset-password/:token" element={<ResetPassword />} />

        {/* Ruta para los datos adicionales del miembro */}
        <Route path="/member-data" element={
          <PrivateRoute>
            {isMember ? <MemberData /> : <Navigate to="/Login" />} {/* Redirigir si no es miembro */}
          </PrivateRoute>
        } />

        {/* Rutas protegidas */}
        <Route path="/Dashboard" element={
          <PrivateRoute>
            {userRole === 'Administrador' ? <AdminDashboard /> : <UserDashboard />}
          </PrivateRoute>
        } />

        <Route path="/Perfil" element={
          <PrivateRoute>
            {userRole ? <Perfil /> : <Navigate to="/Login" />} {/* Redirigir si adminData no existe */}
          </PrivateRoute>
        } />

        {/* Redirección predeterminada */}
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
