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
  const [show2FA, setShow2FA] = useState(false);
  const [administradorId, setAdminId] = useState(null);
  const navigate = useNavigate();

  const bienvenida = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) {
      return "Buenos Días";
    } else if (hora >= 12 && hora < 18) {
      return "Buenas Tardes";
    } else {
      return "Buenas Noches";
    }
  };


  useEffect(() => {
    const twoFaVerified = Cookies.get('twoFactorVerified');
    const authToken = Cookies.get('authToken');
    setShow2FA(!twoFaVerified); // Si no se ha verificado 2FA, muestra el formulario de 2FA
    if (twoFaVerified) {
     setShow2FA(false)
    }
    
    if (authToken) {
      navigate('/dashboard'); // Redirige al dashboard si el 2FA ya fue verificado
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
        setError('Por favor, ingrese el código 2FA enviado a su correo.');
      } else {
        Cookies.set('authToken', response.data.token, { expires: 7 });
        Cookies.set('userRole', response.data.admin.roles, { expires: 7 });
        Cookies.set('twoFactorVerified', 'true', { expires: 7 });
       
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

  const handle2FAVerification = async (e) => {
    e.preventDefault();

    try {
      // Realiza la verificación del código 2FA
      const response = await axios.post('http://localhost:3001/api/administradores/verify-two-factor', {
        administradorId,
        token
      });

      // Almacena el token y los roles del administrador en las cookies
      const { token: authToken, administrador } = response.data;
      Cookies.set('authToken', authToken, { expires: 7 });
      Cookies.set('userRole', administrador.roles, { expires: 7 });
      Cookies.set('twoFactorVerified', 'true', { expires: 7 });

      // Obtiene la información del administrador
      const adminResponse = await axios.get(`http://localhost:3001/api/administradores/${administradorId}`, {
        headers: {
          Authorization: `Bearer ${authToken}` // Agregar el token en el encabezado
        }
      });

      const adminData = adminResponse.data;
      // Guardar en cookies
      Cookies.set('adminData', JSON.stringify(adminData), { expires: 7 });

      // Redirige al usuario al dashboard
      navigate('/dashboard');
    } catch (error) {
      // Manejo de errores con un mensaje más claro
      const errorMessage = error.response?.data?.message || 'Ocurrió un error al verificar el código 2FA.';
      console.error('Error al verificar 2FA:', error);
      setError(errorMessage);
    }
  };

  return (
    <section className="login-contenedor d-flex justify-content-between shadow-lg rounded-3 overflow-hidden">
      <div className="imagen-login">
        <img src={pic} alt="" className="img-fluid" />
      </div>

        <div className="bg-white p-4">
          <p className="fs-5">Hola!</p>
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
