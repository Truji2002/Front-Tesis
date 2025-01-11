/* src/components/Login.jsx */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/button/Button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import { showAlert } from './alerts';
import '../styles/Login.css'; // Asegúrate de que este archivo exista

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Manejo específico para error 403
          throw new Error('No cuenta con contratos vigentes.');
        }

        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en la autenticación');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera excedido. Intente nuevamente.');
      }
      throw error; // Re-lanzar el error para ser manejado donde se llame
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response && response.access) {
        // Guardar tokens y datos en localStorage
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        localStorage.setItem('nombre', response.first_name);
        localStorage.setItem('rol', response.rol);
        localStorage.setItem('id', response.id);
        localStorage.setItem('codigoOrganizacion', response.codigoOrganizacion);

        if (response.rol === 'instructor' && response.debeCambiarContraseña) {
          localStorage.setItem('debeCambiarContraseña', 'true');
          navigate('/change-password'); // Redirige a la página de cambio
        } else {
          // Redirigir al dashboard principal
          localStorage.removeItem('debeCambiarContraseña');
          if (onSuccess) {
            onSuccess(); // Llama al callback si existe
          }
          navigate('/'); // Redirige al dashboard
        }
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError(err.message || 'Error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar Sesión</h2>
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <Button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </Button>

          <div className="links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
              }}
              className="forgot-password"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
      <div className="login-right">
        <div className="welcome-message">
          <h2>¡Bienvenido!</h2>
          <p>Regístrate con el código de tu organización</p>
          <Button className="btn-secondary" onClick={() => navigate('/register')}>
            Regístrate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
