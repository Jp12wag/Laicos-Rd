import axios from 'axios';

const API_URL = 'http://localhost:3001/api/diocesis'; // Cambia la URL según sea necesario

// Obtener todas las diócesis
export const getDiocesis = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las diócesis:', error);
        throw error;
    }
};

// Crear una nueva parroquia dentro de una diócesis
export const createParroquia = async (diocesisId, parroquiaData) => {
    try {
        const response = await axios.post(`${API_URL}/parroquia`, {
            ...parroquiaData,
            diocesis: diocesisId
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la parroquia:', error);
        throw error;
    }
};

// Eliminar una parroquia
export const deleteParroquia = async (parroquiaId) => {
    try {
        await axios.delete(`${API_URL}/parroquia/${parroquiaId}`);
    } catch (error) {
        console.error('Error al eliminar la parroquia:', error);
        throw error;
    }
};
