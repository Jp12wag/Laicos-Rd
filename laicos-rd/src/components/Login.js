import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/users/login', {
        email,
        password,
        token  // El código 2FA que el usuario introduce
      });

      console.log('Login exitoso:', response.data);

      if(response.status===200){
        alert("Logeado Correctamente");
        localStorage.setItem('authToken', response.data.token); // Guardar el token
        localStorage.setItem('userRole', response.data.user.roles); // Guardar el rol del usuario
        navigate('/dashboard'); // Redirigir al dashboard

      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Código 2FA"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
        <a href='/register'>Registrase</a>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
