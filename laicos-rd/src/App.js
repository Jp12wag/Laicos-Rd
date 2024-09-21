import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Cookies from 'js-cookie';

const App = () => {
  const userRole = Cookies.get('userRole');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Solo cambia el estado si hay un cambio real
    if (userRole) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userRole]); // Solo se ejecuta cuando `userRole` cambia
  console.log(userRole);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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