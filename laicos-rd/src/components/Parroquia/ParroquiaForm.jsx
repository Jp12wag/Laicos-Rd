import React, { useState, useEffect } from 'react';
import { getDioesis } from '../../services/diocesisService'; // Asegúrate de tener un servicio para obtener las diócesis
const ParroquiaForm = ({ onSubmit, parroquia }) => {
    const [nombre, setNombre] = useState('');
    const [dioesisId, setDioesisId] = useState('');
    const [dioesisList, setDioesisList] = useState([]);

    useEffect(() => {
        const fetchDioesis = async () => {
            const data = await getDioesis(); // Obtener la lista de diócesis
            setDioesisList(data);
        };

        fetchDioesis();
    }, []);

    useEffect(() => {
        if (parroquia) {
            setNombre(parroquia.nombre);
            setDioesisId(parroquia.dioesis._id); // Asignar el ID de la diócesis seleccionada
        } else {
            setNombre('');
            setDioesisId('');
        }
    }, [parroquia]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre, dioesis: dioesisId }); // Incluir la diócesis en los datos enviados
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
            <select
                value={dioesisId}
                onChange={(e) => setDioesisId(e.target.value)}
                required
            >
                <option value="">Selecciona una Diócesis</option>
                {dioesisList.map((dioesis) => (
                    <option key={dioesis._id} value={dioesis._id}>
                        {dioesis.nombre}
                    </option>
                ))}
            </select>
            <button type="submit">{parroquia ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default ParroquiaForm;
