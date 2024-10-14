import React from 'react';


const UsuariosList = ({ usuarios, userId, enviarSolicitudAmistad, esAmigo, solicitudEnviada }) => (
  <div className="lista-usuarios">
    <h3>Usuarios:</h3>
    <ul>
      {usuarios.filter(usuario => usuario._id !== userId).map((usuario) => (
        <li key={usuario._id}>
          {usuario.nombre} {usuario.apellido}
          {esAmigo(usuario._id) ? (
            <span className="amigo">Ya es tu amigo</span>
          ) : solicitudEnviada(usuario._id) ? (
            <button className="solicitud-enviada" disabled>Solicitud enviada</button>
          ) : (
            <button onClick={() => enviarSolicitudAmistad(usuario._id)}>Enviar Solicitud</button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default UsuariosList;
