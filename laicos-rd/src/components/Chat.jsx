import React, { useState, useEffect, useRef } from 'react';
import '../css/Chat.css';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

const socket = io('http://localhost:3001', { 
  auth: {
    token: Cookies.get('authToken')
  }
});

const Chat = () => {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]); // Historial de mensajes
  const [usuariosConectados, setUsuariosConectados] = useState([]);
  const [receptorId, setReceptorId] = useState('');
  const [userId, setUserId] = useState(Cookies.get('idUser')); // ID del usuario actual
  const mensajesRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor con socket ID:', socket.id);
    });

    // Nuevo mensaje recibido
    socket.on('nuevoMensaje', (data) => {
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { emisor: data.emisorId, mensaje: data.mensaje, fechaEnvio: data.fechaEnvio }
      ]);
    });

    // Actualización de usuarios conectados
    socket.on('actualizarUsuariosConectados', (usuarios) => {
      const usuariosFiltrados = usuarios.filter(usuario => usuario.userInfo._id !== userId);
      setUsuariosConectados(usuariosFiltrados);
    });

    // Historial de mensajes cargado
    socket.on('historialMensajes', (historial) => {
      setMensajes(historial);
    });

    return () => {
      socket.off('nuevoMensaje');
      socket.off('actualizarUsuariosConectados');
      socket.off('historialMensajes');
    };
  }, [userId]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = () => {
    if (!mensaje.trim() || !receptorId) {
      alert("Por favor, selecciona un usuario receptor y escribe un mensaje.");
      return;
    }

    socket.emit('enviarMensaje', { 
      receptorId,
      mensaje 
    });

    // Agregar el mensaje enviado al estado local para mostrarlo inmediatamente
    setMensajes((prevMensajes) => [
      ...prevMensajes,
      { emisor: userId, mensaje, fechaEnvio: new Date() }
    ]);

    setMensaje('');
  };

  const seleccionarReceptor = (id) => {
    setReceptorId(id);
    socket.emit('cargarHistorial', { receptorId: id });
  };

  return (
    <div className="chat-container">
      <div className="usuarios-conectados">
        <h3>Usuarios Conectados:</h3>
        <ul>
          {usuariosConectados.map((usuario) => (
            <li key={usuario.userInfo._id}>
              <button className="usuario-boton" onClick={() => seleccionarReceptor(usuario.userInfo._id)}>
                {usuario.userInfo.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mensajes" ref={mensajesRef}>
        {mensajes.map((msg, index) => (
          <div key={index} className={`mensaje ${msg.emisor === userId ? 'mensaje-enviado' : 'mensaje-recibido'}`}>
            {msg.mensaje} <span>{new Date(msg.fechaEnvio).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="entrada-mensaje">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;