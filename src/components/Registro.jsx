// src/components/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/button/Button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import { FaUser, FaEnvelope, FaLock, FaKey, FaBuilding } from 'react-icons/fa';
import '../styles/Registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    codigoOrganizacion: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setPasswordError('');
    setIsError(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setIsError(true);
      setLoading(false);
      setTimeout(() => setPasswordError(''), 5000);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/registroEstudiante/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          codigoOrganizacion: formData.codigoOrganizacion,
        }),
      });

      if (response.ok) {
        setMessage('Registro exitoso. Redirigiendo al inicio de sesión...');
        setIsError(false);
        setTimeout(() => navigate('/login'), 3000);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          codigoOrganizacion: '',
        });
      } else {
        const errorData = await response.json();

        if (errorData.email) {
          setMessage(`Error: ${errorData.email[0]}`);
        } else if (errorData.error) {
          setMessage(`Error: ${errorData.error}`);
        } else if (typeof errorData === 'object') {
          const errorMessage = Object.values(errorData)
            .flat()
            .join(' ');
          setMessage(`Error: ${errorMessage}`);
        } else {
          setMessage('Error desconocido al registrar.');
        }
        setIsError(true);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setMessage('Error al intentar registrar. Inténtalo de nuevo más tarde.');
      setIsError(true);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-background">
      <div className="registro-container">
        <form onSubmit={handleSubmit} className="registro-form">
          <h2 className="form-title">Registro</h2>
          {message && (
            <p className={`message ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
          {passwordError && <p className="error-message">{passwordError}</p>}

          {/* Nombre y Apellido */}
          <div className="form-row">
            <div className="form-group">
              <Label htmlFor="first_name">
                <FaUser className="icon-inline" /> Nombre
              </Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div className="form-group">
              <Label htmlFor="last_name">
                <FaUser className="icon-inline" /> Apellido
              </Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="email">
              <FaEnvelope className="icon-inline" /> Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          {/* Contraseña y Confirmar Contraseña */}
          <div className="form-row">
            <div className="form-group">
              <Label htmlFor="password">
                <FaLock className="icon-inline" /> Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <div className="form-group">
              <Label htmlFor="confirmPassword">
                <FaKey className="icon-inline" /> Confirmar
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="codigoOrganizacion">
              <FaBuilding className="icon-inline" /> Código de Organización
            </Label>
            <Input
              id="codigoOrganizacion"
              name="codigoOrganizacion"
              type="text"
              value={formData.codigoOrganizacion}
              onChange={handleChange}
              placeholder="Ingresa tu código de organización"
              required
            />
          </div>

          <Button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
          <Button
            type="button"
            className="return-button"
            onClick={() => navigate('/login')}
          >
            Volver al Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
