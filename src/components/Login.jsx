import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import '../styles/Login.css';

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
      const response = await fetch(`http://127.0.0.1:8000/api/login/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en la autenticación');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera excedido. Intente nuevamente.');
      }
      throw error;
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
        localStorage.setItem('codigoOrganizacion', response.codigoOrganizacion);
        
        if (response.rol === 'instructor' && response.debeCambiarContraseña) {
          
          localStorage.setItem('debeCambiarContraseña', 'true');
          navigate('/change-password'); // Redirige a la página de cambio
        } else {
          // Redirigir al dashboard principal
          localStorage.removeItem('debeCambiarContraseña');
          onSuccess(); // Llama al callback
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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>

        <p className="register-link">
          ¿No tienes cuenta?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            Regístrate con el código de tu organización
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
