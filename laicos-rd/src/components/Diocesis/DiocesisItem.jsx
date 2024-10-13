import React from 'react';
import '../../css/dioesis.css';

const DioesisItem = ({ dioesis, onEdit, onDelete }) => {
  return (
    <div className="dioesis-item">
      <h3>{dioesis.nombre}</h3>
      <div className="dioesis-buttons">
        <button className="btn-confirm" onClick={() => onEdit(dioesis)}>Editar</button>
        <button className="btn-cancel" onClick={() => onDelete(dioesis._id)}>Borrar</button>
      </div>
    </div>
  );
};

export default DioesisItem;
