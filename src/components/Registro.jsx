import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import '../styles/Registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    codigoOrganizacion: '',
    asignadoSimulacion: false,
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // Estado para indicar si el mensaje es un error
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); // Define useNavigate para la navegación

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setPasswordError('');
    setIsError(false); // Restablecer el estado de error al intentar registrar nuevamente
  
    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setIsError(true); // Mostrar en rojo si las contraseñas no coinciden
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/registroCliente/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          confirmPassword: undefined, // No enviar confirmPassword al servidor
        }),
      });
  
      if (response.ok) {
        setMessage('Registro exitoso.');
        setIsError(false); // Establece `isError` en `false` para mensaje de éxito
        setTimeout(() => navigate('/login'), 2000); // Redirigir al login después de 2 segundos
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          codigoOrganizacion: '',
          asignadoSimulacion: false,
        });
      } else {
        const errorData = await response.json();
        
        // Extraer errores específicos del email, código de organización, u otros campos
        if (errorData.email) {
          setMessage(`Error: ${errorData.email[0]}`);
        } else if (errorData.error) {
          setMessage(`Error: ${errorData.error}`); // Captura el error específico de código de organización
        } else {
          setMessage(`Error al registrar: ${errorData.detail || 'Problema desconocido'}`);
        }
        setIsError(true); // Mostrar en rojo si hay un error en el registro
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setMessage('Error al intentar registrar. Inténtalo de nuevo más tarde.');
      setIsError(true); // Mostrar en rojo si hay un error de conexión
    }
  };

  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-form">
        <h2>Registro de Cliente</h2>
        {message && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
        {passwordError && <p className="error">{passwordError}</p>}
        
        <div className="form-group">
          <Label htmlFor="first_name">Nombre</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="last_name">Apellido</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="codigoOrganizacion">Código de Organización</Label>
          <Input
            id="codigoOrganizacion"
            name="codigoOrganizacion"
            type="text"
            value={formData.codigoOrganizacion}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Registrar
        </Button>
        <Button type="button" className="w-full" onClick={() => navigate('/login')}>
          Volver al Login
        </Button>
      </form>
    </div>
  );
};

export default Registro;
