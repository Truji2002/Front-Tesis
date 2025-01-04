import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from './ui/input/input';
import Button from './ui/button/button';
import Label from './ui/label/label';
import { showAlert } from './alerts';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CambiarContraseña = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const debeCambiar = localStorage.getItem('debeCambiarContraseña');
    if (debeCambiar !== 'true') {
      navigate('/welcome'); // Redirigir al dashboard si no debe cambiar contraseña
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '', // Campo adicional para confirmar la nueva contraseña
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasLength && hasNumber && hasLetter;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar nueva contraseña
    if (formData.new_password !== formData.confirm_new_password) {
      showAlert('Error', 'Las contraseñas no coinciden.', 'error');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.new_password)) {
      showAlert(
        'Error',
        'La nueva contraseña debe tener al menos 8 caracteres, un número y una letra.',
        'error'
      );
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/cambiarPassword/`,
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showAlert('Éxito', response.data.message, 'success');
      localStorage.removeItem('debeCambiarContraseña');
      navigate('/welcome'); // Redirige al dashboard
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || 'No se pudo cambiar la contraseña.';
      showAlert('Error', errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Label htmlFor="old_password">Contraseña Actual</Label>
          <Input
            type="password"
            id="old_password"
            name="old_password"
            value={formData.old_password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <Label htmlFor="new_password">Nueva Contraseña</Label>
          <Input
            type="password"
            id="new_password"
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <Label htmlFor="confirm_new_password">Confirmar Nueva Contraseña</Label>
          <Input
            type="password"
            id="confirm_new_password"
            name="confirm_new_password"
            value={formData.confirm_new_password}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </Button>
      </form>
    </div>
  );
};

export default CambiarContraseña;
