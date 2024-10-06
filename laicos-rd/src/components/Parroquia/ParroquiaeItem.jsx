import React from 'react';

const ParroquiaItem = ({ parroquia, onDelete, onEdit }) => {
    return (
        <li>
            <h3>{parroquia.nombre}</h3>
            <p>Clero: {parroquia.clero}</p>
            <button onClick={() => onEdit(parroquia)}>Editar</button>
            <button onClick={() => onDelete(parroquia._id)}>Eliminar</button>
        </li>
    );
};

export default ParroquiaItem;
