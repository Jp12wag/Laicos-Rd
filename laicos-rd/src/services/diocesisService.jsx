import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3001/api/diocesis'; 
export const getDioesis = async () => {
  const authToken = Cookies.get('authToken');
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};


const createDioesis = async (data) => {
  const authToken = Cookies.get('authToken');
  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};

const updateDioesis = async (id, data) => {
  const authToken = Cookies.get('authToken');
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};

const deleteDioesis = async (id) => {
  const authToken = Cookies.get('authToken');
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export default {
  getDioesis,
  createDioesis,
  updateDioesis,
  deleteDioesis,
};
