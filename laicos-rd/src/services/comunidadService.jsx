import axios from 'axios';

const API_URL = 'http://localhost:3001/api/'; // Cambia esto según la URL del backend

// Crear comunidad
export const crearComunidad = (data, token) => {
   
  return axios.post(`${API_URL}comunidades/`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Listar comunidades
export const listarComunidades = (token) => {
console.log(token)
  return axios.get(`${API_URL}comunidades/comunidades`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Agregar miembro a la comunidad
export const agregarMiembro = (data, token) => {
  return axios.post(`${API_URL}comunidades/agregar-miembro`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
