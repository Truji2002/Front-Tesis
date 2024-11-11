const API_URL = import.meta.env.VITE_API_URL; 

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Error en la autenticación'); 
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error; 
  }
};

export default login;
