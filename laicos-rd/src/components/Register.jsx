import React, { useState } from 'react';
import axios from 'axios';
import "../css/registro.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState('Seleccionar');
  const [celular, setCelular] = useState('');
  const [fechaN, setfechaN] = useState('');
  const [esMiembro, setesMiembro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qrcode, setQRCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado de carga
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el estado de carga

    try {
      const response = await axios.post('http://localhost:3001/api/administradores/', {
        nombre: name,
        apellido,
        email,
        password,
        sexo,
        celular,
        nacimiento: fechaN,
        esMiembro
      });

      setQRCode(response.data.qrcode);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false); // Desactivar el estado de carga

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setLoading(false); // Desactivar el estado de carga
      setError('Error al registrar. Verifica los datos e intenta nuevamente.');
      console.error('Error al registrar:', error);
    }
  };

  return (
    <section className="login-contenedor d-flex  shadow-lg rounded-2 overflow-hidden">
      <div className="bg-white registro-contenedor">
        <h2 className='titulo-registro'>Registro</h2>
        <form className="formulario-registro" onSubmit={handleRegister}>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="apellido">Apellidos</label>
            <input
              id="apellido"
              type="text"
              placeholder="Apellidos"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="genero">Género</label>
            <select id="genero" value={sexo} onChange={(e) => setSexo(e.target.value)} required>
              <option value="Seleccionar" disabled>Seleccionar</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="celular">Teléfono</label>
            <input
              id="celular"
              type="tel"
              placeholder="Teléfono"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              id="fechaNacimiento"
              type="date"
              value={fechaN}
              onChange={(e) => setfechaN(e.target.value)}
              required
            />
          </div>

          <div className={`custom-checkbox ${esMiembro ? 'checked' : ''}`}>
            <input
              id='check'
              type="checkbox"
              checked={esMiembro}
              onChange={(e) => setesMiembro(e.target.checked)}
            />
            <label htmlFor='check'>¿Eres miembro de la iglesia?</label>
          </div>
          
          <p>{esMiembro ? 'Sí, soy miembro de la iglesia.' : 'No, no soy miembro de la iglesia.'}</p>

          <button type="submit" className='btn' disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        {error && <p className="error-message">{error}</p>}
        {qrcode && (
          <div>
            <h3>Escanea este código QR con tu aplicación de autenticación</h3>
            <img src={qrcode} alt="Código QR de 2FA" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Register;
