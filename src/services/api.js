import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ; // URL de tu API


export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/login/`, credentials, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;  // Devolver solo los datos de la respuesta
  } catch (error) {
    console.error('Error en el login:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
export default login;

