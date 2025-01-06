import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { showAlert } from './alerts';
import Button from './ui/button/button';
import Input from './ui/input/input';
import Label from './ui/label/label';
import '../styles/FormInstructor.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FormInstructor = ({ isEdit, instructor, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    empresa: '',
  });

  const [empresas, setEmpresas] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (isEdit && instructor) {
      setFormData({
        first_name: instructor.first_name || '',
        last_name: instructor.last_name || '',
        email: instructor.email || '',
        empresa: instructor.empresa || '',
      });
    }

    const fetchEmpresas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/empresas/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener las empresas.');
        const data = await response.json();
        setEmpresas(data);
      } catch (error) {
        showAlert('Error', 'No se pudieron cargar las empresas.', 'error');
      }
    };

    fetchEmpresas();
  }, [isEdit, instructor, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      showAlert('Error', 'El nombre y apellido son obligatorios.', 'error');
      return false;
    }
    if (!formData.email.includes('@')) {
      showAlert('Error', 'Correo electrónico no válido.', 'error');
      return false;
    }
    if (!formData.empresa) {
      showAlert('Error', 'La empresa es obligatoria.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      empresa: parseInt(formData.empresa, 10),
    };

    try {
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit
        ? `${API_BASE_URL}/api/instructores/${instructor.id}/`
        : `${API_BASE_URL}/api/registrarInstructor/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar los datos.');
      }

      showAlert(
        'Éxito',
        isEdit ? 'Instructor actualizado con éxito.' : 'Instructor creado con éxito.',
        'success'
      );
      onSubmit();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo completar la operación.', 'error');
    }
  };

  return (
    <form className="form-instructor" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Editar Instructor' : 'Crear Instructor'}</h2>

      <div className="form-group">
        <Label htmlFor="first_name">Nombre</Label>
        <Input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <Label htmlFor="last_name">Apellido</Label>
        <Input
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          disabled={isEdit}
          required
        />
      </div>

     

      <div className="form-group">
        <Label htmlFor="empresa">Empresa</Label>
        <select
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleInputChange}
          disabled={isEdit}
          required
        >
          <option value="">Seleccione una empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">{isEdit ? 'Actualizar Instructor' : 'Crear Instructor'}</Button>

      {isEdit && (
        <Button
          type="button"
          className="manage-contracts-button"
          onClick={() => window.location.href = `/instructor/${instructor.id}/contracts`}
        >
          Administrar Contratos
        </Button>
      )}
    </form>
  );
};

export default FormInstructor;
