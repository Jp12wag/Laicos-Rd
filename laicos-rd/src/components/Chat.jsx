  import React, { useState, useEffect, useRef } from 'react';
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
    const [mensajes, setMensajes] = useState([]); // Historial de mensajes
    const [usuariosConectados, setUsuariosConectados] = useState([]);
    const [receptorId, setReceptorId] = useState('');
    const userId = Cookies.get('IdUser');
    const mensajesRef = useRef(null);
    const [amigos, setAmigos] = useState([]); // Lista de amigos aceptados
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]); // Solicitudes de amistad pendientes
    const [usuarios, setUsuarios] = useState([]); // Lista de todos los usuarios
    const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]); // Solicitudes de amistad enviadas
    const [user, setUser] = useState('');
    const authToken = Cookies.get('authToken');


  
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
        setUsuariosConectados(usuariosFiltrados);
      });


      return () => {
        socket.off('connect');
        socket.off('nuevoMensaje');
        socket.off('actualizarUsuariosConectados');
      };
    }, [userId]);


    const abrirModal = () => {
      setMostrarModal(true);
    };

    const cerrarModal = () => {
      setMostrarModal(false);
    };
    useEffect(() => {
      const obtenerUsuario = async () => {
        if (!authToken) {
          console.log("Token no encontrado. Redirigiendo al login...");
          return;
        }

        if (!userId) return;

        try {
          const response = await axios.get(`http://localhost:3001/api/administradores/${userId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            }
          });

          if (response.data) {
            setUser(response.data);
          
          } else {
            console.log("No se encontraron datos de usuario.");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };
      obtenerUsuario();
    }, [])
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
      const obtenerDatos = async () => {
        try {
          // Obtener todos los usuarios
          const respuestaUsuarios = await fetch('http://localhost:3001/api/administradores', {
            headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
          });
          const dataUsuarios = await respuestaUsuarios.json();
          setUsuarios(dataUsuarios);
          setUser(dataUsuarios)
          // Obtener amigos
          const respuestaAmigos = await fetch('http://localhost:3001/api/solicitud/aceptadas', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
            },
          });
          const dataAmigos = await respuestaAmigos.json();
          setAmigos(dataAmigos);

          // Obtener solicitudes pendientes
          const respuestaSolicitudes = await fetch('http://localhost:3001/api/solicitud/pendientes', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('authToken')}`
            },
          });
          const dataSolicitudes = await respuestaSolicitudes.json();

          setSolicitudesPendientes(dataSolicitudes);

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

    

    const seleccionarReceptor = (id) => {

      console.log("Usuario: ",id,userId)
      if (!amigos.find(amigo => amigo._id === id)) {
        alert('Solo puedes chatear con tus amigos.');
        return;
      }
      setReceptorId(id);
      socket.emit('cargarHistorial', { receptorId: id });
    };

    const esAmigo = (id) => {
      return amigos.some(amigo => amigo._id === id);
    };

    const solicitudEnviada = (id) => {
      return solicitudesEnviadas.some(solicitud => solicitud.receptor === id);
    };


    return (
      <div className="chat-container">
        <div className="lista-amigos">
          <h3 className="titulo-chat">Chats</h3>
          <h3 className="titulo-chat">{user.nombre}</h3>
          <div className='header'>
            <div className='user-info'>
            
              {user.foto ? (
              
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
              <input type="text" placeholder='Search or start new chat' className='inputSearch' />
              <IoSearch className='IoSearch' />
            </div>

          </div>
          <div className="chatlist">
            {Array.isArray(amigos) && amigos.length > 0 ? (
              
              amigos.map((amigo) => (
                
                <div key={amigo._id} className="block" onClick={() => seleccionarReceptor(amigo._id)}>
                  <div className="imgbx">
                    {amigo.foto ? (
                      <img src={amigo.foto} alt={amigo.nombre} />
                    ) : (
                      <span>{amigo.nombre.charAt(0)}{amigo.apellido.charAt(0)}</span>
                    )}

                  </div>
                  <div className="detalles">
                    <div className="listHead">
                      <h4 className='nombreDetalles'>{amigo?.nombre ? `${amigo.nombre} ${amigo.apellido}` : 'Nombre no disponible'}</h4>
                      <p className="tiempo">04:00</p>
                    </div>
                    {mensajes.map((mensaje, index) => (
                      <div className="messageP" key={index}>
                        {mensaje.leido === false && (
                          <b className='contador' key={index}>{index + 1}</b>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <li>No hay amigos disponibles.</li>
            )}
          </div>

        </div>
        <div className="chat">
          {/* Mostrar historial de mensajes solo si hay un receptor seleccionado */}
          {receptorId && (
            <div className="historial-mensajes" ref={mensajesRef}>
              
              {mensajes.map((mensaje, index) => (
                <div key={index} className={String(mensaje.emisor) === String(userId) ? 'mensaje-propio' : 'mensaje-receptor'}>
                  <p>{mensaje.mensaje}</p>
                  <span>{new Date(mensaje.fechaEnvio).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          {/* Componente para enviar mensajes, solo visible si hay un receptor seleccionado */}
          {receptorId && (
            <div className="input-mensaje">
              <input className="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
              />
              <FontAwesomeIcon icon={faPaperPlane} className="btn-enviar" onClick={enviarMensaje} />
            </div>
          )}
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
