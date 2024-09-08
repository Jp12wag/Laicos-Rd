import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('');
  const [qrcode, setQRCode] = useState('');
  const [error, setError] = useState(''); // Agregar estado para errores

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/', {
        name,
        email,
        password,
        roles
      });

      console.log(response.data);
      setQRCode(response.data.qrcode); // Guardar el código QR en el estado
      setError(''); // Limpiar errores anteriores
    } catch (error) {
      setError('Error al registrar. Verifica los datos e intenta nuevamente.');
      console.error('Error al registrar:', error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Roles"
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      {error && <p>{error}</p>} {/* Mostrar mensaje de error */}
      {qrcode && (
        <div>
          <h3>Escanea este código QR con tu aplicación de autenticación</h3>
          <img src={qrcode} alt="Código QR de 2FA" />
        </div>
      )}
    </div>
  );
};

export default Register;
