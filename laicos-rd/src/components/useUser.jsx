import React, { useState, useEffect} from 'react';
import axios from 'axios';
const useUser = (userId, authToken) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const obtenerUsuario = async () => {
        if (!authToken || !userId) return;
  
        try {
          const response = await axios.get(`http://localhost:3001/api/administradores/${userId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          });
  
          setUser(response.data);
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };
  
      obtenerUsuario();
    }, [userId, authToken]);
  
    return user;
  };
  

  export default useUser;