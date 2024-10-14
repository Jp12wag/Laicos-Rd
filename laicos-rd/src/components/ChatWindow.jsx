import React, { useRef, useEffect } from 'react';
import '../css/Chat.css';

const ChatWindow = ({ mensajes, userId }) => {
  const mensajesRef = useRef(null);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  return (
    <div className="historial-mensajes" ref={mensajesRef}>
      {mensajes.map((mensaje, index) => (
        <div key={index} className={mensaje.emisor === userId ? 'mensaje-propio' : 'mensaje-receptor'}>
          <p>{mensaje.mensaje}</p>
          <span>{new Date(mensaje.fechaEnvio).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
