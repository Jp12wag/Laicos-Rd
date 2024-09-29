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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    const role = Cookies.get('userRole');
    const admin = Cookies.get('adminData');
    console.log("Admin: "+admin);

    // Establecer el estado basado en la existencia de las cookies
    if (authToken) {
      setIsLoggedIn(true);
      setUserRole(role); // Almacena el rol del usuario
    } else {
      setIsLoggedIn(false);
    }

    // Establecer adminData si existe
    if (admin) {
      setAdminData(JSON.parse(admin)); // Convertir de JSON a objeto
    }
  }, []); // Solo se ejecuta al montar el componente

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Reset" element={<RequestResetPassword />} />
        <Route path="/Reset-password/:token" element={<ResetPassword />} />

        {/* Rutas protegidas */}
        <Route path="/Dashboard" element={
          <PrivateRoute>
            {userRole === 'Administrador' && adminData ? <AdminDashboard /> : <UserDashboard />}
          </PrivateRoute>
        } />

        <Route path="/Perfil" element={
          <PrivateRoute>
            {adminData ? <Perfil /> : <Navigate to="/Login" />} {/* Redirigir si adminData no existe */}
          </PrivateRoute>
        } />
        
        {/* Redirección predeterminada */}
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
