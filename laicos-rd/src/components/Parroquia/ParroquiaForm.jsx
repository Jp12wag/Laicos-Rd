import React, { useState, useEffect } from 'react';

const ParroquiaForm = ({ onSubmit, parroquia }) => {
    const [nombre, setNombre] = useState('');
    const [sacerdote, setSacerdote] = useState('');

    useEffect(() => {
        if (parroquia) {
            setNombre(parroquia.nombre);
            setSacerdote(parroquia.sacerdote);
        } else {
            setNombre('');
            setSacerdote('');
        }
    }, [parroquia]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre, sacerdote });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre de la Parroquia"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Nombre del Clero"
                value={sacerdote}
                onChange={(e) => setSacerdote(e.target.value)}
                required
            />
            <button type="submit">{parroquia ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default ParroquiaForm;
