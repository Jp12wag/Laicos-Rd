// src/services/archdioceseService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/archdioceses'; // Asegúrate de que la URL sea correcta

export const getArchdioceses = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getArchdioceseById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createArchdiocese = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const updateArchdiocese = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteArchdiocese = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
