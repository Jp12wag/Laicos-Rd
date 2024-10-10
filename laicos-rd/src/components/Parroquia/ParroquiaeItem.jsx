import React from 'react';

const ParroquiaItem = ({ parroquia, onDelete, onEdit }) => {
    return (
        <li>
            <h3>{parroquia.nombre}</h3>
            <p>Diócesis: {parroquia.dioesis.nombre}</p> {/* Muestra el nombre de la diócesis */}
            <button onClick={() => onEdit(parroquia)}>Editar</button>
            <button onClick={() => onDelete(parroquia._id)}>Eliminar</button>
        </li>
    );
};

export default ParroquiaItem;
