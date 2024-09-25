import React, { useState } from 'react';
import axios from 'axios';

const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/administradores/request-reset-password', { email });
      setSuccess('Se ha enviado un correo con instrucciones para restablecer la contraseña.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el restablecimiento de contraseña.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Solicitar Restablecimiento de Contraseña</h2>
      <form onSubmit={handleRequest}>
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Correo</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default RequestResetPassword;
