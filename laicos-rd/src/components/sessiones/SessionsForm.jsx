import React, { useState } from 'react';

const SessionsForm = ({ onSubmit }) => {
    const [sessionInfo, setSessionInfo] = useState('');

    const handleChange = (e) => {
        setSessionInfo(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(sessionInfo); // Llama a la función onSubmit para manejar la creación de sesiones
        setSessionInfo(''); // Limpiar el formulario
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={sessionInfo}
                onChange={handleChange}
                placeholder="Detalles de la sesión"
                required
            />
            <button type="submit">Agregar Sesión</button>
        </form>
    );
};

export default SessionsForm;
