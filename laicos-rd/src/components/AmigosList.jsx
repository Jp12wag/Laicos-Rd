import React from 'react';
import '../css/Chat.css';

const AmigosList = ({ amigos, seleccionarReceptor }) => (
  
  <div className="lista-amigos">
    <h3>Amigos</h3>
    <ul>
      {amigos.length > 0 ? (
        amigos.map((amigo) => (
          <li key={amigo._id}>
            <button onClick={() => seleccionarReceptor(amigo._id)}>
            {amigo?.nombre ? `${amigo.nombre} ${amigo.apellido}` : 'Nombre no disponible'}  
            </button>
          </li>
        ))
      ) : (
        <li>No hay amigos disponibles.</li>
      )}
    </ul>
  </div>
);

export default AmigosList;
