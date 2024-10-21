import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import axios from 'axios';



const socket = io('http://localhost:3001', {
  auth: {
    token: Cookies.get('authToken')
  }
});


const ChatGrupo = ({ grupoId }) => {
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [parroquiaId, setParroquiaId] = useState('');
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    crearGrupoParroquia()
}, []);

const crearGrupoParroquia = async () => {
  const miembroResponse = await axios.get(`http://localhost:3001/api/miembros/${Cookies.get('IdUser')}`, {
    headers: {
        Authorization: `Bearer ${authToken}`,
    },
});


if(miembroResponse.status=== 200){
  setParroquiaId(miembroResponse.data.Parroquia._id)
}else{
  console.log('No data')
}




  if (parroquiaId) {
    try {
      const response = await axios.post('http://localhost:3001/api/chatGrupal/buscarCrearGrupo',
        { parroquiaId, miembroId: Cookies.get('IdUser') },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data) {
  
      } else {
        console.log("No se encontraron datos de usuario.");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  }
};


const seleccionarParroquia = (parroquiaId) => {
  setParroquiaId(parroquiaId);
};


  useEffect(() => {
    socket.emit('cargarHistorialGrupo', { grupoId });

    socket.on('historialMensajesGrupo', (mensajes) => {
      setMensajes(mensajes);
    });

    socket.on('nuevoMensajeGrupo', (nuevoMensaje) => {
      setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
    });

    return () => {
      socket.off('historialMensajesGrupo');
      socket.off('nuevoMensajeGrupo');
    };
  }, [grupoId]);

  useEffect(() => {
  //  socket.emit('unirseGrupoParroquia', { parroquiaId });
  
    // Rest of the useEffect code...
  }, [grupoId, parroquiaId]);


  const enviarMensaje = () => {
    if (mensaje.trim()) {
      socket.emit('enviarMensajeGrupo', { grupoId, mensaje });
      setMensaje('');
    }
  };

  return (
    <div>
      <div className="mensajes">
        {mensajes.map((msg, idx) => (
          <div key={idx} className="mensaje">
            <strong>{msg.emisor}</strong>: {msg.mensaje}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button onClick={enviarMensaje}>Enviar</button>
    </div>
  );
};

export default ChatGrupo;
