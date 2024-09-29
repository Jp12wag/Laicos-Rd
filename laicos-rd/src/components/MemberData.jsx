import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MemberData = () => {
  const [additionalData, setAdditionalData] = useState({
    memberData1: '',
    memberData2: '',
    // Agrega otros campos necesarios
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí envías los datos adicionales al servidor
      const response = await axios.post('http://localhost:3001/api/members/data', additionalData);
      console.log('Datos adicionales enviados:', response.data);
      navigate('/dashboard'); // Redirigir después de guardar los datos
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
          placeholder="Datos adicionales 1" 
          value={additionalData.memberData1} 
          onChange={(e) => setAdditionalData({ ...additionalData, memberData1: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Datos adicionales 2" 
          value={additionalData.memberData2} 
          onChange={(e) => setAdditionalData({ ...additionalData, memberData2: e.target.value })} 
          required 
        />
        {/* Agrega más campos según sea necesario */}
        <button type="submit">Guardar Datos</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default MemberData;
