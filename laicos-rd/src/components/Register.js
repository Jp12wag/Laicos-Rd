import React, { useState } from 'react';
import axios from 'axios';
import "../css/Login.css";
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [name, setName] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState('Selecionar');
  const [celular, setCelular] = useState('');
  const [fechaN, setfechaN] = useState('');
  const [esMiembro, setesMiembro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qrcode, setQRCode] = useState('');
  const [error, setError] = useState(''); // Agregar estado para errores
  const navigate = useNavigate(); // Define el hook useNavigate
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/administradores/', {
        nombre: name,
        apellido,
        email,
        password,
        sexo: sexo,
        celular,
        nacimiento: fechaN,
        esMiembro
      });


      console.log(response.data);
      setQRCode(response.data.qrcode); // Guardar el código QR en el estado
      setError(''); // Limpiar errores anteriores

      // Limpiar los campos del formulario
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/login'); // Redirigir a la página de login
      }, 2000);
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
          type="text"
          placeholder="Apellidos"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <select id="genero" value={sexo} onChange={(e) => setSexo(e.target.value)} required>
        <option value="Seleccionar" disabled>Seleccionar</option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
        </select>
        {sexo !== 'Seleccionar' && (
        <p>Has seleccionado: {sexo}</p>
      )}

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
          type="phone"
          placeholder="Telefono"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          required
        />
        <input
          type="date"
          id="fechaNacimiento"
          value={fechaN}
          onChange={(e) => setfechaN(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={esMiembro}
            onChange={(e) => setesMiembro(e.target.checked)}
          />
          ¿Eres miembro de la iglesia?
        </label>
        <p>{esMiembro ? 'Sí, soy miembro de la iglesia.' : 'No, no soy miembro de la iglesia.'}</p>

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
