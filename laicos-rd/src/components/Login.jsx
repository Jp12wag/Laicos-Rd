import "../css/Login.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [administradorId, setAdminId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const twoFaVerified = Cookies.get('twoFactorVerified');
    const isTwoFaEnabled = Cookies.get('isTwoFaEnabled') === 'true';
    const authToken = Cookies.get('authToken');

    if (!authToken) {
      setShow2FA(false);
      return;
    }

    if (isTwoFaEnabled && twoFaVerified === 'true' && authToken) {
      navigate('/dashboard');
    } else if (isTwoFaEnabled) {
      setShow2FA(twoFaVerified !== 'true');
    } else {
      navigate('/dashboard');  // Omitir el 2FA si está deshabilitado
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/administradores/login', {
        email,
        password
      });

      // Comprueba si se requiere 2FA
      if (response.data.twoFactorRequired) {
        setAdminId(response.data.administradorId); // Almacena el ID del usuario
        setError('Por favor, ingrese el código 2FA enviado a su correo.');
        setShow2FA(true); // Mostrar formulario 2FA
      } else {
        // Guardar datos en cookies
        Cookies.set('authToken', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('userRole', response.data.administrador.rolUsuario, { expires: 7 });
        Cookies.set('twoFactorVerified', 'false', { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('IdUser', response.data.administrador._id, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('isTwoFaEnabled', response.data.administrador.isTwoFaEnabled, { expires: 7, secure: true, sameSite: 'Strict' });

        // Limpiar los campos
        setEmail('');
        setPassword('');
        setToken('');
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: '¡Bienvenido!',
        });

        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Ocurrió un error al iniciar sesión.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al iniciar sesión.',
      });
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/administradores/verify-two-factor', {
        administradorId,
        token
      });

      const { token: authToken, administrador } = response.data;
      Cookies.set('authToken', authToken, { expires: 7, secure: true, sameSite: 'Strict' });
      Cookies.set('userRole', administrador.rolUsuario, { expires: 7, secure: true, sameSite: 'Strict' });
      Cookies.set('twoFactorVerified', 'true', { expires: 7, secure: true, sameSite: 'Strict' });
      Cookies.set('IdUser', administrador._id, { expires: 7, secure: true, sameSite: 'Strict' });
      Cookies.set('isTwoFaEnabled', response.data.administrador.isTwoFaEnabled, { expires: 7, secure: true, sameSite: 'Strict' });
      Swal.fire({
        icon: 'success',
        title: 'Verificación 2FA Exitosa',
        text: '¡Has ingresado correctamente!',
      });
      navigate('/dashboard'); // Redirigir al dashboard si es miembro
    } catch (error) {
 
      const errorMessage = error.response?.data?.message || 'Ocurrió un error al verificar el código 2FA.';
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  return (
    <section className="container-principal-login d-flex align-items-center justify-content-center">


      <form className="formulario-login d-flex flex-column p-4 rounded-3 mb-1 shadow" onSubmit={show2FA ? handle2FAVerification : handleLogin}>
        <h1 className="my-0">Iniciar sesión</h1>
        <p className="mb-5">Ingresa tus credenciales para acceder</p>

        <label htmlFor="email">Correo electrónico</label>
        <input className="rounded-3" type="email" name="email" id="email" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Contraseña</label>
        <div className="d-flex align-items-center">
          <input className="rounded-3 " type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <FaEye className="text-dark FaEye-icon" />
        </div>

        {show2FA && (
          <input type="text" placeholder="Código 2FA" value={token} onChange={(e) => setToken(e.target.value)} required />
        )}

        <p className="olvidaste-contrasena" id="olvidaste-contrasena">
          <a href="/reset">¿Olvidaste tu contraseña?</a>
        </p>

        <button type="submit" className="my-4 btn">
          {show2FA ? "Verify 2FA" : "Iniciar Sesión"}
        </button>

        <p className="text-center">¿No tienes una cuenta? <a href="/register" id="link-registro">Regístrate</a></p>
        {error && <p>{error}</p>}


      </form>

    </section>
  );
};

export default Login;
