import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/Chat.css';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoScanCircleOutline, IoChatbox, IoSearch } from 'react-icons/io5';
import { faUser, faPaperPlane } from '@fortawesome/free-solid-svg-icons';


const socket = io('http://localhost:3001', {
  auth: {
    token: Cookies.get('authToken')
  }
});

const Chat = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [usuariosConectados, setUsuariosConectados] = useState([]);
  const [receptorId, setReceptorId] = useState('');
  const [receptor, setReceptor] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [user, setUser] = useState({});
  const [parroquiaId, setParroquiaId] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [esChatGrupal, setEsChatGrupal] = useState(false);
  const userId = Cookies.get('IdUser');
  const authToken = Cookies.get('authToken');
  const mensajesRef = useRef(null);
  const [buscarTermino, setBuscarTermino] = useState('');
  const [Temporal, setTemporal] = useState('');


  useEffect(() => {
    const obtenerParroquia = async () => {
      try {
        const miembroResponse = await axios.get(`http://localhost:3001/api/miembros/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (miembroResponse.data?.Parroquia) {
          setParroquiaId(miembroResponse.data.Parroquia._id);
          setParroquia(miembroResponse.data.Parroquia);
        }
      } catch (error) {
        console.error('Error al obtener la parroquia:', error);
      }
    };
    obtenerParroquia();
  }, [userId, authToken]);

  useEffect(() => {
    socket.on('nuevoMensaje', (data) => {
       setMensajes((prevMensajes) => [
          ...prevMensajes,
          { emisor: data.emisorId, mensaje: data.mensaje, fechaEnvio: data.fechaEnvio }
       ]);
    });
 
    return () => {
       socket.off('nuevoMensaje');
    };
 }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor con socket ID:', socket.id);
    });

    socket.on('nuevoMensaje', (data) => {
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { emisor: data.emisorId, mensaje: data.mensaje, fechaEnvio: data.fechaEnvio }
      ]);
    });

    socket.on('historialMensajes', (historial) => {
      setMensajes(historial);
    });
  

    socket.on('actualizarUsuariosConectados', (usuarios) => {
      console.log('Hay un usuario conectado: ', usuarios)
      const usuariosFiltrados = usuarios.filter(usuario => usuario.userInfo._id !== userId);
      setUsuariosConectados(usuariosFiltrados);
      
    });


    return () => {
      socket.off('connect');
      socket.off('nuevoMensaje');
      socket.off('actualizarUsuariosConectados');
      socket.off('historialMensajes');
    };
  }, [userId]);


  const abrirModal = () => {
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };
  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const [responseUsuario, responseAmigos, responseSolicitudesPendientes] = await Promise.all([
          axios.get(`http://localhost:3001/api/administradores/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axios.get('http://localhost:3001/api/solicitud/aceptadas', {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axios.get('http://localhost:3001/api/solicitud/pendientes', {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        ]);
        setUser(responseUsuario.data);
        setAmigos(responseAmigos.data);

      } catch (error) {
        console.error('Error al obtener datos del usuario o amigos:', error);
      }
    };
    obtenerDatosUsuario();
  }, [userId, authToken]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);


  // Sending a message
  const enviarMensaje = useCallback(() => {
    if (!mensaje.trim()) {
      alert("Por favor, escribe un mensaje.");
      return;
    }

    const destino = esChatGrupal ? parroquiaId : receptorId;
    if (!destino) {
      alert("Por favor, selecciona un usuario o grupo receptor.");
      return;
    }

    socket.emit('enviarMensaje', { receptorId: destino, mensaje });

    setMensajes((prevMensajes) => [
      ...prevMensajes,
      { emisor: userId, mensaje, fechaEnvio: new Date(), leido: false }
    ]);

    socket.on('historialMensajes', (historial) => {
      setMensajes(historial);
     
    });
    setMensaje('');
  }, [mensaje, parroquiaId, receptorId, esChatGrupal, userId]);


  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener todos los usuarios
        const respuestaUsuarios = await fetch('http://localhost:3001/api/administradores', {
          headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
        });
        const dataUsuarios = await respuestaUsuarios.json();
        setUsuarios(dataUsuarios);

        // Obtener amigos
        const respuestaAmigos = await fetch('http://localhost:3001/api/solicitud/aceptadas', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('authToken')}`
          },
        });
        const dataAmigos = await respuestaAmigos.json();
        setAmigos(dataAmigos);


      } catch (error) {

        console.error('Error al obtener datos:', error);

      }
      setSolicitudesEnviadas([]);
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
      setSolicitudesEnviadas([...solicitudesEnviadas, { receptor: receptorId }]);
    } catch (error) {
      console.error('Error al enviar la solicitud de amistad:', error);
    }
  };


  const seleccionarReceptor = useCallback((id) => {
    if (!amigos.find(amigo => amigo._id === id)) {
      alert('Solo puedes chatear con tus amigos.');
      return;
    }
    setReceptor(amigos.find(amigo => amigo._id === id))
    setReceptorId(id);
    setEsChatGrupal(false);
    socket.emit('cargarHistorial', { receptorId: id });
  }, [amigos]);


  const cambiarAChatGrupal = useCallback(() => {
    if (!parroquiaId) {
      alert('No estás asignado a ninguna parroquia.');
      return;
    }
    
    setEsChatGrupal(true);
    socket.emit('cargarHistorialGrupal', { receptorId: parroquiaId });
  }, [parroquiaId]);

  const esAmigo = (id) => {
    return amigos.some(amigo => amigo._id === id);
  };

  const solicitudEnviada = (id) => {
    return solicitudesEnviadas.some(solicitud => solicitud.receptor === id);
  };

  const amigosFiltrados = amigos.filter((amigo) =>
    `${amigo.nombre} ${amigo.apellido}`.toLowerCase().includes(buscarTermino.toLowerCase())
  );

  useEffect(() => {
    if (receptorId && !esChatGrupal) {
       socket.emit('cargarHistorial', { receptorId });
    }
 }, [receptorId, esChatGrupal]);


  return (
    <div className="chat-container">
      <div className="lista-amigos">
        <h3 className="titulo-chat">Chats</h3>
        <h5 className="titulo-chat">{user.nombre} {user.apellido}</h5>
        <div className='header'>
          <div className='user-info'>

            {user._id === userId ? (

              <img src={user.foto} alt={user.nombre} className='cover' />
            ) : (
              <span>{user.nombre && user.apellido ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}` : 'NA'}</span>
            )}

          </div>
          <ul className="nav_icons">
            <li className="nav_icons-lista"> <IoScanCircleOutline size={20} /></li>
            <li className="nav_icons-lista"> <IoChatbox size={20} /></li>
            <li className="nav_icons-lista" onClick={abrirModal}>  <FontAwesomeIcon icon={faUser} /></li>

          </ul>

        </div>
        <div className="search_chat">
          <div className='search_chat_contenedor'>
            <input type="text" placeholder='Search or start new chat' className='inputSearch' onChange={(e) => setBuscarTermino(e.target.value)} />
            <IoSearch className='IoSearch' />
          </div>

        </div>
        <div className="chatlist">
          {parroquiaId && (
            <div className="block" onClick={cambiarAChatGrupal}>
              <div className="imgbx">
                {/* Mostrar iniciales de la parroquia o un ícono */}
                <span>{parroquia.nombre ? parroquia.nombre.charAt(0) : 'PA'}</span>
              </div>
              <div className="detalles">
                <div className="listHead">
                  {/* Mostrar nombre de la parroquia */}
                  <h4 className="nombreDetalles">{parroquia.nombre || 'Nombre no disponible'}</h4>
                  <p className="tiempo">04:00</p>
                </div>
              </div>
            </div>
          )}

          {amigosFiltrados.length > 0 ? (
            amigosFiltrados.map((amigo) => (
              <div
                key={amigo._id}
                className="block"
                onClick={() => seleccionarReceptor(amigo._id)}
              >
              
                <div className="imgbx">
                  {amigo.foto ? (
                    <img src={amigo.foto} alt={amigo.nombre} />
                  ) : (
                    <span>
                      {amigo.nombre.charAt(0)}
                      {amigo.apellido.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="detalles">
                  <div className="listHead">
                    <h4 className="nombreDetalles">
                      {amigo?.nombre
                        ? `${amigo.nombre} ${amigo.apellido}`
                        : 'Nombre no disponible'}
                    </h4>
                    <p className="tiempo">04:00</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <li>No se encontraron amigos.</li>
          )}
        </div>
      </div>
      <div className="chat">
        {/* Mostrar chat grupal o privado según selección */}
        {receptorId || esChatGrupal ? (
          <>
            {/* Encabezado con el nombre y la imagen del receptor */}
            <div className="chat-encabezado">
              {receptor.imagen ? (
                <img
                  src={receptor.foto}
                  alt={`Imagen de ${receptor.nombre}`}
                  className="imagen-receptor"
                />
              ) : (
                <div className="iniciales-receptor">
                  {receptor.nombre[0]}
                  {receptor.apellido[0]}
                </div>
              )}
              <span className="nombre-receptor">
                {receptor.nombre} {receptor.apellido}
              </span>
            </div>

            {/* Historial de mensajes */}
            <div className="historial-mensajes" ref={mensajesRef}>
              {mensajes.map((mensaje, index) => (
                <div
                  key={index}
                  className={
                    String(mensaje.emisor) === String(userId)
                      ? 'mensaje-propio'
                      : 'mensaje-receptor'
                  }
                >
                  <p>{mensaje.mensaje}</p>
                  <span>{new Date(mensaje.fechaEnvio).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Selecciona un amigo o un grupo para chatear.</p>
        )}

        {/* Componente para enviar mensajes */}
        {receptorId || esChatGrupal ? (
          <div className="input-mensaje">
            <input
              className="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
            />
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="btn-enviar"
              onClick={enviarMensaje}
            />
          </div>
        ) : null}
      </div>

      {mostrarModal && (

        <div className="modal-overlay" onClick={cerrarModal}> {/* Fondo del modal */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Contenido del modal */}
            <button className="close-modal" onClick={cerrarModal}>Cerrar</button>
            <div className="contenedor-chat-usuario">
              <div className="lista-usuarios">
                <h3>Usuarios:</h3>
                <ul className='contenedorSolicitud'>
                  {usuarios.filter(usuario => usuario._id !== userId).map((usuario) => (
                    <li key={usuario._id}>
                      <p>{usuario.nombre} {usuario.apellido}</p>
                      {esAmigo(usuario._id) ? (
                        <span className="amigo"></span>
                      ) : solicitudEnviada(usuario._id) ? (
                        <button className="solicitud-enviada" disabled>Solicitud enviada</button>
                      ) : (
                        <button onClick={() => enviarSolicitudAmistad(usuario._id)}>Enviar Solicitud</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div >
  );
};

export default Chat;
