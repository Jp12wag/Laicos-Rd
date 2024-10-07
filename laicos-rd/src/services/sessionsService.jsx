import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3001/api/administradores';

const authToken = Cookies.get('authToken');
const userId = Cookies.get('IdUser');


export const logoutSession = async(token)=>{
    try {
        const response = await axios.post('http://localhost:3001/api/administradores/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error al obtener sesiones:', error);
        throw error;
      }
}
export const getSessions = async () => {
    try {
        const response = await axios.get(`${API_URL}/${userId}/sessions`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        throw error;
    }
};

export const logoutAllSessions = async () => {
    try {
        await axios.post(`${API_URL}/logoutAll`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
    } catch (error) {
        console.error('Error al cerrar todas las sesiones:', error);
        throw error;
    }
};
