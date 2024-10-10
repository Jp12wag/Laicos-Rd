import React from 'react';
import '../../css/dioesis.css';

const DioesisItem = ({ dioesis, onEdit, onDelete }) => {
  return (
    <div className="dioesis-item">
      <h3>{dioesis.nombre}</h3>
      <button onClick={() => onEdit(dioesis)}>Editar</button>
      <button onClick={() => onDelete(dioesis._id)}>Borrar</button>
    </div>
  );
};

export default DioesisItem;
