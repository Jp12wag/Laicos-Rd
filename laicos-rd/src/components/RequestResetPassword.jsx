import React, { useState } from 'react';
import axios from 'axios';
import '../css/RequestResetPassword.css'
import { useNavigate } from 'react-router-dom';



const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/administradores/request-reset-password', { email });
      console.log(email);
      setSuccess('Se ha enviado un correo con instrucciones para restablecer la contraseña.');
      navigate('/login');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el restablecimiento de contraseña.');
      setSuccess('');
    }
  };

  return (
    <div className='container'>
    <div className='card'>
      <h2 className='title'>Restablecer Contraseña</h2>
      <form className='title' onSubmit={handleRequest}>
        <input 
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className='title' type="submit">Enviar Correo</button>
        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}
      </form>
    </div>
    </div>
  );
};

export default RequestResetPassword;
