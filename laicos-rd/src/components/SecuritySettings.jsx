import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const SecuritySettings = () => {
  const [isTwoFaEnabled, setIsTwoFaEnabled] = useState(false);
  const authToken = Cookies.get('authToken');
  useEffect(() => {
    // Obtener la configuración desde las cookies o el servidor
    const storedTwoFa = Cookies.get('isTwoFaEnabled');
    setIsTwoFaEnabled(storedTwoFa === 'true');
  }, []);

  const handleToggleTwoFa = async () => {
    const newValue = !isTwoFaEnabled;
    setIsTwoFaEnabled(newValue);
  
    // Guardar el nuevo estado en las cookies
    Cookies.set('isTwoFaEnabled', newValue, { expires: 7, secure: true, sameSite: 'Strict' });
  
    try {
      // Enviar la configuración al servidor para guardarla
      await axios.post('http://localhost:3001/api/administradores/config', 
        {
          isTwoFaEnabled: newValue
        }, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        }
      );
    } catch (error) {
      console.error('Error al actualizar la configuración de seguridad:', error);
    }
  };

  return (
    <div className="security-settings">
      <h3>Configuración de Seguridad</h3>
      <label>
        <input
          type="checkbox"
          checked={isTwoFaEnabled ? true : false}
          onChange={handleToggleTwoFa}
        />
        Habilitar autenticación en dos pasos (2FA)
      </label>
    </div>
  );
};

export default SecuritySettings;
