import React from 'react';
import '../../css/ParroquiaList.css';

const ParroquiaItem = ({ parroquia, onDelete, onEdit }) => {
    return (
        <li className='parroquia-item'>
            <h3 className='parroquia-title'>{parroquia.nombre}</h3>
            <p className='parroquia-info'>{parroquia.dioesis.nombre}</p> {/* Muestra el nombre de la diócesis */}
            <button className='btn-edit-parroquia' onClick={() => onEdit(parroquia)}>Editar</button>
            <button  className='btn-delete-parroquia' onClick={() => onDelete(parroquia._id)}>Eliminar</button>
        </li>
    );
};

export default ParroquiaItem;
