// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../services/api';
import '../styles/Login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true); 

    try {
      const response = await login({ email, password });
      
      
      if (response && response.access) {
        console.log('Login exitoso:', response);
        localStorage.setItem('accessToken', response.access); 
        localStorage.setItem('refreshToken', response.refresh); 
        setError(''); 
        setSuccess(true); 
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      setError('Error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      {success ? (  
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


