import "../css/Login.css";
import pic from "../img/pic.avif";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';



const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = window.location.pathname.split('/').pop(); // Obtén el token de la URL
      try {
        await axios.post(`http://localhost:3001/api/users/reset-password/${token}`, { newPassword });
        // Redirigir al login o mostrar un mensaje de éxito
      } catch (error) {
        setError(error.response?.data?.error || 'Error al restablecer la contraseña.');
      }
    };

    const handlePasswordResetRequest = async (e) => {
        e.preventDefault();
        try {
          await axios.post('http://localhost:3001/api/users/request-reset-password', {
            email
          });
          setError('Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.');
        } catch (error) {
          setError(error.response?.data?.error || 'Error al solicitar el restablecimiento de contraseña.');
        }
      };
      
      // En tu JSX
      <p className="forget-password" id="forget-password" onClick={handlePasswordResetRequest}>
        Forget password?
      </p>
      
  
    return (
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="Nueva Contraseña" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
        <button type="submit">Restablecer Contraseña</button>
        {error && <p>{error}</p>}
      </form>
    );
  };


  