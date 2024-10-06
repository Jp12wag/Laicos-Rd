import React, { useState, useEffect } from 'react';
import dioesisService from '../../services/diocesisService';
import '../../css/dioesis.css';

const DioesisForm = ({ selectedDioesis, onFormSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (selectedDioesis) {
      setNombre(selectedDioesis.nombre);
    }
  }, [selectedDioesis]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit({ nombre });
    setNombre('');
  };

  return (
    <form onSubmit={handleSubmit} className="dioesis-form">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la Diócesis"
        required
      />
      <button type="submit">{selectedDioesis ? 'Actualizar' : 'Crear'} Diócesis</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default DioesisForm;
