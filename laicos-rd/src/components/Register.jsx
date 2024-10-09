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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      // Limpiar los campos
      setName('');
      setApellido('');
      setEmail('');
      setPassword('');
      setSexo('Seleccionar');
      setCelular('');
      setfechaN('');
      setesMiembro(false);
      setError('');

      // Navegar a la página de login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError('Error al registrar. Verifica los datos e intenta nuevamente.');
      console.error('Error al registrar:', error);
    }
  };

  return (
    <section className='contenedor-principal'>
      <div className="login-contenedor registro d-flex shadow-lg rounded-2 overflow-hidden">
        <div className="bg-white registro-contenedor">
          <h2 className='titulo-registro my-3'>Registro</h2>
          <form className="formulario-registro px-4" onSubmit={handleRegister}>
            <div className='d-flex gap-3 justify-content-center'>
              <div>
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
              </div>
              <div>
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
                <p className='label-miembro'>{esMiembro ? 'Sí, soy miembro de la iglesia.' : 'No, no soy miembro de la iglesia.'}</p>
              </div>
            </div>
            <button type="submit" className='btn btn-primary w-100 my-3' disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default Register;
