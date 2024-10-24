import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import RequestResetPassword from './components/RequestResetPassword';
import ResetPassword from './components/ResetPassword';
import Perfil from './components/Perfil';
import Cookies from 'js-cookie';
import PrivateRoute from './components/PrivateRoute';
import SessionsPage from './components/sessiones/SessionsPage';
import ActividadDetalle from './components/ActividadDetalle'; 

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Añadido para manejar la carga inicial
  const authToken = Cookies.get('authToken');
  const role = Cookies.get('userRole');

  useEffect(() => {
    // Simula la carga para obtener el rol del usuario
    if (authToken) {
      setUserRole(role);
    } else {
      setUserRole(null);
    }
    setLoading(false); // Carga terminada
  }, [authToken, role]); // Dependencias de authToken y role

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner o una pantalla de carga
  }

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Reset" element={<RequestResetPassword />} />
        <Route path="/Reset-password/:token" element={<ResetPassword />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/Perfil" element={<Perfil/>}/>
        <Route path="/actividades/:id" element={<ActividadDetalle />} />
        {/* Rutas protegidas */}
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              {/* Si el usuario es administrador, redirige al AdminDashboard, si no, al UserDashboard */}
              {<AdminDashboard />}
            </PrivateRoute>
          }
        />

        <Route path="/Perfil"/>

        {/* Redirección predeterminada */}
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
};

export default App;
