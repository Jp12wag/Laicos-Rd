import axios from 'axios';

const API_URL = 'http://localhost:3001/api/parroquia'; // Cambia la URL según sea necesario

// Obtener todas las parroquias
export const getParroquias = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las parroquias:', error);
        throw error;
    }
};

// Crear una nueva parroquia
export const createParroquia = async (parroquiaData) => {
    try {
        const response = await axios.post(API_URL, parroquiaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la parroquia:', error);
        throw error;
    }
};

// Eliminar una parroquia
export const deleteParroquia = async (parroquiaId) => {
    try {
        await axios.delete(`${API_URL}/${parroquiaId}`);
    } catch (error) {
        console.error('Error al eliminar la parroquia:', error);
        throw error;
    }
};

// Actualizar una parroquia
export const updateParroquia = async (parroquiaId, parroquiaData) => {
    try {
        const response = await axios.put(`${API_URL}/${parroquiaId}`, parroquiaData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la parroquia:', error);
        throw error;
    }
};
