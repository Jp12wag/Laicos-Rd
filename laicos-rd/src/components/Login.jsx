import "../css/Login.css";
import pic from "../img/pic.avif";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const [show2FA, setShow2FA] = useState(false); // Cambiado a false por defecto
  const [administradorId, setAdminId] = useState(null); // Almacena el ID del usuario
  const navigate = useNavigate();

  const bienvenida = () => {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 12) {
      return "Good Morning";
    } else if (hora >= 12 && hora < 18) {
      return "Good Afternoon";
    } else if (hora >= 18 && hora < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  useEffect(() => {
    const twoFaVerified = Cookies.get('twoFactorVerified');
   
  
    if (twoFaVerified) {
      setShow2FA(false);
    }
  
    const authToken = Cookies.get('authToken');
   
  
    if (authToken===true) {
      navigate('/dashboard'); // Redirige al dashboard si ya está logueado
    }
  }, [navigate]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/administradores/login', {
        email,
        password
      });

      if (response.data.twoFactorRequired) {
        
        setAdminId(response.data.administrador._id); // Almacena el ID del usuario
        setShow2FA(true);
        setError('Por favor, ingrese el código 2FA enviado a su correo.');
        return;
      } else {
        Cookies.set('authToken', response.data.token, { expires: 1 }); // Expira en 1 día
        Cookies.set('userRole', response.data.admin.roles, { expires: 1 });
        Cookies.set('twoFactorVerified', 'true', { expires: 1 });
        // Limpiar los campos
        setEmail('');
        setPassword('');
        setToken('');
        
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.response?.data?.message || 'Ocurrió un error al iniciar sesión.');
    }
  };
  // Función para verificar 2FA
  const handle2FAVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/administradores/verify-two-factor', {
        administradorId,
        token
      });

      Cookies.set('authToken', response.data.token, { expires: 1 }); // Expira en 1 día
      Cookies.set('userRole', response.data.administrador.roles, { expires: 1 });
      navigate('/dashboard');

    } catch (error) {
      console.error('Error al verificar 2FA:', error);
      setError(error.response?.data?.message || 'Ocurrió un error al verificar el código 2FA.');
    }
  };

  return (
    <section className="login-contenedor d-flex justify-content-between shadow-lg rounded-3 overflow-hidden">
      <div className="imagen-login">
        <img src={pic} alt="" className="img-fluid" />
      </div>

      <div className="bg-white p-4">
        <p className="fs-5">Hello!</p>
        <p className="fs-5">{bienvenida()}</p>

        <form className="formulario-login d-flex flex-column px-5 py-4" onSubmit={show2FA ? handle2FAVerification : handleLogin}>
          <h2 className="text-center fs-5">Login your account</h2>

          <input className="inputName" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="inputName" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {show2FA && (
            <input type="text" placeholder="Código 2FA" value={token} onChange={(e) => setToken(e.target.value)} required />
          )}

          <p className="forget-password" id="forget-password">
            <a href="/reset">Forget password?</a>
          </p>

          <button type="submit" className="mt-2 mb-3 btn btn-primary mx-4 fs-5">
            {show2FA ? "Verify 2FA" : "Login"}
          </button>

          <a href="/register"><p className="text-center">Create Account</p></a>
          {error && <p>{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Login;