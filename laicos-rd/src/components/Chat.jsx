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
  const [conversacionesRecientes, setConversacionesRecientes] = useState([]); // Agregar el estado para las conversaciones recientes
  const [amigos, setAmigos] = useState([]); // Lista de amigos aceptados
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]); // Solicitudes de amistad pendientes
  const [usuarios, setUsuarios] = useState([]); // Lista de todos los usuarios

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

    // Historial de mensajes cargado
    socket.on('historialMensajes', (historial) => {
      setMensajes(historial);
    });

    // Actualización de usuarios conectados
    socket.on('actualizarUsuariosConectados', (usuarios) => {
      const usuariosFiltrados = usuarios.filter(usuario => usuario.userInfo._id !== userId);
      console.log(usuariosFiltrados)
      setUsuariosConectados(usuariosFiltrados);

    });

    return () => {
      socket.off('connect');
      socket.off('nuevoMensaje');
      socket.off('historialMensajes');
      socket.off('actualizarUsuariosConectados');
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
      { emisor: userId, mensaje, fechaEnvio: new Date(), leido: false }
    ]);

    setMensaje('');
  };

  useEffect(() => {
    // Llamar al backend para obtener las conversaciones recientes
    const obtenerConversacionesRecientes = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/conversaciones-recientes', {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
        });
        console.log(respuesta.data)
        const data = await respuesta.json();
        setConversacionesRecientes(data.conversaciones);
      } catch (error) {
        console.error('Error al obtener las conversaciones recientes:', error);
      }
    };

    obtenerConversacionesRecientes();
  }, []);



  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener todos los usuarios
        const respuestaUsuarios = await fetch('http://localhost:3001/api/administradores', {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
        });
        const dataUsuarios = await respuestaUsuarios.json();
        setUsuarios(dataUsuarios);
        console.log(usuarios)

        // Obtener amigos
        const respuestaAmigos = await fetch('http://localhost:3001/api/solicitud/aceptadas', {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
        });
        const dataAmigos = await respuestaAmigos.json();
        console.log("Data: ", dataAmigos)
        setAmigos(dataAmigos);
        console.log("Amigo: ", amigos)
        // Obtener solicitudes pendientes
        const respuestaSolicitudes = await fetch('http://localhost:3001/api/solicitud/pendientes', {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
        });
        const dataSolicitudes = await respuestaSolicitudes.json();
        setSolicitudesPendientes(dataSolicitudes);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  const enviarSolicitudAmistad = async (receptorId) => {
    try {

      const respuesta = await fetch('http://localhost:3001/api/solicitud/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
        },
        body: JSON.stringify({ receptor: receptorId }),
      });

      const data = await respuesta.json();
      alert(data.message);
    } catch (error) {
      console.error('Error al enviar la solicitud de amistad:', error);
    }
  };

  const aceptarSolicitudAmistad = async (solicitudId) => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/solicitud/aceptar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
        },
        body: JSON.stringify({ solicitudId }),
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        alert(data.message);
        // Actualizar la lista de amigos y solicitudes pendientes
        setAmigos(prevAmigos => [...prevAmigos, data.amigo]);
        setSolicitudesPendientes(prevSolicitudes => prevSolicitudes.filter(s => s._id !== solicitudId));
      } else {
        alert(data.error); // Muestra el error si la solicitud no fue exitosa
      }
    } catch (error) {
      console.error('Error al aceptar la solicitud de amistad:', error);
    }
  };

  const rechazarSolicitudAmistad = async (solicitudId) => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/amistades/rechazar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
        },
        body: JSON.stringify({ solicitudId }),
      });
      const data = await respuesta.json();
      alert(data.message);
      // Eliminar la solicitud de la lista
      setSolicitudesPendientes(prevSolicitudes => prevSolicitudes.filter(s => s._id !== solicitudId));
    } catch (error) {
      console.error('Error al rechazar la solicitud de amistad:', error);
    }
  };


  const seleccionarReceptor = (id) => {
    if (!amigos.find(amigo => amigo._id === id)) {
      alert('Solo puedes chatear con tus amigos.');
      return;
    }
    setReceptorId(id);
    socket.emit('cargarHistorial', { receptorId: id });
  };
  return (
    <div className="chat-container">
      <div className='contenedor-chat-usuario'>
        <div className="lista-usuarios">
          <h3>Usuarios:</h3>
          <ul className='contenedorSolicitud'>
            {usuarios.filter(usuario => usuario._id !== userId).map((usuario) => (
              <li key={usuario._id}>
                {usuario.nombre} {usuario.apellido}
                <button onClick={() => enviarSolicitudAmistad(usuario._id)}>Enviar Solicitud</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="solicitudes-pendientes">
          <h3>Solicitudes de Amistad Pendientes:</h3>
          <ul>
            {Array.isArray(solicitudesPendientes) && solicitudesPendientes.map((solicitud) => (
              <li key={solicitud._id}>
                {solicitud.emisor.nombre} {solicitud.emisor.apellido}
                <button onClick={() => aceptarSolicitudAmistad(solicitud._id)}>Aceptar</button>
                <button onClick={() => rechazarSolicitudAmistad(solicitud._id)}>Rechazar</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lista-amigos">
          <h3>Tus Amigos:</h3>
          <ul>
            {Array.isArray(amigos) && amigos.map((amigo) => (
              <li key={amigo._id}>
                <button className='btn' onClick={() => seleccionarReceptor(amigo._id)}>
                  {amigo.nombre} {/* Asegúrate de que el objeto amigo tiene el campo 'nombre' */}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='contener-chat'>
          <div className="mensajes" ref={mensajesRef}>
            {mensajes.map((msg, index) => (
              <div
                key={index}
                className={`mensaje ${msg.emisor === userId ? 'mensaje-enviado' : 'mensaje-recibido'}`}
              >
                <strong>{msg.emisor === userId ? 'Tú' : 'Otro usuario'}</strong>: {msg.mensaje} <span>{new Date(msg.fechaEnvio).toLocaleString()}</span>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default Chat;
