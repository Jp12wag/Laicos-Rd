import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import Cookies from 'js-cookie';

const App = () => {
  const userRole = Cookies.get('userRole');
  const authToken = Cookies.get('authToken');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Verifica si existe un authToken para marcar al usuario como logueado
    if (authToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [authToken]); // Solo se ejecuta cuando `authToken` cambia

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<RequestResetPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Ruta para restablecer la contraseña */}
        <Route path="/dashboard" element={
          isLoggedIn ? (
            userRole === 'Administrador' ? <AdminDashboard /> : <UserDashboard />
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;