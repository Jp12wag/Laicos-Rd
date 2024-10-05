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
  const [userRole, setUserRole] = useState(null);
  const authToken = Cookies.get('authToken');
  const role = Cookies.get('userRole');

  useEffect(() => {
   
    // Establecer el estado basado en la existencia de las cookies
    if (authToken) {
      setUserRole(role); // Almacena el rol del usuario

    }else {
      setUserRole(null); // Asegúrate de limpiar el estado si no hay token
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
        <Route path={"/Dashboard/"} element={
          <PrivateRoute>
            {userRole === 'Administrador' ? <AdminDashboard /> : <UserDashboard />}
          </PrivateRoute>
        } />

        <Route path="/Perfil" element={
          <PrivateRoute>
            {userRole ? <Perfil /> : <Navigate to="/Login" />} {}
          </PrivateRoute>
        } />

        {/* Redirección predeterminada */}
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
