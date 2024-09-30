import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const MemberData = () => {
  const [additionalData, setAdditionalData] = useState({
    direccion: '',        // Agregar campos adicionales
    estadoCivil: '',
    cargo: '',
    nacionalidad: '',
    esLaico: true,       // Ajustar según tu lógica
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = Cookies.get('email');   // Obtener el correo de las cookies
      const password = Cookies.get('password'); // Obtener la contraseña de las cookies
      
      // Aquí envías los datos adicionales al servidor
      const response = await axios.post('http://localhost:3001/api/miembros/', {
        ...additionalData, // Usar el spread operator para incluir los datos
        email,             // Incluir el correo
        password           // Incluir la contraseña
      });
      

      if(response.ok){
        navigate('/dashboard'); // Redirigir después de guardar los datos
      }

     
    } catch (error) {
      setError('Error al guardar los datos. Intenta de nuevo.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Por favor, ingresa los datos adicionales</h2>
      <form onSubmit={handleDataSubmit}>
        <input 
          type="text" 
          placeholder="Dirección" 
          value={additionalData.direccion} 
          onChange={(e) => setAdditionalData({ ...additionalData, direccion: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Estado Civil" 
          value={additionalData.estadoCivil} 
          onChange={(e) => setAdditionalData({ ...additionalData, estadoCivil: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Cargo" 
          value={additionalData.cargo} 
          onChange={(e) => setAdditionalData({ ...additionalData, cargo: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nacionalidad" 
          value={additionalData.nacionalidad} 
          onChange={(e) => setAdditionalData({ ...additionalData, nacionalidad: e.target.value })} 
          required 
        />
        <button type="submit">Guardar Datos</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default MemberData;