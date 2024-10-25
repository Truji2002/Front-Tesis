// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../services/api'; // Ajuste en la ruta para subir un nivel
import '../styles/Login.css'; // Ajuste en la ruta para subir un nivel


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [success, setSuccess] = useState(false); // Estado para controlar el éxito del login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setLoading(true); // Inicia el estado de carga

    try {
      const response = await login({ email, password });
      
      // Verificar si la respuesta incluye el token de acceso
      if (response && response.access) {
        console.log('Login exitoso:', response);
        localStorage.setItem('accessToken', response.access); // Guarda el token
        localStorage.setItem('refreshToken', response.refresh); // Guarda el refresh token si lo necesitas
        setError(''); // Limpiar cualquier mensaje de error
        setSuccess(true); // Establecer el estado de éxito en true
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      setError('Error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false); // Termina el estado de carga
    }
  };

  return (
    <div className="login-container">
      {success ? (  // Si el login es exitoso, mostrar mensaje de éxito
        <div className="success-message">
          <h2>¡Inicio de sesión exitoso!</h2>
          <p>Has iniciado sesión correctamente.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar Sesión</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;


