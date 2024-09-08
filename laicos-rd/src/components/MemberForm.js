import React, { useState } from 'react';

function MemberForm() {
  const [formData, setFormData] = useState({
    name: '',
    diocese: '',
    parish: '',
    movement: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Miembro registrado con éxito');
       
        e.target.value("");
      } else {
        alert('Error al registrar miembro');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Diócesis:</label>
        <input type="text" name="diocese" value={formData.diocese} onChange={handleChange} required />
      </div>
      <div>
        <label>Parroquia:</label>
        <input type="text" name="parish" value={formData.parish} onChange={handleChange} required />
      </div>
      <div>
        <label>Movimiento:</label>
        <input type="text" name="movement" value={formData.movement} onChange={handleChange} required />
      </div>
      <button type="submit">Registrar</button>
    </form>
  );
}

export default MemberForm;
