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
    setIsError(false);

    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setIsError(true);

      // Eliminar automáticamente el mensaje después de 5 segundos
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
          asignadoSimulacion: formData.asignadoSimulacion,
        }),
      });

      if (response.ok) {
        setMessage('Registro exitoso.');
        setIsError(false);
        setTimeout(() => navigate('/login'), 2000);
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

        // Manejo de errores: Formatea el mensaje correctamente
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

        // Eliminar automáticamente el mensaje después de 5 segundos
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setMessage('Error al intentar registrar. Inténtalo de nuevo más tarde.');
      setIsError(true);

      // Eliminar automáticamente el mensaje después de 5 segundos
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-form">
        <h2>Registro</h2>
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
          Registrarse
        </Button>
        <Button type="button" className="w-full return-button" onClick={() => navigate('/login')}>
          Volver al Login
        </Button>
      </form>
    </div>
  );
};

export default Registro;
